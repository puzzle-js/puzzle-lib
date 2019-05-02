"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const chai_1 = require("chai");
const jsdom_1 = require("jsdom");
const puzzle_1 = require("../../src/puzzle");
const info_1 = require("../../src/modules/info");
describe('Module - Info', () => {
    beforeEach(() => {
        global.window = (new jsdom_1.JSDOM(``, { runScripts: "outside-only" })).window;
    });
    afterEach(() => {
        delete global.window;
        puzzle_1.PuzzleJs.clearListeners();
    });
    it('should create new Info', () => {
        const info = new info_1.Info();
        chai_1.expect(info).to.be.instanceof(info_1.Info);
    });
});
