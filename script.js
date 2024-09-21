// Fetch ATIS data from the Vercel backend
async function getATISData() {
    try {
        // Make the API request
        const response = await fetch('https://egnr-flight-prep.vercel.app/api/atis');
        const atisData = await response.json();

        // Update the ATIS information in the HTML
        document.getElementById('info-letter').textContent = atisData.informationLetter;
        document.getElementById('runway').textContent = atisData.runway;
        document.getElementById('wind').textContent = `${atisData.windDirection}° at ${atisData.windSpeed} KT`;
        document.getElementById('visibility').textContent = `${atisData.visibility} meters`;
        document.getElementById('qnh').textContent = `${atisData.qnh} hPa`;

        // Draw the wind direction on the compass
        drawCompass(atisData.windDirection);  // Call the function to draw the wind direction

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

// Call the getATISData function when the page loads
window.onload = getATISData;
