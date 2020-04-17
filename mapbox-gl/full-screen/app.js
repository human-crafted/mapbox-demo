import 'https://api.mapbox.com/mapbox-gl-js/v1.9.1/mapbox-gl.js'

const mapbox_token =
  'pk.eyJ1IjoiY3NhdW5kZXJzIiwiYSI6ImNrOTJyZHl2ajA2cm8zbm90ZG5kMnU0cTAifQ.7_Ukvt3GZMAr31UUBDWZzQ'

mapboxgl.accessToken = mapbox_token
var map = new mapboxgl.Map({
  container: 'map',
  style: 'mapbox://styles/mapbox/dark-v10',
  zoom: 1.5,
  center: [0, 20],
})

map.addControl(new mapboxgl.FullscreenControl())
