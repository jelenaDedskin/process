var Connection = require('tedious').Connection;
var Request = require('tedious').Request;

var config = {
    userName: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    server: process.env.DB_HOST,
    port: process.env.DB_PORT,
    options: {
        database: process.env.DB_NAME,
        encrypt: true
    },
}

var connection = new Connection(config);

connection.on('connect', function(err) {
    if (err) {
        console.log(err);
    }
});

module.exports = {
    calculatePrice: function(callId) {
        return new Promise ( (resolve, reject) => {
            request = new Request('' +
                'SELECT (ibr.rate * ibc.duration) as calculated_price ' +
                'FROM ib_call_table as ibc ' +
                'LEFT JOIN ib_call_rate as ibr ' +
                'ON ibc.duration ' +
                'BETWEEN ibr.duration_from AND ibr.duration_to ' +
                'WHERE ibc.call_id=' + callId, function (err) {

                if (err) {
                    console.log(err);
                    return reject(err);
                } else {
                    console.log('Calculated');
                }
            });

        request.on('row', function(columns) {
            return resolve(columns[0].value);
        });

        connection.execSql(request);
    });
    }
};