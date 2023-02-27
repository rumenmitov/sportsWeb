// Random NBA facts while waiting for server
let nbaFacts = [];
let factsRequest = new XMLHttpRequest();
factsRequest.open('GET', "https://172.105.130.226/server/facts");
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

let xhttp = new XMLHttpRequest();
xhttp.open("GET", "https://172.105.130.226/server/teams/");
xhttp.send(null);

xhttp.onload = function () {
  let teams = JSON.parse(this.responseText);

  for (let i in teams) {
    // Creating a section for each team
    let section = document.createElement("section");
    teamResults.appendChild(section);

    // Append a heading for the team's name
    let heading = document.createElement("h2");
    heading.innerText = teams[i].team;
    section.appendChild(heading);

    for (let j in teams[i].scores) {
      // Displaying each result
      let para = document.createElement("p");
      para.innerHTML = `<i>Game ${Number(j) + 1}</i> -- ${teams[i].scores[j]}`;
      section.appendChild(para);
    }

    // Finally append wins and losses
    let winsPara = document.createElement("p");
    winsPara.innerHTML = `<b>Wins:</b> ${teams[i].wins}`;
    section.appendChild(winsPara);

    let lossesPara = document.createElement("p");
    lossesPara.innerHTML = `<b>Losses:</b> ${teams[i].losses}`;
    section.appendChild(lossesPara);
  }

  screenCover.style.display = "none";
  loader.style.display = "none";
  coverText.style.display = "none";
  factsDiv.style.display = 'none';
};
