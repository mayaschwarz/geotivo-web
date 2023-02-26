let currCountryToGuess;
let countries = [];
let countriesGuessedCorrectly = [];
let excludedCountries = [];
let attempts = 0;
let missedCountries = [];
let livesLost = 0;
let playedOnce = false;

let mapOptions = {
    zoom: 3,
    minZoom: 1,
    mapTypeId: google.maps.MapTypeId.ROADMAP,
    backgroundColor: 'none',
    styles: [
        {
            featureType: 'all',
            elementType: 'labels',
            stylers: [{ 
                visibility: 'off' 
             }]
        }
    ]
};

let map = new google.maps.Map(
    document.getElementById('map-canvas'), mapOptions
);
map.fitBounds(BOUNDS);

var startModal = document.getElementsByClassName("start-modal")[0];
var startButton = document.getElementsByClassName("start-button")[0];
var restartButton = document.getElementsByClassName("restart-button")[0];
var gameScreen = document.getElementsByClassName('game-screen')[0];
var gameOverModal = document.getElementsByClassName("game-over-modal")[0];

startButton.onclick = function() {
    startModal.style.display = "none";
    gameScreen.style.filter = "none";
}

restartButton.onclick = function() {
    gameOverModal.style.display = "none";
    gameScreen.style.filter = "none";
    resetAll();
}

window.onclick = function(event) {
    if (event.target == startModal) {
        startModal.style.display = "none";
    }
}

function countryClick(country, i) {
    // correct guess
    if (country.name === currCountryToGuess.name) {
        countriesGuessedCorrectly.push(i);
        country.setOptions({'fillColor': "#00FF00", 'fillOpacity': 0.8});
        randomizeNextCountry();
    } 
    // incorrect guess
    else {
        country.setOptions({'fillColor': "#FF0000", 'fillOpacity': 0.8});
        attempts += 1;
        document.getElementById("attempts").innerHTML = ALLOWED_ATTEMPTS - attempts;
        if (ALLOWED_ATTEMPTS - attempts === 0){
            livesLost += 1;
            missedCountries.push(currCountryToGuess.name);
            document.getElementById(`life${livesLost}`).style.display = "none";
            if (livesLost === ALLOWED_LIVES) {
                outOfLivesShowGameOverAndStats();
            } else {
                randomizeNextCountry();
            }
        }
    }
}

function resetAllowedAttempts(){
    attempts = 0;
    document.getElementById("attempts").innerHTML = ALLOWED_ATTEMPTS;
}

function generateRandomNumber(min, max, excludedCountries) {
    var num = Math.floor(Math.random() * (max - min + 1)) + min;
    return (excludedCountries.includes(num)) ? generateRandom(min, max) : num;
}

function outOfLivesShowGameOverAndStats() {
    gameScreen.style.filter = "blur(2px)";
    document.getElementById("game-stats").innerHTML = missedCountries;
    document.getElementsByClassName("game-over-modal")[0].style.display = "inline";
}

function resetAll() {
    for (let i = 0; i < ALLOWED_LIVES; i++) {
        document.getElementById(`life${i+1}`).style.display = "inline";
    }
    countriesGuessedCorrectly = [];
    excludedCountries = [];
    missedCountries = [];
    livesLost = 0;
    randomizeNextCountry();
}

function randomizeNextCountry() {
    currCountryToGuess = countries[generateRandomNumber(0, TOTAL_COUNTRIES, excludedCountries)];
    document.getElementById("countryToGuess").innerHTML = currCountryToGuess.name;
    resetAllowedAttempts();
}

function showCountries() {
    for (var i = 0; i < countries.length; i++) {
        countries[i].setMap(map);
        google.maps.event.addListener(countries[i],"mouseover",function(){
            if (!countriesGuessedCorrectly.includes(i) && !missedCountries.includes(i)){
                this.setOptions({fillColor: "#EBEDEF", 'fillOpacity': 0.75});
            }
        });
        
        google.maps.event.addListener(countries[i],"mouseout",function(){
            if (!countriesGuessedCorrectly.includes(i) && !missedCountries.includes(i)){
                this.setOptions({fillColor: "#EBEDEF", 'fillOpacity': 0});
            }
        });
    
        google.maps.event.addListener(countries[i], 'click', function(event) {
            countryClick(this, i);
        });
    }
}

function createCountry(coords, country) {
    var countryPolygon = new google.maps.Polygon({
        paths: coords,
        name: country.country,
        strokeOpacity: 0,
        fillOpacity: 0
    });

    countries.push(countryPolygon);
}
