"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const chai_1 = require("chai");
const puzzle_1 = require("../src/puzzle");
const jsdom_1 = require("jsdom");
describe('PuzzleJs Lib', () => {
    beforeEach(() => {
        global.window = (new jsdom_1.JSDOM(``, { runScripts: "outside-only" })).window;
    });
    afterEach(() => {
        delete global.window;
        puzzle_1.PuzzleJs.clearListeners();
    });
    it('should declare PuzzleJs under window', () => {
        require("../../src/lib");
        chai_1.expect(window.PuzzleJs).to.eq(puzzle_1.PuzzleJs);
    });
});
