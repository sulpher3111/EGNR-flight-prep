window.onload = function () {
    fetchATISData();
};

async function fetchATISData() {
    const atisContainer = document.getElementById("atis-info");

    // Ensure the container element exists
    if (!atisContainer) {
        console.error('ATIS container element not found.');
        return;
    }

    try {
        const response = await fetch('/api/atis');
        if (!response.ok) {
            throw new Error('Failed to fetch ATIS data');
        }

        const atisData = await response.json();
        displayATIS(atisData);
    } catch (error) {
        atisContainer.innerHTML = '<p>Error fetching ATIS data</p>';
        console.error("Error fetching ATIS data:", error);
    }
}

function displayATIS(atisData) {
    const atisContainer = document.getElementById("atis-info");

    if (!atisData || typeof atisData !== 'object') {
        atisContainer.innerHTML = '<p>Error: Invalid ATIS data received</p>';
        return;
    }

    // Safely access ATIS data fields and provide fallback if missing
    const station = atisData.station || 'Unknown';
    const informationCode = atisData.informationCode || 'Unknown';
    const runway = atisData.runway || 'Unknown';
    const windDirection = atisData.wind?.direction || 'Unknown';
    const windSpeed = atisData.wind?.speed || 'Unknown';
    const windVariability = atisData.wind?.variability || 'Not reported';
    const visibility = atisData.visibility || 'Not reported';
    const weather = atisData.weather || 'Not reported';
    const cloudLayers = atisData.cloudLayers || 'No data available';
    const temperature = atisData.temperature || 'Unknown';
    const dewPoint = atisData.dewPoint || 'Unknown';
    const qnh = atisData.qnh || 'Unknown';

    // Update the DOM with ATIS data
    atisContainer.innerHTML = `
        <p><strong>Station:</strong> ${station}</p>
        <p><strong>Information Code:</strong> ${informationCode}</p>
        <p><strong>Runway in Use:</strong> ${runway}</p>
        <p><strong>Wind:</strong> ${windDirection}° at ${windSpeed} KT</p>
        <p><strong>Wind Variability:</strong> ${windVariability}</p>
        <p><strong>Visibility:</strong> ${visibility}</p>
        <p><strong>Weather:</strong> ${weather}</p>
        <p><strong>Cloud Layers:</strong> ${cloudLayers}</p>
        <p><strong>Temperature:</strong> ${temperature}°C</p>
        <p><strong>Dew Point:</strong> ${dewPoint}°C</p>
        <p><strong>Altimeter (QNH):</strong> ${qnh} hPa</p>
    `;

    // Draw wind compass
    drawWindCompass(windDirection, windSpeed);
}

function drawWindCompass(direction, speed) {
    const canvas = document.getElementById('windCanvas');
    const windKnotsDiv = document.getElementById('wind-knots');

    // Ensure canvas and wind-knots elements exist
    if (!canvas || !windKnotsDiv) {
        console.error('Wind compass or wind-knots element not found.');
        return;
    }

    const context = canvas.getContext('2d');
    // Clear canvas
    context.clearRect(0, 0, canvas.width, canvas.height);

    // Draw compass circle
    context.beginPath();
    context.arc(150, 150, 100, 0, 2 * Math.PI);
    context.stroke();

    // Draw wind direction
    if (direction !== 'Unknown') {
        context.beginPath();
        context.moveTo(150, 150);
        const radians = (direction - 90) * (Math.PI / 180);
        const x = 150 + 100 * Math.cos(radians);
        const y = 150 + 100 * Math.sin(radians);
        context.lineTo(x, y);
        context.strokeStyle = "red";
        context.stroke();
    }

    // Update wind speed in knots at the center
    windKnotsDiv.textContent = `Wind: ${speed} KT`;
}
