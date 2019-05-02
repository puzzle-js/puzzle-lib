"use strict";
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const chai_1 = require("chai");
const jsdom_1 = require("jsdom");
const puzzle_1 = require("../../src/puzzle");
const faker = __importStar(require("faker"));
const sinon = __importStar(require("sinon"));
const util_1 = require("../../src/util");
const fragments_1 = require("../../src/modules/fragments");
describe('Module - Fragments', () => {
    beforeEach(() => {
        global.window = (new jsdom_1.JSDOM(``, { runScripts: "outside-only" })).window;
    });
    afterEach(() => {
        sinon.restore();
        delete global.window;
        puzzle_1.PuzzleJs.clearListeners();
    });
    it('should create new Fragments', () => {
        const fragments = new fragments_1.Fragments();
        chai_1.expect(fragments).to.be.instanceof(fragments_1.Fragments);
    });
    it('should log fragment information', function () {
        const fragments = new fragments_1.Fragments();
        const fn = sinon.stub(util_1.Util, 'log');
        const variable = {
            fragmentName: faker.helpers.userCard()
        };
        fragments.set(variable);
        chai_1.expect(fn.calledWith(variable['fragmentName'])).to.eq(true);
    });
});
