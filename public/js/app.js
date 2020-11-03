
const weatherForm = document.querySelector('form')
const weatherInput = document.querySelector('input')
const weatherCardHeader = document.getElementById('card_head')
const weatherCardText = document.getElementById('card_inner_text')
const weatherCardImg = document.getElementById('weather_img')
const error_msg = document.getElementById('error_msg')

var mymap = L.map('mapid').setView([0,0],1)
L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png',{attribution:'<a href="https://www.maptiler.com/copyright/" target="_blank">&copy; MapTiler</a> <a href="https://www.openstreetmap.org/copyright" target="_blank">&copy; OpenStreetMap contributors</a>'}).addTo(mymap)
let marker;

 function getLocation() {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(async (position)=>{
        const coor = {lat:position.coords.latitude,lng:position.coords.longitude}
        if(marker) mymap.removeLayer(marker)
        marker = new L.Marker(coor, {draggable:false});
        mymap.addLayer(marker);
       
        await getForecast(coor)


      });
    } else {
      x.innerHTML = "Geolocation is not supported by this browser.";
    }
  }

  getLocation()

 function onMapClick(e) {
    if(marker) mymap.removeLayer(marker)
    marker = new L.Marker(e.latlng, {draggable:false});
    mymap.addLayer(marker);
   
    getForecast(e.latlng)
   
}
mymap.on('click', onMapClick)

weatherForm.addEventListener('submit',async (e)=>{
    e.preventDefault()
    try {
        const latlng = await getForecast(weatherInput.value)
        console.log(latlng)
        if(marker) mymap.removeLayer(marker)
        marker = new L.Marker(latlng, {draggable:false});
        mymap.addLayer(marker);
    }
    catch {
        if(marker) mymap.removeLayer(marker)
    }
})

async function getForecast (data) {
    let url
    let responseJ
    if (typeof data == 'string') {
        url = `/weather?location=${data}`
    }

    else {
        url = `/weather?location=${data.lng},${data.lat}`
    }
   
    try {
        const response = await fetch(url)
        responseJ = await response.json()
        if (responseJ.error) {
            error_msg.innerHTML=responseJ.error
            weatherInput.className='form-control is-invalid'
            weatherInput.value=""
            return
        }
        else {
               
            weatherInput.className='form-control is-valid'
            weatherInput.value=responseJ.location.region
            weatherCardHeader.innerHTML=`Region: ${responseJ.location.region}<br>Country: ${responseJ.location.country}<br> Observation Time: ${responseJ.current.observation_time}`
            weatherCardText.innerHTML=`Temperature: ${responseJ.current.temperature} ℃<br><br>Wind Speed: ${responseJ.current.wind_speed} ms<br>Humidity: ${responseJ.current.humidity} %<br>Rain chance ${responseJ.current.precip*100} %`
            weatherCardImg.src=responseJ.current.weather_icons[0]
        }
    }
    catch (e) {
        error_msg.innerHTML=e
        return
        
    }
    return {lat:responseJ.location.lat,lng:responseJ.location.lon}
}

