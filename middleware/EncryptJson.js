var CryptoJS = require('crypto-js');


const EncryptJson = (JsonValue) => {
    let json = JsonValue

    var key = CryptoJS.enc.Utf8.parse('123456$#@$^@1ERF');
    var iv = CryptoJS.enc.Utf8.parse('123456$#@$^@1ERF');
    var encrypted = CryptoJS.AES.encrypt(CryptoJS.enc.Utf8.parse(json.toString()), key,
      {
        keySize: 128 / 8,
        iv: iv,
        mode: CryptoJS.mode.CBC,
        padding: CryptoJS.pad.Pkcs7
      });

    let encryptedjson = encrypted.toString();

    return encryptedjson;
}

module.exports = EncryptJson
