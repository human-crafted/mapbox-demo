import 'https://api.mapbox.com/mapbox-gl-js/v1.9.1/mapbox-gl.js'

const mapbox_token =
  'pk.eyJ1IjoiY3NhdW5kZXJzIiwiYSI6ImNrOTJyZHl2ajA2cm8zbm90ZG5kMnU0cTAifQ.7_Ukvt3GZMAr31UUBDWZzQ'

mapboxgl.accessToken = mapbox_token
var map = new mapboxgl.Map({
  container: 'map',
  style: 'mapbox://styles/mapbox/dark-v10',
  zoom: 9,
  center: [-0.118092, 51.509865],
  maxBounds: [-0.65918, 51.256758, 0.411987, 51.703204],
})
