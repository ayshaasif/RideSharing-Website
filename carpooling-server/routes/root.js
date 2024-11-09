const express = require('express')
const router = express.Router()
const path = require('path')

router.get('/', (req, res)=>{
    // res.sendFile('./views/index.html', { root : __dirname });
    res.sendFile(path.join(__dirname,'..', 'views', 'index.html'));
});

// shift+alt+down arrow -> to copy the code down 

router.get('/hello(.html)?', (req,res,next) => {
    console.log('attempted to load hello.html');
    next()
}, (req,res)=>{
    console.log('Tried to load ')
    res.send("Hello World!")
})


module.exports = router