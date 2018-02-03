var express = require('express')
var bodyParser = require('body-parser')
var app = express()
var http = require('http').Server(app)
var io = require('socket.io')(http)
var mongoose = require('mongoose')

app.use(express.static(__dirname))
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended: false}))

mongoose.Promise = Promise

var dburl = 'mongodb://user:user@ds125058.mlab.com:25058/learning-nodejsandmongodb'

var Message = mongoose.model('Message',{
    name: String,
    message: String
})

/*var messages = [
    {name:'Tim',message:'hi'},
    {name:'Jim',message:'hi'}
] */

app.get('/messages',(req,res)=>{
  //  res.send(messages)
  Message.find({},(err, messages)=>{
      res.send(messages)
  })
})

app.post('/messages',async (req,res)=>{
    
    try {
       // throw 'some error'
        console.log(req.body)
        var message = new Message(req.body)
        var savedMessage = await message.save()
        
        console.log('saved')
        
        var censored = Message.findOne({message: 'badword'})
        
        if(censored){
            await message.remove({_id:censored.id})
        }
        else{
            io.emit('message', req.body)
        }
            res.sendStatus(200)
    } 
    catch (error) {
        res.sendStatus(500)
        return console.error(error)
    }
    finally{
        console.log('finally block')
    }

    
})


io.on('connection',(socket) => {
    console.log('user connected')
})

mongoose.connect(dburl,(err)=>{
    console.log('mongo db connection',err)
})

var server = http.listen(3000,() =>{
    console.log('server is listening on port',server.address().port) 
})


