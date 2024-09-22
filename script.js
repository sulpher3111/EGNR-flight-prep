window.onload = function () {
    fetchATISData();
};

async function fetchATISData() {
    const atisContainer = document.getElementById("atis-info");

    try {
        const response = await fetch('https://egnr-flight-prep.vercel.app/api/atis');
        const atisData = await response.json();
        displayATIS(atisData);
        drawRunwayWindDiagram(atisData.runway, atisData.wind);
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

    atisContainer.innerHTML = `
        <p><strong>Station:</strong> ${atisData.station}</p>
        <p><strong>Info Code:</strong> ${atisData.informationCode}</p>
        <p><strong>Runway:</strong> ${atisData.runway}</p>
        <p><strong>Wind:</strong> ${atisData.wind.direction}° at ${atisData.wind.speed} KT (${atisData.wind.variability})</p>
        <p><strong>Visibility:</strong> ${atisData.visibility}</p>
        <p><strong>Weather:</strong> ${atisData.weather}</p>
        <p><strong>Clouds:</strong> ${atisData.cloudLayers}</p>
        <p><strong>Temperature:</strong> ${atisData.temperature}°C</p>
        <p><strong>Dew Point:</strong> ${atisData.dewPoint}°C</p>
        <p><strong>QNH:</strong> ${atisData.qnh} hPa</p>
        <p><strong>Runway Condition:</strong> ${atisData.runwayCondition}</p>
        <p><strong>Transition Level:</strong> ${atisData.transitionLevel}</p>
        <p><strong>Forecast:</strong> ${atisData.forecast}</p>
    `;
}

function drawRunwayWindDiagram(runway, wind) {
    const canvas = document.getElementById('runwayCanvas');
    const context = canvas.getContext('2d');
    context.clearRect(0, 0, canvas.width, canvas.height);

    // Fixed Runway 04/22 Orientation
    const runwayLength = 160;
    const runwayWidth = 20;

    // Draw static horizontal runway (04/22)
    context.fillStyle = "gray";
    context.fillRect((canvas.width - runwayLength) / 2, (canvas.height - runwayWidth) / 2, runwayLength, runwayWidth);

    // Add runway numbers (04 and 22)
    context.font = "16px Arial";
    context.fillStyle = "black";
    context.textAlign = "center";
    context.fillText("04", canvas.width / 2 - runwayLength / 2 + 15, canvas.height / 2 - 10); // Runway 04
    context.fillText("22", canvas.width / 2 + runwayLength / 2 - 15, canvas.height / 2 - 10); // Runway 22

    // Wind direction
    const windDirection = parseInt(wind.direction, 10);
    const radians = (windDirection - 90) * (Math.PI / 180); // Adjust for wind direction

    // Arrow length for wind
    const arrowLength = 80;

    // Calculate wind arrow endpoint
    const windX = canvas.width / 2 + arrowLength * Math.cos(radians);
    const windY = canvas.height / 2 + arrowLength * Math.sin(radians);

    // Draw wind arrow
    context.beginPath();
    context.moveTo(canvas.width / 2, canvas.height / 2); // Start from runway center
    context.lineTo(windX, windY); // Draw wind direction arrow
    context.strokeStyle = "red";
    context.lineWidth = 2;
    context.stroke();

    // Draw wind arrowhead
    context.beginPath();
    context.moveTo(windX, windY);
    context.lineTo(windX - 10 * Math.cos(radians + Math.PI / 6), windY - 10 * Math.sin(radians + Math.PI / 6));
    context.lineTo(windX - 10 * Math.cos(radians - Math.PI / 6), windY - 10 * Math.sin(radians - Math.PI / 6));
    context.closePath();
    context.fillStyle = "red";
    context.fill();
}
