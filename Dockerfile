FROM node:11-slim
COPY . /var/www
WORKDIR /var/www
RUN npm install
RUN  apt-get update -y && \
     apt-get -y autoremove && \
     apt-get clean
RUN apt-get install -y unzip libaio1 build-essential curl \
    && rm -rf /var/lib/apt/lists/*
RUN mkdir -p /opt/oracle
ADD instantclient-basic-linux.x64-18.3.0.0.0dbru.zip /opt/oracle
RUN unzip /opt/oracle/instantclient-basic-linux.x64-18.3.0.0.0dbru.zip -d /opt/oracle
RUN sh -c "echo /opt/oracle/instantclient_18_3 > \
      /etc/ld.so.conf.d/oracle-instantclient.conf" \
    ldconfig
RUN tee -a /etc/ld.so.conf.d/oracle_instant_client.conf && ldconfig
ENV LD_LIBRARY_PATH=/opt/oracle/instantclient_18_3:$LD_LIBRARY_PATH
ENV NODE_ENV=production
ENTRYPOINT npm start
EXPOSE 6667