const ClientScp = require('scp2');
const OSS = require('ali-oss');
const ClientShh = require('ssh2').Client;
const fs = require('fs');
const path = require('path');
const util = require('util');
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
    ClientScp.scp(`${localFilePath}`, `${remoteAddress}:${remoteFilePath}`, (err) => {
      if (err) {
        // eslint-disable-next-line prefer-promise-reject-errors
        reject(`Fail: 1 ${err.message}`);
        return;
      }
      resolve('upload success!');
    });
  });
}
// oss 上传
async function uploadOss() {
  console.log('目录：', localFilePath);
  const ClientOss = new OSS({
    region: 'oss-cn-hongkong',
    accessKeyId: 'LTAI5tRDFWD6tDB1n67XvQhj',
    accessKeySecret: 'U6RiRYlt0UpZ8IU8Rbs3nMRzC9gDa6',
    bucket: 'affiliate-traffic'
  });
  try {
    const files = fs.readdirSync(localFilePath);
    // 文件列表在files变量中
    const filePaths = [];
    files.forEach((file) => {
      // console.log(file);
      const pathFile = path.join(localFilePath, file);
      const key = `community/dist/${file}`;
      const stat = fs.statSync(pathFile);
      if (
        stat.isFile() &&
        (pathFile.indexOf('.js') > 0 || pathFile.indexOf('.css') > 0 || pathFile.indexOf('.html') > 0)
      ) {
        ClientOss.put(key, pathFile)
          .then(() => {
            console.log('upload success:', key);
          })
          .catch(() => {
            console.log('upload success fila:', key);
          });
      }
    });
  } catch (err) {
    console.log('Unable to scan directory: ' + err);
  }
}

// 重启
async function restart() {
  let conn = new ClientShh();
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
  uploadOss();
  // 重启
  // const restartResult = await restart().catch(console.error);
  // console.log(restartResult);
})();
