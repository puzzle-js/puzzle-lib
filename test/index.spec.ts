import {expect} from "chai";
import {PuzzleJs} from "../src/puzzle";
import {JSDOM} from "jsdom";

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

describe('PuzzleJs Lib', () => {
    beforeEach(() => {
        global.window = (new JSDOM(``, {runScripts: "outside-only"})).window;
    });

    afterEach(() => {
        delete (global as { window?: Window }).window;
        PuzzleJs.clearListeners();
    });

    it('should declare PuzzleJs under window', () => {
        require("../src");

        expect(window.PuzzleJs).to.eq(PuzzleJs);
    });
});
