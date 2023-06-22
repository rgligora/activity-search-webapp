let map;
let location;
let latitude;
let longitude;
const currentUrl = window.location.href
const splits = currentUrl.split('/')
let city
if(splits.includes('location')){
    city = splits.pop()
}

  

async function initMap() {
  const { Map } = await google.maps.importLibrary("maps");
  const geocoder = new google.maps.Geocoder();
    const geocodingRequest = {
        address: city,
      };
    if(city){
      geocoder.geocode(geocodingRequest, (results, status) => {
        if (status === google.maps.GeocoderStatus.OK && results.length > 0) {
           location = results[0].geometry.location;
           latitude = location.lat();
           longitude = location.lng();
          
          console.log(`Coordinates for ${city}: Latitude: ${latitude}, Longitude: ${longitude}`);
          console.log(typeof latitude, typeof longitude)
            map = new Map(document.getElementById("map"), {
                center: { lat: latitude, lng: longitude },
                zoom: 12,
            });

            const divs = document.getElementsByClassName('activity-address');
            const addresses = [];
            for (let i = 0; i < divs.length; i++) {
                addresses.push(divs[i].innerHTML);
            }
            addresses.forEach((address) => {
                geocoder.geocode({ address }, (results, status) => {
                  if (status === google.maps.GeocoderStatus.OK && results.length > 0) {
                    const location = results[0].geometry.location;
              
                    const marker = new google.maps.Marker({
                      position: location,
                      map: map,
                    });
                  } else {
                    console.log(`Geocoding failed for address: ${address}`);
                  }
                });
              });


        } else {
          console.log(`Geocoding request failed for ${city}`);
          window.location.href = '/'
          alert(`Geocoding request failed for ${city}`)

        }
      });      
    }else{
        map = new Map(document.getElementById("map"), {
            center: { lat: 45.81, lng: 15.98 },
            zoom: 8,
          });
    }
  
}

initMap();
