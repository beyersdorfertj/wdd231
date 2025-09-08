const navBtn = document.querySelector('#ham-btn');
const navBar = document.querySelector('#nav-bar');

navBtn.addEventListener('click', ()=>{
    navBtn.classList.toggle('show');
    navBar.classList.toggle('show');
})