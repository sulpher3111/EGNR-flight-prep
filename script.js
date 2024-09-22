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

    // Display ATIS horizontally (in a single line)
    atisContainer.innerHTML = `
        <p>
            <strong>Station:</strong> ${atisData.station} &nbsp; | 
            <strong>Info Code:</strong> ${atisData.informationCode} &nbsp; | 
            <strong>Runway:</strong> ${atisData.runway} &nbsp; | 
            <strong>Wind:</strong> ${atisData.wind.direction}° at ${atisData.wind.speed} KT (${atisData.wind.variability}) &nbsp; | 
            <strong>Visibility:</strong> ${atisData.visibility} &nbsp; | 
            <strong>Weather:</strong> ${atisData.weather} &nbsp; | 
            <strong>Clouds:</strong> ${atisData.cloudLayers} &nbsp; | 
            <strong>Temp:</strong> ${atisData.temperature}°C &nbsp; | 
            <strong>Dew Pt:</strong> ${atisData.dewPoint}°C &nbsp; | 
            <strong>QNH:</strong> ${atisData.qnh} hPa &nbsp; | 
            <strong>Runway Condition:</strong> ${atisData.runwayCondition} &nbsp; | 
            <strong>Transition Level:</strong> ${atisData.transitionLevel} &nbsp; | 
            <strong>Forecast:</strong> ${atisData.forecast}
        </p>
    `;
}

function drawRunwayWindDiagram(runway, wind) {
    const canvas = document.getElementById('runwayCanvas');
    const context = canvas.getContext('2d');
    context.clearRect(0, 0, canvas.width, canvas.height);

    // Fixed diagonal runway for 04/22 (approximately 040° heading)
    const runwayLength = 160;
    const runwayWidth = 20;

    context.save();
    context.translate(canvas.width / 2, canvas.height / 2);
    context.rotate(-40 * Math.PI / 180); // Rotate runway by -40° to align with 04/22

    // Draw runway rectangle
    context.fillStyle = "gray";
    context.fillRect(-runwayLength / 2, -runwayWidth / 2, runwayLength, runwayWidth);

    // Restore context after rotation
    context.restore();

    // Add runway numbers (04 and 22)
    context.font = "16px Arial";
    context.fillStyle = "black";
    context.textAlign = "center";
    context.fillText("04", canvas.width / 2 - runwayLength / 2 + 20, canvas.height / 2 - 10); // Runway 04
    context.fillText("22", canvas.width / 2 + runwayLength / 2 - 20, canvas.height / 2 + 20); // Runway 22

    // Wind direction
    const windDirection = parseInt(wind.direction, 10);
    const radians = (windDirection - 40) * (Math.PI / 180); // Adjust wind to runway's diagonal orientation

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
