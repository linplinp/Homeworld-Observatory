// 執行全屏轉場動畫
function performTransition() {
    // 改為尋找 loading 元素
    const loadingElement = document.querySelector('.loading');
    if (!loadingElement) return Promise.resolve();

    return new Promise(resolve => {
        loadingElement.style.opacity = '1';

        // 動畫結束後執行回調
        setTimeout(() => {
            resolve();
        }, 600);
    });
}

// ... 保持 navigateTo 函數不變 ...

// 页面跳转函数 - 带转场动画
window.navigateTo = async function (url) {
    try {
        // 执行转场动画
        await performTransition();
        // 动画完成后跳转
        window.location.href = url;
    } catch (error) {
        console.error('跳转出错:', error);
        // 出错时直接跳转
        window.location.href = url;
    }
};

// 页面加载完成后初始化导航项点击事件
document.addEventListener('DOMContentLoaded', () => {
    // 为导航项添加点击事件
    const navItems = document.querySelectorAll('.nav-item');
    navItems.forEach(item => {
        const url = item.dataset.url;
        if (url) {
            item.addEventListener('click', () => navigateTo(url));
        }
    });

    // 演出图标点击事件
    const performanceIcon = document.querySelector('.performance-icon');
    if (performanceIcon && performanceIcon.hasAttribute('onclick')) {
        // 移除内联事件
        performanceIcon.removeAttribute('onclick');
        // 添加新事件
        performanceIcon.addEventListener('click', () => {
            navigateTo('performance.html');
        });
    }
});

// 在现有script标签内添加以下代码
document.addEventListener('DOMContentLoaded', () => {
    // 显示body
    document.body.classList.add('animate-in');

    // 隐藏过渡元素
    const transitionEl = document.getElementById('transitionElements');
    if (transitionEl) {
        setTimeout(() => {
            transitionEl.classList.add('hidden');
        }, 500);
    }

    // 级联显示页面元素
    const containerChildren = document.querySelectorAll('.container > *');
    containerChildren.forEach((child, index) => {
        setTimeout(() => {
            child.classList.add('animate-in');
        }, 600 + (index * 100)); // 每个元素间隔100ms入场
    });
});