import {Module} from "./module";
import {EVENT, RESOURCE_LOADING_TYPE, RESOURCE_TYPE} from "./enums";
import {IPageFragmentConfig, IPageLibAsset, IPageLibConfiguration} from "./types";
import {on} from "./decorators";
import {AssetHelper} from "./assetHelper";

export class Core extends Module {
  private static observer: IntersectionObserver | undefined;
  private static gun: any | undefined;

  static get _pageConfiguration() {
    return this.__pageConfiguration;
  }

  static set _pageConfiguration(value) {
    this.__pageConfiguration = value;
  }

  // tslint:disable-next-line:variable-name
  private static __pageConfiguration: IPageLibConfiguration;

  @on(EVENT.ON_CONFIG)
  static config(pageConfiguration: string) {
    Core.__pageConfiguration = JSON.parse(pageConfiguration) as IPageLibConfiguration;

    const decentralizedFragmentsExists = Core.__pageConfiguration.fragments.some(fragment => fragment.asyncDecentralized);

    if (decentralizedFragmentsExists) {
      Core.gun = (window as any).Gun({
        peers: Core.__pageConfiguration.peers
      });
    }

    const fragments = Core.__pageConfiguration.fragments.filter(i => !i.onDemand);
    const forcedFragments = fragments.filter(i => i.clientAsync && i.clientAsyncForce);
    if (forcedFragments.length) {
      forcedFragments.forEach(fragment => Core.asyncLoadFragment(fragment));
    }

    if (this.isIntersectionObserverSupported()) {
      const asyncFragments = fragments.some(i => i.clientAsync);

      if (asyncFragments && Core.__pageConfiguration.intersectionObserverOptions) {
        this.observer = new IntersectionObserver(this.onIntersection.bind(this), Core.__pageConfiguration.intersectionObserverOptions);
      } else if (asyncFragments) {
        this.observer = new IntersectionObserver(this.onIntersection.bind(this));
      }
    }
  }

  /**
   * Renders fragment
   * @param {string} fragmentName
   * @param {string} containerSelector
   * @param {string} replacementContentSelector
   */
  @on(EVENT.ON_FRAGMENT_RENDERED)
  static load(fragmentName: string, containerSelector?: string, replacementContentSelector?: string) {
    if (containerSelector && replacementContentSelector) {
      Core.__replace(containerSelector, replacementContentSelector);
    }
  }

  @on(EVENT.ON_FRAGMENT_RENDERED)
  static loadAssetsOnFragment(fragmentName: string, containerSelector?: string, replacementContentSelector?: string, gatewayName?: string) {
    const onFragmentRenderAssets = Core.__pageConfiguration.assets.filter(
      asset => asset.fragment === fragmentName &&
        ((gatewayName && asset.gateway) ? gatewayName === asset.gateway : true) &&
        asset.loadMethod === RESOURCE_LOADING_TYPE.ON_FRAGMENT_RENDER &&
        !asset.preLoaded
    );

    const assets = Core.createLoadQueue(onFragmentRenderAssets);

    AssetHelper.loadAssetSeries(assets);
  }

  @on(EVENT.ON_PAGE_LOAD)
  static pageLoaded() {
    const onFragmentRenderAssets = Core.__pageConfiguration.assets.filter(asset => {
      if (asset.loadMethod === RESOURCE_LOADING_TYPE.ON_PAGE_RENDER && !asset.preLoaded) {
        const fragment = Core.__pageConfiguration.fragments.find(
          _fragment => _fragment.name === asset.fragment &&
            ((_fragment.gateway && asset.gateway) ? _fragment.gateway === asset.gateway : true)
        );
        return fragment && fragment.attributes.if !== "false";
      }
      return false;
    });

    const assets = Core.createLoadQueue(onFragmentRenderAssets);

    AssetHelper.loadAssetSeries(assets);
  }

  @on(EVENT.ON_PAGE_LOAD)
  static asyncComponentRender() {
    const asyncFragments = Core.__pageConfiguration.fragments.filter(i => i.clientAsync && !i.onDemand);

    asyncFragments.forEach(fragment => {
      if (this.observer) {
        const container = document.querySelector(this.getFragmentContainerSelector(fragment, 'main'));

        if (container) {
          this.observer.observe(container);
        }
      } else {
        this.asyncLoadFragment(fragment);
      }
    });
  }

  private static asyncLoadFragment(fragment: IPageFragmentConfig) {
    if (fragment.asyncLoaded) return Promise.resolve();
    fragment.asyncLoaded = true;
    const queryString = this.prepareQueryString(fragment.attributes);
    const key = `${fragment.source}${window.location.pathname}${queryString}`;

    if (!fragment.asyncDecentralized) {
      return this.fetchGatewayFragment(fragment)
        .then(res => this.asyncRenderResponse(fragment, res));
    }

    Core.gun
      .get(key, (gunResponse: any) => {
        if (gunResponse.err || !gunResponse.put) {
          this.fetchGatewayFragment(fragment)
            .then(gatewayResponse => Core.gun.get(key).put({
              ...gatewayResponse,
              ...gatewayResponse.$headers ? {
                $headers: JSON.stringify(gatewayResponse.$headers)
              } : {},
              ...gatewayResponse.$model ? {
                $model: JSON.stringify(gatewayResponse.$model)
              } : {},
            }));
        }
      })
      .on((gunResponse: any) => {
        try {
          gunResponse.$model = JSON.parse(gunResponse.$model);
          gunResponse.$headers = JSON.parse(gunResponse.$headers);
          this.asyncRenderResponse(fragment, gunResponse);
        } catch (e) {
          this.fetchGatewayFragment(fragment)
            .then(gatewayResponse => Core.gun.get(key).put({
              ...gatewayResponse,
              ...gatewayResponse.$headers ? {
                $headers: JSON.stringify(gatewayResponse.$headers)
              } : {},
              ...gatewayResponse.$model ? {
                $model: JSON.stringify(gatewayResponse.$model)
              } : {},
            }));
        }
      });
  }

  private static fetchGatewayFragment(fragment: IPageFragmentConfig) {
    const queryString = this.prepareQueryString(fragment.attributes);
    const fragmentRequestUrl = `${fragment.source}${(fragment.attributes.withoutPathname) ? '/' : window.location.pathname}${queryString}`;
    return fetch(fragmentRequestUrl, {
      headers: {
        originalurl: window.location.pathname
      },
      credentials: 'include'
    })
      .then(res => {
        return res.json();
      });
  }

  private static asyncRenderResponse(fragment: IPageFragmentConfig, res: any) {
    if (res['$model']) {
      Object.keys(res['$model']).forEach(key => {
        (window as any)[key] = res['$model'][key];
      });
    }

    if (res['$headers']) {
      const locationRedirect = res['$headers'].location || res['$headers'].Location;
      if (locationRedirect) {
        return location.replace(locationRedirect);
      }
    }

    const fragmentAssets = Core.__pageConfiguration.assets.filter(
      asset => asset.fragment === fragment.name &&
        ((fragment.gateway && asset.gateway) ? fragment.gateway === asset.gateway : true)
    );
    const assets = Core.createLoadQueue(fragmentAssets, true);

    AssetHelper.loadAssetSeries(assets, () => {
      Object.keys(res).forEach(key => {
        if (!key.startsWith('$')) {
          const container = document.querySelector(this.getFragmentContainerSelector(fragment, key));
          if (container) {
            this.setEvalInnerHtml(container, res[key],container.tagName === "META");
          }
        }
      });
    });
  }

  private static getFragmentContainerSelector(fragment: IPageFragmentConfig, partial: string) {
    const query =  partial === "main" ? `[puzzle-fragment="${fragment.name}"]:not([fragment-partial])` : `[puzzle-fragment="${fragment.name}"][fragment-partial="${partial}"]`;

    if (fragment.gateway) {
      return `[puzzle-gateway="${fragment.gateway}"]${query}`;
    }

    return query;
  }

  private static prepareQueryString(fragmentAttributes: Record<string, string>) {
    const attributes = Object.assign(window.location.search.slice(1).split('&').reduce((dict: { [name: string]: string }, i) => {
      const [key, value] = i.split('=');
      if (typeof value !== "undefined") {
        dict[key] = value;
      }
      return dict;
    }, {}), fragmentAttributes);
    delete attributes.source;
    return Object.keys(attributes).reduce((query: string, key: string) => `${query}&${key}=${attributes[key]}`, '?__renderMode=stream');
  }

  private static setEvalInnerHtml(elm: any, html: any, meta?: boolean) {
    if(meta){
      elm.outerHTML = html;
      return;
    }

    elm.innerHTML = html;
    Array.from(elm.querySelectorAll("script")).forEach((oldScript: any) => {
      const newScript = document.createElement("script");
      Array.from(oldScript.attributes)
        .forEach((attr: any) => newScript.setAttribute(attr.name, attr.value));
      newScript.appendChild(document.createTextNode(oldScript.innerHTML));
      oldScript.parentNode.replaceChild(newScript, oldScript);
    });
  }

  @on(EVENT.ON_VARIABLES)
  static onVariables(fragmentName: string, configKey: string, configData: object) {
    (window as any)[configKey] = configData;
  }

  static createLoadQueue(assets: IPageLibAsset[], asyncQueue?: boolean) {
    const loadList: any = [];

    assets.forEach(asset => {
      const fragment = Core.__pageConfiguration.fragments.find(
        _fragment => _fragment.name === asset.fragment &&
          ((_fragment.gateway && asset.gateway) ? _fragment.gateway === asset.gateway : true)
      );
      if (asyncQueue || (fragment && !fragment.clientAsync)) {
        if (asset.type === RESOURCE_TYPE.JS) {
          if (!asset.preLoaded) {
            asset.preLoaded = true;
            asset.defer = true;

            if (asset.dependent) {
              asset.dependent.forEach((dependencyName) => {
                const dependency = Core.__pageConfiguration.dependencies.filter(dependency => dependency.name === dependencyName);
                const dependencyContent = dependency[0];
                if (fragment && fragment.clientAsync) {
                  if (dependencyContent) {
                    if (loadList.indexOf(dependencyContent) === -1) {
                      loadList.push(dependencyContent);
                      dependencyContent.preLoaded = true;
                    }
                  }
                } else {
                  if (dependencyContent && !dependencyContent.preLoaded) {
                    if (loadList.indexOf(dependencyContent) === -1) {
                      loadList.push(dependencyContent);
                      dependencyContent.preLoaded = true;
                    }
                  }
                }
              });
            }

            if (loadList.indexOf(asset) === -1) {
              loadList.push(asset);
            }
          }
        } else if (asset.type === RESOURCE_TYPE.CSS) {
          if (loadList.indexOf(asset) === -1) {
            loadList.push(asset);
          }
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
  private static __replace(containerSelector: string, replacementContentSelector: string) {
    const z = window.document.querySelector(replacementContentSelector) as any;
    const r = z.innerHTML;
    z.parentNode.removeChild(z);
    window.document.querySelector(containerSelector)!.innerHTML = r;
  }

  private static onIntersection(changes: IntersectionObserverEntry[], observer: IntersectionObserver) {
    changes.forEach(change => {
      if (change.isIntersecting) {
        const target = change.target;
        const fragmentName = target.getAttribute('puzzle-fragment');
        const gatewayName = target.getAttribute('puzzle-gateway');
        const fragment = Core.__pageConfiguration.fragments.find(
            _fragment => _fragment.name === fragmentName &&
            ((_fragment.gateway && gatewayName) ? _fragment.gateway === gatewayName : true)
        );
        if (fragment) {
          this.asyncLoadFragment(fragment);
          observer.unobserve(target);
        }
      }
    });
  }

  static renderAsyncFragment(fragmentName: string, gatewayName?: string) {
    const fragment = this.__pageConfiguration.fragments.find(
      _fragment => _fragment.name === fragmentName &&
        ((_fragment.gateway && gatewayName) ? _fragment.gateway === gatewayName : true)
    );
    if (fragment) {
      const selector = this.getFragmentContainerSelector(fragment, "main");
      const fragmentContainer = window.document.querySelector(selector);
      if (fragmentContainer) {
        if (this.observer) this.observer.unobserve(fragmentContainer);
        return this.asyncLoadFragment(fragment);
      }
    }

    return Promise.resolve();
  }

  private static isIntersectionObserverSupported() {
    return 'IntersectionObserver' in window
      && 'IntersectionObserverEntry' in window
      && 'intersectionRatio' in window.IntersectionObserverEntry.prototype;
  }
}