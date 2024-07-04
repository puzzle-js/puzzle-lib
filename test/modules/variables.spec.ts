import {expect} from "chai";
import {DOMWindow, JSDOM} from "jsdom";
import {PuzzleJs} from "../../src/puzzle";
import {Variables} from "../../src/modules/variables";
import * as faker from "faker";
import sinon from "sinon";
import {Util} from "../../src/util";

declare global {
    interface Window {
        PuzzleJs: PuzzleJs;
        __fragment_variable: any;
    }
}

export interface Global {
    document: Document;
    window: DOMWindow;
}

declare var global: Global;

describe('Module - Variables', () => {
    beforeEach(() => {
        global.window = (new JSDOM(``, {runScripts: "outside-only"})).window;
    });

    afterEach(() => {
        sinon.restore();
        delete (global as { window?: DOMWindow }).window;
        PuzzleJs.clearListeners();
        Variables.variables = {};
    });

    it('should create new Info', () => {
        const variables = new Variables();

        expect(variables).to.be.instanceof(Variables);
    });

    it('should set fragment variables', function () {
        const variable = faker.helpers.userCard();
        const fragmentName = faker.random.word();

        Variables.set(fragmentName, '__fragment_variable', variable);

        expect(Variables.variables[fragmentName]['__fragment_variable']).to.eq(variable);
    });

    it('should print variables', function () {
        const variable = faker.helpers.userCard();
        const fragmentName = faker.random.word();
        const fn = sinon.stub(Util, 'log');
        window.__fragment_variable = variable;

        Variables.set(fragmentName, '__fragment_variable', variable);
        Variables.print();

        expect(fn.calledWith(variable)).to.true;
    });

    it('should define setter getter for variables', function () {
        const variable = {
            fragment: faker.helpers.userCard()
        };

        Variables.variables = variable;

        expect(Variables.variables).to.eq(variable);
    });
});
