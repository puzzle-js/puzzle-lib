import {expect} from "chai";
import {JSDOM} from "jsdom";
import {PuzzleJs} from "../src/puzzle";
import {Core} from "../src/core";
import {createPageLibConfiguration} from "./mock";
import sinon, { SinonStub } from "sinon";
import * as faker from "faker";
import {IPageLibAsset, IPageLibConfiguration, IPageLibDependency} from "../src/types";
import {RESOURCE_LOADING_TYPE, RESOURCE_TYPE} from "../src/enums";

const sandbox = sinon.createSandbox();

declare global {
  interface Window {
    [key: string]: any;

    PuzzleJs: PuzzleJs;
  }
}

export interface Global {
  document: Document;
  window: Window;
  fetch: any;
}

declare var global: Global;

describe('Module - Core', () => {
  beforeEach(() => {
    global.window = (new JSDOM(``, { runScripts: "outside-only" })).window;
    global.fetch = sandbox.stub().resolves({json: () => {}});
  });

  afterEach(() => {
    delete global.window;
    delete global.fetch;
    PuzzleJs.clearListeners();
    sandbox.verifyAndRestore();
    (Core as any)._pageConfiguration = undefined;
  });

  it('should create new Info', () => {
    const core = new Core();

    expect(core).to.be.instanceof(Core);
  });

  it('should register Page configuration', () => {
    const pageConfiguration = createPageLibConfiguration();

    Core.config(JSON.stringify(pageConfiguration));

    expect(Core._pageConfiguration).to.deep.eq(pageConfiguration);
  });

  it('should put fragment model under window', () => {
    const windowModel = {
      name: faker.random.word(),
      description: faker.lorem.paragraphs(2)
    };
    const variableName = faker.random.word();
    const fragmentName = faker.random.word();

    Core.onVariables(fragmentName, variableName, windowModel);

    console.log(window[variableName]);

    expect(window[variableName]).to.deep.eq(windowModel);
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

    Core.load(fragmentName, `#${fragmentContainerId}`, `#${fragmentContentId}`);

    expect(global.window.document.body.innerHTML).to.eq(`<div id="${fragmentContainerId}">${fragmentContent}</div>`);
  });

  it('should create true load queue for js assets', function () {
    const assets = [
      {
        name: 'bundle1',
        dependent: ['vendor1'],
        preLoaded: false,
        link: 'bundle1.js',
        fragment: 'test',
        loadMethod: RESOURCE_LOADING_TYPE.ON_PAGE_RENDER,
        type: RESOURCE_TYPE.JS
      }
    ] as IPageLibAsset[];
    const dependencies = [
      {
        name: 'vendor1',
        link: 'vendor1.js',
        preLoaded: false
      }
    ] as IPageLibDependency[];
    const config = {
      dependencies,
      assets,
      fragments: [{
        name: 'test'
      }],
      page: 'page'
    } as IPageLibConfiguration;

    Core.config(JSON.stringify(config));

    const queue = Core.createLoadQueue(assets);

    expect(queue).to.deep.eq(
      [
        {name: 'vendor1', link: 'vendor1.js', preLoaded: true},
        {
          name: 'bundle1',
          dependent: ['vendor1'],
          preLoaded: true,
          fragment: 'test',
          link: 'bundle1.js',
          loadMethod: 2,
          type: 1,
          defer: true
        }
      ]);
  });

  it('should create true load queue for js assets excluding async', function () {
    const assets = [
      {
        name: 'bundle1',
        dependent: ['vendor1'],
        preLoaded: false,
        link: 'bundle1.js',
        fragment: 'test',
        loadMethod: RESOURCE_LOADING_TYPE.ON_PAGE_RENDER,
        type: RESOURCE_TYPE.JS
      }
    ] as IPageLibAsset[];
    const dependencies = [
      {
        name: 'vendor1',
        link: 'vendor1.js',
        preLoaded: false
      }
    ] as IPageLibDependency[];
    const config = {
      dependencies,
      assets,
      fragments: [{
        name: 'test',
        clientAsync: true
      }],
      page: 'page'
    } as IPageLibConfiguration;

    Core.config(JSON.stringify(config));

    const queue = Core.createLoadQueue(assets);

    expect(queue).to.deep.eq(
      []);
  });

  it('should render async fragment', async () => {
    const assets = [
      {
        name: 'bundle1',
        dependent: ['vendor1'],
        preLoaded: false,
        link: 'bundle1.js',
        fragment: 'test',
        loadMethod: RESOURCE_LOADING_TYPE.ON_PAGE_RENDER,
        type: RESOURCE_TYPE.JS
      }
    ] as IPageLibAsset[];
    const dependencies = [
      {
        name: 'vendor1',
        link: 'vendor1.js',
        preLoaded: false
      }
    ] as IPageLibDependency[];
    const config = {
      dependencies,
      assets,
      fragments: [{
        name: 'test',
        attributes: {
          if: "false"
        },
        chunked: true,
        clientAsync: true,
        clientAsyncForce: undefined,
        onDemand: undefined,
        source: undefined,
        asyncDecentralized: false
      }],
      page: 'page',
      peers: []
    } as IPageLibConfiguration;

    const fragmentContainer = global.window.document.createElement('div');
    fragmentContainer.setAttribute('puzzle-fragment', 'test');
    global.window.document.body.appendChild(fragmentContainer);

    const fetchStub = global.fetch as SinonStub;
    const stubAsyncRenderResponse = sandbox.stub(Core as any, "asyncRenderResponse").resolves();

    Core.config(JSON.stringify(config));
    await Core.renderAsyncFragment('test');
    await Core.renderAsyncFragment('test');
    
    expect(fetchStub.calledOnce).to.eq(true);
    expect(fetchStub.getCall(0).lastArg.headers).to.haveOwnProperty("originalurl");
    expect(stubAsyncRenderResponse.calledOnce).to.eq(true);
  });

  it('should render forced async fragment', async () => {
    const assets = [
      {
        name: 'bundle1',
        dependent: ['vendor1'],
        preLoaded: false,
        link: 'bundle1.js',
        fragment: 'test',
        loadMethod: RESOURCE_LOADING_TYPE.ON_PAGE_RENDER,
        type: RESOURCE_TYPE.JS
      }
    ] as IPageLibAsset[];
    const dependencies = [
      {
        name: 'vendor1',
        link: 'vendor1.js',
        preLoaded: false
      }
    ] as IPageLibDependency[];
    const config = {
      dependencies,
      assets,
      fragments: [{
        name: 'test',
        attributes: {
          if: "false"
        },
        chunked: true,
        clientAsync: true,
        clientAsyncForce: true,
        onDemand: undefined,
        source: undefined,
        asyncDecentralized: false
      }],
      page: 'page',
      peers: []
    } as IPageLibConfiguration;

    const fragmentContainer = global.window.document.createElement('div');
    fragmentContainer.setAttribute('puzzle-fragment', 'test');
    global.window.document.body.appendChild(fragmentContainer);

    const fetchStub = global.fetch as SinonStub;
    const stubAsyncRenderResponse = sandbox.stub(Core as any, "asyncRenderResponse").resolves();

    Core.config(JSON.stringify(config));
    await Core.renderAsyncFragment('test');
    await Core.renderAsyncFragment('test');
    
    expect(fetchStub.calledOnce).to.eq(true);
    expect(fetchStub.getCall(0).lastArg.headers).to.haveOwnProperty("originalurl");
    expect(stubAsyncRenderResponse.calledOnce).to.eq(true);
  });

  it('should return a promise object that is resolved if fragment does not exist', () => {
    const assets = [] as IPageLibAsset[];
    const dependencies = [] as IPageLibDependency[];
    const config = {
      dependencies,
      assets,
      fragments: [],
      page: 'page',
      peers: []
    } as IPageLibConfiguration;

    Core.config(JSON.stringify(config));
    const result = Core.renderAsyncFragment('test');
    
    expect(result).to.be.a('promise');
  });

  it('should return a promise object that is resolved if fragment is asyncLoaded', () => {
    const assets = [
      {
        name: 'bundle1',
        dependent: ['vendor1'],
        preLoaded: false,
        link: 'bundle1.js',
        fragment: 'test',
        loadMethod: RESOURCE_LOADING_TYPE.ON_PAGE_RENDER,
        type: RESOURCE_TYPE.JS
      }
    ] as IPageLibAsset[];
    const dependencies = [
      {
        name: 'vendor1',
        link: 'vendor1.js',
        preLoaded: false
      }
    ] as IPageLibDependency[];
    const config = {
      dependencies,
      assets,
      fragments: [{
        name: 'test',
        attributes: {
          if: "false"
        },
        chunked: true,
        clientAsync: true,
        clientAsyncForce: undefined,
        onDemand: undefined,
        source: undefined,
        asyncDecentralized: false,
        asyncLoaded: true
      }],
      page: 'page',
      peers: []
    } as IPageLibConfiguration;

    Core.config(JSON.stringify(config));
    const result = Core.renderAsyncFragment('test');
    
    expect(result).to.be.a('promise');
  });
});
