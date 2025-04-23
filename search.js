let allData = []; // to store the filtered/modified data.
let originalData = []; // to store the data received from the server.
let currentPage = 1;
let rowsPerPage = 25;

function performSearch(event) {
    event.preventDefault();
    
    const search = document.getElementById('searchInput').value;
    const gene = document.getElementById('geneSelect').value;

    if (!search || !gene) {
        const errorMessage = document.getElementById('errorMessage');
        errorMessage.textContent = '';
        if (!search.value.trim()) {
            errorMessage.textContent = 'Please fill the search column';
        } else if (!gene.value) {
            errorMessage.textContent = 'Please select a gene';
        }
        return;
    }

    fetch(`backend.php?search=${encodeURIComponent(search)}&gene=${encodeURIComponent(gene)}`)
        .then(response => response.json())
        .then(result => {
            allData = result.data;
            originalData = [...allData];
            if (allData.length > 0) {
                document.getElementById('resultsContainer').style.display = 'block';
                document.getElementById('noResultsMessage').style.display = 'none';
                currentPage = 1;
                displayResults();
            } else {
                document.getElementById('resultsContainer').style.display = 'none';
                document.getElementById('noResultsMessage').style.display = 'block';
            }
        })
        .catch(error => console.error('Error:', error));
}

function displayResults() {
    const tableBody = document.querySelector('#resultsTable tbody');
    tableBody.innerHTML = '';

    const start = (currentPage - 1) * rowsPerPage;
    const end = start + rowsPerPage;
    const pageData = allData.slice(start, end);

    pageData.forEach(row => {
        const tr = document.createElement('tr');
        ['Gene', 'Pop', 'HGVS_NP', 'dbSNP', 'ACMG_Classification'].forEach(key => {
            const td = document.createElement('td');
            td.textContent = row[key];
            tr.appendChild(td);
        });
        tableBody.appendChild(tr);
    });

    updatePageInfo();
}

function updatePageInfo() {
    const totalPages = Math.ceil(allData.length / rowsPerPage);
    document.getElementById('pageInfo').textContent = `Page ${currentPage} of ${totalPages}`;
}

function changePage(direction) {
    const newPage = currentPage + direction;
    if (newPage > 0 && newPage <= Math.ceil(allData.length / rowsPerPage)) {
        currentPage = newPage;
        displayResults();
    }
}

function changeRowsPerPage() {
    rowsPerPage = parseInt(document.getElementById('rowsPerPage').value);
    currentPage = 1;
    displayResults();
}

function searchTable() {
    const searchTerm = document.getElementById('tableSearch').value.toLowerCase();
    
    if (searchTerm === "") {
        allData = [...originalData]; // Reset to original data
    } else {
        allData = originalData.filter(row => 
            Object.values(row).some(value => 
                value.toLowerCase().includes(searchTerm)
            )
        );
    }

    currentPage = 1;
    displayResults();
}

//function to populate search input field when each button is pressed
function fillSearch(text) {
    document.getElementById('searchInput').value = text;
}

document.getElementById('searchForm').addEventListener('submit', performSearch);