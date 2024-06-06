const http = require('http')
const path = require('path')
const fs = require('fs')
const fsPromises = require('fs/promises')

const logEvents = require('./logEvent')
const EventEmitter = require('events')
//const { data } = require('date-fns/locale')
class MyEmitter extends EventEmitter{}

//Initialize object
const myEmitter = new MyEmitter()
myEmitter.on('log', (message, fileName) => { logEvents(message, fileName)})

const PORT = process.env.PORT || 3500

const serverFile = async(filePath, contentType, response) => {
    try{
        const rawData = await fsPromises.readFile(filePath,
            !contentType.includes('image') ? 'utf8' : '' //read as utf8 if not an image
            )
        const data = contentType === 'application.json' ? JSON.parse(rawData) : rawData
        
        response.writeHead(
            filePath.includes('400.html') ? 404 : 200,
             {'Content-Type': contentType})
        response.end(
            contentType === 'application/json' ? JSON.stringify(data) : data

        )


    }catch(err) {
        console.log(err)
        myEmitter.emit('log', `${err.name}: ${err.message}`, 'errLog.txt')
        response.statusCode = 500
        response.end()
    }
}

const server = http.createServer((req, res) => {
    console.log(req.url, req.method)
    
    myEmitter.emit('log', `${req.url}\t ${req.method}`, 'reqLog.txt')

    const extension = path.extname(req.url)

    let contentType;
    switch(extension){
        case '.css':
            contentType = 'text/css'
            break
        case '.js':
            contentType = 'test/javascript'
            break
        case 'json':
            contentType = 'application/json'
            break
        case '.jpg':
            contentType = 'image/jpeg'
                break
        case '.png':
            contentType = 'image/png'
            break
        case '.txt':
            contentType = 'text/plain'
            break
        default:
            contentType = 'text/html'
               }
        
    let filePath = contentType === 'text/html' && req.url === '/' ? path.join(__dirname, 'views', 'index.html') : contentType === 'text/html' && req.url.slice(-1) === '/' ? path.join(__dirname, 'views', req.url, 'index.html') :contentType === 'text/html' ? path.join(__dirname, 'views', req.url) : path.join(__dirname, req.url)

    //makes .html extension not required in the browser
    if (!extension && req.url.slice(-1) !== '/') filePath += '.html'

    const fileExists = fs.existsSync(filePath)
    if(fileExists){
        //serve file
        serverFile(filePath, contentType, res)
    }else{
        //respond with 404
        switch(path.parse(filePath).base){
            case 'old-page.html':
                res.writeHead(301, {'Location': '/new-page.html'})
                res.end()
                break
            case 'www-page.html':
                res.writeHead(301, {'Location': '/'})
                res.end()
                break
            default:
                //serve a 404 response
                serverFile(path.join(__dirname, 'views', '404.html'), 'text/html', res)
            }
    }

})
server.listen(PORT, () => console.log(`Server running on port ${PORT}`))

// add listener for the log

// setTimeout(() => {
//     // Raise an event
//     myEmitter.emit('log', 'Log event occurred!')
// }, 2000)
