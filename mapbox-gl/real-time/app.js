import 'https://api.mapbox.com/mapbox-gl-js/v1.9.1/mapbox-gl.js'

const mapbox_token =
  'pk.eyJ1IjoiY3NhdW5kZXJzIiwiYSI6ImNrOTJyZHl2ajA2cm8zbm90ZG5kMnU0cTAifQ.7_Ukvt3GZMAr31UUBDWZzQ'

mapboxgl.accessToken = mapbox_token
var map = new mapboxgl.Map({
  container: 'map',
  style: 'mapbox://styles/mapbox/dark-v10',
  sprite: 'mapbox://sprites/mapbox/dark-v10',
  zoom: 7.9,
  center: [-0.118092, 51.509865],
  transition: {
    delay: 100,
    duration: 100,
  },
})

let geoJson

map.on('load', () => {
  fetch('../../data/geojson/boundaries/london.geojson')
    .then((response) => response.json())
    .then((data) => {
      map.addSource('london', {
        type: 'geojson',
        data,
      })

      map.addLayer({
        id: 'london',
        type: 'fill',
        source: 'london',
        layout: {},
        paint: {
          'fill-color': 'green',
          'fill-opacity': 0.3,
        },
      })
    })

  fetch('../../data/fake-data/mds-providers/bird/status-changes-large.json')
    .then((response) => response.json())
    .then((data) => {
      geoJson = {
        type: 'FeatureCollection',
        features: data.data['status_changes']
          .map((statusChange) => {
            return {
              ...statusChange.event_location,
              properties: {
                ...statusChange.event_location.properties,
                vehicleId: statusChange.vehicle_id,
                providerName: statusChange.provider_name,
                eventType: statusChange.event_type,
                eventReason: statusChange.event_type_reason,
              },
            }
          })
          .flat(),
      }

      map.addSource('statusChanges', {
        type: 'geojson',
        data: geoJson,
        cluster: true,
        clusterRadius: 80,
        clusterMaxZoom: 12,
      })

      window.setInterval(() => {
        const realTimeData = {
          ...geoJson,
          features: geoJson.features.map((feature) => {
            return {
              ...feature,
              geometry: {
                ...feature.geometry,
                coordinates: [
                  feature.geometry.coordinates[0] + 0.05,
                  feature.geometry.coordinates[1] + 0.05,
                ],
              },
            }
          }),
        }

        map.getSource('statusChanges').setData(realTimeData)
        geoJson = realTimeData
      }, 30000)

      map.addLayer({
        id: 'cluster',
        type: 'circle',
        source: 'statusChanges',
        filter: ['has', 'point_count'],
        paint: {
          'circle-color': '#32BF84',
          'circle-radius': [
            'step',
            ['get', 'point_count'],
            20,
            100,
            30,
            750,
            40,
          ],
        },
      })

      map.addLayer({
        id: 'cluster-count',
        type: 'symbol',
        source: 'statusChanges',
        filter: ['has', 'point_count'],
        paint: {
          'text-color': 'white',
        },
        layout: {
          'text-field': '{point_count_abbreviated}',
          'text-font': ['DIN Offc Pro Medium', 'Arial Unicode MS Bold'],
          'text-size': 12,
        },
      })

      map.addLayer({
        id: 'marker',
        type: 'symbol',
        source: 'statusChanges',
        layout: {
          'icon-image': 'bicycle-15',
          'text-field': '{vehicleId}',
          'text-font': ['DIN Offc Pro Medium', 'Arial Unicode MS Bold'],
          'text-size': 12,
          'text-variable-anchor': ['top', 'bottom', 'left', 'right'],
          'text-radial-offset': 0.5,
          'text-justify': 'auto',
        },
        paint: {
          'text-color': 'white',
        },
        filter: ['!', ['has', 'point_count']],
      })

      map.on('click', 'marker', (e) => {
        e.preventDefault()
        if (e.features) {
          const [feature] = e.features
          const {
            properties: { vehicleId, providerName, eventType, eventReason },
            geometry: { coordinates },
          } = feature

          const [longitude, latitude] = coordinates
          new mapboxgl.Popup({ offset: 25 })
            .setLngLat(new mapboxgl.LngLat(longitude, latitude))
            .setHTML(
              `<h3>${vehicleId}</h3><p><strong>Provider:</strong> ${providerName}</p><p><strong>Event Type:</strong> ${eventType}</p><p><strong>Event Reason:</strong> ${eventReason}</p>`
            )
            .addTo(map)
        }
      })

      map.on('mouseenter', 'cluster', (e) => {
        e.preventDefault()
        map.getCanvas().style.cursor = 'pointer'
      })

      map.on('mouseenter', 'marker', (e) => {
        e.preventDefault()
        map.getCanvas().style.cursor = 'pointer'
      })

      map.on('mouseleave', 'cluster', (e) => {
        e.preventDefault()
        map.getCanvas().style.cursor = ''
      })

      map.on('mouseleave', 'marker', (e) => {
        e.preventDefault()
        map.getCanvas().style.cursor = ''
      })
    })
})
