// 監聽事件:檔案完成加載
document.addEventListener("DOMContentLoaded", function() {
    // 抓取捲動容器與波浪元素
    const container = document.querySelector('.container');
    const waves = document.querySelectorAll('.wave-anim-left, .wave-anim-right');

    container.addEventListener('wheel', function(e) {
        // 阻止預設的滾輪行為
        e.preventDefault();
    }, { passive: false });

    // 監聽捲動事件
    container.addEventListener('scroll', () => {
        // 算出目前捲動百分比 (0.0 ~ 1.0)
        // scrollTop: 目前捲去的高度
        // scrollHeight - clientHeight: 可捲動的總距離
        const scrollTop = container.scrollTop;
        const maxScroll = container.scrollHeight - container.clientHeight;
        
        // 避免除以 0 或超出範圍
        let scrollFraction = 0;
        if (maxScroll > 0) {
            scrollFraction = scrollTop / maxScroll;
        }
        if (scrollFraction > 1) scrollFraction = 1;
        if (scrollFraction < 0) scrollFraction = 0;

        // 設定速度倍率邏輯
        // minSpeed: 初始速度 (地表)
        // maxSpeed: 最快速度 (地核)
        // 這裡設定從 1倍速 變到 5倍速 (你可以自己改這個數字)
        const minSpeed = 1;
        const maxSpeed = 5; 
        
        // 計算當前應有的速度
        const currentSpeed = minSpeed + (scrollFraction * (maxSpeed - minSpeed));

        // 套用速度到波浪動畫上
        waves.forEach(wave => {
            // getAnimations() 會抓取該元素上所有正在跑的 CSS 動畫
            const anims = wave.getAnimations();
            anims.forEach(anim => {
                // 修改 playbackRate 就能無縫變速
                anim.playbackRate = currentSpeed;
            });
        });
    });
});