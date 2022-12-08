let resultsTable;
let button = document.querySelector('button');

button.onclick = () => {
    // First remove previos results (if any)
    if (resultsTable) resultsTable.remove();

    // Creating results table
    resultsTable = document.createElement('table');
    document.body.appendChild(resultsTable);

    // Creating row for category names
    let newHeaderRow = document.createElement('tr');
    resultsTable.appendChild(newHeaderRow);

    // First Name
    let newHeaderFirstName = document.createElement('th');
    newHeaderFirstName.innerHTML = 'First Name';
    newHeaderRow.appendChild(newHeaderFirstName);

    // Last Name
    let newHeaderLastName = document.createElement('th');
    newHeaderLastName.innerHTML = 'Last Name';
    newHeaderRow.appendChild(newHeaderLastName);

    // Date of Birth (DoB)
    let newHeaderDoB = document.createElement('th');
    newHeaderDoB.innerHTML = 'Date of Birth';
    newHeaderRow.appendChild(newHeaderDoB);

    // Class
    let newHeaderClass = document.createElement('th');
    newHeaderClass.innerHTML = 'Class';
    newHeaderRow.appendChild(newHeaderClass);

    // Team
    let newHeaderTeam = document.createElement('th');
    newHeaderTeam.innerHTML = 'Team';
    newHeaderRow.appendChild(newHeaderTeam);

    // Handling data from server
    let xhttp = new XMLHttpRequest();

    xhttp.open("GET", "http://127.0.0.1:5454/signup");
    xhttp.send(null);
    
    xhttp.onload = function() {
        let results = JSON.parse(this.responseText);


        for ( let i in results) {
            let newRow = document.createElement('tr');
            resultsTable.appendChild(newRow);

            // First Name
            let newCellFirstName = document.createElement('td');
            newCellFirstName.innerHTML = results[i]['firstName'];
            newRow.appendChild(newCellFirstName);

            // Last Name
            let newCellLastName = document.createElement('td');
            newCellLastName.innerHTML = results[i]['lastName'];
            newRow.appendChild(newCellLastName);

            // Date of Birth (DoB)
            let newCellDoB = document.createElement('td');
            newCellDoB.innerHTML = results[i]['dob'];
            newRow.appendChild(newCellDoB);

            // Class
            let newCellClass = document.createElement('td');
            newCellClass.innerHTML = results[i]['class'];
            newRow.appendChild(newCellClass);

            // Team
            let newCellTeam = document.createElement('td');
            newCellTeam.innerHTML = results[i]['teamName'];
            newRow.appendChild(newCellTeam);
        }
    };
};

