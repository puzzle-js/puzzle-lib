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
Object.defineProperty(exports, "__esModule", { value: true });
const module_1 = require("../module");
const util_1 = require("../util");
const puzzle_1 = require("../puzzle");
const decorators_1 = require("../decorators");
const enums_1 = require("../enums");
class Info extends module_1.Module {
    static showInformation() {
        util_1.Util.wrapGroup('PuzzleJs', 'Debug Mode - Package Info', () => {
            this.logo();
            util_1.Util.log(`PuzzleJs: ${puzzle_1.PuzzleJs.PACKAGE_VERSION}`);
            util_1.Util.table(puzzle_1.PuzzleJs.DEPENDENCIES);
        });
    }
    static logo() {
        window.console.log('%c       ', `font-size: 400px; background: url(${puzzle_1.PuzzleJs.LOGO}) no-repeat;`);
    }
}
__decorate([
    decorators_1.on(enums_1.EVENT.ON_PAGE_LOAD),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], Info, "showInformation", null);
exports.Info = Info;
