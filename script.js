// Fetch ATIS data from the Vercel backend
async function getATISData() {
    try {
        const response = await fetch('https://egnr-flight-prep.vercel.app/api/atis');  // This should be the correct URL
        const atisData = await response.json(); // Parse the JSON response

        // Update the ATIS information in the HTML
        document.getElementById('info-letter').textContent = atisData.informationLetter;
        document.getElementById('runway').textContent = atisData.runway;
        document.getElementById('wind').textContent = `${atisData.windDirection}° at ${atisData.windSpeed} KT`;
        document.getElementById('visibility').textContent = `${atisData.visibility} meters`;
        document.getElementById('qnh').textContent = `${atisData.qnh} hPa`;

    } catch (error) {
        console.error('Error fetching ATIS data:', error);
    }
}

// Call the function when the page loads
window.onload = getATISData;
