FROM dockerep-0.mtl.mnubo.com/scores:latest

WORKDIR /src/app
RUN npm update
RUN bower --allow-root update

ADD app/ app
ADD server/ /src/server
ADD dist/ dist
ADD Gruntfile.js .

EXPOSE 3000

WORKDIR /src/server
CMD npm start
