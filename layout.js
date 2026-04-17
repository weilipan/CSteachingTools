// layout.js
document.addEventListener("DOMContentLoaded", function() {
    // 這裡我們直接在 <a> 標籤內加入 onmouseover 與 onmouseout 事件
    // 完全不依賴或更動任何 CSS 檔案，保證只影響這個特定的標題連結
    const headerHTML = `
        <header style="background-color: #24292e; color: white; padding: 1rem 2rem; text-align: center; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
            <h1 style="margin: 0; font-size: 1.5rem; font-weight: 600;">
                <a href="https://weilipan.github.io/CSteachingTools/" 
                   style="color: white; text-decoration: none; transition: color 0.2s ease-in-out;" 
                   onmouseover="this.style.color='yellow'" 
                   onmouseout="this.style.color='white'">
                   基礎程式視覺化模擬網站
                </a>
            </h1>
        </header>
    `;

    // 定義全站共用的頁尾
    const footerHTML = `
        <footer style="text-align: center; padding: 30px 20px; color: var(--text-muted, #586069); font-size: 0.9rem; border-top: 1px solid var(--border-color, #e1e4e8); margin-top: 50px; background-color: #fafbfc;">
            &copy; 2026 建中資訊科潘威歷師程式語言教學庫
        </footer>
    `;

    // 將標頭插入到 body 的最前面
    document.body.insertAdjacentHTML('afterbegin', headerHTML);
    // 將頁尾插入到 body 的最後面
    document.body.insertAdjacentHTML('beforeend', footerHTML);
});