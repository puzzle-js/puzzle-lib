"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const enums_1 = require("./enums");
class Util {
    static wrapGroup(name, description, fn, color = enums_1.LOG_COLORS.GREEN) {
        const logConfig = (name, color) => ['%c' + name, `background: ${color}; color: white; padding: 2px 0.5em; ` + `border-radius: 0.5em;`];
        window.console.groupCollapsed(...logConfig(name, color), description);
        fn();
        window.console.groupEnd();
    }
    static log(content, type = enums_1.LOG_TYPES.INFO, color = enums_1.LOG_COLORS.BLUE) {
        const logConfig = (c) => ['%cPuzzleJs', `background: ${c}; color: white; padding: 2px 0.5em; ` + `border-radius: 0.5em;`];
        window.console[type](...logConfig(color), content);
    }
    static table(content) {
        window.console.table(content);
    }
}
exports.Util = Util;
