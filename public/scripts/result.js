let currentPage = 1;

function displayPage(pageNumber) {
    const allGames = document.querySelectorAll('.card');
    const allButtons = document.querySelectorAll('.page-item');
    const countSpan = document.getElementById('per-page-count');
    
    currentPage = pageNumber;

    let displayCount = 0;
    allGames.forEach((game, index) => {
        if (index >= ((pageNumber-1)*12) && index < (pageNumber*12)) {
            game.style.display = 'block';
            displayCount++;
        } else {
            game.style.display = 'none';
        };
    });

    allButtons.forEach(btn => btn.classList.remove('active'));
    allButtons.forEach(btn => {
        if (btn.innerText.trim() == currentPage.toString()) {
            btn.classList.add('active');
        }
    });

    if (countSpan) countSpan.innerHTML = displayCount;

    countSpan.innerHTML = displayCount;

};
document.addEventListener('DOMContentLoaded', () => {
    const totalPage = Math.ceil(document.querySelectorAll('.card').length/12);
    displayPage(1);
    const pageLinks = document.querySelectorAll('.page-link');

    pageLinks.forEach(link => {
    link.addEventListener('click', (e) => {
        const action = e.target.innerText.trim();
      
        if (action === '<<') {
            displayPage(1);
        } else if (action === '<') {
            if (currentPage>1) {
                displayPage(--currentPage);
            }
        } else if (action === '>') {
            if (currentPage<totalPage) {
                displayPage(++currentPage);
            }
        } else if (action === '>>') { 
            displayPage(totalPage);
        }
        else {
            displayPage(parseInt(action));
            }
        });
        
    });
});