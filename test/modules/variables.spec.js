"use strict";
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const chai_1 = require("chai");
const jsdom_1 = require("jsdom");
const puzzle_1 = require("../../src/puzzle");
const variables_1 = require("../../src/modules/variables");
const faker = __importStar(require("faker"));
const sinon_1 = __importDefault(require("sinon"));
const util_1 = require("../../src/util");
describe('Module - Variables', () => {
    beforeEach(() => {
        global.window = (new jsdom_1.JSDOM(``, { runScripts: "outside-only" })).window;
    });
    afterEach(() => {
        sinon_1.default.restore();
        delete global.window;
        puzzle_1.PuzzleJs.clearListeners();
        variables_1.Variables.variables = {};
    });
    it('should create new Info', () => {
        const variables = new variables_1.Variables();
        chai_1.expect(variables).to.be.instanceof(variables_1.Variables);
    });
    it('should set fragment variables', function () {
        const variable = faker.helpers.userCard();
        const fragmentName = faker.random.word();
        variables_1.Variables.set(fragmentName, '__fragment_variable', variable);
        chai_1.expect(variables_1.Variables.variables[fragmentName]['__fragment_variable']).to.eq(variable);
    });
    it('should print variables', function () {
        const variable = faker.helpers.userCard();
        const fragmentName = faker.random.word();
        const fn = sinon_1.default.stub(util_1.Util, 'log');
        window.__fragment_variable = variable;
        variables_1.Variables.set(fragmentName, '__fragment_variable', variable);
        variables_1.Variables.print();
        chai_1.expect(fn.calledWith(variable)).to.true;
    });
    it('should define setter getter for variables', function () {
        const variable = {
            fragment: faker.helpers.userCard()
        };
        variables_1.Variables.variables = variable;
        chai_1.expect(variables_1.Variables.variables).to.eq(variable);
    });
});
