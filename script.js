// Fetch METAR data from the airbrief API (You would need to replace this with a real API call)
fetch("https://egnr.airbrief.net/")
    .then(response => {
        // Simulate METAR data for demo purposes
        return {
            "informationLetter": "A",
            "runway": "04",
            "visibility": "10km",
            "cloud": "Few Clouds",
            "qnh": "1013",
            "windDirection": 90,
            "windSpeed": "15 knots"
        };
    })
    .then(metarData => {
        // Update the METAR section with the data
        document.getElementById("info-letter").textContent = metarData.informationLetter;
        document.getElementById("runway").textContent = metarData.runway;
        document.getElementById("visibility").textContent = metarData.visibility;
        document.getElementById("cloud").textContent = metarData.cloud;
        document.getElementById("qnh").textContent = metarData.qnh;
        document.getElementById("wind-speed").textContent = metarData.windSpeed;

        // Draw wind direction on the compass
        drawCompass(metarData.windDirection);
    })
    .catch(error => console.log(error));

// Function to draw compass with wind direction
function drawCompass(degrees) {
    const canvas = document.getElementById('wind-compass');
    const ctx = canvas.getContext('2d');
    const radius = canvas.width / 2;

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw outer circle
    ctx.beginPath();
    ctx.arc(radius, radius, radius - 10, 0, 2 * Math.PI);
    ctx.stroke();

    // Draw wind direction arrow
    const radians = (degrees - 90) * (Math.PI / 180);  // Convert degrees to radians and rotate 90 degrees
    ctx.beginPath();
    ctx.moveTo(radius, radius);
    ctx.lineTo(radius + (radius - 20) * Math.cos(radians), radius + (radius - 20) * Math.sin(radians));
    ctx.stroke();
}
