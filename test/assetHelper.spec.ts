import {expect} from "chai";
import {JSDOM} from "jsdom";
import {PuzzleJs} from "../src/puzzle";
import * as faker from "faker";
import * as sinon from "sinon";
import { AssetHelper } from "../src/assetHelper";
import {IPageLibAsset} from "../src/types";
import {RESOURCE_LOADING_TYPE, RESOURCE_TYPE} from "../src/enums";

declare global {
    interface Window {
        PuzzleJs: PuzzleJs;
    }
}

export interface Global {
    document: Document;
    window: Window;
}

declare var global: Global;

describe('Module - Asset Helper', () => {
    beforeEach(() => {
        global.window = (new JSDOM(``, {runScripts: "outside-only"})).window;
    });

    afterEach(() => {
        sinon.restore();
        delete global.window;
        PuzzleJs.clearListeners();
    });

    it('should append script tag without promise', () => {
        // arrange
        const asset: IPageLibAsset = {
            name: faker.lorem.word(),
            loadMethod: RESOURCE_LOADING_TYPE.ON_FRAGMENT_RENDER,
            fragment: faker.lorem.word(),
            dependent: [],
            type: RESOURCE_TYPE.JS,
            link: faker.lorem.word(),
            preLoaded: false,
            defer: true,
        };

        // act
        const result = AssetHelper.loadJs(asset);

        // assert
        expect(global.window.document.body.children.length).to.eq(1);
    });

    it('should append link tag without promise', () => {
        // arrange
        const asset: IPageLibAsset = {
            name: faker.lorem.word(),
            loadMethod: RESOURCE_LOADING_TYPE.ON_FRAGMENT_RENDER,
            fragment: faker.lorem.word(),
            dependent: [],
            type: RESOURCE_TYPE.CSS,
            link: faker.lorem.word(),
            preLoaded: false
        };

        // act
        const result = AssetHelper.loadCSS(asset);

        // assert
        expect(global.window.document.head.children.length).to.eq(1);
    });


    it('should load given js assets', async (done) => {
        // arrange
        const spy = sinon.spy();
        const assets: IPageLibAsset[] = [
            {
                name: faker.lorem.word(),
                loadMethod: RESOURCE_LOADING_TYPE.ON_FRAGMENT_RENDER,
                fragment: faker.lorem.word(),
                dependent: [],
                type: RESOURCE_TYPE.JS,
                link: faker.lorem.word(),
                preLoaded: false,
                defer: true,
            }
        ];

        // act
        await AssetHelper.loadAssetSeries(assets, spy);

        AssetHelper.promises[assets[0].name].resolve();

        // assert
        expect(global.window.document.body.children.length).to.eq(1);

        setTimeout(() => {
            expect(spy.calledOnce).to.eq(true);
            done();
        });
    });

    it('should load given css assets', async (done) => {
        // arrange
        const spy = sinon.spy();
        const assets: IPageLibAsset[] = [
            {
                name: faker.lorem.word(),
                loadMethod: RESOURCE_LOADING_TYPE.ON_FRAGMENT_RENDER,
                fragment: faker.lorem.word(),
                dependent: [],
                type: RESOURCE_TYPE.CSS,
                link: faker.lorem.word(),
                preLoaded: false
            }
        ];

        // act
        await AssetHelper.loadAssetSeries(assets, spy);

        AssetHelper.promises[assets[0].name].resolve();

        // assert
        expect(global.window.document.head.children.length).to.eq(1);

        setTimeout(() => {
            expect(spy.calledOnce).to.eq(true);
            done();
        });
    });

    it('should call given callback when js asset has an error', async (done) => {
        // arrange
        const spy = sinon.spy();
        const assets: IPageLibAsset[] = [
            {
                name: faker.lorem.word(),
                loadMethod: RESOURCE_LOADING_TYPE.ON_FRAGMENT_RENDER,
                fragment: faker.lorem.word(),
                dependent: [],
                type: RESOURCE_TYPE.JS,
                link: faker.lorem.word(),
                preLoaded: false,
                defer: true,
            }
        ];

        // act
        await AssetHelper.loadAssetSeries(assets, spy);

        AssetHelper.promises[assets[0].name].reject();

        // assert
        expect(global.window.document.body.children.length).to.eq(1);

        setTimeout(() => {
            expect(spy.calledOnce).to.eq(true);
            done();
        });
    });

    it('should call given callback when css asset has an error', async (done) => {
        // arrange
        const spy = sinon.spy();
        const assets: IPageLibAsset[] = [
            {
                name: faker.lorem.word(),
                loadMethod: RESOURCE_LOADING_TYPE.ON_FRAGMENT_RENDER,
                fragment: faker.lorem.word(),
                dependent: [],
                type: RESOURCE_TYPE.CSS,
                link: faker.lorem.word(),
                preLoaded: false
            }
        ];

        // act
        await AssetHelper.loadAssetSeries(assets, spy);

        AssetHelper.promises[assets[0].name].reject();

        // assert
        expect(global.window.document.head.children.length).to.eq(1);

        setTimeout(() => {
            expect(spy.calledOnce).to.eq(true);
            done();
        });
    });

    it('should call given callback if assets length is 0', async (done) => {
        // arrange
        const spy = sinon.spy();
        const assets: IPageLibAsset[] = [];

        // act
        await AssetHelper.loadAssetSeries(assets, spy);

        // assert
        setTimeout(() => {
            expect(spy.calledOnce).to.eq(true);
            done();
        });
    });
});
