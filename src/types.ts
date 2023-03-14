export enum NSClientScope {
  'restlets',
  'rest_webservices',
  'suite_analytics',
}
export type NSClientConfig = {
  clientId: string;
  certificateId: string;
  accountId: string;
  scope: string[];
  consumerKey: string;
  consumerSecret: string;
  privateKey: string;
};

export interface LineItem {
  itemid: number;
  itemname: string;
  etaillineid?: string;
  lineid: string;
  location: number;
  quantity: number;
  quantitycommitted: number;
  quantitybackordered: number;
  quantityshiprecv: number;
  fulfillable: string;
  rate: number;
  itemtype: string;
}

export interface OrderResponse {
  internalid: number;
  shopifyordernumber: string;
  shopifyorderid: string;
  highfraudrisk: string;
  saleschannel: string;
  date: string;
  lastmodifieddate: string;
  createddate: string;
  customerId: number;
  firstname: string;
  lastname: string;
  address1: string;
  address2?: string;
  city: string;
  state: string;
  zip: string;
  country: string;
  email: string;
  phone?: string;
  lineItems: LineItem[];
}

export type NSResponseLinks = {
  rel: 'next' | 'last' | 'self';
  href: string;
};
export interface NSBaseRestResponse {
  id?: string;
  count?: number;
  hasMore?: boolean;
  offset: number;
  totalResults: number;
  items: NSItemsResponse[];
  links: NSResponseLinks[];
}

export interface Item {
  id: string;
}

export type QueueRecord = {
  id: number;
  record_id: number;
  lastmodifieddate: string;
};

export interface Items {
  item: Item;
  quantity: number;
}

export interface GetOrdersOptions {
  updated_at_min?: string;
  updated_at_max?: string;
  created_at_min?: string;
  created_at_max?: string;
  status?: string;
  limit?: number;
}

export interface GetItemOptions {
  id: string;
  locations?: string;
}

export interface GetItemsOptions {
  locations?: string;
}
export interface ItemReponse {
  id: number;
  itemId: string;
  itemType: string;
  avgCost: number;
  purchasePrice: number;
  locations?: LocationsEntity[] | null;
}
export interface LocationsEntity {
  locationId: number;
  quantityOnHand: number;
  quantityAvailable: number;
  quantityOnOrder: number;
  quantityCommitted: number;
  quantityBackOrdered: number;
}

export interface FulfillmentLineRequest {
  orderLine: number;
  itemreceipt: boolean;
  location: boolean;
}

export interface FulfillmentPackage {
  packageDescr?: string;
  packageTrackingNumber: string;
  packageTrackingNumberReturn?: string;
  packageWeight: number;
  refName?: string;
}

export type FulfillmentStatus = 'B' | 'C';

export interface FulfillmentRequest {
  itemsToFulfill: FulfillmentLineRequest[];
  shipStatus?: FulfillmentStatus;
  packages?: FulfillmentPackage[];
}

export interface FulfillmentClientRequest {
  orderInternalId: string;
  items: string[];
  shipStatus?: FulfillmentStatus;
  packages?: FulfillmentPackage[];
  tranDate?: string;
}

export interface RequestOptions {
  path: string;
  method?: 'get' | 'post' | 'put' | 'delete' | 'patch' | 'head' | 'options';
  baseUrlPath: string;
  body?: string | object;
  params?: object;
  headers?: { [key: string]: string };
}

export interface NSTokenRequestResponse {
  access_token: 'string';
  expires_in: string;
  token_type: 'Bearer';
}

export type NSItemsResponse = {
  id: string;
};

export type NSRecordBaseReponse = {
  id: string;
  lastModifiedDate: string;
};

export interface NSRecordPageRestResponse {
  count?: number;
  hasMore?: boolean;
  offset: number;
  totalResults: number;
  items: NSItemsResponse[];
}

export type NSRecordType =
  | 'salesorder'
  | 'itemreceipt'
  | 'customer'
  | 'inventoryitem';

export type TransactionPropertiesForUpdate = 'status' | 'total';

export type NSImportRequestParams = {
  limit: number;
  q: string;
  offset?: number;
};

export type NSImportRequestOptions = {
  recordType: NSRecordType;
  startDate: StartDateOptions | string;
  limit: number;
  logResponse?: boolean;
  transactionPropertiesToUpdate?: TransactionPropertiesForUpdate[];
};

export type StartDateOptions = 'auto' | 'sync';

export type StartDate = Date | string;

export type LockerConfig = {
  redisUrl: string;
  options?: LockOptions;
};

export type LockOptions = {
  lockTimeout?: number;
  acquireTimeout?: number;
  retryInterval?: number;
  refreshInterval?: number;
};

export interface SuiteQLRequestOptions
  extends Omit<RequestOptions, 'body' | 'path' | 'baseUrlPath'> {
  query: string;
}
