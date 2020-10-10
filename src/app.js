const express=require('express')
const app = express()
const path = require('path')
const hbs = require('hbs')
const geo = require('./utils/geocode')

let x=0

const publicDirPath=path.join(__dirname,'../public')
const viewPath=path.join(__dirname,'../templates/views')
const partialsPath=path.join(__dirname,'../templates/partials')

app.set('view engine','hbs')
app.set('views',viewPath)
app.use(express.static(publicDirPath))
hbs.registerPartials(partialsPath)

setInterval(()=>{
    x++
     
 }, 1000)
 
 let date = new Date(Date.now())
 
 app.get('',(req,res)=>{
    
    res.render('index',{curr_time:`${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`})

})

app.get('/forecast',(req,res)=>{
    res.render('forecast',{curr_time:`${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`})


})

app.get('/about',(req,res)=>{
    res.render('about',{curr_time:`${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`})


})
app.get('/weather',(req,res)=>{
    if(!req.query.location) {
        return res.send({error:'You must provide a location!'})
    }

    geo.geo(req.query.location, (error,data)=> {
        
        if(!error) {
            res.send(data)
        }
        else {
            res.send({error:error})
        }
       
        //console.log(data)
        //console.log(error)
    })



   
})

app.get('*',(req,res)=>{
    res.render('error')

})

app.listen(3000,() => console.log('Server started'))



