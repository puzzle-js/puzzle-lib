import {RESOURCE_LOADING_TYPE, RESOURCE_TYPE, RESOURCE_JS_EXECUTE_TYPE, RESOURCE_CSS_EXECUTE_TYPE} from "./enums";

import {PuzzleJs} from "./puzzle";

declare global {
  interface Window {
    PuzzleJs: PuzzleJs;
    PerformanceObserver?: any;
  }
}

export interface IPageLibAsset {
  name: string;
  loadMethod: RESOURCE_LOADING_TYPE;
  fragment?: string;
  dependent?: string[];
  type: RESOURCE_TYPE;
  link: string;
  preLoaded: boolean;
  defer?: boolean;
}

export interface ICustomPageAsset {
  name: string;
  loadMethod: RESOURCE_LOADING_TYPE;
  link: string;
  dependent?: string;
}

export interface IPageFragmentConfig {
  name: string;
  chunked: boolean;
  clientAsync: boolean;
  clientAsyncForce: boolean | undefined;
  criticalCss: boolean | undefined;
  onDemand: boolean | undefined;
  asyncDecentralized: boolean;
  attributes: { [name: string]: string };
  source: string | undefined;
  asyncLoaded?: boolean;
}

export interface IPageLibDependency {
  name: string;
  link: string;
  type: RESOURCE_TYPE;
  preLoaded: boolean;
  loadMethod?: RESOURCE_LOADING_TYPE;
  executeType?: RESOURCE_JS_EXECUTE_TYPE | RESOURCE_CSS_EXECUTE_TYPE;
}

export interface IPageLibConfiguration {
  page: string;
  fragments: IPageFragmentConfig[];
  assets: IPageLibAsset[];
  dependencies: IPageLibDependency[];
  peers: string[];
  rootMargin: string;
}

export interface IEventListener {
  [event: string]: Function[];
}
