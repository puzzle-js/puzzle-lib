import {DOMWindow, JSDOM} from "jsdom";
import {PuzzleJs} from "../src/puzzle";
import {on} from "../src/decorators";
import {EVENT} from "../src/enums";


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

describe('PuzzleLib Decorators', () => {
    beforeEach(() => {
        global.window = (new JSDOM(``, {runScripts: "outside-only"})).window;
    });

    afterEach(() => {
        delete (global as { window?: DOMWindow }).window;
        PuzzleJs.clearListeners();
    });

    it('should register for events on PuzzleJs', (done) => {
        class Test {
            @on(EVENT.ON_PAGE_LOAD)
            static pageLoaded() {
                done();
            }
        }

        PuzzleJs.emit(EVENT.ON_PAGE_LOAD);
    });
});
