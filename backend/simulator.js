// backend/simulator.js
import axios from "axios";

function generateSensorData() {
  return {
    moisture: Math.floor(Math.random() * 60) + 20,      // 20–80%
    temperature: Math.floor(Math.random() * 10) + 25,   // 25–35 °C
  };
}

setInterval(async () => {
  const data = generateSensorData();
  try {
    await axios.post("http://localhost:4000/api/sensor", data);
    console.log("✅ Data terkirim:", data);
  } catch (err) {
    console.error("❌ Gagal kirim data:", err.message);
  }
}, 5000); // kirim tiap 5 detik
