#!/bin/env bash

API_URL="http://localhost:4000"

list() {
    curl -s -X GET "$API_URL/images" -H "accept: application/json" | jq
}

get() {
    curl -s -X GET "$API_URL/images/$1" -H "accept: application/json" | jq
}

upload() {
    local IMAGE_NAME="$1"
    local FILE_PATH="$2"

    echo "Creating image with name $IMAGE_NAME"

    # 1. Solicita la URL de subida
    local RES=$(curl -s -X POST "$API_URL/images" \
        -H "accept: application/json" \
        -H "Content-Type: application/json" \
        -d "{\"name\": \"$IMAGE_NAME\"}"
    )

    local IMAGE_ID=$(echo "$RES" | jq -r '.image.id')
    local UPLOAD_URL=$(echo "$RES" | jq -r '.uploadUrl')

    echo "Uploading image with id $IMAGE_ID"

    # 2. Extrae el host del presigned URL
    local UPLOAD_HOST=$(echo "$UPLOAD_URL" | sed -E 's|https?://([^/]+).*|\1|')

    local TRANS_RUL=$(echo "$UPLOAD_URL" | sed -E 's/minio:9000/localhost:9000/')

    # 3. Hace el PUT con el host correcto
    curl -X PUT "$TRANS_RUL" \
        --header "Host: $UPLOAD_HOST" \
        --header "Content-Type: application/octet-stream" \
        --upload-file "$FILE_PATH"
}


case "$1" in
    list)
        list
        ;;
    get)
        if [ -z "$2" ]; then
            echo "Usage: $0 get <image_id>"
            exit 1
        fi
        get "$2"
        ;;
    upload)
        if [ -z "$2" ]; then
            echo "Usage: $0 upload <name> <path>"
            exit 1
        fi
        if [ ! -f "$3" ]; then
            echo "File $3 does not exist."
            exit 1
        fi
        upload $2 $3
        ;;
    *)
        echo "Usage: $0 {list|get <image_id>} or {upload <name> <path>}"
        exit 1
        ;;
esac
