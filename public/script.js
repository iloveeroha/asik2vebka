async function getWeather() {
  const city = document.getElementById("cityInput").value;

  if (!city) {
    alert("Enter city name");
    return;
  }

  try {
    const res = await fetch(`/weather?city=${encodeURIComponent(city)}`);

    if (!res.ok) {
      throw new Error("Server error");
    }

    const data = await res.json();

    document.getElementById("weatherCard").classList.remove("hidden");

    document.getElementById("cityName").innerText = city;
    document.getElementById("description").innerText = data.description;
    document.getElementById("temp").innerText = data.temperature;
    document.getElementById("feels").innerText = data.feelsLike;
    document.getElementById("wind").innerText = data.windSpeed;
    document.getElementById("rain").innerText = data.rain || 0;
    document.getElementById("country").innerText = data.country;
    document.getElementById("coords").innerText =
      `${data.coordinates.lat}, ${data.coordinates.lon}`;

  } catch (err) {
    console.error(err);
    alert("Weather not found");
  }
}
async function getCountry() {
  const country = document.getElementById("countryInput").value;

  if (!country) {
    alert("Enter country name");
    return;
  }

  try {
    const res = await fetch(`/news?country=${encodeURIComponent(country)}`);

    if (!res.ok) {
      throw new Error("Server error");
    }

    const data = await res.json();

    document.getElementById("countryCard").classList.remove("hidden");
    document.getElementById("newsCard").classList.remove("hidden");

    document.getElementById("countryData").innerHTML =
      `<strong>News about ${country}</strong>`;

    document.getElementById("newsData").innerHTML = "";

    data.articles.forEach(a => {
      document.getElementById("newsData").innerHTML +=
        `<p><a href="${a.url}" target="_blank">${a.title}</a></p>`;
    });

  } catch (e) {
    console.error(e);
    alert("Country news not found");
  }
}
