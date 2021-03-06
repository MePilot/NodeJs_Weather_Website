const express=require('express')
const path = require('path')
const hbs = require('hbs')
const geo = require('./utils/geocode')

const app = express()
const port = process.env.PORT

const publicDirPath=path.join(__dirname,'../public')
const viewPath=path.join(__dirname,'../templates/views')
const partialsPath=path.join(__dirname,'../templates/partials')

app.set('view engine','hbs')
app.set('views',viewPath)
app.use(express.static(publicDirPath))
hbs.registerPartials(partialsPath)


 app.get('',(req,res)=>{
    
    res.render('index')

})


app.get('/about',(req,res)=>{
    res.render('about')


})
app.get('/weather',(req,res)=>{
    if(!req.query.location) {
        return res.send({error:'You must provide a location!'})
    }

    geo(req.query.location, (error,data)=> {
        
        if(!error) {
            res.send(data)
        }
        else {
            res.send({error:error})
        }
       
    })

})

app.get('*',(req,res)=>{
    res.render('error')

})

app.listen(port,() => console.log(`Server started at port ${port}`))



