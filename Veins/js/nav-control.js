
document.addEventListener("DOMContentLoaded", () => {
    // 1. 抓取 DOM 元素
    const toggleCheckbox = document.getElementById("toggle-menu");
    const container1 = document.querySelector(".container-01");
    const container2 = document.querySelector(".container-02");
    
    // 定義兩個列表的狀態管理
    // listElement: 該列表的 DOM
    // currentIndex: 該列表目前選到第幾個
    // id: 用於除錯或特定邏輯
    const listManagers = [
        {
            id: 1,
            container: container1,
            list: container1.querySelector(".list"),
            items: container1.querySelectorAll(".log-button"),
            currentIndex: 0
        },
        {
            id: 2,
            container: container2,
            list: container2.querySelector(".list"),
            items: container2.querySelectorAll(".log-button"),
            currentIndex: 1
        }
    ];

    /* 核心渲染函式：只負責更新傳入的那一個 List manager */
    function updateListVisual(manager) {
        const { list, items, currentIndex, container } = manager;
        
        // A. 計算整個 List 的 translateY (置中邏輯)
        if (items[currentIndex]) {
            let offsetY = container.offsetHeight / 2 - items[currentIndex].offsetHeight / 2;
            // 扣掉當前項目前面所有項目的高度
            for (let i = 0; i < currentIndex; i++) {
                offsetY -= items[i].offsetHeight;
            }
            list.style.transform = `translateY(${offsetY}px)`;
        }

        // B. 處理個別按鈕的 3D 樣式
        items.forEach((item, i) => {
            const dist = Math.abs(i - currentIndex);
            
            // 參數設定
            const scale = 1.2 - dist * 0.2;
            const opacity = 1 - dist * 0.2;
            const zindex = 100 - dist;
            const xOffset = dist * 25; // 往右縮排
            const yOffset = 10 - dist;
            
            // 樣式套用
            item.style.opacity = Math.max(opacity, 0);
            item.style.zIndex = zindex;
            item.style.transform = `translateX(${-1 * xOffset}px) 
                                    translateY(${yOffset}px)
                                    scale(${Math.max(scale, 0.6)})`;

            // Active Class 與 Checkbox 同步
            if (i === currentIndex) {
                item.classList.add("active");
                
                // 先取得現在 toggle 是開還是關 (true 為第二頁, false 為第一頁)
                const toggleCheckbox = document.getElementById("toggle-menu");
                const isSecondPage = toggleCheckbox.checked;

                // 判斷現在這個 manager 是不是「當前頁面」的主角？
                // manager.id === 1 代表第一頁
                // manager.id === 2 代表第二頁
                const isCurrentActiveManager = (manager.id === 1 && !isSecondPage) || (manager.id === 2 && isSecondPage);

                const forId = item.getAttribute("for"); 
                
                // 只有當他是「當前頁面的主角」時，才允許去勾選 Radio
                if (forId && isCurrentActiveManager) {
                    const targetCheckbox = document.getElementById(forId);
                    if (targetCheckbox) targetCheckbox.checked = true;
                }

        } else {
            item.classList.remove("active");
            // Radio 不需要手動 remove checked，所以 else 這裡保持這樣就好
        }
        });
    }

    /**
     * 初始化：兩個選單都先渲染一次
     */
    listManagers.forEach(manager => updateListVisual(manager));


    /**
     * 滾輪事件監聽 (綁定在 window 或 document 上)
     * 根據 toggle-menu 的狀態決定控制哪一個列表
     */
    window.addEventListener("wheel", (e) => {
        // 判斷目前是哪一個 Container 被顯示
        // 如果 checkbox 被勾選，代表顯示 Container 2 (Index 1)
        // 如果沒勾選，代表顯示 Container 1 (Index 0)
        const activeManagerIndex = toggleCheckbox.checked ? 1 : 0;
        const currentManager = listManagers[activeManagerIndex];

        if (e.deltaY > 0) {
            currentManager.currentIndex++;
        } else {
            currentManager.currentIndex--;
        }

        // 限制範圍 (0 ~ length-1)
        const maxIndex = currentManager.items.length - 1;
        currentManager.currentIndex = Math.max(0, Math.min(maxIndex, currentManager.currentIndex));

        // 更新畫面
        updateListVisual(currentManager);
    });

    /**
     * 點擊切換事件
     * 分別對兩個列表的按鈕綁定
     */
    listManagers.forEach(manager => {
        manager.items.forEach((item, index) => {
            item.addEventListener("click", (e) => {
                e.preventDefault(); // 防止 label 點擊的預設跳動
                
                // 更新該列表的索引
                manager.currentIndex = index;
                updateListVisual(manager);
            });
        });
    });

    // 額外功能：當切換 toggle-menu 時，自動觸發一次當前列表的渲染
    // 確保內容（右邊的文字圖案）有正確同步回來
    toggleCheckbox.addEventListener("change", () => {
        const activeManagerIndex = toggleCheckbox.checked ? 1 : 0;
        updateListVisual(listManagers[activeManagerIndex]);
    });
});