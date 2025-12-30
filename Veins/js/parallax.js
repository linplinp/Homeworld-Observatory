{
const mouse = { x: 0, y: 0 };
const pos = { x: 0, y: 0 };


const logs = document.querySelectorAll('[id^="log-img-"]');
const title = document.querySelectorAll('.log-title');
const article = document.querySelectorAll('[class^="log-article-"]');
const orbit01 = document.querySelector('.orbit-container-1');
const orbit02 = document.querySelector('.orbit-container-2');
const data = document.querySelectorAll('.data-art-section');


document.querySelector('body').addEventListener('mousemove', ({ x, y }) => {
    mouse.x = x;
    mouse.y = y;
});

function calcValue(a, b) {
    const range = 40; 
    return (a / b) * range - range / 2;
}

function movement() {
    const easing = 10;
    pos.x += (mouse.x - pos.x) / easing;
    pos.y += (mouse.y - pos.y) / easing;

    const xValue = calcValue(pos.x, window.innerWidth);
    const yValue = calcValue(pos.y, window.innerHeight);



logs.forEach(el => {
    if (el) {
        el.style.transform = `translate3d(${xValue * 0.8}px, ${yValue * 0.5}px, 0)`;
    }

});    

title.forEach(t => { 
        t.style.transform = `translate3d(${xValue * 1.1}px, ${yValue * 0.7}px, 0)`;
}); 


article.forEach(a => { 
    if (a) {
        a.style.transform = `translate3d(${xValue * 1.1}px, ${yValue * 0.7}px, 0)`;
    }
}); 

data.forEach(d => { 
    if (d) {
        d.style.transform = `translate3d(${xValue * 1.1}px, ${yValue * 0.7}px, 0)`;
    }
}); 

orbit01.style.transform = `translate3d(${xValue * 0.3}px, ${yValue * 0.3}px, 0)`;
orbit02.style.transform = `translate3d(${xValue * 0.3}px, ${yValue * 0.3}px, 0)`;




        requestAnimationFrame(movement);
    }
}
requestAnimationFrame(movement);