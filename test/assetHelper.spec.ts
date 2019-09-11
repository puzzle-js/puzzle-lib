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
        expect(result).to.eq(null);
        expect(global.window.document.body.children.length).to.eq(1);
    });

});
