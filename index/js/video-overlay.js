// 1. 獲取元素引用
const coffeeCup = document.querySelector('.coffee-cup');
const tablet = document.querySelector('.tablet');
const ashtrayBook = document.querySelector('.ashtray-book');
const videoOverlay = document.getElementById('videoOverlay');
const overlayVideo = document.getElementById('overlayVideo');
const videoSource = overlayVideo.querySelector('source');

// 播放影片的通用函數
function playOverlayVideo(videoPath, triggerElement) {
    if (!videoOverlay || !overlayVideo) return;

    // 隱藏觸發元素
    triggerElement.style.opacity = '0';

    // 更換影片路徑並載入
    videoSource.src = videoPath;
    overlayVideo.load();

    // 顯示容器
    videoOverlay.classList.add('active');

    // 播放
    overlayVideo.currentTime = 0;
    overlayVideo.play().catch(error => {
        console.error("影片播放失敗:", error);
    });

    // 影片播放結束後恢復
    overlayVideo.onended = () => {
        videoOverlay.classList.remove('active');
        coffeeCup.style.opacity = '1';
        tablet.style.opacity = '1';
        ashtrayBook.style.opacity = '1';
    };
}

// 2. 點擊咖啡杯觸發
if (coffeeCup) {
    coffeeCup.addEventListener('click', () => {
        playOverlayVideo('index/video/CF-2.webm', coffeeCup);
    });
}

// 3. 點擊平板觸發
if (tablet) {
    tablet.addEventListener('click', () => {
        playOverlayVideo('index/video/TB-C.webm', tablet);
    });
}
// 3. 點擊筆記本觸發
if (ashtrayBook) {
    ashtrayBook.addEventListener('click', () => {
        playOverlayVideo('index/video/TB-L.webm', ashtrayBook);
    });
}