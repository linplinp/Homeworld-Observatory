const click = document.getElementById('click');
const scrollUp = document.getElementById('scrollUp');
const scrollDown = document.getElementById('scrollDown');
const hoverSound = document.getElementById('hoverSound');

// 1. 點擊音效
addEventListener("click", () => {
    click.play();
});

// 2. 滾輪音效 (區分上下)
addEventListener("wheel", (event) => {
    if (event.deltaY > 0) {
        scrollDown.currentTime = 0;
        scrollDown.play();
    } else if (event.deltaY < 0) {
        scrollUp.currentTime = 0;
        scrollUp.play();
    }
});

// 3. 懸停音效 (Hover)
addEventListener("mouseover", (event) => {
    // 取得滑鼠當前指向的元素
    const target = event.target;
    
    // 檢查是否匹配：按鈕、連結、或是指定的容器類名
    // .closest() 可以確保滑鼠移到容器內的子元素（如圖片）時也能觸發
    if (target.closest('button') || 
        target.closest('a') || 
        target.classList.contains('music-icon')||
        target.classList.contains('menu-nav-menu')||
        target.classList.contains('menu-navigation')||
        target.classList.contains('navigation')) {
        
        hoverSound.currentTime = 0;
        hoverSound.play();
    }
});