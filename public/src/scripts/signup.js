// Random NBA facts while waiting for server
let nbaFacts = [];
let factsRequest = new XMLHttpRequest();
factsRequest.open('GET', "https://sport.pupilscom-esl1.eu/server/facts");
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

const userCode = location.href.split("?userCode=")[1];
const email = atob(userCode);

let signupForm = document.querySelector("form");
let teamSelectBox = document.querySelector("#teamSelectBox");
let teamSelect = document.querySelector("select");


let xhttp = new XMLHttpRequest();
xhttp.open("GET", "https://sport.pupilscom-esl1.eu/server/teams/");
xhttp.send(null);
xhttp.onload = function () {
  let teams = JSON.parse(this.responseText);

  for (let index in teams) {
    let newTeamOption = document.createElement("option");
    newTeamOption.setAttribute("value", teams[index].team);
    newTeamOption.innerText = teams[index].team;
    teamSelect.appendChild(newTeamOption);
  }

  screenCover.style.display = 'none';
  loader.style.display = "none";
  coverText.style.display = 'none';
  factsDiv.style.display = 'none';
};

let emailLabel = document.createElement("label");
emailLabel.setAttribute("for", "email");
emailLabel.setAttribute("style", "margin-top: -5%;");
emailLabel.innerText = "Email:";
signupForm.appendChild(emailLabel);

let emailInput = document.createElement("input");
emailInput.setAttribute("readonly", "true");
emailInput.setAttribute("type", "email");
emailInput.setAttribute("name", "email");
emailInput.setAttribute("value", email);
signupForm.appendChild(emailInput);

let submitButton = document.createElement("input");
submitButton.setAttribute("type", "submit");
submitButton.setAttribute("value", "Sign-up");
submitButton.setAttribute('id', "submitButton");
signupForm.appendChild(submitButton);

teamSelect.addEventListener("click", () => {
  let selectedIndex = teamSelect.selectedIndex;
  let selectedOption = teamSelect[selectedIndex];

  // First remove all newTeam input boxes
  if (document.querySelector("#newTeamInput")) {
    document.querySelector("#newTeamInput").remove();
  }

  if (selectedOption.value === "newTeam") {
    // Then, if newTeam option is selected, create an input box
    addNewTeamInput();
  }
});

addNewTeamInput();

signupForm.addEventListener("submit", ()=>{
  submitButton.remove();

  screenCover.style.display = 'inline-block';
  loader.style.display = "inline-block";
  coverText.style.display = 'inline-block';
  factsDiv.style.display = 'inline-block';
});

function addNewTeamInput() {
    let newTeamInput = document.createElement("input");
    newTeamInput.setAttribute("id", "newTeamInput");
    newTeamInput.setAttribute("name", "newTeam");
    newTeamInput.setAttribute("placeholder", "Team name");
    newTeamInput.setAttribute('required', 'true');
    teamSelectBox.appendChild(newTeamInput);
}
