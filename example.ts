import NSClient from './src';
import Paginate from './src/Paginate';
import { config } from 'dotenv';

config();

const client = new NSClient();

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
