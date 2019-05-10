const fs = require('fs');
const tar = require('tar-stream');
const uuid = require('uuid');
const through = require('through2');

const startApp = (app, port) => {
  app.listen(port, (err) => {
    if (err) {
      console.error('Error when starting');
      console.error(err);
    }
    console.info('Server listening: ', port);
  });
};

const infiniteTar = (entry_file) => {
  const stats = fs.statSync(entry_file);
  console.log('Entry size: ', stats.size);
  const pack = tar.pack();
  let counter = 0;
  const createEntry = () => {
    if (counter % 1000 === 0) {
      console.log('Send mega bytes: ', (counter * stats.size) / 1024 * 1024);
    }
    counter++;
    const entry = pack.entry({ name: uuid.v4(), size: stats.size }, (err) => {
      if (err) {
        console.error('Entry error');
        console.error(err);
        return;
      }
      createEntry();
    });
    fs.createReadStream(entry_file).pipe(entry);
  };
  createEntry();
  return pack;
};

const chunkStream = (chunkSize) => {
  let buffer = Buffer.alloc(0);
  const transformFunction = function (data, enc, next) {
    let allData = Buffer.concat([buffer, data]);
    let totalLength = allData.length;
    let remainder = totalLength % chunkSize;
    let cutoff = totalLength - remainder;
    for (let i=0; i < cutoff; i+=chunkSize) {
      let chunk = allData.slice(i, i + chunkSize);
      this.push(chunk);
    }
    buffer = allData.slice(cutoff, totalLength);
    next();
  };
  const flushFunction = function (next) {
    if (buffer.length > 0) {
      this.push(buffer);
    }
    next();
  };
  return through(transformFunction, flushFunction);
};

const delay = (amount) => {
  return through(function (chunk, encoding, next) {
    setTimeout(() => {
      this.push(chunk);
      next();
    }, amount);
  });
};

const onStreamChunk = (handler) => through(function (chunk, encoding, next) {
  handler(chunk, encoding);
  this.push(chunk);
  next();
});

module.exports = {
  infiniteTar,
  startApp,
  chunkStream,
  delay,
  onStreamChunk,
};
