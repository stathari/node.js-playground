var fs = require('fs')
var datainp={ name:'Bob'}
fs.writeFile('data.json',JSON.stringify(datainp),(err)=>{
    console.log('write finished', err)
})