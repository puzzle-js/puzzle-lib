import {Module} from "../module";
import {Util} from "../util";
import {PuzzleJs} from "../puzzle";
import {on} from "../decorators";
import {EVENT} from "../enums";

export class Info extends Module {
  @on(EVENT.ON_PAGE_LOAD)
  static showInformation() {
    Util.wrapGroup('PuzzleJs', 'Debug Mode - Package Info', () => {
      this.renderLogo();
    });
  }

  static renderLogo() {
    window.console.log('%c       ', `font-size: 400px; background: url(${PuzzleJs.LOGO}) no-repeat;`);
  }
}
