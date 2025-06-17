"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.decrypt = exports.encrypt = void 0;
const typeorm_1 = require("typeorm");
const crypto_1 = require("./crypto");
/**
 * Encrypt fields on entity.
 */
function encrypt(entity) {
    if (!entity) {
        return entity;
    }
    for (let columnMetadata of (0, typeorm_1.getMetadataArgsStorage)().columns) {
        let { propertyName, mode, target } = columnMetadata;
        let options = columnMetadata.options;
        let encrypt = options.encrypt;
        if (encrypt &&
            !((encrypt === null || encrypt === void 0 ? void 0 : encrypt.encryptionPredicate) && !(encrypt === null || encrypt === void 0 ? void 0 : encrypt.encryptionPredicate(entity))) &&
            mode === 'regular' &&
            (encrypt.looseMatching || entity.constructor === target)) {
            if (entity[propertyName]) {
                entity[propertyName] = (0, crypto_1.encryptData)(Buffer.from(entity[propertyName], 'utf8'), encrypt).toString('base64');
            }
        }
    }
    return entity;
}
exports.encrypt = encrypt;
const getDecryptedValue = (value, options) => {
    try {
        return (0, crypto_1.decryptData)(Buffer.from(value, 'base64'), options).toString('utf8');
    }
    catch (_a) {
        return value;
    }
};
/**
 * Decrypt fields on entity.
 */
function decrypt(entity) {
    if (!entity) {
        return entity;
    }
    for (let columnMetadata of (0, typeorm_1.getMetadataArgsStorage)().columns) {
        let { propertyName, mode, target } = columnMetadata;
        let options = columnMetadata.options;
        let encrypt = options.encrypt;
        if (encrypt &&
            !((encrypt === null || encrypt === void 0 ? void 0 : encrypt.encryptionPredicate) && !(encrypt === null || encrypt === void 0 ? void 0 : encrypt.encryptionPredicate(entity))) &&
            mode === 'regular' &&
            (encrypt.looseMatching || entity.constructor === target)) {
            if (entity[propertyName]) {
                entity[propertyName] = getDecryptedValue(entity[propertyName], encrypt);
            }
        }
    }
    return entity;
}
exports.decrypt = decrypt;
//# sourceMappingURL=entity.js.map