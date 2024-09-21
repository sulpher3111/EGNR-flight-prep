// Fetch ATIS data from the Vercel backend
async function getATISData() {
    try {
        const response = await fetch('https://your-vercel-backend.vercel.app/api/atis');
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
