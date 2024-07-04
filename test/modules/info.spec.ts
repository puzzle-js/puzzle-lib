import {expect} from "chai";
import {DOMWindow, JSDOM} from "jsdom";
import {PuzzleJs} from "../../src/puzzle";
import {Info} from "../../src/modules/info";

declare global {
    interface Window {
        PuzzleJs: PuzzleJs;
    }
}

export interface Global {
    document: Document;
    window: DOMWindow;
}

declare var global: Global;

describe('Module - Info', () => {
    beforeEach(() => {
        global.window = (new JSDOM(``, {runScripts: "outside-only"})).window;
    });

    afterEach(() => {
        delete (global as { window?: DOMWindow }).window;
        PuzzleJs.clearListeners();
    });

    it('should create new Info', () => {
        const info = new Info();

        expect(info).to.be.instanceof(Info);
    });
});
