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
const jsdom_1 = require("jsdom");
const puzzle_1 = require("../src/puzzle");
const decorators_1 = require("../src/decorators");
const enums_1 = require("../src/enums");
describe('PuzzleLib Decorators', () => {
    beforeEach(() => {
        global.window = (new jsdom_1.JSDOM(``, { runScripts: "outside-only" })).window;
    });
    afterEach(() => {
        delete global.window;
        puzzle_1.PuzzleJs.clearListeners();
    });
    it('should register for events on PuzzleJs', (done) => {
        class Test {
            static pageLoaded() {
                done();
            }
        }
        __decorate([
            decorators_1.on(enums_1.EVENT.ON_PAGE_LOAD),
            __metadata("design:type", Function),
            __metadata("design:paramtypes", []),
            __metadata("design:returntype", void 0)
        ], Test, "pageLoaded", null);
        puzzle_1.PuzzleJs.emit(enums_1.EVENT.ON_PAGE_LOAD);
    });
});
