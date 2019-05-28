FROM ubuntu:18.04
COPY sim.tar /opt/sim.tar
RUN cd /opt && \
	apt update && \
	apt install -y wget && \
	apt install -y xz-utils && \
	tar -xvf sim.tar && \
	wget https://npm.taobao.org/mirrors/node/v10.15.1/node-v10.15.1-linux-x64.tar.xz && \
	xz -d node-v10.15.1-linux-x64.tar.xz && \
	tar -xvf node-v10.15.1-linux-x64.tar && \
	rm node-v10.15.1-linux-x64.tar && \
	mv node-v10.15.1-linux-x64 node10 && \
	printf '#!/bin/bash\ncd /opt/workspace\nnpm --registry https://registry.npm.taobao.org install >/dev/null 2>&1\nnode index.js' > start.sh && \
	chmod +x start.sh
ENV PATH=$PATH:/opt/node10/bin:/opt/sim NODE_ENV=production 
CMD [ "cd /opt/workspace && ./start.sh" ]
