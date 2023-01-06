// Random NBA facts while waiting for server
let nbaFacts = [];
let factsRequest = new XMLHttpRequest();
factsRequest.open('GET', "https://89.116.228.40:6969/");
factsRequest.send(null);

factsRequest.onload = function() {
  nbaFacts = JSON.parse(this.responseText);
  let randIndex = Math.floor(Math.random() * nbaFacts.length);
  document.querySelector("#randomFacts").innerText = nbaFacts[randIndex];
  
  let randFactGen = setInterval(() => {
    let randIndex = Math.floor(Math.random() * nbaFacts.length);
    document.querySelector("#randomFacts").innerText = nbaFacts[randIndex];
    console.log(nbaFacts[randIndex]);
  }, 2000);
};

// Loading screen
let screenCover = document.querySelector('#screenCover');
let loader = document.querySelector("#loader");
let coverText = document.querySelector('#coverText');
let factsDiv = document.querySelector('#factsDiv');

let form = document.querySelector('form');
let team1 = document.querySelector('#team1');
let team2 = document.querySelector('#team2');


let xhttp = new XMLHttpRequest();
xhttp.open("GET", "https://89.116.228.40:5454/server/teams/");
xhttp.send(null);

xhttp.onload = function() {
    let teams = JSON.parse(this.responseText);

    // Adding options to Team A
    for ( let i in teams ) {
        let newOption = document.createElement('option');
        newOption.setAttribute("value", teams[i].team);
        newOption.innerText = teams[i].team;

        team1.appendChild(newOption);
    }

    // Adding options to Team B
    for ( let i in teams ) {
        let newOption = document.createElement('option');
        newOption.setAttribute("value", teams[i].team);
        newOption.innerText = teams[i].team;

        team2.appendChild(newOption);
    }

    screenCover.style.display = "none";
    loader.style.display = "none";
    coverText.style.display = "none";
    factsDiv.style.display = 'none';
}

form.addEventListener('submit', ()=>{
    screenCover.style.display = "inline-block";
    loader.style.display = "inline-block";
    coverText.style.display = "inline-block";
    factsDiv.style.display = 'inline-block';
})
