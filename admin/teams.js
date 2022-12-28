let form = document.querySelector('form');
let team1 = document.querySelector('team1');
let team2 = document.querySelector('team2');

let xhttp = new XMLHttpRequest();
xhttp.open("GET", "https://89.116.228.40/teams/");
xhttp.send(null);

xhttp.onload = function() {
    let teams = JSON.parse(this.responseText);

    for ( let i in teams ) {
        let newOption = document.createElement('option');
        newOption.setAttribute("value", teams[i].team);
        newOption.innerText = teams[i].team;
        team1.appendChild(newOption);
        team2.appendChild(newOption);
    }
}

form.addEventListener('submit', ()=>{
    // loader code goes here
})
