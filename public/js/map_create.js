maptilersdk.config.apiKey = map_key;

const map = new maptilersdk.Map({
  container: "map",
  style: maptilersdk.MapStyle.TOPO,
  center: [122.49922388823957, 11.12608115379616], // Panay Island approx
  zoom: 7.9,
});

map.on("click", (e) => {
  document.getElementById("lng").value = e.lngLat.lng;
  document.getElementById("lat").value = e.lngLat.lat;
});

new maptilersdk.Marker().setLngLat([122.49922388823957, 11.12608115379616]).addTo(map);
