// Function to update the date and time information on the page
function updateDateTime() {
    const now = new Date();

    // Get the current date
    const todayDate = now.toLocaleDateString('en-GB');  // UK date format
    document.getElementById('today-date').textContent = todayDate;

    // Get the current UTC time
    const utcTime = now.toUTCString().slice(-12, -4);  // Extract HH:MM:SS from UTC string
    document.getElementById('utc-time').textContent = utcTime;

    // Get the current UK time (accounting for daylight saving)
    const ukTime = now.toLocaleTimeString('en-GB', { timeZone: 'Europe/London' });
    document.getElementById('uk-time').textContent = ukTime;
}

// Fetch ATIS data from the Vercel backend
async function getATISData() {
    try {
        // Fetch data from the backend API
        const response = await fetch('https://egnr-flight-prep.vercel.app/api/atis');
        const atisData = await response.json();

        // Extract the ATIS time from the raw ATIS data (example: "EGNR COM ATIS V 1620Z")
        const atisTimeMatch = atisData.raw.match(/ATIS \w+ (\d{4})Z/);
        const atisTime = atisTimeMatch ? `${atisTimeMatch[1].slice(0, 2)}:${atisTimeMatch[1].slice(2)} UTC` : 'Unknown';

        // Update the ATIS time and other details in the HTML
        document.getElementById('atis-time').textContent = atisTime;
        document.getElementById('info-letter').textContent = atisData.informationLetter;
        document.getElementById('runway').textContent = atisData.runway;
        document.getElementById('wind').textContent = `${atisData.windDirection}° at ${atisData.windSpeed} KT`;
        document.getElementById('visibility').textContent = `${atisData.visibility} meters`;
        document.getElementById('qnh').textContent = `${atisData.qnh} hPa`;

        // Decode temperature and dew point
        const tempDewpointMatch = atisData.raw.match(/(\d{2})\/(\d{2})/);
        const temperature = tempDewpointMatch ? `${tempDewpointMatch[1]}°C` : 'Unknown';
        const dewpoint = tempDewpointMatch ? `${tempDewpointMatch[2]}°C` : 'Unknown';
        document.getElementById('temp-dewpoint').textContent = `${temperature} / ${dewpoint}`;

        // Decode runway condition codes
        const runwayConditionMatch = atisData.raw.match(/RUNWAY CONDITION CODES:([^<]*)/);
        const runwayCondition = runwayConditionMatch ? runwayConditionMatch[1].trim() : 'Unknown';
        document.getElementById('runway-condition').textContent = runwayCondition;

        // Decode cloud base
        const cloudMatch = atisData.raw.match(/SCT(\d{3})|BKN(\d{3})/);
        const cloudBase = cloudMatch ? `${parseInt(cloudMatch[1] || cloudMatch[2]) * 100} feet` : 'Unknown';
        document.getElementById('cloud-base').textContent = cloudBase;

        // Free text (e.g., bird activity)
        const freeTextMatch = atisData.raw.match(/MULTIPLE SKEENS OF GEESE(.*)/);
        const freeText = freeTextMatch ? freeTextMatch[1].trim() : 'None';
        document.getElementById('free-text').textContent = freeText;

        // Draw the wind direction on the compass
        drawCompass(atisData.windDirection);

        // Fetch NOTAMs
        await getNOTAMs();
        await getWeatherWarnings();

    } catch (error) {
        console.error('Error fetching ATIS data:', error);
    }
}

// Function to draw the wind direction on the canvas
function drawCompass(windDirection) {
    const canvas = document.getElementById('wind-compass');
    const ctx = canvas.getContext('2d');
    const radius = canvas.width / 2;

    // Clear the canvas before drawing
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw the outer circle (compass boundary)
    ctx.beginPath();
    ctx.arc(radius, radius, radius - 10, 0, 2 * Math.PI);
    ctx.stroke();

    // Draw compass directions (N, E, S, W)
    ctx.font = '16px Arial';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('N', radius, 15);  // North
    ctx.fillText('E', canvas.width - 15, radius);  // East
    ctx.fillText('S', radius, canvas.height - 15);  // South
    ctx.fillText('W', 15, radius);  // West

    // Convert wind direction degrees to radians
    const radians = (windDirection - 90) * (Math.PI / 180);  // Adjust to compass orientation

    // Draw the wind direction arrow
    ctx.beginPath();
    ctx.moveTo(radius, radius);
    ctx.lineTo(
        radius + (radius - 20) * Math.cos(radians),
        radius + (radius - 20) * Math.sin(radians)
    );
    ctx.strokeStyle = '#ff0000';  // Red color for the arrow
    ctx.lineWidth = 4;
    ctx.stroke();
}

// Function to fetch NOTAMs and populate the NOTAM section
async function getNOTAMs() {
    // Fetch NOTAM data (this is a placeholder, replace with actual NOTAM API)
    const notamData = [
        "NOTAM 1: Temporary runway closure",
        "NOTAM 2: Construction near taxiway"
    ];

    const notamList = document.getElementById('notam-list');
    notamList.innerHTML = '';  // Clear existing NOTAMs

    notamData.forEach(notam => {
        const li = document.createElement('li');
        li.textContent = notam;
        notamList.appendChild(li);
    });
}

// Function to fetch weather warnings and forecast (placeholders)
async function getWeatherWarnings() {
    // Example data
    const forecast = "No significant weather forecast";
    const warnings = "No active weather warnings";

    document.getElementById('forecast').textContent = forecast;
    document.getElementById('weather-warnings').textContent = warnings;
}

// Call the updateDateTime and getATISData functions when the page loads
window.onload = function() {
    updateDateTime();
    getATISData();
    setInterval(updateDateTime, 1000);  // Update the time every second
};
