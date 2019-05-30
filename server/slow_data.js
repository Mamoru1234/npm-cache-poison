const express = require('express');
const proxy = require('express-http-proxy');
const app = express();
const { startApp, chunkStream, delay, onStreamChunk } = require('./utils');
const fs = require('fs');

const PORT = 6790;
// dspm proxy
// app.get('/artifact/download/left-pad/1.3.0', (req, res) => {
//   const path = './tarball/left-pad-1.3.0.tgz';
//   const chunkSize = 16;
//   const delayAmount = 60000;
//   const totalBytes = fs.statSync(path).size;
//   const totalTime = toMinutes((totalBytes / chunkSize) * delayAmount);
//   console.log('Estimated time(min) to send package: ', totalTime);
//   fs.createReadStream(path)
//     .pipe(chunkStream(chunkSize))
//     .pipe(delay(delayAmount))
//     .pipe(res);
// });
//
// app.use(proxy('localhost:3000', {
//   userResDecorator: (proxyRes, proxyResData, userReq) => {
//     console.info(`Method ${userReq.method} url: ${userReq.url}`);
//     return proxyResData;
//   }
// }));

const toMinutes = (amount) => (amount / (1000 * 60)).toFixed(2);
// npm proxy
app.get('/left-pad/-/left-pad-1.3.0.tgz', (req, res) => {
  const path = './tarball/left-pad-1.3.0.tgz';
  const chunkSize = 16;
  const delayAmount = 60000;
  const totalBytes = fs.statSync(path).size;
  const totalTime = toMinutes((totalBytes / chunkSize) * delayAmount);
  console.log('Estimated time(min) to send package: ', totalTime);
  fs.createReadStream(path)
    .pipe(chunkStream(chunkSize))
    .pipe(delay(delayAmount))
    .pipe(res);
});

app.use(proxy('registry.npmjs.org', {
  userResDecorator: (proxyRes, proxyResData, userReq) => {
    console.info(`Method ${userReq.method} url: ${userReq.url}`);
    if (userReq.method !== 'GET') {
      return proxyResData;
    }
    const metadata = JSON.parse(proxyResData.toString());
    if (metadata.name === 'left-pad') {
      metadata.versions['1.3.0'].dist.tarball = `http://localhost:${PORT}/left-pad/-/left-pad-1.3.0.tgz`;
    }
    return JSON.stringify(metadata);
  }
}));

startApp(app, PORT);
