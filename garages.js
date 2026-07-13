// Sample verified garages around Bengaluru (lat, lng are real coordinates)
const GARAGES = [
  { name: "Raju Auto Works", lat: 12.9177, lng: 77.6228, rating: 4.3, phone: "9876543210", address: "Near Silk Board, Bengaluru", open: true },
  { name: "Sri Sai Motors", lat: 12.9352, lng: 77.6245, rating: 4.1, phone: "9845123456", address: "Koramangala 5th Block", open: true },
  { name: "Speedy Car Care", lat: 12.9719, lng: 77.6412, rating: 4.5, phone: "9900112233", address: "Indiranagar 100ft Road", open: false },
  { name: "City Auto Garage", lat: 12.9081, lng: 77.6476, rating: 3.9, phone: "9988776655", address: "HSR Layout Sector 2", open: true },
  { name: "Precision Motors", lat: 12.9646, lng: 77.5989, rating: 4.6, phone: "9765432109", address: "Malleshwaram 8th Cross", open: true },
  { name: "Highway Car Clinic", lat: 12.9979, lng: 77.6961, rating: 4.0, phone: "9123456780", address: "Whitefield Main Road", open: false }
];

let map, markers = [], userMarker = null;
const DEFAULT_CENTER = [12.9352, 77.6146]; // Bengaluru center-ish

function initMap(){
  map = L.map('map', { zoomControl: true }).setView(DEFAULT_CENTER, 12);

  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '&copy; OpenStreetMap contributors'
  }).addTo(map);

  renderGarages(GARAGES);
}

function distanceKm(lat1, lon1, lat2, lon2){
  const R = 6371;
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = Math.sin(dLat/2)**2 + Math.cos(lat1*Math.PI/180)*Math.cos(lat2*Math.PI/180)*Math.sin(dLon/2)**2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
}

function renderGarages(list, userPos){
  // clear old markers
  markers.forEach(m => map.removeLayer(m));
  markers = [];

  const withDist = list.map(g => ({
    ...g,
    dist: userPos ? distanceKm(userPos.lat, userPos.lng, g.lat, g.lng) : null
  }));
  if (userPos) withDist.sort((a,b) => a.dist - b.dist);

  const listEl = document.getElementById('garageList');
  listEl.innerHTML = '';

  withDist.forEach((g, i) => {
    const marker = L.marker([g.lat, g.lng]).addTo(map)
      .bindPopup(`<b>${g.name}</b><br>${g.address}<br>★ ${g.rating} · ${g.open ? 'Open now' : 'Closed'}`);
    markers.push(marker);

    const card = document.createElement('div');
    card.className = 'garage-card';
    card.innerHTML = `
      <div class="garage-top">
        <div class="garage-name">${g.name}</div>
        <div class="garage-badge ${g.open ? 'badge-open' : 'badge-closed'}">${g.open ? 'Open' : 'Closed'}</div>
      </div>
      <div class="garage-meta">
        <span class="stars">★ ${g.rating}</span>
        <span>${g.address}</span>
        ${g.dist !== null ? `<span>${g.dist.toFixed(1)} km away</span>` : ''}
      </div>
      <div class="garage-actions">
        <a href="tel:${g.phone}">📞 Call</a>
        <a href="https://www.openstreetmap.org/directions?to=${g.lat}%2C${g.lng}" target="_blank" rel="noopener">🧭 Directions</a>
      </div>
    `;
    card.onclick = () => {
      map.setView([g.lat, g.lng], 15);
      marker.openPopup();
      document.querySelectorAll('.garage-card').forEach(c => c.classList.remove('active'));
      card.classList.add('active');
    };
    listEl.appendChild(card);
  });
}

function useMyLocation(){
  if (!navigator.geolocation){
    alert('Geolocation is not supported by your browser.');
    return;
  }
  navigator.geolocation.getCurrentPosition(
    (pos) => {
      const userPos = { lat: pos.coords.latitude, lng: pos.coords.longitude };
      if (userMarker) map.removeLayer(userMarker);
      userMarker = L.circleMarker([userPos.lat, userPos.lng], {
        radius: 8, color: '#38E1E8', fillColor: '#38E1E8', fillOpacity: 0.8
      }).addTo(map).bindPopup('You are here').openPopup();
      map.setView([userPos.lat, userPos.lng], 13);
      renderGarages(GARAGES, userPos);
    },
    (err) => {
      alert('Could not get your location (' + err.message + '). Showing sample Bengaluru garages instead.');
    }
  );
}

initMap();
