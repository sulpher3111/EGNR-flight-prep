// Fetch ATIS data from the Vercel backend
async function getATISData() {
    try {
        const response = await fetch('https://egnr-flight-prep-hiq0okwvm-sulpher3111s-projects.vercel.app/api/atis.js');
        const atisData = await response.json();

        // Update the ATIS information on the webpage
        document.getElementById('info-letter').textContent = atisData.informationLetter;
        document.getElementById('runway').textContent = atisData.runway;
        document.getElementById('wind').textContent = `${atisData.windDirection}° at ${atisData.windSpeed} KT`;
        document.getElementById('visibility').textContent = `${atisData.visibility} meters`;
        document.getElementById('qnh').textContent = `${atisData.qnh} hPa`;

        // Draw the wind direction on the compass (if applicable)
        drawCompass(atisData.windDirection);
    } catch (error) {
        console.error('Error fetching ATIS data:', error);
    }
}
