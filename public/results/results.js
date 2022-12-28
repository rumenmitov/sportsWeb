let teamResults = document.querySelector('#teamResults');

let xhttp = new XMLHttpRequest();
xhttp.open("GET", "https://89.116.228.40:5454/server/teams/");
xhttp.send(null);

xhttp.onload = function() {
    let teams = JSON.parse(this.responseText);

    for ( let i in teams ) {
        // Creating a section for each team
        let section = document.createElement('section');
        teamResults.appendChild(section);

        // Append a heading for the team's name
        let heading = document.createElement('h2');
        heading.innerText = teams[i].team;
        section.appendChild(heading);
        
        for ( let j in teams[i].scores ) {
            // Displaying each result
            let para = document.createElement('p');
            para.innerHTML = `<i>Game ${Number(j)+1}</i> -- ${teams[i].scores[j]}`;
            section.appendChild(para);
        }
    }

    screenCover.style.display = "none";
    loader.style.display = "none";
    coverText.style.display = "none";
};