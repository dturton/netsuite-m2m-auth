import NSClient from '../src/NSClient';

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
    const response = await client.request({
      baseUrlPath: '.suitetalk.api.netsuite.com/services/rest',
      path: '*',
      method: 'options',
    });
    expect(response.status).toBe(204);
  });
});
