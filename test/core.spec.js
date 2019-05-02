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
const puzzle_1 = require("../src/puzzle");
const core_1 = require("../src/core");
const mock_1 = require("./mock");
const faker = __importStar(require("faker"));
const enums_1 = require("../src/enums");
describe('Module - Core', () => {
    beforeEach(() => {
        global.window = (new jsdom_1.JSDOM(``, { runScripts: "outside-only" })).window;
    });
    afterEach(() => {
        delete global.window;
        puzzle_1.PuzzleJs.clearListeners();
        core_1.Core._pageConfiguration = undefined;
    });
    it('should create new Info', () => {
        const core = new core_1.Core();
        chai_1.expect(core).to.be.instanceof(core_1.Core);
    });
    it('should register Page configuration', () => {
        const pageConfiguration = mock_1.createPageLibConfiguration();
        core_1.Core.config(JSON.stringify(pageConfiguration));
        chai_1.expect(core_1.Core._pageConfiguration).to.deep.eq(pageConfiguration);
    });
    it('should put fragment model under window', () => {
        const windowModel = {
            name: faker.random.word(),
            description: faker.lorem.paragraphs(2)
        };
        const variableName = faker.random.word();
        const fragmentName = faker.random.word();
        core_1.Core.onVariables(fragmentName, variableName, windowModel);
        console.log(window[variableName]);
        chai_1.expect(window[variableName]).to.deep.eq(windowModel);
    });
    it('should load fragment and replace its contents', function () {
        const fragmentName = faker.random.word();
        const fragmentContent = faker.random.words();
        const fragmentContainerId = "fragment-container";
        const fragmentContentId = "fragment-content";
        const fragmentContainer = global.window.document.createElement('div');
        fragmentContainer.setAttribute('id', fragmentContainerId);
        global.window.document.body.appendChild(fragmentContainer);
        const fragmentContentContainer = global.window.document.createElement('div');
        fragmentContentContainer.setAttribute('id', fragmentContentId);
        fragmentContentContainer.innerHTML = fragmentContent;
        global.window.document.body.appendChild(fragmentContentContainer);
        core_1.Core.load(fragmentName, `#${fragmentContainerId}`, `#${fragmentContentId}`);
        chai_1.expect(global.window.document.body.innerHTML).to.eq(`<div id="${fragmentContainerId}">${fragmentContent}</div>`);
    });
    it('should create true load queue for js assets', function () {
        const assets = [
            {
                name: 'bundle1',
                dependent: ['vendor1'],
                preLoaded: false,
                link: 'bundle1.js',
                loadMethod: enums_1.RESOURCE_LOADING_TYPE.ON_PAGE_RENDER,
                type: enums_1.RESOURCE_TYPE.JS
            }
        ];
        const dependencies = [
            {
                name: 'vendor1',
                link: 'vendor1.js',
                preLoaded: false
            }
        ];
        const config = {
            dependencies,
            assets,
            fragments: [],
            page: 'page'
        };
        core_1.Core.config(JSON.stringify(config));
        const queue = core_1.Core.createLoadQueue(assets);
        chai_1.expect(queue).to.deep.eq([
            { name: 'vendor1', link: 'vendor1.js', preLoaded: true },
            {
                name: 'bundle1',
                dependent: ['vendor1'],
                preLoaded: true,
                link: 'bundle1.js',
                loadMethod: 2,
                type: 1,
                defer: true
            }
        ]);
    });
});
