const hamburger = document.getElementById('hamburger');
const nav = document.getElementById('nav');
const overlay = document.getElementById('overlay');

const toggleNav = () => {
    nav.classList.toggle('active');
    overlay.classList.toggle('active');
    hamburger.classList.toggle('active');
};

hamburger.addEventListener('click', toggleNav);
overlay.addEventListener('click', toggleNav);

document.querySelectorAll('nav a').forEach(link => {
    link.addEventListener('click', () => {
        if (nav.classList.contains('active')) {
            toggleNav();
        }
    });
});