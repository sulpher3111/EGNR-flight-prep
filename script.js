window.onload = function () {
    fetchATISData();

    // Handle PDF creation
    document.getElementById('create-pdf').addEventListener('click', createPDF);
};

// Fetch ATIS data and display it
async function fetchATISData() {
    const atisContainer = document.getElementById("atis-info");

    try {
        const response = await fetch('https://egnr-flight-prep.vercel.app/api/atis');
        const atisData = await response.json();
        displayATIS(atisData);
        window.atisData = atisData; // Save ATIS data for PDF creation
    } catch (error) {
        atisContainer.innerHTML = '<p>Error fetching ATIS data</p>';
        console.error("Error fetching ATIS data:", error);
    }
}

// Display ATIS data in the ATIS section
function displayATIS(atisData) {
    const atisContainer = document.getElementById("atis-info");

    if (!atisData || typeof atisData !== 'object') {
        atisContainer.innerHTML = '<p>Error: Invalid ATIS data received</p>';
        return;
    }

    // Display ATIS data in a compact format
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

// Generate the PDF with the form data and ATIS information
function createPDF() {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();

    // Get form data
    const flightType = document.getElementById('flight-type').value;
    const runway = document.getElementById('runway').value;
    const fuelEndurance = document.getElementById('fuel-endurance').value;
    const timeOnRoute = document.getElementById('time-on-route').value;
    const departureTime = document.getElementById('departure-time').value;
    const studentName = document.getElementById('student-name').value;
    const instructorName = document.getElementById('instructor-name').value;
    const lessonBriefing = document.getElementById('lesson-briefing').value;

    // Get ATIS data (if available)
    const atisData = window.atisData;

    // Add Date and Time to PDF
    const currentDate = new Date().toLocaleDateString();
    const currentTime = new Date().toLocaleTimeString();

    // Add data to PDF
    doc.setFontSize(12);
    doc.text(`Date: ${currentDate}`, 10, 10);
    doc.text(`Time: ${currentTime}`, 10, 20);

    doc.setFontSize(10);
    doc.text(`Type of Flight: ${flightType}`, 10, 30);
    doc.text(`Runway: ${runway}`, 10, 40);
    doc.text(`Fuel Endurance: ${fuelEndurance} hours`, 10, 50);
    doc.text(`Time on Route: ${timeOnRoute} hours`, 10, 60);
    doc.text(`Departure Time: ${departureTime}`, 10, 70);
    doc.text(`Student Name: ${studentName}`, 10, 80);
    doc.text(`Instructor Name: ${instructorName}`, 10, 90);
    doc.text(`Lesson Briefing: ${lessonBriefing}`, 10, 100);

    // Add ATIS information to PDF (if available)
    if (atisData) {
        doc.text(`Station: ${atisData.station}`, 10, 110);
        doc.text(`Runway: ${atisData.runway}`, 10, 120);
        doc.text(`Wind: ${atisData.wind.direction}° at ${atisData.wind.speed} KT`, 10, 130);
        doc.text(`Visibility: ${atisData.visibility}`, 10, 140);
        doc.text(`Weather: ${atisData.weather}`, 10, 150);
    }

    // Draw lines for notes on the bottom half
    for (let i = 180; i <= 270; i += 10) {
        doc.line(10, i, 200, i); // Horizontal lines for notes
    }

    // Save the PDF
    doc.save(`${studentName}_FlightPrep_${currentDate}.pdf`);
}
