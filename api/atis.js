const axios = require('axios');
const cheerio = require('cheerio');

module.exports = async (req, res) => {
  // Add CORS headers to the response
  res.setHeader('Access-Control-Allow-Origin', '*');  // Allow all origins
  res.setHeader('Access-Control-Allow-Methods', 'GET');  // Only allow GET requests

  try {
    const { data } = await axios.get('https://egnr.airbrief.net/');
    const $ = cheerio.load(data);

    // Extract ATIS information from the <p> tag
    const atisText = $('p').first().text().trim();
    const informationLetter = atisText.match(/ATIS (\w)/)[1];
    const runway = atisText.match(/RWY IN USE (\d{2})/)[1];
    const wind = atisText.match(/(\d{3})(\d{2})KT/);
    const visibility = atisText.match(/(\d{4})/)[1];
    const qnh = atisText.match(/Q(\d{4})/)[1];

    // Send the scraped ATIS data as JSON
    res.status(200).json({
      informationLetter,
      runway,
      windDirection: wind[1],
      windSpeed: wind[2],
      visibility,
      qnh
    });
  } catch (error) {
    console.error('Error fetching ATIS data:', error);
    res.status(500).send('Failed to retrieve ATIS data');
  }
};
