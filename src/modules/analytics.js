"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
const module_1 = require("../module");
const util_1 = require("../util");
const enums_1 = require("../enums");
const decorators_1 = require("../decorators");
class Analytics extends module_1.Module {
    static get fragments() {
        return this._fragments;
    }
    static set fragments(value) {
        this._fragments = value;
    }
    static start(config) {
        Analytics.connectionInformation = Analytics.collectConnectionInformation();
        performance.mark(`${enums_1.TIME_LABELS.HTML_TRANSFER_STARTED}`);
        Analytics.fragments = Analytics.fragments.concat(JSON.parse(config).fragments);
    }
    static end() {
        util_1.Util.wrapGroup('PuzzleJs', 'Debug Mode - Analytics', () => {
            util_1.Util.table({
                'Round Trip Time': `${this.connectionInformation.rtt} ms`,
                'Connection Speed': `${this.connectionInformation.downlink} kbps`,
                'Connection Type': this.connectionInformation.effectiveType
            });
            const fragmentsTableData = Analytics.fragments.reduce((fragmentMap, fragment) => {
                fragmentMap[fragment.name] = {
                    'Parsing Started': `${~~fragment.loadTime[0].startTime} ms`,
                    'Parse Duration': `${~~fragment.loadTime[0].duration} ms`,
                };
                return fragmentMap;
            }, {});
            util_1.Util.table(fragmentsTableData);
            if (window.performance && performance.getEntriesByType) {
                const performance = window.performance;
                const performanceEntries = performance.getEntriesByType('paint');
                performanceEntries.forEach((performanceEntry, i, entries) => {
                    util_1.Util.log("The time to " + performanceEntry.name + " was " + performanceEntry.startTime + " milliseconds.");
                });
            }
        });
    }
    static fragment(name) {
        const fragment = Analytics.fragments.find(fragment => fragment.name === name);
        performance.mark(`${enums_1.TIME_LABELS.FRAGMENT_RENDER_END}${name}`);
        performance.measure(`${enums_1.TIME_LABELS.FRAGMENT_MEASUREMENT}${name}`, `${enums_1.TIME_LABELS.HTML_TRANSFER_STARTED}`, `${enums_1.TIME_LABELS.FRAGMENT_RENDER_END}${name}`);
        fragment.loadTime = performance.getEntriesByName(`${enums_1.TIME_LABELS.FRAGMENT_MEASUREMENT}${name}`);
    }
    static collectConnectionInformation() {
        const connection = navigator.connection || navigator.mozConnection || navigator.webkitConnection;
        //if (!connection) log('Connection api is not supported', LOG_TYPES.WARN, LOG_COLORS.RED);
        return {
            rtt: connection ? connection.rtt : '',
            effectiveType: connection ? connection.effectiveType : '',
            downlink: connection ? connection.downlink : ''
        };
    }
}
Analytics._fragments = [];
Analytics.connectionInformation = null;
__decorate([
    decorators_1.on(enums_1.EVENT.ON_CONFIG),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], Analytics, "start", null);
__decorate([
    decorators_1.on(enums_1.EVENT.ON_PAGE_LOAD),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], Analytics, "end", null);
__decorate([
    decorators_1.on(enums_1.EVENT.ON_FRAGMENT_RENDERED),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], Analytics, "fragment", null);
exports.Analytics = Analytics;
