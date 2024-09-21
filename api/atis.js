const axios = require('axios');
const cheerio = require('cheerio');

module.exports = async (req, res) => {
  // Add CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET');

  try {
    // Fetch data from the ATIS source
    const { data } = await axios.get('https://egnr.airbrief.net/');
    const $ = cheerio.load(data);

    // Extract ATIS information from the <p> tag
    const atisText = $('p').first().text().trim();

    // Log the scraped ATIS text for debugging
    console.log('Scraped ATIS Text:', atisText);

    // Use regex to match and extract data, with proper null checks
    const informationLetterMatch = atisText.match(/ATIS (\w)/);
    const runwayMatch = atisText.match(/RWY IN USE (\d{2})/);
    const windMatch = atisText.match(/(\d{3})(\d{2})KT/);
    const visibilityMatch = atisText.match(/(\d{4})/);
    const qnhMatch = atisText.match(/Q(\d{4})/);

    // Safely extract information if matches are found
    const informationLetter = informationLetterMatch ? informationLetterMatch[1] : 'Unknown';
    const runway = runwayMatch ? runwayMatch[1] : 'Unknown';
    const windDirection = windMatch ? windMatch[1] : 'Unknown';
    const windSpeed = windMatch ? windMatch[2] : 'Unknown';
    const visibility = visibilityMatch ? visibilityMatch[1] : 'Unknown';
    const qnh = qnhMatch ? qnhMatch[1] : 'Unknown';

    // Send the ATIS data along with the raw ATIS text as a JSON response
    res.status(200).json({
      informationLetter,
      runway,
      windDirection,
      windSpeed,
      visibility,
   
