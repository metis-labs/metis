FROM envoyproxy/envoy:v1.14.1

COPY ./envoy.yaml /etc/envoy/envoy.yaml

ENTRYPOINT ["/usr/local/bin/envoy", "-c"]

CMD /etc/envoy/envoy.yaml