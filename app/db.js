const { Connection } = require('tedious');
const { Request } = require('tedious');

const config = {
  userName: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  server: process.env.DB_HOST,
  port: process.env.DB_PORT,
  options: {
    database: process.env.DB_NAME,
    encrypt: true,
  },
};

const connection = new Connection(config);
module.exports = {
  calculatePriceForGivenCall: async (callId) => {
    const sqlString = `BEGIN TRANSACTION;
                       UPDATE ib_call_table 
                       SET status='calculating'
                       WHERE call_id=${callId}; 
                       SELECT (ibr.rate * ibc.duration) as calculated_price
                       FROM ib_call_table as ibc
                       LEFT JOIN ib_call_rate as ibr
                       ON ibc.duration
                       BETWEEN ibr.duration_from AND ibr.duration_to
                       WHERE ibc.call_id=${callId};
                       COMMIT;`;
    return new Promise((resolve, reject) => {
      const request = new Request(sqlString, (err) => {
        if (err) {
          reject(err);
        }
      });

      request.on('row', columns => resolve(columns[0].value));

      connection.execSql(request);
    });
  },
  getUnprocessedCalls: async () => {
    const callIds = [];
    const sqlString = `SELECT call_id
                       FROM ib_call_table
                       WHERE status='reported'`;
    return new Promise((resolve, reject) => {
      const request = new Request(sqlString, (err) => {
        if (err) {
          reject(err);
        } else {
          resolve(callIds);
        }
      });

      request.on('row', (columns) => {
        columns.forEach((column) => {
          callIds.push(column.value);
        });
        return callIds;
      });

      connection.execSql(request);
    });
  },
};
