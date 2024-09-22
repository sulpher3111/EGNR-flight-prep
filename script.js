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

// New function to draw the runway-wind diagram
function drawRunwayWindDiagram(runway, wind) {
    const canvas = document.getElementById('runwayCanvas');
    const context = canvas.getContext('2d');
    context.clearRect(0, 0, canvas.width, canvas.height);

    // Draw runway
    context.fillStyle = "gray";
    context.fillRect(120, 100, 160, 20); // Horizontal runway

    // Draw runway label
    context.fillStyle = "black";
    context.font = "16px Arial";
    context.fillText(`Runway ${runway}`, 150, 90);

    // Draw wind arrow
    const windDirection = parseInt(wind.direction, 10);
    const radians = (windDirection - 90) * (Math.PI / 180);
    const arrowLength = 80;
    const x = 200 + arrowLength * Math.cos(radians);
    const y = 110 + arrowLength * Math.sin(radians);

    context.beginPath();
    context.moveTo(200, 110); // Starting point at the center of the runway
    context.lineTo(x, y); // Draw arrow line
    context.strokeStyle = "red";
    context.lineWidth = 2;
    context.stroke();

    // Add arrowhead
    context.beginPath();
    context.moveTo(x, y);
    context.lineTo(x - 10 * Math.cos(radians + Math.PI / 6), y - 10 * Math.sin(radians + Math.PI / 6));
    context.lineTo(x - 10 * Math.cos(radians - Math.PI / 6), y - 10 * Math.sin(radians - Math.PI / 6));
    context.closePath();
    context.fillStyle = "red";
    context.fill();
}
