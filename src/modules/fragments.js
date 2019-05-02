"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const module_1 = require("../module");
const util_1 = require("../util");
const enums_1 = require("../enums");
class Fragments extends module_1.Module {
    set(fragmentInfo) {
        util_1.Util.wrapGroup('PuzzleJs', 'Debug Mode - Fragments', () => {
            Object.keys(fragmentInfo).forEach(fragmentName => {
                util_1.Util.wrapGroup('PuzzleJs', fragmentName, () => {
                    util_1.Util.log(fragmentInfo[fragmentName]);
                }, enums_1.LOG_COLORS.BLUE);
            });
        });
    }
}
exports.Fragments = Fragments;
