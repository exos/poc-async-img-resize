FROM minio/mc:latest

ADD policies /policies
ADD connect.sh /connect.sh
ADD entrypoint.sh /entrypoint.sh

RUN chmod +x /entrypoint.sh /connect.sh

ENTRYPOINT [ "./entrypoint.sh" ]
