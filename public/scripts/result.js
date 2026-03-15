let currentPage = 1;
let totalPages = 0;

function displayPage(pageNumber) {
    const allGames = document.querySelectorAll('.card');
    const countSpan = document.getElementById('per-page-count');
    const popup = document.getElementById('goto-popup');

    popup.style.display = 'none';

    // Safety check for boundaries
    if (pageNumber < 1) pageNumber = 1;
    if (pageNumber > totalPages) pageNumber = totalPages;
    
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

    countSpan.innerHTML = displayCount;
    renderPagination();
    updateActivePagination();
};

// Pagination Section
function updateActivePagination() {
    const allButtons = document.querySelectorAll('.page-item');

    allButtons.forEach(btn => btn.classList.remove('active'));
    allButtons.forEach(btn => {
        if (btn.innerText.trim() == currentPage.toString()) {
            btn.classList.add('active');
        }
    });
};
function renderPagination() {
    const paginationUl = document.querySelector('.pagination');

    let html = '';

    // Opening previous pagination (<<) (<) :
    html += '<li class="page-item"><a class="page-link"><<</a></li>';
    html += '<li class="page-item"><a class="page-link"><</a></li>';

    // Index in between:
    if (totalPages <= 7) {
        // Total page <= 7: Show all
         for (let i=1; i<=7; i++) {
            html += `<li class="page-item"><a class ="page-link">${i}</a></li>`;
         };
    } else {
        // Total page > 7: Sliding window pagination
        if (currentPage <= 4) {
            // Near start: 1 2 3 4 5 ... n
            for (let i = 1; i <= 5; i++) html += `<li class="page-item"><a class ="page-link">${i}</a></li>`;
            html += `<li class="page-item"><a class="page-link" onclick="toggleGotoPopup(event)">...</a></li>`;
            html += `<li class="page-item"><a class ="page-link">${totalPages}</a></li>`;
        } 
        else if (currentPage >= totalPages - 3) {
            // Near end: 1 ... n-4 n-3 n-2 n-1 n
            html += `<li class="page-item"><a class ="page-link">1</a></li>`;
            html += `<li class="page-item"><a class="page-link" onclick="toggleGotoPopup(event)">...</a></li>`;
            for (let i = totalPages - 4; i <= totalPages; i++) {
                html += `<li class="page-item"><a class ="page-link">${i}</a></li>`;
            }
        } 
        else {
            // Middle: 1 ... 4 5 6 ... n
            html += `<li class="page-item"><a class ="page-link">1</a></li>`;
            html += `<li class="page-item"><a class="page-link" onclick="toggleGotoPopup(event)">...</a></li>`;
            html += `<li class="page-item"><a class ="page-link">${currentPage-1}</a></li>`;
            html += `<li class="page-item"><a class ="page-link">${currentPage}</a></li>`;
            html += `<li class="page-item"><a class ="page-link">${currentPage+1}</a></li>`;
            html += `<li class="page-item"><a class="page-link" onclick="toggleGotoPopup(event)">...</a></li>`;
            html += `<li class="page-item"><a class ="page-link">${totalPages}</a></li>`;
        }
    }

    // Closing next pagination (>) (>>) :
    html += `<li class="page-item"><a class ="page-link">></a></li>`;
    html += `<li class="page-item"><a class ="page-link">>></a></li>`;

    paginationUl.innerHTML = html;
}
function toggleGotoPopup(event) {
    event.preventDefault();
    const popup = document.getElementById('goto-popup');
    const dotBtn = event.target;
    
    const rect = dotBtn.getBoundingClientRect();
    
    popup.style.top = `${rect.top + window.scrollY - 120}px`; 
    popup.style.left = `${rect.left + window.scrollX - 50}px`;
    
    popup.style.display = 'block';
    document.getElementById('goto-input').value = currentPage;
}

document.addEventListener('DOMContentLoaded', () => {
    totalPages = Math.ceil(document.querySelectorAll('.card').length/12);

    displayPage(1);

    const paginationList = document.querySelector('.pagination');

    paginationList.addEventListener('click', (e) => {
        const link = e.target.closest('.page-link');

        if (!link || link.innerText.trim() === '...') return;

        const action = link.innerText.trim();

        if (action === '...' || !action) return;
        
        if (action === '<<') {
            displayPage(1);
        } else if (action === '<') {
            if (currentPage>1) {
                displayPage(--currentPage);
            }
        } else if (action === '>') {
            if (currentPage<totalPages) {
                displayPage(++currentPage);
            }
        } else if (action === '>>') { 
            displayPage(totalPages);
        }
        else {
            displayPage(parseInt(action));
        }
    });
});

document.getElementById('goto-submit').addEventListener('click', () => {
    const input = document.getElementById('goto-input');
    const pageNum = parseInt(input.value);
    
    if (pageNum >= 1 && pageNum <= totalPages) {
        displayPage(pageNum);
        document.getElementById('goto-popup').style.display = 'none';
    } else {
        alert(`Please enter a page between 1 and ${totalPages}`);
    }
});