maptilersdk.config.apiKey = map_key;

const map = new maptilersdk.Map({
  container: "map",
  style: maptilersdk.MapStyle.TOPO,
  center: travelspot.geometry.coordinates, // Panay Island approx
  zoom: 14,
});

new maptilersdk.Marker().setLngLat(travelspot.geometry.coordinates).addTo(map);
