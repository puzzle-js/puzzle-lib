import {IPageLibConfiguration} from "../src/types";

export const createPageLibConfiguration = (providedConfiguration?: object) => {
  return {
    assets: [],
    fragments: [{
      name: "test-fragment",
      chunked: false
    }],
    page: 'test-page',
    ...providedConfiguration
  } as unknown as IPageLibConfiguration;
};
