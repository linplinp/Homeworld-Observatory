// 頁面加載完成後播放一次hover.mp3
window.addEventListener('load', function () {
    const loadSound = document.getElementById('loadSound');
    // 嘗試播放音頻（處理瀏覽器自動播放限制）
    loadSound.play().catch(error => {
        console.log('自動播放受限，需要用戶交互後才能播放:', error);
        // 可以添加用戶交互後播放的邏輯，例如點擊頁面後播放
        document.body.addEventListener('click', function playOnClick() {
            loadSound.play();
            document.body.removeEventListener('click', playOnClick);
        }, { once: true });
    });
});