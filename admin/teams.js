// Random NBA facts while waiting for server
let nbaFacts = [
    "The NBA first came to be as the Basketball Association of America in 1946",
    "Kobe Bryant's Middle Name Is Bean",
    "Wilt Chamberlain had his number retired by the Harlem Globetrotters",
    "Rumour has it that Manute Bol killed a lion with a spear. I wouldn't want to mess with that guy! 🦁",
    "Vince Carter and Tracy Mcgrady are cousins! They themselves did not know of this until after they were both in the NBA",
    "Scott Skiles holds the record for most assissts in one NBA game (a whopping 30 assists!)",
    "The largest margin of victory in an NBA game happened on December 17, 1991 as the Cavs dropped the hammer on the Miami Heat, 148-80",
    "Isiah Thomas once scored 16 Points in 94 Seconds and still lost!",
    "Allen Iverson holds the record for most steals in an NBA Playoff game (10 steals on May 13, 1999) 🐱‍👤",
    "The Celtics and the Knicks are the only two teams in the NBA to have never relocated!",
    "Dennis Rodman once illegally married himself! 👰",
    "MJ is the GOAT let's be real here 🐐",
    "The bird on the Twitter logo is named after Larry Bird of the Boston Celtics 🐦",
    "Shaquille O’Neal has only made one 3 pointer in his 20-year NBA career!",
    "No player has ever worn the number 69 while playing in the NBA",
    "Manute Bol has more career blocks than points! ⛔",
    "Russell Westbrook > Steph Curry , am I right Poli?",
    "Kobe Bryant’s first NBA contract was co-signed by his parents 👪",
    "The shortest player (Muggsy Bogues) and the tallest player (Manute Bol) in NBA history played once for the same team (Washington Bullets)",
    "Paul Pierce was stabbed 11 times and still played every game in the 2000-01 season 🔪 #CelticsPride 🍀",
    "Canadian-American James Naismith invented basketball in 1891",
    "Coach Frank W. Keaney holds the credit for the concept of 'fast break' in basketball 🏃‍♂️",
    "The longest NBA basketball game lasted for 78 minutes. It was between the Indianapolis Olympians and the Rochester Royals",
    "The highest-scoring NBA game ended with a score of 186-184 between the Detroit Pistons and the Denver Nuggets in 1983",
    "Wilt Chamberlain holds the record for the most points scored in a single basketball game (100 points 🤯)",
    "Ron Artest holds the record for the longest ever NBA suspension (73 regular season games and 13 playoff games) ⌚",
    "The famous NBA logo features the silhouette of Jerry West 🏀",
    "The first brand to market basketball shoes was Converse's authentic Chuck Taylor All-Stars",
    "Michael Jordan’s Air Jordan is the best-selling basketball shoe of all-time 💹",
    "Basketball at the Summer Olympics has been a sport for men consistently since 1936 🏀"
];
  
  let randIndex = Math.floor(Math.random() * nbaFacts.length);
  document.querySelector("#randomFacts").innerText = nbaFacts[randIndex];
  
  let randFactGen = setInterval(() => {
    let randIndex = Math.floor(Math.random() * nbaFacts.length);
    document.querySelector("#randomFacts").innerText = nbaFacts[randIndex];
    console.log(nbaFacts[randIndex]);
  }, 7000);

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
