require('dotenv').config();
const axios = require('axios');
const db = require('../db');
const responseHandler = require('../helpers/responseHandler');

const proceedToIbServer = async (price, callId) => {
  axios.post(`${process.env.IB_SERVER_URI}/consume`, {
    callId,
    price,
  });
};

async function processArray(array) {
  for (const call of array) {
    const price = await db.calculatePriceForGivenCall(call);
    await proceedToIbServer(price, call);
  }
}


module.exports = {
  calculatePrice: async (req, res, callId = null) => {
    if (callId) {
      const price = await db.calculatePriceForGivenCall(callId);
      await proceedToIbServer(price, callId);
      responseHandler.successResponse(res, 'Call is updated');
    } else {
      const unprocessedCalls = await db.getUnprocessedCalls();
      await processArray(unprocessedCalls);
      responseHandler.successResponse(res, 'Calls are updated');
    }
  },
};
