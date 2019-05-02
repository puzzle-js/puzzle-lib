"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const chai_1 = require("chai");
const jsdom_1 = require("jsdom");
const puzzle_1 = require("../src/puzzle");
const enums_1 = require("../src/enums");
const sinon_1 = __importDefault(require("sinon"));
const faker = __importStar(require("faker"));
describe('PuzzleJs', () => {
    beforeEach(() => {
        global.window = (new jsdom_1.JSDOM(``, { runScripts: "outside-only" })).window;
    });
    afterEach(() => {
        delete global.window;
        puzzle_1.PuzzleJs.clearListeners();
    });
    it('should has a method for injecting modules', function () {
        class Module {
            constructor() {
            }
            static m() {
            }
        }
        puzzle_1.PuzzleJs.inject({ module: Module });
        chai_1.expect(puzzle_1.PuzzleJs['module'].m).to.eq(Module.m);
    });
    it('should register listeners', function () {
        const fn = sinon_1.default.spy();
        const variable = faker.helpers.createCard();
        puzzle_1.PuzzleJs.subscribe(enums_1.EVENT.ON_PAGE_LOAD, fn);
        puzzle_1.PuzzleJs.emit(enums_1.EVENT.ON_PAGE_LOAD, variable);
        chai_1.expect(fn.calledWithExactly(variable)).to.true;
    });
});
