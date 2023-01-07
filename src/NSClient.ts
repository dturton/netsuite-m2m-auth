/* eslint-disable @typescript-eslint/no-non-null-assertion */
import axios, { AxiosError, AxiosRequestConfig, AxiosResponse } from 'axios';
import { LocalStorage } from 'node-localstorage';
import { stringify } from 'querystring';
import { config } from 'dotenv';
import { KJUR } from 'jsrsasign';

config();

import {
  NSBaseRestResponse,
  NSClientConfig,
  NSTokenRequestResponse,
  RequestOptions,
  SuiteQLRequestOptions,
} from './types';

export default class NSClient {
  config: NSClientConfig;

  localStorage: LocalStorage;

  accessToken?: string;

  constructor() {
    this.localStorage = new LocalStorage('./scratch');
    this.config = {
      certificateId: process.env.CERTIFICATE_ID!,
      accountId: process.env.ACCOUNT_ID!,
      clientId: process.env.CLIENT_ID!,
      consumerKey: process.env.CONSUMER_KEY!,
      consumerSecret: process.env.CONSUMER_SECRET!,
      privateKey: process.env.PRIVATE_KEY_CONTENTS!,
      scope: ['restlets', 'rest_webservices', 'suite_analytics'],
    };
  }

  generateJwt = (): string => {
    const jwtHeader = {
      alg: 'PS256', // Using PS256, which is one of the algorithms NetSuite supports for client credentials
      typ: 'JWT',
      kid: this.config.certificateId,
    };

    const stringifiedJwtHeader = JSON.stringify(jwtHeader);

    // Create JWT payload
    const jwtPayload = {
      iss: this.config.consumerKey, // consumer key of integration record
      scope: ['restlets', 'rest_webservices'], // scopes specified on integration record
      iat: +new Date() / 1000, // timestamp in seconds
      exp: +new Date() / 1000 + 3600, // timestamp in seconds, 1 hour later, which is max for expiration
      aud: `https://3609571.suitetalk.api.netsuite.com/services/rest/auth/oauth2/v1/token`,
    };

    const stringifiedJwtPayload = JSON.stringify(jwtPayload);

    // Sign the JWT with the PS256 algorithm (algorithm must match what is specified in JWT header).
    // The JWT is signed using the jsrsasign lib (KJUR)
    const signedJWT = KJUR.jws.JWS.sign(
      'PS256',
      stringifiedJwtHeader,
      stringifiedJwtPayload,
      this.config.privateKey,
    );
    return signedJWT;
  };

  async refreshToken() {
    const jsonWebToken = await this.generateJwt();

    const baseUrl = `https://${this.config.accountId
      .toLowerCase()
      .replace('_', '-')}.suitetalk.api.netsuite.com/services/rest`;

    const requestConfig = {
      url: '/auth/oauth2/v1/token',
      baseURL: baseUrl,
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      data: stringify({
        grant_type: 'client_credentials',
        client_assertion_type:
          'urn:ietf:params:oauth:client-assertion-type:jwt-bearer',
        client_assertion: jsonWebToken,
      }),
    };

    const { data }: { data: NSTokenRequestResponse } = await axios(
      requestConfig,
    );
    return data;
  }

  async suiteQL<T>(
    options: SuiteQLRequestOptions,
  ): Promise<AxiosResponse<NSBaseRestResponse & T>> {
    const response = await this.request({
      path: '/query/v1/suiteql',
      method: 'post',
      params: options.params,
      body: {
        q: options.query,
      },
    });
    return response as AxiosResponse<NSBaseRestResponse & T>;
  }

  async request<T>(
    opts: RequestOptions,
  ): Promise<AxiosResponse<NSBaseRestResponse & T>> {
    const accessToken =
      this.localStorage.getItem('access_token') || this.accessToken;
    if (!accessToken) {
      const data = await this.refreshToken();
      this.accessToken = data.access_token;
    }

    const { path, method = 'get', body, params } = opts;

    const baseUrl = `https://${this.config.accountId
      .toLowerCase()
      .replace('_', '-')}.suitetalk.api.netsuite.com/services/rest`;

    const requestConfig: AxiosRequestConfig = {
      baseURL: baseUrl,
      method,
    };

    const instance = axios.create(requestConfig);

    instance.interceptors.response.use(
      async (response: AxiosResponse<NSBaseRestResponse>) => response,
      async (err) => {
        const error = err as AxiosError;
        if (error.response?.status === 400) {
          const data = await this.refreshToken();
          this.accessToken = data.access_token;
        } else {
          return Promise.reject(error);
        }
        return Promise.reject(error);
      },
    );

    const response: AxiosResponse<NSBaseRestResponse> = await instance({
      url: path,
      data: body,
      params,
      headers: {
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        Authorization: `Bearer ${this.accessToken!}`,
        'Content-Type': 'application/json',
        prefer: 'transient',
      },
    });
    return response as AxiosResponse<NSBaseRestResponse & T>;
  }
}
