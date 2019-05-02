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
const module_1 = require("./module");
const enums_1 = require("./enums");
const decorators_1 = require("./decorators");
const assetHelper_1 = require("./assetHelper");
class Core extends module_1.Module {
    static get _pageConfiguration() {
        return this.__pageConfiguration;
    }
    static set _pageConfiguration(value) {
        this.__pageConfiguration = value;
    }
    static config(pageConfiguration) {
        Core.__pageConfiguration = JSON.parse(pageConfiguration);
    }
    /**
     * Renders fragment
     * @param {string} fragmentName
     * @param {string} containerSelector
     * @param {string} replacementContentSelector
     */
    static load(fragmentName, containerSelector, replacementContentSelector) {
        if (containerSelector && replacementContentSelector) {
            Core.__replace(containerSelector, replacementContentSelector);
        }
    }
    static loadAssetsOnFragment(fragmentName) {
        const onFragmentRenderAssets = Core.__pageConfiguration.assets.filter(asset => asset.fragment === fragmentName && asset.loadMethod === enums_1.RESOURCE_LOADING_TYPE.ON_FRAGMENT_RENDER && !asset.preLoaded);
        const scripts = Core.createLoadQueue(onFragmentRenderAssets);
        assetHelper_1.AssetHelper.loadJsSeries(scripts);
    }
    static pageLoaded() {
        const onFragmentRenderAssets = Core.__pageConfiguration.assets.filter(asset => asset.loadMethod === enums_1.RESOURCE_LOADING_TYPE.ON_PAGE_RENDER && !asset.preLoaded);
        const scripts = Core.createLoadQueue(onFragmentRenderAssets);
        assetHelper_1.AssetHelper.loadJsSeries(scripts);
    }
    static onVariables(fragmentName, configKey, configData) {
        window[configKey] = configData;
    }
    static createLoadQueue(assets) {
        let loadList = [];
        assets.forEach(asset => {
            if (!asset.preLoaded) {
                asset.preLoaded = true;
                asset.defer = true;
                asset.dependent && asset.dependent.forEach((dependencyName) => {
                    const dependency = Core.__pageConfiguration.dependencies.filter(dependency => dependency.name === dependencyName);
                    const dependencyContent = dependency[0];
                    if (dependencyContent && !dependencyContent.preLoaded) {
                        if (loadList.indexOf(dependencyContent) === -1) {
                            loadList.push(dependencyContent);
                            dependencyContent.preLoaded = true;
                        }
                    }
                });
                if (loadList.indexOf(asset) === -1) {
                    loadList.push(asset);
                }
            }
        });
        return loadList;
    }
    /**
     * Replaces container inner with given content.
     * @param {string} containerSelector
     * @param {string} replacementContentSelector
     */
    static __replace(containerSelector, replacementContentSelector) {
        const z = window.document.querySelector(replacementContentSelector);
        const r = z.innerHTML;
        z.parentNode.removeChild(z);
        window.document.querySelector(containerSelector).innerHTML = r;
    }
}
__decorate([
    decorators_1.on(enums_1.EVENT.ON_CONFIG),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], Core, "config", null);
__decorate([
    decorators_1.on(enums_1.EVENT.ON_FRAGMENT_RENDERED),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String]),
    __metadata("design:returntype", void 0)
], Core, "load", null);
__decorate([
    decorators_1.on(enums_1.EVENT.ON_FRAGMENT_RENDERED),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], Core, "loadAssetsOnFragment", null);
__decorate([
    decorators_1.on(enums_1.EVENT.ON_PAGE_LOAD),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], Core, "pageLoaded", null);
__decorate([
    decorators_1.on(enums_1.EVENT.ON_VARIABLES),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, Object]),
    __metadata("design:returntype", void 0)
], Core, "onVariables", null);
exports.Core = Core;
