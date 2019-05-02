"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const puzzle_1 = require("./puzzle");
const core_1 = require("./core");
const info_1 = require("./modules/info");
const variables_1 = require("./modules/variables");
const fragments_1 = require("./modules/fragments");
const analytics_1 = require("./modules/analytics");
const storage_1 = require("./modules/storage");
(function () {
    const MODULES = {
        Core: core_1.Core,
        Info: info_1.Info,
        Variables: variables_1.Variables,
        Fragments: fragments_1.Fragments,
        Analytics: analytics_1.Analytics,
        Storage: storage_1.Storage
    };
    puzzle_1.PuzzleJs.inject(MODULES);
    window.PuzzleJs = puzzle_1.PuzzleJs;
})();
