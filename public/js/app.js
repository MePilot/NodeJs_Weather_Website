console.log('Page loaded!!!!')

//import L from leaflet


const weatherForm = document.querySelector('form')
const weatherInput = document.querySelector('input')
const weatherCardHeader = document.getElementById('card_head')
const weatherCardText = document.getElementById('card_inner_text')
const weatherCardImg = document.getElementById('weather_img')
const error_msg = document.getElementById('error_msg')

var mymap = L.map('mapid').setView([0,0],1)
L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png',{attribution:'<a href="https://www.maptiler.com/copyright/" target="_blank">&copy; MapTiler</a> <a href="https://www.openstreetmap.org/copyright" target="_blank">&copy; OpenStreetMap contributors</a>'}).addTo(mymap)
let marker;
function onMapClick(e) {
    if(marker) mymap.removeLayer(marker)
    marker = new L.Marker(e.latlng, {draggable:true});
    mymap.addLayer(marker);
    console.log(`Map fdsfsdfsdfsdfsdfsddata: ${e.latlng}`)

    fetch(`http://localhost:3000/weather?location=${e.latlng.lng},${e.latlng.lat}`).then((response)=> {
        response.json().then((data)=>{
            if (data.error) {
                error_msg.innerHTML=data.error
                weatherInput.className='form-control is-invalid'
                weatherInput.value=""
               
            }
            else {
                console.log(data)
                weatherInput.className='form-control is-valid'
                weatherInput.value=data.location.region
                weatherCardHeader.innerHTML=`Регион: ${data.location.region}<br>Страна: ${data.location.country}`
                weatherCardText.innerHTML=`Температура: ${data.current.temperature} ℃<br>Скорость ветра: ${data.current.wind_speed}мс<br>Влажность: ${data.current.humidity}%<br>Шанс осадков: ${data.current.precip}%`
                weatherCardImg.src=data.current.weather_icons[0]
            }
            
        })
    })
}
mymap.on('click', onMapClick)

weatherForm.addEventListener('submit',(e)=>{
    e.preventDefault()
    
    fetch(`http://localhost:3000/weather?location=${weatherInput.value}`).then((response)=> {
    response.json().then((data)=>{
        if (data.error) {
            error_msg.innerHTML=data.error
            weatherInput.className='form-control is-invalid'
           
        }
        else {
            console.log(data)
            weatherInput.className='form-control is-valid'
            weatherCardHeader.innerHTML=`Регион: ${data.location.region}<br>Страна: ${data.location.country}`
            weatherCardText.innerHTML=`Температура: ${data.current.temperature} ℃<br>Скорость ветра: ${data.current.wind_speed}мс<br>Влажность: ${data.current.humidity}%<br>Шанс осадков: ${data.current.precip}%`
            weatherCardImg.src=data.current.weather_icons[0]
        }
        
    })
})}

)

