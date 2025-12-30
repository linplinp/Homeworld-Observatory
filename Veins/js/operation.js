// 抓取元素checkBox
// 如果按下esc且checkBox為checked 
// 則checkBox改為unchecked

const nav = document.getElementById('nav');
const toggle = document.getElementById('toggle-menu');


document.addEventListener('keydown', function(event) {
    if (event.key === 'Escape') {
        nav.checked = false;
    }
});

document.addEventListener('keydown', function(event) {
    if (event.key === 'Spacebar') {
        toggle.checked = true;
    }
});