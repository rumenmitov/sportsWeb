// Random NBA facts while waiting for server
let nbaFacts = [];
let factsRequest = new XMLHttpRequest();
factsRequest.open('GET', "https://sport.pupilscom-esl1.eu /server/facts");
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


screenCover.style.display = 'none';
loader.style.display = "none";
coverText.style.display = 'none';
factsDiv.style.display = 'none';

form.addEventListener('submit', ()=>{
    screenCover.style.display = 'inline-block';
    loader.style.display = "inline-block";
    coverText.style.display = 'inline-block';
    factsDiv.style.display = 'inline-block';
})