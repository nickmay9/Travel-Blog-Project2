var locations = [];

async function mapHandler() {

    const response = await fetch('/api/posts', {
        method: 'get',
        headers: {
            'Content-Type': 'application/json'
        }
    }).then(data => {
        return data.json();
    }).then(data => {
        for(let i=0; i<data.length; i++) {
            locations.push([data[i].title, data[i].lat, data[i].long]);
        }
    });

    initMap();
  
}
  
function initMap() {
    var center = {lat: 39.099728, lng: -94.578568};
    var map = new google.maps.Map(document.getElementById('map'), {
    zoom: 4,
    center: center
    });

    var infowindow =  new google.maps.InfoWindow({});
    var marker, count;
    for (count = 0; count < locations.length; count++) {
    marker = new google.maps.Marker({
        position: new google.maps.LatLng(locations[count][1], locations[count][2]),
        map: map,
        title: locations[count][0]
    });
    google.maps.event.addListener(marker, 'click', (function (marker, count) {
        return function () {
        infowindow.setContent(locations[count][0]);
        infowindow.open(map, marker);
        }
    })(marker, count));
    }
}

mapHandler();

  // window.onload = function() {
  //     var startPos;
  //     var geoSuccess = function(position) {
  //       startPos = position;
  //       document.getElementById('startLat').innerHTML = startPos.coords.latitude;
  //       document.getElementById('startLon').innerHTML = startPos.coords.longitude;
  //     };
  //     navigator.geolocation.getCurrentPosition(geoSuccess);
  // };