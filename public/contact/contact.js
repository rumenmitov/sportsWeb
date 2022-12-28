let form = document.querySelector('form');
let reportTypeSelect = document.querySelector('#type').children;

screenCover.style.display = "none";
loader.style.display = "none";
coverText.style.display = "none";

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
});