module.exports = async (req, res) => {
    res.setHeader('Access-Control-Allow-Origin', '*');  // Allow all origins
    res.setHeader('Access-Control-Allow-Methods', 'GET');  // Allow only GET requests
const axios = require('axios');
const cheerio = require('cheerio');

module.exports = async (req, res) => {
    try {
        const { data } = await axios.get('https://egnr.airbrief.net/');
        const $ = cheerio.load(data);

        const atisRaw = $('p').first().text();
        const parsedAtis = parseATIS(atisRaw);

        res.status(200).json(parsedAtis);
    } catch (error) {
        console.error('Error fetching ATIS data:', error);
        res.status(500).json({ error: 'Failed to fetch ATIS data' });
    }
};

function parseATIS(atisRaw) {
    const atis = {};

    const station = atisRaw.match(/^(EGNR)/);
    const informationCode = atisRaw.match(/ATIS ([A-Z])/);
    const runway = atisRaw.match(/RWY IN USE (\d{2})/);
    const wind = atisRaw.match(/(\d{3})(\d{2})KT/);
    const variability = atisRaw.match(/(\d{3})V(\d{3})/);
    const visibility = atisRaw.match(/(\d{4})/);
    const temperatureDewPoint = atisRaw.match(/(\d{2})\/(\d{2})/);
    const qnh = atisRaw.match(/Q(\d{4})/);

    atis.station = station ? station[1] : 'Unknown';
    atis.informationCode = informationCode ? informationCode[1] : 'Unknown';
    atis.runway = runway ? runway[1] : 'Unknown';
    atis.wind = {
        direction: wind ? wind[1] : 'Unknown',
        speed: wind ? wind[2] : 'Unknown',
        variability: variability ? `Variable between ${variability[1]}° and ${variability[2]}°` : 'No variability'
    };
    atis.visibility = visibility ? `${visibility[1]} meters` : 'Not reported';
    atis.temperature = temperatureDewPoint ? temperatureDewPoint[1] : 'Unknown';
    atis.dewPoint = temperatureDewPoint ? temperatureDewPoint[2] : 'Unknown';
    atis.qnh = qnh ? qnh[1] : 'Unknown';

    return atis;
}
