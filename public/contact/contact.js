// Random NBA facts while waiting for server
let nbaFacts = [];
let factsRequest = new XMLHttpRequest();
factsRequest.open('GET', "https://172.105.130.226/");
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
let teamResults = document.querySelector("#teamResults");
let screenCover = document.querySelector("#screenCover");
let loader = document.querySelector("#loader");
let coverText = document.querySelector("#coverText");
let factsDiv = document.querySelector('#factsDiv');

let form = document.querySelector('form');
let reportTypeSelect = document.querySelector('#type').children;



screenCover.style.display = "none";
loader.style.display = "none";
coverText.style.display = "none";
factsDiv.style.display = 'none';

const bugType = location.href.split('?reportType=')[1];
if (bugType === 'signup') {
    reportTypeSelect[1].setAttribute("selected", 'true');
} else if (bugType === 'results') {
    reportTypeSelect[2].setAttribute("selected", 'true');
} else if (bugType === 'teams') {
    reportTypeSelect[3].setAttribute("selected", 'true');
} else if (bugType === 'question') {
    reportTypeSelect[4].setAttribute("selected", 'true');
} else if (bugType === 'praise') {
    reportTypeSelect[5].setAttribute("selected", 'true');
}  else if (bugType === 'other') {
    reportTypeSelect[6].setAttribute("selected", 'true');
}

form.addEventListener('submit', ()=>{
    screenCover.style.display = "inline-block";
    loader.style.display = "inline-block";
    coverText.style.display = "inline-block";
    factsDiv.style.display = 'inline-block';
});