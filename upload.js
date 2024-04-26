const client = require('scp2');
// 服务器信息
const host = '1.94.25.172';
const username = 'root';
const password = 'Hws2416$';
const port = 22;
const localFilePath = `${__dirname}/dist`;
const remoteFilePath = '/www/dist';

const remoteAddress = `${username}:${password}@${host}`;
console.log('localFilePath:', `${localFilePath}/index.html`);
console.log('au:', `${remoteAddress}:${remoteFilePath}`);

// 上传
async function upload() {
  return new Promise((resolve, reject) => {
    client.scp(`${localFilePath}`, `${remoteAddress}:${remoteFilePath}`, (err) => {
      if (err) {
        // eslint-disable-next-line prefer-promise-reject-errors
        reject(`Fail: 1 ${err.message}`);
        return;
      }
      resolve('upload success!');
    });
  });
}

// 重启
async function restart() {
  let Client = require('ssh2').Client;
  let conn = new Client();
  return new Promise((resolve, reject) => {
    conn
      .on('ready', function() {
        console.log('Client :: ready');
        conn.exec(`cd ${remoteFilePath};pwd;npm i;npm run restart;`, function(err, stream) {
          if (err) throw err;
          stream
            .on('close', function(code, signal) {
              console.log(`Stream :: close :: code: ${code}, signal: ${signal}`);
              conn.end();
              resolve('restart success!');
            })
            .on('data', function(data) {
              console.log(`STDOUT: ${data}`);
            })
            .stderr.on('data', function(data) {
              console.log(`STDERR: ${data}`);
            });
        });
      })
      .connect({
        host,
        port,
        username,
        password
      });
  });
}

// 启动任务
(async () => {
  // 上传
  const uploadResult = await upload().catch(console.error);
  console.log(uploadResult);
  // 重启
  // const restartResult = await restart().catch(console.error);
  // console.log(restartResult);
})();
