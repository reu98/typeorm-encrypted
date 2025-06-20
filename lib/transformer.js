"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.JSONEncryptionTransformer = exports.EncryptionTransformer = void 0;
const typeorm_1 = require("typeorm");
const crypto_1 = require("./crypto");
class EncryptionTransformer {
    constructor(options) {
        this.options = options;
    }
    from(value) {
        if (!value) {
            return;
        }
        try {
            return (0, crypto_1.decryptData)(Buffer.from(value, 'base64'), this.options).toString('utf8');
        }
        catch (_a) {
            return value;
        }
    }
    to(value) {
        var _a;
        if ((value !== null && value !== void 0 ? value : null) === null) {
            return;
        }
        if (typeof value === 'string') {
            return (0, crypto_1.encryptData)(Buffer.from(value, 'utf8'), this.options).toString('base64');
        }
        if (!value) {
            return;
        }
        // Support FindOperator.
        // Just support "Equal", "In", "Not", and "IsNull".
        // Other operators aren't work correctly, because values are encrypted on the db.
        if (value.type === `in`) {
            return (0, typeorm_1.In)(value.value.map(s => (0, crypto_1.encryptData)(Buffer.from(s, 'utf-8'), this.options).toString('base64')));
        }
        else if (value.type === 'equal') {
            return (0, typeorm_1.Equal)((0, crypto_1.encryptData)(Buffer.from(value.value, 'utf-8'), this.options).toString('base64'));
        }
        else if (value.type === 'not') {
            return (0, typeorm_1.Not)(this.to((_a = value.child) !== null && _a !== void 0 ? _a : value.value));
        }
        else if (value.type === 'isNull') {
            return value;
        }
        else {
            throw new Error('Only "Equal","In", "Not", and "IsNull" are supported for FindOperator');
        }
    }
}
exports.EncryptionTransformer = EncryptionTransformer;
class JSONEncryptionTransformer {
    constructor(options) {
        this.options = options;
    }
    from(value) {
        if (!(value === null || value === void 0 ? void 0 : value.encrypted))
            return value;
        try {
            const decrypted = (0, crypto_1.decryptData)(Buffer.from(value.encrypted, 'base64'), this.options).toString('utf8');
            return JSON.parse(decrypted);
        }
        catch (_a) {
            return value;
        }
    }
    to(value) {
        if ((value !== null && value !== void 0 ? value : null) === null) {
            return;
        }
        if (typeof value === 'object' && !(value === null || value === void 0 ? void 0 : value.type)) {
            const encrypted = (0, crypto_1.encryptData)(Buffer.from(JSON.stringify(value), 'utf8'), this.options).toString('base64');
            return { encrypted };
        }
        if (!value) {
            return;
        }
        // FindOperators are not supported.
        throw new Error('Filter operators are not supported for JSON encrypted fields');
    }
}
exports.JSONEncryptionTransformer = JSONEncryptionTransformer;
//# sourceMappingURL=transformer.js.map