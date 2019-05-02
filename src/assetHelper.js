"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class AssetHelper {
    static loadJs(asset) {
        let loader = null;
        const scriptTag = document.createElement('script');
        scriptTag.type = 'text/javascript';
        scriptTag.attributes['puzzle-asset'] = asset.name;
        scriptTag.src = asset.link;
        scriptTag.defer = asset.defer || false;
        if (!asset.defer) {
            loader = new Promise((resolve, reject) => {
                scriptTag.onload = () => {
                    resolve();
                };
            });
        }
        window.document.body.appendChild(scriptTag);
        return loader;
    }
    static loadJsSeries(scripts) {
        for (let i = 0, p = Promise.resolve(); i < scripts.length; i++) {
            p = p.then(_ => new Promise(resolve => {
                const assetLoading = AssetHelper.loadJs(scripts[i]);
                if (!assetLoading) {
                    resolve();
                }
                else {
                    assetLoading.then(() => {
                        resolve();
                    });
                }
            }));
        }
    }
    static loadCSS() {
    }
}
exports.AssetHelper = AssetHelper;
