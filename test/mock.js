"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createPageLibConfiguration = (providedConfiguration) => {
    return Object.assign({ assets: [], fragments: [{
                name: "test-fragment",
                chunked: false
            }], page: 'test-page' }, providedConfiguration);
};
