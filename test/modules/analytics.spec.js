"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const chai_1 = require("chai");
const jsdom_1 = require("jsdom");
const puzzle_1 = require("../../src/puzzle");
const sinon_1 = __importDefault(require("sinon"));
const analytics_1 = require("../../src/modules/analytics");
describe('Module - Fragments', () => {
    beforeEach(() => {
        global.window = (new jsdom_1.JSDOM(``, { runScripts: "outside-only" })).window;
    });
    afterEach(() => {
        sinon_1.default.restore();
        delete global.window;
        puzzle_1.PuzzleJs.clearListeners();
    });
    it('should create new Analytics', () => {
        const fragments = new analytics_1.Analytics();
        chai_1.expect(fragments).to.be.instanceof(analytics_1.Analytics);
    });
});
