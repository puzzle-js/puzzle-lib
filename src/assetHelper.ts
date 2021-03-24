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
            } else {
                this.promises[asset.name].resolve();
            }

            window.document.body.appendChild(scriptTag);
        }

        return this.promises[asset.name].promise;
    }

    static loadJsSeries(scripts: IPageLibAsset[]) {
        for (let i = 0, p: any = Promise.resolve(); i < scripts.length; i++) {
            p = p.then(() => new Promise(resolve => {
                    const assetLoading = AssetHelper.loadJs(scripts[i]);
                    assetLoading.then(() => {
                        resolve();
                    });
                }
            ));
        }
    }
}
