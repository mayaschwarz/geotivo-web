let countries = [];
let countriesGuessedCorrectly = [];
let currCountryToGuess;
let excludedCountries = [];

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

function countryClick(country, i) {
    console.log('currCountryToGuess is', currCountryToGuess.name);
    // guessed correctly
    if (country.name === currCountryToGuess.name) {
        console.log("RIGHT!!!!");
        countriesGuessedCorrectly.push(i);
        country.setOptions({'fillColor': COLORS[generateRandomNumber(0, COLORS.length, [])], 'fillOpacity': 0.5})
        randomizeNextCountry();
    } else {
        console.log("WRONG!!!!");
    }
}

function generateRandomNumber(min, max, excludedCountries) {
    var num = Math.floor(Math.random() * (max - min + 1)) + min;
    return (excludedCountries.includes(num)) ? generateRandom(min, max) : num;
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
            this.setOptions({fillColor: "#EBEDEF", 'fillOpacity': 0.75});
        });

        google.maps.event.addListener(countries[i],"mouseout",function(){
            this.setOptions({fillColor: "#EBEDEF", 'fillOpacity': 0});
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
