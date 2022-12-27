let resultsTable;

let getResultsButton = document.querySelector("#getResults");

getResultsButton.onclick = getResults;

function getResults() {
  // First remove previos results (if any)
  if (resultsTable) resultsTable.remove();

  // Creating results table
  resultsTable = document.createElement("table");
  document.body.appendChild(resultsTable);

  // Creating row for category names
  let newHeaderRow = document.createElement("tr");
  resultsTable.appendChild(newHeaderRow);

  // First Name
  let newHeaderFirstName = document.createElement("th");
  newHeaderFirstName.innerHTML = "First Name";
  newHeaderRow.appendChild(newHeaderFirstName);

  // Last Name
  let newHeaderLastName = document.createElement("th");
  newHeaderLastName.innerHTML = "Last Name";
  newHeaderRow.appendChild(newHeaderLastName);

  // Email
  let newHeaderEmail = document.createElement("th");
  newHeaderEmail.innerHTML = "Email";
  newHeaderRow.appendChild(newHeaderEmail);

  // Date of Birth (DoB)
  let newHeaderDoB = document.createElement("th");
  newHeaderDoB.innerHTML = "Date of Birth";
  newHeaderRow.appendChild(newHeaderDoB);

  // Class
  let newHeaderClass = document.createElement("th");
  newHeaderClass.innerHTML = "Class";
  newHeaderRow.appendChild(newHeaderClass);

  // Team
  let newHeaderTeam = document.createElement("th");
  newHeaderTeam.innerHTML = "Team";
  newHeaderRow.appendChild(newHeaderTeam);

  // Delete Option
  let newHeaderDelete = document.createElement("th");
  newHeaderDelete.innerHTML = "Delete";
  newHeaderRow.appendChild(newHeaderDelete);

  // Handling data from server
  let xhttp = new XMLHttpRequest();

  xhttp.open("GET", "https://89.116.228.40:5454/signup");
  xhttp.send(null);

  xhttp.onload = function () {
    let results = JSON.parse(this.responseText);
    results = sortResults(results);

    for (let i in results) {
      let newRow = document.createElement("tr");
      resultsTable.appendChild(newRow);

      // First Name
      let newCellFirstName = document.createElement("td");
      newCellFirstName.innerHTML = results[i]["firstName"];
      newRow.appendChild(newCellFirstName);

      // Last Name
      let newCellLastName = document.createElement("td");
      newCellLastName.innerHTML = results[i]["lastName"];
      newRow.appendChild(newCellLastName);

      // Email
      let newCellEmail = document.createElement("td");
      newCellEmail.innerHTML = results[i]["email"];
      newRow.appendChild(newCellEmail);

      // Date of Birth (DoB)
      let newCellDoB = document.createElement("td");
      newCellDoB.innerHTML = results[i]["dob"];
      newRow.appendChild(newCellDoB);

      // Class
      let newCellClass = document.createElement("td");
      newCellClass.innerHTML = results[i]["class"];
      newRow.appendChild(newCellClass);

      // Team
      let newCellTeam = document.createElement("td");
      newCellTeam.innerHTML = results[i]["team"];
      newRow.appendChild(newCellTeam);

      // Delete Cell
      let newCellDelete = document.createElement("td");
      newRow.appendChild(newCellDelete);

      // Delete Button
      let newDeleteButton = document.createElement("button");
      newDeleteButton.innerText = "Delete";
      newDeleteButton.addEventListener("click", () => {
        deleteParticipant({
          id: results[i]["_id"],
          team: results[i]["team"],
          email: results[i]["email"],
        });
      });
      newCellDelete.appendChild(newDeleteButton);
    }
  };
}

function sortResults(results) {
  // Sorting option will take the user choice for sorting the data
  let index = document.querySelector("#sortBySelection").selectedIndex;
  let sortingOption = document
    .querySelector("#sortBySelection")
    [index].getAttribute("value");

  if (sortingOption === "firstName") {
    return results.sort((a, b) => {
      if (a.firstName > b.firstName) return 1;
      else if (a.firstName < b.firstName) return -1;
      else return 0;
    });
  } else if (sortingOption === "lastName") {
    return results.sort((a, b) => {
      if (a.lastName > b.lastName) return 1;
      else if (a.lastName < b.lastName) return -1;
      else return 0;
    });
  } else if (sortingOption === "dob") {
    return results.sort((a, b) => {
      if (a.dob > b.dob) return 1;
      else if (a.dob < b.dob) return -1;
      else return 0;
    });
  } else if (sortingOption === "class") {
    return results.sort((a, b) => {
      if (a.class > b.class) return 1;
      else if (a.class < b.class) return -1;
      else return 0;
    });
  } else if (sortingOption === "team") {
    return results.sort((a, b) => {
      if (a.team > b.team) return 1;
      else if (a.team < b.team) return -1;
      else return 0;
    });
  } else return results;
}

let deleteParticipant = function (id) {
  id = JSON.stringify(id);
  let AdminConfirmation = prompt(
    `Are you sure you want to delete the user with the ID: '${id}'?\nIf you are sure please type 'CONFIRM' below.`
  );
  if (AdminConfirmation !== "CONFIRM") return;
  console.log(id);

  let xhttp = new XMLHttpRequest();

  xhttp.open("DELETE", `https://89.116.228.40:5454/signup/${id}`);
  xhttp.send(null);

  xhttp.onload = () => {
    document.write(
      `${xhttp.responseText}<br><button onclick='location.href="https://sportspc.ml/admin";'>Go back</button>`
    );
  };
};
