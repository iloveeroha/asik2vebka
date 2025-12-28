const express = require("express");
const axios = require("axios");

const app = express();
const PORT = 3000;

app.use(express.static("public"));

const WEATHER_API_KEY = "70bf530956e5f4ea3aea458008ad6109";
const NEWS_API_KEY = "781d280890a64b70895e0f9f8460e182";

app.get("/weather", async (req, res) => {
  const city = req.query.city;

  if (!city) {
    return res.status(400).json({ error: "City required" });
  }

  try {
    const r = await axios.get(
      `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${WEATHER_API_KEY}`
    );

    const d = r.data;

    res.json({
      temperature: d.main.temp,
      description: d.weather[0].description,
      feelsLike: d.main.feels_like,
      windSpeed: d.wind.speed,
      rain: d.rain ? d.rain["3h"] : 0,
      country: d.sys.country,
      coordinates: {
        lat: d.coord.lat,
        lon: d.coord.lon
      }
    });

  } catch (e) {
    console.error(e.response?.data || e.message);
    res.status(500).json({ error: "Weather API error" });
  }
});


app.get("/country", async (req, res) => {
  try {
    const r = await axios.get(
      `https://restcountries.com/v3.1/alpha/${req.query.code}`
    );

    const c = r.data[0];
    res.json({
      name: c.name.common,
      capital: c.capital?.[0] || "N/A",
      population: c.population,
      region: c.region,
      flag: c.flags.png
    });

  } catch {
    res.status(500).json({ error: "Country error" });
  }
});
app.get("/news", async (req, res) => {
  const country = req.query.country;

  if (!country) {
    return res.status(400).json({ error: "Country name required" });
  }

  const fromDate = new Date();
  fromDate.setDate(fromDate.getDate() - 7);
  const from = fromDate.toISOString().split("T")[0];

  try {
    const r = await axios.get(
      `https://newsapi.org/v2/everything?q=${encodeURIComponent(country)}&from=${from}&sortBy=publishedAt&language=en&pageSize=5&apiKey=${NEWS_API_KEY}`
    );

    res.json({
      articles: r.data.articles.map(a => ({
        title: a.title,
        url: a.url
      }))
    });

  } catch (e) {
    console.error(e.response?.data || e.message);
    res.status(500).json({ error: "News API error" });
  }
});

app.listen(PORT, () => {
  console.log(`Server running → http://localhost:${PORT}`);
});
