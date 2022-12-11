const email = location.href.split("?email=")[1];

let signupForm = document.querySelector("form");
let teamSelectBox = document.querySelector("#teamSelectBox");
let teamSelect = document.querySelector("select");

let xhttp = new XMLHttpRequest();
xhttp.open("GET", "http://127.0.0.1:5454/signup/teams");
xhttp.send(null);
xhttp.onload = function () {
  let teams = JSON.parse(this.responseText);
  console.log(teams[0].team);

  for (let index in teams) {
    let newTeamOption = document.createElement("option");
    newTeamOption.setAttribute("value", teams[index].team);
    newTeamOption.innerText = teams[index].team;
    teamSelect.appendChild(newTeamOption);
  }
};

let emailLabel = document.createElement("label");
emailLabel.setAttribute("for", "email");
emailLabel.innerText = "Email";
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
signupForm.appendChild(submitButton);

teamSelect.addEventListener("click", () => {
  let selectedIndex = teamSelect.selectedIndex;
  let selectedOption = teamSelect[selectedIndex];

  // First remove all newTeam input boxes
  if (document.querySelector("#newTeamInput"))
    document.querySelector("#newTeamInput").remove();

  if (selectedOption.value === "newTeam") {
    // Then, if newTeam option is selected, create an input box
    let newTeamInput = document.createElement("input");
    newTeamInput.setAttribute("id", "newTeamInput");
    newTeamInput.setAttribute("name", "newTeam");
    newTeamInput.setAttribute("placeholder", "Team name");
    teamSelectBox.appendChild(newTeamInput);
  }
});
