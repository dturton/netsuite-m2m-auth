# 🧰 Node.JS NetSuite  M2M Authentication
# netsuite-m2m-auth
### Scripts

Node.JS NetSuite M2M Authentication is a client library written in TypeScript that allows for machine-to-machine (M2M) authentication with NetSuite. It simplifies the process of authenticating with NetSuite's APIs by providing a convenient and easy-to-use interface for obtaining and refreshing access tokens. This library is particularly useful for developers building integrations or applications that need to programmatically interact with NetSuite data and functionality.

Setting up environmental variables

The NetSuite REST API requires certain configuration values, such as your account ID, client ID, and private key, in order to authenticate requests. These values should be stored as environmental variables on your system.

To set up these environmental variables, you will need to create a .env file in     the root directory of your project. The .env file should contain the following variables:

 - ACCOUNT_ID=your_account_id
 - CLIENT_ID=your_client_id
 -  CONSUMER_KEY=your_consumer_key
 - CONSUMER_SECRET=your_consumer_secret
 - PRIVATE_KEY_CONTENTS=your_private_key_contents
 - CERTIFICATE_ID=your_certificate_id

```typescript
const paginate = new Paginate({
  apiCall: async (offset, limit) => {
    const response = await client.suiteQL({
      query: `SELECT item,location,averagecostmli,quantityavailable,quantitybackordered,quantitycommitted,quantityonhand,quantityonorder FROM inventoryitemlocations WHERE quantityavailable>0`,
      params: { offset, limit },
    });
    return response;
  },
});

const run = async () => {
  for await (const response of paginate.run()) {
    console.log(response.data);
  }
};

void run();
```
