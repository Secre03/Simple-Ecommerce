function fixContentPadding() {
    const header = document.querySelector('header');
    const searchBar = document.querySelector('.search-bar-section');

    const content =
        document.querySelector('.products-content-section') ||
        document.querySelector('.orders-main-section') ||
        document.querySelector('.tracking-main-section');

    if (!header || !searchBar || !content) return;

    const totalOffset = header.offsetHeight + searchBar.offsetHeight + 16;
    content.style.paddingTop = totalOffset + 'px';
}

window.addEventListener('DOMContentLoaded', fixContentPadding);
window.addEventListener('resize', fixContentPadding);