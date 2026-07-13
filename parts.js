const PARTS = [
  { icon: "🔋", name: "Car Battery (35Ah)", price: 4200, shop: "AutoZone Koramangala", brand: "Universal", stock: "in" },
  { icon: "🛞", name: "Tyre 165/80 R14", price: 3600, shop: "Bridgestone Select", brand: "Maruti Suzuki", stock: "in" },
  { icon: "🧯", name: "Brake Pad Set (Front)", price: 1200, shop: "Bosch Service Center", brand: "Maruti Suzuki", stock: "in" },
  { icon: "🧯", name: "Brake Pad Set (Rear)", price: 950, shop: "Bosch Service Center", brand: "Hyundai", stock: "low" },
  { icon: "🛢️", name: "Engine Oil 5W-30 (4L)", price: 1850, shop: "Shell Authorized Dealer", brand: "Universal", stock: "in" },
  { icon: "🌬️", name: "Air Filter", price: 350, shop: "AutoZone Koramangala", brand: "Maruti Suzuki", stock: "in" },
  { icon: "🌬️", name: "Cabin AC Filter", price: 280, shop: "AutoZone Koramangala", brand: "Hyundai", stock: "in" },
  { icon: "⚡", name: "Spark Plug (set of 4)", price: 900, shop: "NGK Authorized Store", brand: "Tata Motors", stock: "in" },
  { icon: "🔧", name: "Wiper Blade Pair", price: 550, shop: "Bosch Service Center", brand: "Universal", stock: "in" },
  { icon: "💧", name: "Coolant (1L)", price: 320, shop: "Shell Authorized Dealer", brand: "Universal", stock: "in" },
  { icon: "🎯", name: "Wheel Alignment + Balancing", price: 700, shop: "Speedy Car Care", brand: "Universal", stock: "in" },
  { icon: "🔩", name: "Clutch Plate Kit", price: 4500, shop: "Precision Motors", brand: "Mahindra", stock: "low" },
  { icon: "🚦", name: "Headlight Bulb (H4)", price: 400, shop: "AutoZone Koramangala", brand: "Honda", stock: "in" },
  { icon: "🪫", name: "Alternator (Reconditioned)", price: 5200, shop: "Precision Motors", brand: "Hyundai", stock: "low" },
  { icon: "🧰", name: "Timing Belt Kit", price: 3800, shop: "Bosch Service Center", brand: "Maruti Suzuki", stock: "in" },
  { icon: "🌡️", name: "Radiator Assembly", price: 6200, shop: "Highway Car Clinic", brand: "Tata Motors", stock: "low" }
];

function renderParts(){
  const q = document.getElementById('searchInput').value.trim().toLowerCase();
  const brand = document.getElementById('brandFilter').value;

  const filtered = PARTS.filter(p => {
    const matchesQuery = !q || p.name.toLowerCase().includes(q);
    const matchesBrand = !brand || p.brand === brand || p.brand === "Universal";
    return matchesQuery && matchesBrand;
  });

  const grid = document.getElementById('partsGrid');
  if (filtered.length === 0){
    grid.innerHTML = `<div class="no-results">No parts match your search. Try a different name or brand.</div>`;
    return;
  }

  grid.innerHTML = filtered.map(p => `
    <div class="part-card">
      <div class="part-top">
        <div class="part-name">${p.name}</div>
        <div class="part-icon">${p.icon}</div>
      </div>
      <div class="part-price">₹${p.price.toLocaleString('en-IN')}</div>
      <div class="part-shop">${p.shop} · ${p.brand}</div>
      <span class="stock-badge ${p.stock === 'in' ? 'stock-in' : 'stock-low'}">${p.stock === 'in' ? 'In Stock' : 'Low Stock'}</span>
    </div>
  `).join('');
}

renderParts();
