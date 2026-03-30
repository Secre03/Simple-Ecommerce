function fixProductsPadding() {
    const header = document.querySelector('header');
    const searchBar = document.querySelector('.search-bar-section');
    const content = document.querySelector('.products-content-section');

    if (!header || !searchBar || !content) return;

    const totalOffset = header.offsetHeight + searchBar.offsetHeight + 16; // 16px breathing room
    content.style.paddingTop = totalOffset + 'px';
}

window.addEventListener('DOMContentLoaded', fixProductsPadding);
window.addEventListener('resize', fixProductsPadding);