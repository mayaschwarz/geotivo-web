let currCountryToGuess;
let countries = [];
let countriesGuessedCorrectly = [];
let excludedCountries = [];
let attempts = 0;
let missedCountries = [];

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
resetAllowedAttempts();

function countryClick(country, i) {
    // guessed correctly
    if (country.name === currCountryToGuess.name) {
        countriesGuessedCorrectly.push(i);
        country.setOptions({'fillColor': "#00FF00", 'fillOpacity': 0.8});
        attempts = 0;
        resetAllowedAttempts();
        randomizeNextCountry();
    } else {
        attempts += 1;
        document.getElementById("attempts").innerHTML = ALLOWED_ATTEMPTS - attempts;
        if (ALLOWED_ATTEMPTS - attempts === 0){
            outOfAttempts(country);
            missedCountries.push(i);
        }
    }
}

function resetAllowedAttempts(){
    document.getElementById("attempts").innerHTML = ALLOWED_ATTEMPTS;
}

function generateRandomNumber(min, max, excludedCountries) {
    var num = Math.floor(Math.random() * (max - min + 1)) + min;
    return (excludedCountries.includes(num)) ? generateRandom(min, max) : num;
}

function outOfAttempts() {
    console.log('out of attempts');
    attempts = 0;
    document.getElementById("attempts").innerHTML = ALLOWED_ATTEMPTS;
    randomizeNextCountry();
}

function randomizeNextCountry() {
    currCountryToGuess = countries[generateRandomNumber(0, TOTAL_COUNTRIES, excludedCountries)];
    document.getElementById("countryToGuess").innerHTML = currCountryToGuess.name;
}

function showCountries() {
    randomizeNextCountry();
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
