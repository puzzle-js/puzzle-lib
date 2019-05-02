"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const puzzle_1 = require("./puzzle");
exports.on = (event) => {
    return function (target, propertyKey, descriptor) {
        puzzle_1.PuzzleJs.subscribe(event, descriptor.value.bind(target));
        return descriptor;
    };
};
