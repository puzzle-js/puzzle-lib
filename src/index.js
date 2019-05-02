"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const puzzle_1 = require("./puzzle");
const core_1 = require("./core");
(function () {
    const MODULES = {
        Core: core_1.Core
    };
    puzzle_1.PuzzleJs.inject(MODULES);
    window.PuzzleJs = puzzle_1.PuzzleJs;
})();
