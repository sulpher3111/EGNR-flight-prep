window.onload = function () {
    fetchATISData();
};

async function fetchATISData() {
    const atisContainer = document.getElementById("atis-info");

    try {
        const response = await fetch('https://egnr-flight-prep.vercel.app/api/atis');
        const atisData = await response.json();
        displayATIS(atisData);

        // Remove or comment out the line below since the runway diagram is no longer needed.
        // drawRunwayWindDiagram(atisData.runway, atisData.wind);
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

    // Display ATIS information horizontally
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
