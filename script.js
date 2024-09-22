window.onload = function () {
    fetchATISData();

    // Handle PDF creation
    document.getElementById('create-pdf').addEventListener('click', createPDF);
};

async function fetchATISData() {
    const atisContainer = document.getElementById("atis-info");

    try {
        const response = await fetch('https://egnr-flight-prep.vercel.app/api/atis');
        const atisData = await response.json();
        displayATIS(atisData);
        window.atisData = atisData; // Save ATIS data for later PDF generation
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

    // Display ATIS data horizontally
    atisContainer.innerHTML = `
        <p>
            <strong>Station:</strong> ${atisData.station} &nbsp; | 
            <strong>Runway:</strong> ${atisData.runway} &nbsp; | 
            <strong>Wind:</strong> ${atisData.wind.direction}° at ${atisData.wind.speed} KT (${atisData.wind.variability}) &nbsp; | 
            <strong>Visibility:</strong> ${atisData.visibility} &nbsp; | 
            <strong>Weather:</strong> ${atisData.weather} &nbsp; | 
            <strong>Temp:</strong> ${atisData.temperature}°C &nbsp; | 
            <strong>Dew Pt:</strong> ${atisData.dewPoint}°C &nbsp; | 
            <strong>QNH:</strong> ${atisData.qnh} hPa
        </p>
    `;
}
