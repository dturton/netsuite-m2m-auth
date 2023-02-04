import { AxiosResponse } from 'axios';
import url from 'url';
import { NSBaseRestResponse } from './types.js';

export interface PaginateOptions {
  limit?: number;
  apiCall: (
    offset: number,
    limit: number,
  ) => Promise<AxiosResponse<NSBaseRestResponse>>;
}

export default class Paginate<Item, Response> {
  pages: Response[] = [];
  pageBody: Response | undefined;
  pageItems: Item[] = [];
  items: Item[] = [];
  responses: AxiosResponse<NSBaseRestResponse>[] = [];
  response: AxiosResponse<NSBaseRestResponse> | undefined;
  count = 0;
  done = false;
  isFirst = true;
  apiCall: (
    offset: number,
    limit: number,
  ) => Promise<AxiosResponse<NSBaseRestResponse>>;
  limit: number;
  offset: number;

  constructor(options: PaginateOptions) {
    this.apiCall = options.apiCall;
    this.limit = options.limit || 1000;
    this.offset = 0;
  }

  private paginate(response: AxiosResponse<NSBaseRestResponse>) {
    const { links } = response.data;
    const nextLink = links.find((link) => link.rel === 'next');
    if (nextLink) {
      const nextUrl = url.parse(nextLink?.href, true, true);
      const { query } = nextUrl;
      this.offset = query.offset as unknown as number;
      this.limit = query.limit as unknown as number;
    } else {
      this.done = true;
    }
  }

  async *run() {
    while (!this.done) {
      this.response = await this.apiCall(this.offset, this.limit);
      this.paginate(this.response);
      yield this.response;
    }
  }
}
