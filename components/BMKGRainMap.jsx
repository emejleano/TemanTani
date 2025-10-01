import { useEffect, useRef, useState } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

const cities = [
  { name: "Serang", coords: [-6.1202, 106.1503] },
  { name: "Jakarta", coords: [-6.2088, 106.8456] },
  { name: "Bandung", coords: [-6.9175, 107.6191] },
  { name: "Yogyakarta", coords: [-7.7972, 110.3705] },
  { name: "Surabaya", coords: [-7.2575, 112.7521] },
];

export default function BMKGRainMap() {
  const mapRef = useRef(null);
  const legendRef = useRef(null);
  const [selectedCity, setSelectedCity] = useState("Serang");

  useEffect(() => {
    if (!mapRef.current) {
      // Inisialisasi map default
      mapRef.current = L.map("weather-map").setView(cities[0].coords, 9);

      // Base Layer OSM
      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        maxZoom: 18,
        attribution: "&copy; OpenStreetMap contributors",
      }).addTo(mapRef.current);

      // BMKG Layer - Curah Hujan
      L.tileLayer.wms(
        "https://gis.bmkg.go.id/arcgis/services/Peta_Curah_Hujan_dan_Hari_Hujan_/MapServer/WMSServer",
        {
          layers: "2", // Curah Hujan
          format: "image/png",
          transparent: true,
          attribution: "BMKG",
        }
      ).addTo(mapRef.current);

      // === Custom Legend ===
      const legend = L.control({ position: "bottomright" });
      legend.onAdd = function () {
        const div = L.DomUtil.create("div", "info legend");
        div.style.background = "white";
        div.style.padding = "10px";
        div.style.borderRadius = "8px";
        div.style.boxShadow = "0 2px 8px rgba(0,0,0,0.2)";
        div.innerHTML = `
          <h4 style="margin:0 0 5px 0; font-size:14px;">Curah Hujan (mm)</h4>
          <div style="display:flex;flex-direction:column;gap:2px;font-size:12px;">
            <div><span style="background:#a50026;width:20px;height:10px;display:inline-block;margin-right:5px;"></span>> 5000</div>
            <div><span style="background:#d73027;width:20px;height:10px;display:inline-block;margin-right:5px;"></span>4000 - 5000</div>
            <div><span style="background:#fc8d59;width:20px;height:10px;display:inline-block;margin-right:5px;"></span>3000 - 4000</div>
            <div><span style="background:#fee08b;width:20px;height:10px;display:inline-block;margin-right:5px;"></span>2000 - 3000</div>
            <div><span style="background:#d9ef8b;width:20px;height:10px;display:inline-block;margin-right:5px;"></span>1000 - 2000</div>
            <div><span style="background:#91cf60;width:20px;height:10px;display:inline-block;margin-right:5px;"></span>500 - 1000</div>
            <div><span style="background:#1a9850;width:20px;height:10px;display:inline-block;margin-right:5px;"></span>< 500</div>
          </div>
        `;
        return div;
      };
      legend.addTo(mapRef.current);
      legendRef.current = legend;
    }
  }, []);

  // Handler kalau user pilih kota
  const handleCityChange = (cityName) => {
    setSelectedCity(cityName);
    const city = cities.find((c) => c.name === cityName);
    if (city && mapRef.current) {
      mapRef.current.setView(city.coords, 10);
    }
  };

  return (
    <div>
      {/* Dropdown pilih kota */}
      <div style={{ marginBottom: "10px" }}>
        <label style={{ marginRight: "8px", fontWeight: "600" }}>Pilih Kota:</label>
        <select
          value={selectedCity}
          onChange={(e) => handleCityChange(e.target.value)}
          style={{
            padding: "6px 10px",
            borderRadius: "6px",
            border: "1px solid #ccc",
          }}
        >
          {cities.map((city) => (
            <option key={city.name} value={city.name}>
              {city.name}
            </option>
          ))}
        </select>
      </div>

      {/* Peta */}
      <div
        id="weather-map"
        style={{
          width: "100%",
          height: "500px",
          borderRadius: "16px",
          boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
        }}
      ></div>
    </div>
  );
}
