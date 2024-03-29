import { RESOURCE_TYPE } from "./enums";
import {IPageLibAsset} from "./types";

export class AssetHelper {
    static promises: Record<string, {
        resolve: () => void,
        reject: () => void,
        promise: Promise<any>
    }> = {};

    static createDeferred() {
        let resolve, reject: any;
        const promise = new Promise((r, rej) => {
            resolve = r;
            reject = rej;
        });

        return {
            promise,
            resolve: resolve as any,
            reject: reject as any
        };
    }

    static loadJs(asset: IPageLibAsset): Promise<any> {
        const scriptTag: any = window.document.createElement('script');

        if (!this.promises[asset.name]) {
            this.promises[asset.name] = this.createDeferred();
            scriptTag.type = 'text/javascript';
            scriptTag.setAttribute('puzzle-asset', asset.name);
            scriptTag.src = asset.link;
            scriptTag.defer = asset.defer || false;
            scriptTag.crossOrigin = "anonymous";

            if (!asset.defer) {
                scriptTag.onload = () => {
                    this.promises[asset.name].resolve();
                };

                scriptTag.onerror = () => {
                    this.promises[asset.name].reject();
                };
            } else {
                this.promises[asset.name].resolve();
            }

            window.document.body.appendChild(scriptTag);
        }

        return this.promises[asset.name].promise;
    }

    static loadCSS(asset: IPageLibAsset): Promise<any> {
        const linkTag: any = window.document.createElement('link');

        if (!this.promises[asset.name]) {
            this.promises[asset.name] = this.createDeferred();
            linkTag.rel = 'stylesheet';
            linkTag.setAttribute('puzzle-asset', asset.name);
            linkTag.href = asset.link;
            linkTag.onload = () => {
                this.promises[asset.name].resolve();
            };
            linkTag.onerror = () => {
                this.promises[asset.name].reject();
            };

            window.document.head.appendChild(linkTag);
        }

        return this.promises[asset.name].promise;
    }

    static loadAssetSeries(assets: IPageLibAsset[], callback?: Function) {
        if (!assets.length && callback) {
            callback();
        }

        for (let i = 0, p: any = Promise.resolve(); i < assets.length; i++) {
            p = p.then(() => new Promise((resolve, reject) => {
                    const asset = assets[i];
                    if (asset.type === RESOURCE_TYPE.JS) {
                        const assetLoading = AssetHelper.loadJs(asset);
                        assetLoading.then(() => {
                            resolve(null);
                        }).catch(() => {
                            reject(null);
                        });
                    } else if (asset.type === RESOURCE_TYPE.CSS) {
                        const assetLoading = AssetHelper.loadCSS(asset);
                        assetLoading.then(() => {
                            resolve(null);
                        }).catch(() => {
                            reject(null);
                        });
                    }
                }
            )).then(() => {
                if (callback && assets.length - 1 === i) {
                    callback();
                }
            }).catch(() => {
                if (callback && assets.length - 1 === i) {
                    callback();
                }
            });
        }
    }
}
