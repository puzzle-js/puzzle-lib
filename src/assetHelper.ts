import {IPageLibAsset} from "./types";

export class AssetHelper {
  static loadJs(asset: IPageLibAsset): Promise<any> | null {
    let loader: Promise<any> | null = null;
    const scriptTag: any = window.document.createElement('script');
    if (!window.document.querySelector(`[puzzle-asset="${asset.name}"]`)) {
      scriptTag.type = 'text/javascript';
      scriptTag.attributes['puzzle-asset'] = asset.name;
      scriptTag.src = asset.link;
      scriptTag.defer = asset.defer || false;
      scriptTag.crossOrigin = "anonymous";

      if (!asset.defer) {
        loader = new Promise((resolve) => {
          scriptTag.onload = () => {
            resolve();
          };
        });
      }

      window.document.body.appendChild(scriptTag);
    } else {
      return null;
    }

    return loader;
  }

  static loadJsSeries(scripts: IPageLibAsset[]) {
    for (let i = 0, p: any = Promise.resolve(); i < scripts.length; i++) {
      console.log(scripts[i], 'line')
      p = p.then(() => new Promise(resolve => {
          const assetLoading = AssetHelper.loadJs(scripts[i]);
          if (!assetLoading) {
            resolve();
          } else {
            assetLoading.then(() => {
              resolve();
            });
          }
        }
      ));
    }
  }
}
