const request = require('request')

const geoCode = (address, callback) => {

    const URL=`https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(address)}.json?access_token=${process.env.MAPBOX_API}&limit=1`
    request({url:URL,json:true}, (error, response)=> {

        if(error) {
            callback('Error. Unable to connect', undefined)
        }
        else if(response.body.features.length===0) {
            callback('Error. Unable to find location', undefined)
        }
        else {
           
            callback(undefined, {lat:response.body.features[0].center[1],lon:response.body.features[0].center[0], name:response.body.features[0].place_name})
        }
       
    })}

const geo = (name, callback) => {
    
    geoCode(name, (error, data)=> {
       
        if(error) {
           callback(error,undefined)
        }
        else {
            const URL=`http://api.weatherstack.com/current?access_key=${process.env.WEATHER_STACK_API}&query=${data.lat},${data.lon}`
            request({url:URL, json:true}, (error, response)=> {
            if(error) {
                callback('Error. Unable to connect',undefined)
            }
            else if (response.body.error) {
                callback('Place not found', undefined)
            }
        else {
            callback(undefined,response.body)
        }
    }
    )}
})}


module.exports=geo
