const axios = require('axios');
const cheerio = require('cheerio');

module.exports = async (req, res) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') {
        res.status(200).end();
        return;
    }

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

    // Parsing station
    const station = atisRaw.match(/^(EGNR)/);
    const informationCode = atisRaw.match(/ATIS ([A-Z])/);
    const runway = atisRaw.match(/RWY IN USE (\d{2})/);

    // Parsing wind
    const wind = atisRaw.match(/(\d{3})(\d{2})KT/);
    const variability = atisRaw.match(/(\d{3})V(\d{3})/);

    // Parsing visibility (9999 and optional SW direction)
    const visibility = atisRaw.match(/(\d{4})(SW|SE|NW|NE)?/g); // Handles multiple visibility values

    // Parsing weather (focus on weather conditions like RA for rain)
    const weather = atisRaw.match(/(-|\+|VC)?(RA|DZ|SN|SG|IC|PL|GR|GS|BR|FG|FU|VA|DU|SA|HZ|PY|PO|SQ|FC|SS|DS)/);

    // Parsing cloud layers
    const cloud = atisRaw.match(/(BKN|SCT|OVC)(\d{3})/);

    // Parsing temperature and dew point
    const temperatureDewPoint = atisRaw.match(/(\d{2})\/(\d{2})/);

    // Parsing altimeter (QNH)
    const qnh = atisRaw.match(/Q(\d{4})/);

    // Assign values to the object
    atis.station = station ? station[1] : 'Unknown';
    atis.informationCode = informationCode ? informationCode[1] : 'Unknown';
    atis.runway = runway ? runway[1] : 'Unknown';
    atis.wind = {
        direction: wind ? wind[1] : 'Unknown',
        speed: wind ? wind[2] : 'Unknown',
        variability: variability ? `Variable between ${variability[1]}° and ${variability[2]}°` : 'No variability'
    };

    // Handle multiple visibility values (e.g., 9999 and 8000SW)
    if (visibility) {
        atis.visibility = visibility.map(v => {
            const match = v.match(/(\d{4})(SW|SE|NW|NE)?/);
            if (match) {
                return match[2] ? `${match[1]} meters ${match[2]}` : `${match[1]} meters`;
            }
            return 'Unknown';
        }).join(', ');
    } else {
        atis.visibility = 'Not reported';
    }

    // Handle weather parsing
    if (weather) {
        const intensity = weather[1] ? (weather[1] === '+' ? 'Heavy ' : 'Light ') : '';
        const condition = getWeatherCondition(weather[2]);
        atis.weather = intensity + condition;
    } else {
        atis.weather = 'Not reported';
    }

    // Handle cloud layers
    if (cloud) {
        atis.cloudLayers = `${getCloudCover(cloud[1])} at ${parseInt(cloud[2]) * 100} feet`;
    } else {
        atis.cloudLayers = 'No data available';
    }

    atis.temperature = temperatureDewPoint ? temperatureDewPoint[1] : 'Unknown';
    atis.dewPoint = temperatureDewPoint ? temperatureDewPoint[2] : 'Unknown';
    atis.qnh = qnh ? qnh[1] : 'Unknown';

    return atis;
}

function getWeatherCondition(code) {
    const weatherConditions = {
        RA: 'Rain',
        SN: 'Snow',
        BR: 'Mist',
        FG: 'Fog',
        FU: 'Smoke',
        HZ: 'Haze',
        DZ: 'Drizzle',
        SH: 'Showers',
        GR: 'Hail',
        GS: 'Small Hail',
        IC: 'Ice Crystals',
        PL: 'Ice Pellets',
        SG: 'Snow Grains',
        SQ: 'Squalls',
        TS: 'Thunderstorms',
        FC: 'Funnel Cloud',
        PO: 'Dust Whirls',
        DS: 'Duststorm',
        SS: 'Sandstorm'
    };
    return weatherConditions[code] || 'Unknown';
}

function getCloudCover(code) {
    const cloudCovers = {
        SCT: 'Scattered',
        BKN: 'Broken',
        OVC: 'Overcast'
    };
    return cloudCovers[code] || 'Unknown';
}
