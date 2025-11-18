#!/bin/sh -x

./connect.sh

# crear bucket público
mc mb myminio/public || echo "El bucket images ya existe"

# creamos bucket de subida
mc mb myminio/raw || echo "El bucket raw ya existe"

# Damos permisos públicos al bucket público
mc anonymous set download myminio/public || echo "El bucket public ya tiene permisos anonimos"

# El bucket de raw NO tiene accesos de lectura de anonimos
mc anonymous set none myminio/raw || echo "El bucket raw ya tiene permisos anonimos"

# Creamos usuario para el microservicio de redimencionado
mc admin user add myminio $RESIZE_MINIO_USER $RESIZE_MINIO_PASSWORD || echo "El usuario $RESIZE_MINIO_USER ya existe"

# crear policy para el usuario de app
mc admin policy create myminio resizer-policy /policies/resizer-policy.json || echo "La policy resizer-policy ya existe"

# asignar policy al usuario del servicio de redimencionado
mc admin policy attach myminio resizer-policy --user=$RESIZE_MINIO_USER || echo "La policy resizer-policy ya está asignada al usuario $RESIZE_MINIO_USER"

mc admin user add myminio $API_MINIO_USER $API_MINIO_PASSWORD || echo "El usuario $API_MINIO_USER ya existe"

# crear policy para el usuario de api
mc admin policy create myminio api-policy /policies/api-policy.json || echo "La policy api-policy ya existe"

# asignar policy al usuario del servicio de api
mc admin policy attach myminio api-policy --user=$API_MINIO_USER || echo "La policy api-policy ya está asignada al usuario $API_MINIO_USER"

# Creamos los eventos de notificación
# mc admin config set myminio notify_redis:rawevents \
#     address="redis:6379" \
#     key="minio:rawevents" || echo "La configuración de notificación ya existe"

# # Creamos la de public
# mc admin config set myminio notify_redis:publicevents \
#     address="redis:6379" \
#     key="minio:rawevents" || echo "La configuración de notificación ya existe"


# mc admin service restart myminio --wait --json

# sleep 5

# ./connect.sh

# Agregamos el evento on put en raw
mc event add myminio/raw arn:minio:sqs::rawevents:redis --event put || echo "El evento ya existe"

# Por ultimo, seteamos el evento de public
mc event add myminio/public arn:minio:sqs::publicevents:redis --event put || echo "El evento ya existe"

