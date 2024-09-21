// Fetch ATIS data from the backend and update the page
async function getATISData() {
    try {
        const response = await fetch('http://localhost:3000/atis');
        const atisData = await response.json();

        // Update the ATIS information on the webpage
        document.getElementById('info-letter').textContent = atisData.informationLetter;
        document.getElementById('runway').textContent = atisData.runway;
        document.getElementById('wind').textContent = `${atisData.windDirection}° at ${atisData.windSpeed} KT`;
        document.getElementById('visibility').textContent = `${atisData.visibility} meters`;
        document.getElementById('qnh').textContent = `${atisData.qnh} hPa`;

        // Draw the wind direction on the compass
        drawCompass(atisData.windDirection);
    } catch (error) {
        console.error('Error fetching ATIS data:', error);
    }
}

// Function to draw wind direction on the compass
function drawCompass(degrees) {
    const canvas = document.getElementById('wind-compass');
    const ctx = canvas.getContext('2d');
    const radius = canvas.width / 2;

    // Clear the canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw the outer circle
    ctx.beginPath();
    ctx.arc(radius, radius, radius - 10, 0, 2 * Math.PI);
    ctx.stroke();

    // Convert degrees to radians and rotate 90 degrees to point north
    const radians = (degrees - 90) * (Math.PI / 180);
    ctx.beginPath();
    ctx.moveTo(radius, radius);
    ctx.lineTo(
        radius + (radius - 20) * Math.cos(radians),
        radius + (radius - 20) * Math.sin(radians)
    );
    ctx.stroke();
}

// Update ATIS information when the page loads
window.onload = getATISData;
