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
const enums_1 = require("../enums");
const decorators_1 = require("../decorators");
class Variables extends module_1.Module {
    static get variables() {
        return Variables.__variables;
    }
    static set variables(value) {
        Variables.__variables = value;
    }
    static print() {
        util_1.Util.wrapGroup('PuzzleJs', 'Debug Mode - Variables', () => {
            Object.keys(Variables.variables).forEach(fragmentName => {
                util_1.Util.wrapGroup('PuzzleJs', fragmentName, () => {
                    Object.keys(Variables.variables[fragmentName]).forEach(configKey => {
                        util_1.Util.wrapGroup('PuzzleJs', configKey, () => {
                            util_1.Util.log(Variables.variables[fragmentName][configKey]);
                        }, enums_1.LOG_COLORS.YELLOW);
                    });
                }, enums_1.LOG_COLORS.BLUE);
            });
        });
    }
    static set(fragmentName, varName, configData) {
        if (!Variables.variables[fragmentName]) {
            Variables.variables[fragmentName] = {};
        }
        Variables.variables[fragmentName][varName] = configData;
    }
}
Variables.__variables = {};
__decorate([
    decorators_1.on(enums_1.EVENT.ON_PAGE_LOAD),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], Variables, "print", null);
__decorate([
    decorators_1.on(enums_1.EVENT.ON_VARIABLES),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, Object]),
    __metadata("design:returntype", void 0)
], Variables, "set", null);
exports.Variables = Variables;
