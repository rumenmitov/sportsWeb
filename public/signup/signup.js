const email = location.href.split('?email=')[1];

let signupForm = document.querySelector('form');

let emailLabel = document.createElement('label');
emailLabel.setAttribute('for', 'email');
emailLabel.innerText = "Email";
signupForm.appendChild(emailLabel);

let emailInput = document.createElement('input');
emailInput.setAttribute("readonly", "true");
emailInput.setAttribute('type', 'email');
emailInput.setAttribute('name', 'email');
emailInput.setAttribute('value', email);
signupForm.appendChild(emailInput);

let submitButton = document.createElement('input');
submitButton.setAttribute("type", "submit");
submitButton.setAttribute("value", "Sign-up");
signupForm.appendChild(submitButton);
