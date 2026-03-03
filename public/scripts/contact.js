
// Map scripts
const storeLocation = [98.95069490360027, 18.80048374856642]

async function init() {
    const map = new maplibregl.Map({
        style: "https://tiles.openfreemap.org/styles/liberty",
        center: storeLocation,
        zoom: 2,
        container: "map"
    });

    map.flyTo({
        center: storeLocation,
        zoom: 15
    });
    let locationPopup = new maplibregl.Popup()
        .setLngLat(storeLocation)
        .setHTML(`<h3 style="color: #8122C9">The store is here!</h3>`);


    let pin = new maplibregl.Marker({
        color: '#8122C9',
        draggable: false
    }).setLngLat(storeLocation);


    locationPopup.addTo(map);
    pin.addTo(map);
    pin.on('click', (e) => {
        window.open('https://maps.app.goo.gl/zyzYV6TUJsVbt2AP6', '_blank')
    });
}
init();