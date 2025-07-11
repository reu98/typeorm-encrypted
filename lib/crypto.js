"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.decryptData = exports.encryptData = void 0;
const crypto_1 = require("crypto");
const DEFAULT_AUTH_TAG_LENGTH = 16;
function hasAuthTag(algorithm) {
    return algorithm.endsWith('-gcm') || algorithm.endsWith('-ccm') || algorithm.endsWith('-ocb');
}
/**
 * Encrypt data.
 */
function encryptData(data, options) {
    const { algorithm, authTagLength, ivLength, key } = options;
    const iv = options.iv
        ? Buffer.from(options.iv, 'hex')
        : (0, crypto_1.randomBytes)(ivLength);
    const cipherOptions = { authTagLength: authTagLength !== null && authTagLength !== void 0 ? authTagLength : DEFAULT_AUTH_TAG_LENGTH };
    const cipher = crypto_1.createCipheriv(algorithm, Buffer.from(key, 'hex'), iv, cipherOptions);
    const start = cipher.update(data);
    const final = cipher.final();
    if (hasAuthTag(options.algorithm)) {
        return Buffer.concat([iv, cipher.getAuthTag(), start, final]);
    }
    else {
        return Buffer.concat([iv, start, final]);
    }
}
exports.encryptData = encryptData;
/**
 * Decrypt data.
 */
function decryptData(data, options) {
    var _a;
    const { algorithm, ivLength, key } = options;
    const authTagLength = (_a = options.authTagLength) !== null && _a !== void 0 ? _a : DEFAULT_AUTH_TAG_LENGTH;
    const iv = data.slice(0, ivLength);
    const decipher = (0, crypto_1.createDecipheriv)(algorithm, Buffer.from(key, 'hex'), iv);
    let dataToUse = data.slice(options.ivLength);
    if (hasAuthTag(options.algorithm)) {
        // Add ts-ignore due to build error TS2339: Property 'setAuthTag' does not exist on type 'Decipher'.
        // @ts-ignore
        decipher.setAuthTag(dataToUse.slice(0, authTagLength));
        dataToUse = dataToUse.slice(authTagLength);
    }
    const start = decipher.update(dataToUse);
    const final = decipher.final();
    return Buffer.concat([start, final]);
}
exports.decryptData = decryptData;
//# sourceMappingURL=crypto.js.map