let goelocations = [];
const location_container = document.querySelector('.branch_view_container')

async function initMap() {
   await printJSON();
   const center = [40.3, 63];

   const map = L.map('map', {
      center: center,
      zoom: 6,
      zoomAnimation: true
   });

   const icon = L.divIcon({
      className: 'custom-div-icon',
      html: "<div style='background-color: red;' class='marker-pin'></div><i class='fa-solid fa-building-columns' style='color: #ffffff;'></i>",
      iconSize: [30, 42],
      iconAnchor: [13, 41],
      popupAnchor: [3, -37],
   })

   goelocations.forEach(function (location) {
      const geo_id = location.GEO_ID.split(',');
      if (geo_id.length === 2) {
         const marker = L.marker(geo_id, { icon: icon }).addTo(map);
         marker.on('click', () => zoom(marker));
         marker.bindPopup("<b>" + location.LICENZIYAT_RUS + "</b>").openPopup();

         let item = document.createElement("div");
         item.className = "branch_view_item";
         item.innerHTML = `
            <div class="branch_view_item-content info_box">
               <p class='prop_name m-0'>
                  ${location?.LICENZIYAT_RUS}
               </p>
               <div class="branch_view_item-location">
                  <i class="fa-solid fa-location-dot text-red-600"></i>
                  <span>${location?.ADRES_RUS}</span>
               </div>
            </div>
         `;
         item.addEventListener('click', () => { zoom(marker) })
         location_container.appendChild(item);
      }
   });

   map.attributionControl
      .setPosition('bottomleft')
      .setPrefix('');

   function zoom(marker) {
      map.flyTo(marker.getLatLng(), 15, {
         animate: true,
         duration: 1.5
      });
   }
   function traffic() {
      const actualProvider = new ymaps.traffic.provider.Actual({}, { infoLayerShown: true });
      actualProvider.setMap(this._yandex);
   }

   const baseLayers = {
      'Яндекс карта': L.yandex()
         .addTo(map),
      'Яндекс спутник': L.yandex({ type: 'satellite' }),
      'Яндекс гибрид': L.yandex('hybrid'),
      'ОСМ': L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
         attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      })
   };

   const overlays = {
      'Трафик': L.yandex('overlay').on('load', traffic)
   };

   L.control.layers(baseLayers, overlays, { collapsed: false }).addTo(map);
}

async function printJSON() {
   const response = await fetch("data/locations.json");
   const json = await response.json();
   goelocations = json.locations;
   console.log(goelocations)
}

initMap();
