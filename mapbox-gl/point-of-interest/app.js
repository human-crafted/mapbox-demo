import 'https://api.mapbox.com/mapbox-gl-js/v1.9.1/mapbox-gl.js'

const mapbox_token =
  'pk.eyJ1IjoiY3NhdW5kZXJzIiwiYSI6ImNrOTJyZHl2ajA2cm8zbm90ZG5kMnU0cTAifQ.7_Ukvt3GZMAr31UUBDWZzQ'

mapboxgl.accessToken = mapbox_token
var map = new mapboxgl.Map({
  container: 'map',
  style: 'mapbox://styles/mapbox/dark-v10',
  sprite: 'mapbox://sprites/mapbox/dark-v10',
  zoom: 13,
  center: [-0.118092, 51.509865],
})

map.on('load', () => {
  fetch('../../data/geojson/points-of-interest.geojson')
    .then((response) => response.json())
    .then((data) => {
      map.addSource('points-of-interest', {
        type: 'geojson',
        data,
      })

      map.addLayer({
        id: 'points-of-interest',
        type: 'symbol',
        source: 'points-of-interest',
        layout: {
          'icon-image': 'bicycle-15',
          'icon-size': 2.5,
          'text-field': '{title}',
          'text-font': ['DIN Offc Pro Medium', 'Arial Unicode MS Bold'],
          'text-size': 12,
          'text-variable-anchor': ['top', 'center'],
        },
        paint: {
          'text-color': '#32BF84',
          'icon-color': '#32BF84',
        },
      })
    })
})
