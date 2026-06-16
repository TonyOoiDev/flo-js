const fs = require('node:fs');
const readline = require('node:readline');
const { 
    insertMeterReadings,
    closeDBConnection,
 } = require('./db/dbutil');

const METER_DECIMAL_PRECISION = 3;
const ROWS_PER_INSERT = 3;
const USER_SYSTEM = 'system';

const numberOfElements = {
    '100' : 5,
    '200' : 10,
    '300' : 55,
    '400' : 6,
    '500': 5,
    '900' : 1,
}

const calculateConsumption = (arr) => {
    const numarr = arr.map(el => Number(el))
    return numarr.reduce((acc,val) => acc+val , 0)
}

const parseDateString = (dateString) => {
    const yyyy = parseInt(dateString.slice(0,4));
    const mm = parseInt(dateString.slice(4,6));
    const dd = parseInt(dateString.slice(6,8));
    return new Date(Date.UTC(yyyy,mm-1,dd))
}

const roundNDecimalDigit = (val, dp) => {
    factor = Math.pow(10, dp)
    larger = Math.round(val *factor)
    return larger/factor
}

const processCSVFile = async () => {
    try {
        const csvFileName = './csv_data/nem12#0123456789012345#mda1#retail1.csv';
        const fileStream = fs.createReadStream(csvFileName);

        const rl = readline.createInterface({
            input: fileStream,
            crlfDelay: Infinity,
        });

        let index = 0 ; 
        let nmi = undefined;
        let dbData = []
        for await(const line of rl) {
            index++;
            data = line.split(',') 
            const dataIsCorrect = numberOfElements[data[0]] === data.length;
            if (!dataIsCorrect) {
                throw new Error(`Line ${index} with code ${data[0]} is incorrect`)
            }
            switch(data[0]) {
                case '200' : {
                    nmi = data[1]
                    break
                }
                case '300' : {
                    if (!nmi) {
                        throw new Error('No nmi defined for line ${index} in ${csvFileName} file')
                    } else {
                        const consumptionData = {
                            nmi,
                            timestamp: parseDateString(data[1]),
                            consumption : roundNDecimalDigit(calculateConsumption(data.slice(2,50)), METER_DECIMAL_PRECISION),
                        }
                        const auditFields = {
                            created_by: USER_SYSTEM,
                            modified_by: USER_SYSTEM,
                        }
                        const row = {
                            ...consumptionData,
                            ...auditFields,
                        }
                        dbData.push(row)
                    }
                    break;                
                }
                case '900': {
                    if (dbData.length > 0) {
                        await insertMeterReadings(dbData);  // flush
                    }
                    break;
                }
            }
            if ((dbData.length > 0) && ((dbData.length % ROWS_PER_INSERT) === 0)) {
                await insertMeterReadings(dbData);
                dbData = [];
            }
        }
        console.log(`Processing ${csvFileName} ended successfully`);
    } catch (err) {
        console.error(err);
        console.log('Terminating due to error...')
        throw(err)
    }
}

(async () => {
    try {
        await processCSVFile();
        return
    } catch (err) {
        console.error(err)
        process.exit(1);
    } finally {
        await closeDBConnection();
    }
})();
