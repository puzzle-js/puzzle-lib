"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class PuzzleJs {
    static subscribe(event, cb) {
        if (!PuzzleJs.__LISTENERS[event]) {
            PuzzleJs.__LISTENERS[event] = [cb];
        }
        else {
            PuzzleJs.__LISTENERS[event].push(cb);
        }
    }
    static emit(event, ...data) {
        if (PuzzleJs.__LISTENERS[event]) {
            for (const listener of PuzzleJs.__LISTENERS[event]) {
                listener.apply(null, data);
            }
        }
    }
    static clearListeners() {
        PuzzleJs.__LISTENERS = {};
    }
    static inject(modules) {
        for (const name in modules) {
            PuzzleJs[name] = modules[name];
        }
    }
}
PuzzleJs.PACKAGE_VERSION = '';
PuzzleJs.DEPENDENCIES = {};
PuzzleJs.LOGO = '';
PuzzleJs.__LISTENERS = {};
exports.PuzzleJs = PuzzleJs;
