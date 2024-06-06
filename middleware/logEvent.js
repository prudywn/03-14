const {format} = require('date-fns')
const {v4: uuidv4} = require('uuid')

const fs = require('fs')
const fsPromises = require('fs/promises')
const path = require('path')

const logEvents = async (message,logName) => {
    const dateTime = `${format(new Date(), 'yyyyMMdd\tHH:mm:ss')}`
    const logItem = `${dateTime} \t${uuidv4()} \t${message}\n`
    console.log(logItem)
    try{
        if (!fs.existsSync(path.join(__dirname, '..' ,'logs'))){
            await fsPromises.mkdir(path.join(__dirname, '..' ,'logs', logName))
        }
        await fsPromises.appendFile(path.join(__dirname,'..', 'logs', logName),logItem)
    }catch (err) {
        
        console.log(err)
    }
}

const logger = (req, res, next) => {
    logEvents(`${req.method}\t${req.headers.origin}\t${req.url}`, 'reqLog.txt') //(message, file)

    console.log(`${req.method} ${req.path}`)
    next()
}


// console.log(format(new Date(), 'yyyyMMdd\tHH:mm:ss'))
// console.log(uuidv4())
module.exports = {logger, logEvents}