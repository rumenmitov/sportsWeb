let form = document.querySelector('form');

screenCover.style.display = "none";
loader.style.display = "none";
coverText.style.display = "none";

form.addEventListener('submit', ()=>{
    screenCover.style.display = "inline-block";
    loader.style.display = "inline-block";
    coverText.style.display = "inline-block";
});