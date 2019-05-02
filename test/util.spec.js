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
const util_1 = require("../src/util");
const puzzle_1 = require("../src/puzzle");
const sinon_1 = __importDefault(require("sinon"));
const faker = __importStar(require("faker"));
describe('Module - Util', () => {
    beforeEach(() => {
        global.window = (new jsdom_1.JSDOM(``, { runScripts: "outside-only" })).window;
    });
    afterEach(() => {
        delete global.window;
        puzzle_1.PuzzleJs.clearListeners();
    });
    it('should create new Util', () => {
        const util = new util_1.Util();
        chai_1.expect(util).to.be.instanceof(util_1.Util);
    });
    it('should wrap group in console', () => {
        const groupStub = sinon_1.default.stub(global.window.console, 'groupCollapsed');
        const logStub = sinon_1.default.stub(global.window.console, 'log');
        const groupEndStub = sinon_1.default.stub(global.window.console, 'groupEnd');
        const fakerWords = [faker.random.word(), faker.random.word(), faker.random.word()];
        util_1.Util.wrapGroup(fakerWords[0], fakerWords[1], () => {
            window.console.log(fakerWords[2]);
        });
        chai_1.expect(groupStub.calledOnce).to.true;
        chai_1.expect(logStub.calledOnce).to.true;
        chai_1.expect(groupEndStub.calledOnce).to.true;
    });
    it('should log with Puzzle theme', () => {
        const logStub = sinon_1.default.stub(global.window.console, 'info');
        const log = faker.random.word();
        util_1.Util.log(log);
        chai_1.expect(logStub.calledOnce).to.true;
    });
    it('should crete table', () => {
        const logStub = sinon_1.default.stub(global.window.console, 'table');
        const object = faker.helpers.userCard();
        util_1.Util.table(object);
        chai_1.expect(logStub.calledOnce).to.true;
        chai_1.expect(logStub.calledWith(object)).to.true;
    });
});
