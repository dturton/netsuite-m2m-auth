import { AxiosError } from 'axios';
import NSClient from '../src';

jest.setTimeout(100000);

describe('Test NS Client', () => {
  const client = new NSClient();

  it('should return an instance of NSClient', () => {
    expect(client).toBeInstanceOf(NSClient);
  });

  it('should have config and request property and method', () => {
    expect(client.config).toBeDefined();
    expect(client.request).toBeDefined();
  });

  it('Test rest web services', async () => {
    const data = await client.request({ path: '*', method: 'options' });
    expect(data.status).toBe(204);
  });

  it('Test customer request', async () => {
    const response = await client.request({
      method: 'get',
      path: '/record/v1/customer/3957',
    });
    expect(response.data.id).toBe('3957');
  });

  it('should make POST request - SuiteQL Query', async () => {
    try {
      const response = await client.request({
        path: '/query/v1/suiteql?limit=1',
        method: 'post',
        body: {
          q: "SELECT id, companyName, email, dateCreated FROM customer WHERE dateCreated > '2022-01-01'",
        },
      });
      console.log(response.data);
    } catch (err) {
      const error = err as AxiosError;
      console.log(error.response!.data);
      throw error;
    }
  });
});
