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

app.post('/messages',(req,res)=>{
    console.log(req.body)
    var message = new Message(req.body)
    message.save().then(()=>{
           Message.findOne({message: 'badword'}, (err, censored) =>{
            if(censored){
                console.log('censored word found',censored)
                message.remove({_id:censored.id},(err)=>{
                    console.log('removed censored word')
                })
            }
        })  

        io.emit('message',req.body)
        res.sendStatus(200)
    }).catch((err)=>{
        res.sendStatus(500)
        return console.error(err)
    })
    
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


