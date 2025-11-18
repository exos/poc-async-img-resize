#!/bin/sh -x

# Esperamos que MinIO esté listo
until (mc alias set myminio http://minio:9000 ${MINIO_ROOT_USER} ${MINIO_ROOT_PASSWORD}) do
    echo 'esperando a minio...'
    sleep 2
done
