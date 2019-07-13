import {expect} from "chai";
import {PuzzleJs} from "../src/puzzle";
import {JSDOM} from "jsdom";

declare global {
    interface IWindow {
        PuzzleJs: PuzzleJs;
    }
}


export interface IGlobal {
    document: Document;
    window: IWindow;
}

declare var global: IGlobal;

describe('PuzzleJs Lib', () => {
    beforeEach(() => {
        global.window = (new JSDOM(``, {runScripts: "outside-only"})).window;
    });

    afterEach(() => {
        delete global.window;
        PuzzleJs.clearListeners();
    });

    it('should declare PuzzleJs under window', () => {
        require("../src");

        expect(window.PuzzleJs).to.eq(PuzzleJs);
    });
});
