"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AutoEncryptSubscriber = void 0;
const typeorm_1 = require("typeorm");
const entity_1 = require("../entity");
let AutoEncryptSubscriber = class AutoEncryptSubscriber {
    /**
     * Encrypt before insertion.
     */
    beforeInsert(event) {
        (0, entity_1.encrypt)(event.entity);
    }
    /**
     * Encrypt before update.
     */
    beforeUpdate(event) {
        (0, entity_1.encrypt)(event.entity);
    }
    /**
     * Decrypt after find.
     */
    afterLoad(entity) {
        (0, entity_1.decrypt)(entity);
    }
};
AutoEncryptSubscriber = __decorate([
    (0, typeorm_1.EventSubscriber)()
], AutoEncryptSubscriber);
exports.AutoEncryptSubscriber = AutoEncryptSubscriber;
//# sourceMappingURL=AutoEncryptSubscriber.js.map