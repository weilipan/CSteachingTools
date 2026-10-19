// layout.js
document.addEventListener("DOMContentLoaded", function() {
    // 淺色版型標頭：白底、深色字、底部加上淡淡的格線與陰影
    const headerHTML = `
        <header style="background-color: #ffffff; color: #24292e; padding: 1rem 2rem; text-align: center; border-bottom: 1px solid #e1e4e8; box-shadow: 0 1px 3px rgba(27,31,35,0.05);">
            <h1 style="margin: 0; font-size: 1.5rem; font-weight: 600;">
                <a href="https://weilipan.github.io/CSteachingTools/" 
                   style="color: #24292e; text-decoration: none; transition: color 0.2s ease-in-out;" 
                   onmouseover="this.style.color='#0366d6'" 
                   onmouseout="this.style.color='#24292e'">
                   基礎程式視覺化模擬網站
                </a>
            </h1>
        </header>
    `;

    // 頁尾維持原樣（原本的設計就已經是淺色友善的 #fafbfc）
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