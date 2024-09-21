const express = require('express');
const axios = require('axios');
const cheerio = require('cheerio');

const app = express();
const port = 3000;

// Function to scrape ATIS data
async function getATISData() {
  try {
    const { data } = await axios.get('https://egnr.airbrief.net/');
    const $ = cheerio.load(data);

    // Extract ATIS information
    const atisText = $('p').first().text().trim();
    
    // Use regex to extract relevant details
    const informationLetter = atisText.match(/ATIS (\w)/)[1];
    const runway = atisText.match(/RWY IN USE (\d{2})/)[1];
    const wind = atisText.match(/(\d{3})(\d{2})KT/);
    const visibility = atisText.match(/(\d{4})/)[1];
    const qnh = atisText.match(/Q(\d{4})/)[1];

    return {
      informationLetter,
      runway,
      windDirection: wind[1],
      windSpeed: wind[2],
      visibility,
      qnh
    };
  } catch (error) {
    console.error('Error fetching ATIS data:', error);
    return null;
  }
}

// Define API endpoint for ATIS data
app.get('/atis', async (req, res) => {
  const atisData = await getATISData();
  if (atisData) {
    res.json(atisData);
  } else {
    res.status(500).send('Failed to retrieve ATIS data');
  }
});

// Serve the app
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
