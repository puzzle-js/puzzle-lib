"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const module_1 = require("../module");
const util_1 = require("../util");
const decorators_1 = require("../decorators");
const enums_1 = require("../enums");
class Storage extends module_1.Module {
    static end() {
        return __awaiter(this, void 0, void 0, function* () {
            const applicationCacheStorageList = yield Storage.printApplicationCacheInfo();
            util_1.Util.wrapGroup('PuzzleJs', 'Debug Mode - Storage', () => {
                if (window.caches) {
                    util_1.Util.wrapGroup('PuzzleJs', 'Application Cache', () => {
                        util_1.Util.table(applicationCacheStorageList);
                    });
                }
            });
        });
    }
    static printApplicationCacheInfo() {
        return __awaiter(this, void 0, void 0, function* () {
            const cacheNames = yield caches.keys();
            let storageList = {
                total: 0
            };
            const sizePromises = cacheNames.map((cacheName) => __awaiter(this, void 0, void 0, function* () {
                const cache = yield caches.open(cacheName);
                const keys = yield cache.keys();
                let cacheSize = 0;
                yield Promise.all(keys.map((key) => __awaiter(this, void 0, void 0, function* () {
                    const response = yield cache.match(key);
                    if (response) {
                        const blob = yield response.blob();
                        storageList.total += blob.size;
                        cacheSize += blob.size;
                    }
                })));
                storageList[cacheName] = `${cacheSize} bytes`;
            }));
            yield Promise.all(sizePromises);
            storageList.total = `${storageList.total} bytes`;
            return storageList;
        });
    }
}
__decorate([
    decorators_1.on(enums_1.EVENT.ON_PAGE_LOAD),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], Storage, "end", null);
exports.Storage = Storage;
