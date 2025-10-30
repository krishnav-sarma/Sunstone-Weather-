(function () {
  const OPENWEATHER_API_KEY = '4a14fbe13dd4f7577eecfac21179d176'; 
  const input = document.getElementById('city-input');
  const btn = document.getElementById('search-button');
  const locEl = document.getElementById('location');
  const tempEl = document.getElementById('temperature');
  const descEl = document.getElementById('description');
  const humEl = document.getElementById('humidity');
  const windEl = document.getElementById('wind');

  async function search() {
    const q = input.value.trim();
    if (!q) { input.focus(); return; }
    try {
      btn.disabled = true; btn.textContent = 'Loading…';
      if (!OPENWEATHER_API_KEY || OPENWEATHER_API_KEY === 'YOUR_API_KEY_HERE') {
        throw new Error('Add your OpenWeatherMap API key in script.js');
      }
      const url = `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(q)}&units=metric&appid=${OPENWEATHER_API_KEY}`;
      const res = await fetch(url);
      const data = await res.json();
      if (!res.ok) {
        const msg = (data && data.message) ? data.message : 'Failed to fetch weather';
        throw new Error(msg.charAt(0).toUpperCase() + msg.slice(1));
      }

      const city = `${data.name}${data.sys?.country ? ', ' + data.sys.country : ''}`;
      const temp = Math.round(data.main?.temp);
      const desc = (data.weather && data.weather[0] && data.weather[0].description)
        ? data.weather[0].description.replace(/\b\w/g, c => c.toUpperCase())
        : '—';
      const humidity = data.main?.humidity;
      const windKmh = typeof data.wind?.speed === 'number' ? Math.round(data.wind.speed * 3.6) : null; // m/s -> km/h

      locEl.textContent = `Location: ${city || '—'}`;
      tempEl.textContent = `Temperature: ${Number.isFinite(temp) ? temp + '°C' : '—'}`;
      descEl.textContent = `Description: ${desc}`;
      humEl.textContent = `Humidity: ${Number.isFinite(humidity) ? humidity + '%' : '—'}`;
      windEl.textContent = `Wind: ${Number.isFinite(windKmh) ? windKmh + ' km/h' : '—'}`;
    } catch (e) {
      descEl.textContent = `Description: ${(e && e.message) || 'Error'}`;
    } finally {
      btn.disabled = false; btn.textContent = 'Search';
    }
  }

  btn.addEventListener('click', search);
  input.addEventListener('keydown', (ev) => { if (ev.key === 'Enter') search(); });
})();


