const {logEvents} = require('./logEvent')


const errorHandler = (err, req, res, next) => {
    logEvents(`${err.name}: ${err.message}`, 'errLog.txt');
    console.error(err);
    res.sendStatus(500).send(err.message);
}

module.exports = errorHandler