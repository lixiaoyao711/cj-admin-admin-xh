export function doEncrypt(msgString) {
  let msg = msgString;
  if (typeof msgString !== 'string') {
    msg = JSON.stringify(msgString);
  }
  let sm2 = require('sm-crypto').sm2;
  let cipherMode = 0; // 1 - C1C3C2，0 - C1C2C3，默认为1
  let publicKey =
    '04601f2f675b5112fe2cbaacfb7426b0bfbfbe3b0a340d71f01d047546b5c640efcf1c8e2d2a7965921377bbbb0fc68aa9880e0c66439f3333bac9f3afea63a9a8'; // 公钥
  let encryptData = '04' + sm2.doEncrypt(msg, publicKey, cipherMode); // 加密结果
  console.log('加密结果：', encryptData);
  return encryptData;
}
