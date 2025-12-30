        /* 
         * DOM元素緩存管理
         * 集中存儲常用DOM元素引用，避免重複查詢
         */
        const domCache = {
            navItems: document.querySelectorAll('.nav-item'),
            sub2Image: document.querySelector('.howdo-image.sub2'),
            howdoModal: document.getElementById('howdoModal'),
            closeBtn: document.querySelector('.howdo-modal-close'),
            progressBar: document.getElementById('progressBar'),
            navigation: document.getElementById('navigation'),
            problemSection: document.getElementById('problemSection'),
            dataArtSection: document.querySelector('.data-art-section'),
            techRingContainer: document.querySelector('.tech-ring-container')
        };

        /* 
         * 導航功能實現
         * 為所有導航項添加點擊事件，實現頁面跳轉
         */
        domCache.navItems.forEach(item => {
            const url = item.dataset.url;
            if (url) {
                item.addEventListener('click', () => navigateTo(url));
            }
        });
        // 获取所有导航项
        const navItems = document.querySelectorAll('.menu-nav-item');

        // 为每个导航项添加点击事件
        const menuNavItems = document.querySelectorAll('.menu-nav-item');
        menuNavItems.forEach(item => {
            item.addEventListener('click', function () {
                const targetUrl = this.getAttribute('data-url');
                if (targetUrl) {
                    navigateTo(targetUrl); // 呼叫帶有動畫的函數
                }
            });
        });


        /* 
         * 操作提示彈窗交互
         * 實現彈窗的顯示/隱藏功能，包括點擊關閉按鈕、點擊外部區域和ESC鍵關閉
         */
        if (domCache.sub2Image && domCache.howdoModal && domCache.closeBtn) {
            const toggleModal = (show) => {
                domCache.howdoModal.classList.toggle('active', show);
                document.body.style.overflow = show ? 'hidden' : '';
            };

            domCache.sub2Image.addEventListener('click', (e) => {
                e.stopPropagation();
                toggleModal(true);
            });

            domCache.closeBtn.addEventListener('click', () => toggleModal(false));
            domCache.howdoModal.addEventListener('click', (e) => {
                if (e.target === domCache.howdoModal) toggleModal(false);
            });
            document.addEventListener('keydown', (e) => {
                if (e.key === 'Escape' && domCache.howdoModal.classList.contains('active')) {
                    toggleModal(false);
                }
            });
        }

        /* 
         * 導航項亂碼動畫功能
         * 實現導航項懸停時的文字亂碼效果，使用緩存池優化性能
         */
        const chineseChars = '神明測⊠∎不要試影響是我ｱｲｳｴｵ回來崑斤烤';
        const englishChars = 'abcIJK∎LMNOVWXYZ12340!@#$%^&*()';

        // 預生成亂碼文本緩存池
        const glitchCache = new Map();
        function generateGlitchText(length, isChinese) {
            const cacheKey = `${length}-${isChinese}`;
            if (glitchCache.has(cacheKey)) {
                const cache = glitchCache.get(cacheKey);
                if (cache.length > 0) {
                    return cache.pop();
                }
            }

            const chars = isChinese ? chineseChars : englishChars;
            const result = [];
            const cache = [];
            for (let i = 0; i < length; i++) {
                result.push(Math.random() > 0.7 ? ' ' : chars[Math.floor(Math.random() * chars.length)]);
            }
            for (let i = 0; i < 5; i++) {
                const cacheItem = [];
                for (let j = 0; j < length; j++) {
                    cacheItem.push(Math.random() > 0.7 ? ' ' : chars[Math.floor(Math.random() * chars.length)]);
                }
                cache.push(cacheItem.join(''));
            }
            glitchCache.set(cacheKey, cache);

            return result.join('');
        }

        // 為每個導航項創建獨立控制器
        domCache.navItems.forEach(item => {
            const link = item.querySelector('.nav-link');
            const eng = item.querySelector('.nav-eng');
            if (!link || !eng || !link.dataset.original || !eng.dataset.original) return;

            const originalLink = link.dataset.original;
            const originalEng = eng.dataset.original;

            // 將計時器存儲在元素物件上，避免閉包變數衝突
            item.timers = {
                link: null,
                eng: null,
                stopTimeout: null,
                delayTimeout: null
            };

            const clearAllTimers = () => {
                clearInterval(item.timers.link);
                clearInterval(item.timers.eng);
                clearTimeout(item.timers.stopTimeout);
                clearTimeout(item.timers.delayTimeout);
                item.timers.link = null;
                item.timers.eng = null;
                item.timers.stopTimeout = null;
                item.timers.delayTimeout = null;
            };

            const stopGlitch = () => {
                clearAllTimers();
                link.textContent = originalLink;
                eng.textContent = originalEng;
                link.classList.remove('text-glitch');
                eng.classList.remove('text-glitch');
                link.style.color = '';
                eng.style.color = '';
            };

            const startGlitch = () => {
                // 啟動前先徹底清除舊的，防止疊加
                clearAllTimers();

                link.classList.add('text-glitch');
                eng.classList.add('text-glitch');

                // 1. 啟動中文亂碼
                item.timers.link = setInterval(() => {
                    link.textContent = generateGlitchText(originalLink.length, true);
                    link.style.color = Math.random() > 0.7 ? '#ffd700' : '';
                }, 80);

                // 2. 延遲啟動英文亂碼
                item.timers.delayTimeout = setTimeout(() => {
                    item.timers.eng = setInterval(() => {
                        eng.textContent = generateGlitchText(originalEng.length, false);
                        eng.style.color = Math.random() > 0.7 ? '#fff' : '';
                    }, 100);
                }, 50);

                // 3. 設定自動停止 (800ms 後)
                item.timers.stopTimeout = setTimeout(stopGlitch, 800);
            };

            item.addEventListener('mouseenter', startGlitch);
            item.addEventListener('mouseleave', stopGlitch);
        });

        /* 
         * 滑鼠跟蹤視差效果
         * 跟蹤滑鼠移動，實現頁面元素的視差動畫效果，增強頁面深度感
         */
        const mouse = { x: 0, y: 0 }; // 游標位置
        const pos = { x: 0, y: 0 }; // 跟蹤到達位置
        const navigation = document.getElementById('navigation');
        const problemSection = document.getElementById('problemSection');
        const dataArtSection = document.getElementById('dataArtSection');
        const techRingContainer = document.querySelector('.tech-ring-container');
        const desktop = document.getElementById('desktop');
        const desktopItems = document.querySelector('.desktop-items');
        const windowFrame = document.querySelector('.window-frame');
        const ruinsContainers = document.querySelectorAll('.ruins-container');
        const desertContainers = document.querySelectorAll('.desert-container');

        // 監聽滑鼠移動
        document.querySelector('body').addEventListener('mousemove', ({ x, y }) => {
            mouse.x = x;
            mouse.y = y;
        });

        // 計算視差偏移值 - 增大最大偏移範圍
        function calcValue(a, b) {
            const range = 80; // 最大偏移範圍
            return (a / b) * range - range / 2;
        }

        // 動畫循環
        function movement() {
            const easting = 5; // 緩動係數
            pos.x += (mouse.x - pos.x) / easting;
            pos.y += (mouse.y - pos.y) / easting;

            const xValue = calcValue(pos.x, window.innerWidth);
            const yValue = calcValue(pos.y, window.innerHeight);

            // 原有元素視差
            navigation.style.transform = `skewX(-10deg) rotate(1deg) translate3d(${xValue * 0.3}px, ${yValue * 0.3}px, 0) rotateX(${yValue * 0.15}deg) rotateY(${xValue * 0.15}deg)`;
            problemSection.style.transform = `translateX(4vw) skewX(2deg) rotate(0deg) translate3d(${xValue * 0.4}px, ${yValue * 0.4}px, 0) rotateX(${yValue * 0.2}deg) rotateY(${xValue * 0.2}deg)`;
            dataArtSection.style.transform = `translateX(2vw) skewX(-5deg) translate3d(${xValue * 0.5}px, ${yValue * 0.5}px, 0) rotateX(${yValue * 0.25}deg) rotateY(${xValue * 0.25}deg)`;
            techRingContainer.style.transform = `translate(-50%, -50%) translate3d(${xValue * 0.2}px, ${yValue * 0.2}px, 0)`;

            // 新增桌面視差效果
            if (desktop) {
                desktop.style.transform = `translate3d(${xValue * 0.1}px, ${yValue * 0.1}px, 0) rotateX(${yValue * 0.05}deg) rotateY(${xValue * 0.05}deg)`;
            }

            // 新增桌面物品視差效果（比桌面稍強）
            if (desktopItems) {
                desktopItems.style.transform = `translate3d(${xValue * 0.15}px, ${yValue * 0.1}px, 0)`;
            }

            // 新增窗框視差效果（提高係數增強視差效果）
            if (windowFrame) {
                windowFrame.style.transform = `translateY(-10%) translate3d(${-xValue * 0.2}px, ${-yValue * 0.1}px, 0)`;
            }
            // 廢墟圖層 - 使用中等視差係數
            ruinsContainers.forEach((container, index) => {
                windowFrame.style.transform = `translateY(-10%) translate3d(${-xValue * 0.2}px, ${-yValue * 0.05}px, 0)`;
            });

            // 沙漠圖層 - 使用較小的視差係數，營造更遠的距離感
            desertContainers.forEach((container, index) => {
                windowFrame.style.transform = `translateY(-10%) translate3d(${-xValue * 0.2}px, ${-yValue * 0.05}px, 0)`;
            });

            requestAnimationFrame(movement);
        }

        // 啟動動畫
        const animationFrameId = requestAnimationFrame(movement);
        // 頁面卸載時停止動畫
        window.addEventListener('beforeunload', () => {
            if (animationFrameId) {
                cancelAnimationFrame(animationFrameId);
            }
        });  

                function delayedRedirect(url, target, delay) {
          // 獲取連結元素
          var link = document.querySelector('a[href="'+url+'"]');
          if (link) {
            // 阻止預設的點擊跳轉行為
            event.preventDefault();
            // 設定延時
            setTimeout(function() {
              window.open(url,target) // 手動跳轉
            }, delay * 1000); // delay 單位是秒，轉換為毫秒
          }
        }
