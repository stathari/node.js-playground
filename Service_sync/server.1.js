var express = require('express')
var app = express()

app.use(express.static(__dirname))

var messages = [
    {name:'Tim',message:'hi'},
    {name:'Tim',message:'hi'}
]

app.get('/messages',(req,res)=>{
    res.send('hello')
})
var server = app.listen(3000,() =>{
    console.log('server is listening on port',server.address().port) 
})


