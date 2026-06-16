const config = require('./config.json');
const postgre = require('postgres');

const psql = postgre(config);

const insertMeterReadings = (readings) => {
    return new Promise(async (resolve, reject) => {
        try {
            console.log("Writing to Db data");
            console.log(readings)
            await psql`INSERT INTO meter_readings ${ psql(readings)}`
            resolve(true)
        } catch (err) {
            reject(err);
        }
    })
}

const closeDBConnection = async () => {
    await psql.end();
}

module.exports = {
    insertMeterReadings,
    closeDBConnection,
}