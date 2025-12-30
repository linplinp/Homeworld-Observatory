document.addEventListener("DOMContentLoaded", () => {
    const musicIcon = document.getElementById("musicIcon");
    const bgMusic = document.getElementById("bgMusic");
    const iconImg = musicIcon.querySelector("img");

    let isPlaying = false;
    const fadeInDuration = 6000; // 渐入时长（毫秒）
    const targetVolume = 0.1; // 目标音量
    let fadeInterval;

    // 音量渐入函数
    function fadeInMusic() {
        bgMusic.volume = 0; // 从0音量开始
        clearInterval(fadeInterval);

        // 计算每10毫秒需要增加的音量
        const volumeStep = targetVolume / (fadeInDuration / 10);

        fadeInterval = setInterval(() => {
            if (bgMusic.volume < targetVolume) {
                bgMusic.volume = Math.min(bgMusic.volume + volumeStep, targetVolume);
            } else {
                clearInterval(fadeInterval);
            }
        }, 10);
    }

    // 尝试播放（部分浏览器会禁止自动播放）
    bgMusic.volume = 0; // 初始设为0
    bgMusic.play().then(() => {
        isPlaying = true;
        iconImg.style.animation = "spin 3s linear infinite";
        fadeInMusic(); // 开始渐入
    }).catch(err => {
        console.log("自动播放被阻挡，等待使用者点击启动音乐");
    });

    // 点击 icon 切换播放/暂停
    musicIcon.addEventListener("click", () => {
        if (isPlaying) {
            bgMusic.pause();
            iconImg.style.animation = "none";
            clearInterval(fadeInterval); // 停止渐入
        } else {
            bgMusic.play();
            iconImg.style.animation = "spin 3s linear infinite";
            fadeInMusic(); // 开始渐入
        }
        isPlaying = !isPlaying;
    });

});
// 頁面加載完成後播放一次hover.mp3
window.addEventListener('load', function () {
    const loadSound = document.getElementById('loadSound');
    // 嘗試播放音頻（處理瀏覽器自動播放限制）
    loadSound.play().catch(error => {
        // 仅保留错误日志提示，删除用户点击交互播放的逻辑
        console.log('自動播放受限，需用户主动触发播放（已移除点击页面播放逻辑）:', error);
    });
});