var CryptoJS = require('crypto-js');



const DecryptJson = (JsonValue) => {
    let json = JsonValue

    var key = CryptoJS.enc.Utf8.parse('123456$#@$^@1ERF');
    var iv = CryptoJS.enc.Utf8.parse('123456$#@$^@1ERF');
    var decrypted = CryptoJS.AES.decrypt(json.toString(), key, {
        keySize: 128 / 8,
        iv: iv,
        mode: CryptoJS.mode.CBC,
        padding: CryptoJS.pad.Pkcs7
    });
    let decryptedjson = decrypted.toString(CryptoJS.enc.Utf8);

    return decryptedjson;
}

module.exports = DecryptJson
