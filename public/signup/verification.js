let form = document.querySelector('form');
let screenCover = document.querySelector('#screenCover');
let loader = document.querySelector("#loader");
let coverText = document.querySelector('#coverText');

screenCover.style.display = 'none';
loader.style.display = "none";
coverText.style.display = 'none';

form.addEventListener('submit', ()=>{
    screenCover.style.display = 'inline-block';
    loader.style.display = "inline-block";
    coverText.style.display = 'inline-block';
})