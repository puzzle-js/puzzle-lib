import {JSDOM} from "jsdom";
import {PuzzleJs} from "../src/puzzle";
import {on} from "../src/decorators";
import {EVENT} from "../src/enums";


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

describe('PuzzleLib Decorators', () => {
    beforeEach(() => {
        global.window = (new JSDOM(``, {runScripts: "outside-only"})).window;
    });

    afterEach(() => {
        delete global.window;
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
