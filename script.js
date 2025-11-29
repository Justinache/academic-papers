// Load papers from live data or fallback to samples
let papers = [];
let filteredPapers = [];

// DOM elements
const searchInput = document.getElementById('searchInput');
const fromMonth = document.getElementById('fromMonth');
const fromYear = document.getElementById('fromYear');
const toMonth = document.getElementById('toMonth');
const toYear = document.getElementById('toYear');
const journalFilter = document.getElementById('journalFilter');
const fieldFilter = document.getElementById('fieldFilter');
const resetBtn = document.getElementById('resetBtn');
const papersContainer = document.getElementById('papersContainer');
const resultCount = document.getElementById('count');
const noResults = document.getElementById('noResults');

// Populate year dropdowns (FROM and TO)
function populateYearFilters() {
    const yearsSet = new Set();

    papers.forEach(paper => {
        const date = new Date(paper.date);
        const year = date.getFullYear();
        if (!isNaN(year)) {
            yearsSet.add(year);
        }
    });

    // Sort years (newest first: 2026, 2025, 2024...)
    const sortedYears = Array.from(yearsSet).sort((a, b) => b - a);

    console.log('Years found:', sortedYears);

    // Populate both FROM and TO year dropdowns
    [fromYear, toYear].forEach(dropdown => {
        // Keep the first "Year" option
        dropdown.innerHTML = '<option value="">Year</option>';

        sortedYears.forEach(year => {
            const option = document.createElement('option');
            option.value = year;
            option.textContent = year;
            dropdown.appendChild(option);
        });
    });

    console.log(`Generated year filters with ${sortedYears.length} years`);
}

// Populate month dropdown based on selected year
function populateMonthDropdown(monthDropdown, yearDropdown) {
    const selectedYear = parseInt(yearDropdown.value);

    // Month names
    const monthNames = [
        'January', 'February', 'March', 'April', 'May', 'June',
        'July', 'August', 'September', 'October', 'November', 'December'
    ];

    // Clear and add "All months" option
    monthDropdown.innerHTML = '<option value="">All months</option>';

    // If year is 2026, start from February (skip January)
    const startMonth = (selectedYear === 2026) ? 1 : 0;

    // Add month options
    for (let i = startMonth; i < 12; i++) {
        const option = document.createElement('option');
        option.value = i + 1; // 1-12
        option.textContent = monthNames[i];
        monthDropdown.appendChild(option);
    }
}

// Update month options when year changes
function setupYearMonthSync() {
    fromYear.addEventListener('change', () => {
        populateMonthDropdown(fromMonth, fromYear);
        fromMonth.value = ''; // Reset month selection
        applyFilters();
    });

    toYear.addEventListener('change', () => {
        populateMonthDropdown(toMonth, toYear);
        toMonth.value = ''; // Reset month selection
        applyFilters();
    });

    // Initial population
    populateMonthDropdown(fromMonth, fromYear);
    populateMonthDropdown(toMonth, toYear);
}

// Clean abstract text - remove HTML/XML tags and entities
function cleanAbstract(abstract) {
    if (!abstract || abstract === 'No abstract available') {
        return '';
    }

    return abstract
        // Remove all XML/HTML tags including jats: tags
        .replace(/<[^>]*>/g, '')
        // Replace common HTML entities
        .replace(/&nbsp;/g, ' ')
        .replace(/&amp;/g, '&')
        .replace(/&lt;/g, '<')
        .replace(/&gt;/g, '>')
        .replace(/&quot;/g, '"')
        .replace(/&#39;/g, "'")
        .replace(/&rsquo;/g, "'")
        .replace(/&lsquo;/g, "'")
        .replace(/&rdquo;/g, '"')
        .replace(/&ldquo;/g, '"')
        // Remove extra whitespace
        .replace(/\s+/g, ' ')
        .trim();
}

// Load papers from JSON file
async function loadPapers() {
    try {
        showLoadingState('Loading latest papers...');

        // Add cache-busting parameter to force fresh data
        const response = await fetch(`papers-data.json?v=${Date.now()}`);

        if (!response.ok) {
            throw new Error('Failed to load papers data');
        }

        const data = await response.json();

        if (data.papers && data.papers.length > 0) {
            papers = data.papers;
            console.log(`Loaded ${papers.length} papers from live data`);
            console.log(`Last updated: ${new Date(data.lastUpdated).toLocaleString()}`);

            // Show update time
            showUpdateTime(data.lastUpdated);

            // Populate year dropdowns and setup month sync
            populateYearFilters();
            setupYearMonthSync();

            // Clean all abstracts
            papers.forEach(paper => {
                if (paper.abstract) {
                    paper.abstract = cleanAbstract(paper.abstract);
                }
            });
        } else {
            throw new Error('No papers in data file');
        }

        filteredPapers = [...papers];
        hideLoadingState();
        renderPapers(papers);

    } catch (error) {
        console.warn('Could not load live data, using sample data:', error.message);

        // Fallback to sample data
        papers = getSampleData();
        filteredPapers = [...papers];
        hideLoadingState();
        renderPapers(papers);
        populateYearFilters();
        setupYearMonthSync();

        showNotification('Using sample data. Live data will be available after first GitHub Actions run.', 'info');
    }
}

// Show when data was last updated
function showUpdateTime(lastUpdated) {
    const updateEl = document.getElementById('updateTime');
    if (updateEl) {
        updateEl.textContent = `Last updated: ${new Date(lastUpdated).toLocaleString()}`;
    }
}

// Show loading state
function showLoadingState(message = 'Loading...') {
    papersContainer.innerHTML = `<div class="loading">${message}</div>`;
}

// Hide loading state
function hideLoadingState() {
    const loadingEl = document.querySelector('.loading');
    if (loadingEl) loadingEl.remove();
}

// Show notification
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.textContent = message;
    document.body.appendChild(notification);

    setTimeout(() => {
        notification.classList.add('fade-out');
        setTimeout(() => notification.remove(), 300);
    }, 5000);
}

// Sample data fallback
function getSampleData() {
    return [
        {
            title: "The Impact of Artificial Intelligence on Labor Markets: Evidence from Manufacturing",
            authors: "Sarah Johnson, Michael Chen, Lisa Anderson",
            journal: "American Economic Review",
            field: "Economics",
            date: "2025-11-15",
            abstract: "This paper examines the effects of AI adoption on employment and wages in manufacturing sectors."
        },
        {
            title: "Climate Change and Economic Growth: A Global Analysis",
            authors: "David Martinez, Emma Thompson",
            journal: "American Economic Review",
            field: "Economics",
            date: "2025-11-08",
            abstract: "We analyze the relationship between climate change indicators and economic growth across countries."
        },
        {
            title: "Universal Basic Income: Experimental Evidence from Finland",
            authors: "Anna Korhonen, Mikko Virtanen",
            journal: "American Economic Review",
            field: "Economics",
            date: "2025-11-01",
            abstract: "Analysis of Finland's UBI experiment and its effects on employment and well-being."
        },
        {
            title: "Network Effects in Digital Platform Markets",
            authors: "Robert Williams, Jennifer Lee, Thomas Zhang",
            journal: "Quarterly Journal of Economics",
            field: "Economics",
            date: "2025-11-20",
            abstract: "Examining how network effects shape competition and pricing in digital platforms."
        },
        {
            title: "Cryptocurrency Market Efficiency and Price Discovery",
            authors: "Alexander Schmidt, Laura Peterson, Marcus Chang",
            journal: "Journal of Finance",
            field: "Finance",
            date: "2025-11-22",
            abstract: "Investigating market efficiency and price formation in cryptocurrency markets."
        },
        {
            title: "ESG Investing and Portfolio Performance: Long-term Evidence",
            authors: "Emily Roberts, Jack Morrison",
            journal: "Journal of Finance",
            field: "Finance",
            date: "2025-11-14",
            abstract: "Examining the long-term performance implications of ESG investment strategies."
        },
        {
            title: "Machine Learning in Credit Risk Assessment",
            authors: "Kevin Anderson, Priya Sharma, Nathan Brooks",
            journal: "Journal of Financial Economics",
            field: "Finance",
            date: "2025-11-25",
            abstract: "Evaluating machine learning models for predicting credit defaults."
        },
        {
            title: "Earnings Management and Audit Quality: New Evidence",
            authors: "Patricia Davis, Richard Thompson, Susan Miller",
            journal: "Journal of Accounting and Economics",
            field: "Accounting",
            date: "2025-11-19",
            abstract: "Investigating the relationship between audit quality and earnings manipulation."
        },
        {
            title: "Blockchain Technology in Accounting Information Systems",
            authors: "Ryan O'Brien, Mei Lin, Gabriel Santos",
            journal: "Journal of Accounting Research",
            field: "Accounting",
            date: "2025-11-23",
            abstract: "Exploring blockchain applications for financial reporting and auditing."
        },
        {
            title: "CRISPR-Based Gene Therapy for Sickle Cell Disease: Clinical Trial Results",
            authors: "Jennifer Walsh, Akira Tanaka, Maria Fernandez, David Singh",
            journal: "Nature",
            field: "Science",
            date: "2025-11-26",
            abstract: "Breakthrough results from clinical trials using CRISPR gene editing to treat sickle cell disease."
        },
        {
            title: "Quantum Computing Achieves Error Correction Milestone",
            authors: "Thomas Mueller, Lisa Zhou, Ahmed Rahman",
            journal: "Nature",
            field: "Science",
            date: "2025-11-20",
            abstract: "Major advancement in quantum error correction enabling more stable quantum computations."
        }
    ];
}

// Initialize the page
async function init() {
    attachEventListeners();
    await loadPapers();
}

// Attach event listeners
function attachEventListeners() {
    // Search functionality - search as you type
    searchInput.addEventListener('keyup', performSearch);
    searchInput.addEventListener('search', performSearch);

    // Month dropdowns (year dropdowns handled in setupYearMonthSync)
    fromMonth.addEventListener('change', applyFilters);
    toMonth.addEventListener('change', applyFilters);

    // Journal and field checkboxes
    journalFilter.querySelectorAll('input[type="checkbox"]').forEach(checkbox => {
        checkbox.addEventListener('change', applyFilters);
    });

    fieldFilter.querySelectorAll('input[type="checkbox"]').forEach(checkbox => {
        checkbox.addEventListener('change', applyFilters);
    });

    resetBtn.addEventListener('click', resetFilters);
}

// Search functionality with highlighting
function performSearch() {
    applyFilters();
}

// Highlight search terms in text
function highlightText(text, searchTerm) {
    if (!searchTerm || searchTerm.trim() === '') {
        return escapeHtml(text);
    }

    const escapedText = escapeHtml(text);
    const regex = new RegExp(`(${escapeHtml(searchTerm)})`, 'gi');
    return escapedText.replace(regex, '<mark class="highlight">$1</mark>');
}

// Filter functionality with date range
function applyFilters() {
    const searchTerm = searchInput.value.toLowerCase().trim();

    // Get date range values
    const fromYearValue = fromYear.value;
    const fromMonthValue = fromMonth.value;
    const toYearValue = toYear.value;
    const toMonthValue = toMonth.value;

    // Get selected journals and fields
    const selectedJournals = Array.from(journalFilter.querySelectorAll('input[type="checkbox"]:checked'))
        .map(cb => cb.value);
    const selectedFields = Array.from(fieldFilter.querySelectorAll('input[type="checkbox"]:checked'))
        .map(cb => cb.value);

    filteredPapers = papers.filter(paper => {
        const paperDate = new Date(paper.date);
        const paperYear = paperDate.getFullYear();
        const paperMonth = paperDate.getMonth() + 1; // 1-12

        // Search match
        const searchMatch = searchTerm === '' ||
            paper.title.toLowerCase().includes(searchTerm) ||
            paper.authors.toLowerCase().includes(searchTerm) ||
            (paper.abstract && paper.abstract.toLowerCase().includes(searchTerm));

        // Date range filtering
        let dateMatch = true;

        // FROM filtering
        if (fromYearValue) {
            const fromY = parseInt(fromYearValue);
            if (fromMonthValue) {
                // Specific month+year
                const fromM = parseInt(fromMonthValue);
                const paperYearMonth = paperYear * 100 + paperMonth;
                const fromYearMonth = fromY * 100 + fromM;
                if (paperYearMonth < fromYearMonth) {
                    dateMatch = false;
                }
            } else {
                // Entire year (any month in that year or later)
                if (paperYear < fromY) {
                    dateMatch = false;
                }
            }
        }

        // TO filtering
        if (dateMatch && toYearValue) {
            const toY = parseInt(toYearValue);
            if (toMonthValue) {
                // Specific month+year
                const toM = parseInt(toMonthValue);
                const paperYearMonth = paperYear * 100 + paperMonth;
                const toYearMonth = toY * 100 + toM;
                if (paperYearMonth > toYearMonth) {
                    dateMatch = false;
                }
            } else {
                // Entire year (any month in that year or earlier)
                if (paperYear > toY) {
                    dateMatch = false;
                }
            }
        }

        // Journal match
        const journalMatch = selectedJournals.length === 0 ||
            selectedJournals.includes(paper.journal);

        // Field match
        const fieldMatch = selectedFields.length === 0 ||
            selectedFields.includes(paper.field);

        return searchMatch && dateMatch && journalMatch && fieldMatch;
    });

    console.log(`Filtered to ${filteredPapers.length} papers`);
    renderPapers(filteredPapers);
}

// Reset all filters
function resetFilters() {
    searchInput.value = '';

    // Reset date range dropdowns
    fromYear.value = '';
    fromMonth.value = '';
    toYear.value = '';
    toMonth.value = '';

    // Reset month dropdowns to default state
    populateMonthDropdown(fromMonth, fromYear);
    populateMonthDropdown(toMonth, toYear);

    // Uncheck all journal and field checkboxes
    document.querySelectorAll('.checkbox-group input[type="checkbox"]').forEach(checkbox => {
        checkbox.checked = false;
    });

    filteredPapers = [...papers];
    renderPapers(papers);
}

// Render papers to the DOM
function renderPapers(papersToRender) {
    console.log(`Rendering ${papersToRender.length} papers`);
    papersContainer.innerHTML = '';

    if (papersToRender.length === 0) {
        console.warn('No papers to render');
        noResults.style.display = 'block';
        const countEl = document.getElementById('count');
        if (countEl) countEl.textContent = '0';
        return;
    }

    noResults.style.display = 'none';
    const countEl = document.getElementById('count');
    if (countEl) countEl.textContent = papersToRender.length;

    papersToRender.forEach(paper => {
        const paperCard = createPaperCard(paper);
        papersContainer.appendChild(paperCard);
    });
}

// Create a paper card element
function createPaperCard(paper) {
    const card = document.createElement('div');
    card.className = 'paper-card';

    // Get paper URL
    const paperUrl = paper.url || (paper.doi ? `https://doi.org/${paper.doi}` : null);

    card.innerHTML = createPaperCardContent(paper, paperUrl);

    return card;
}

// Create paper card content HTML
function createPaperCardContent(paper, paperUrl) {
    const formattedDate = formatDate(paper.date);
    const searchTerm = searchInput.value.trim();

    // Get abstract preview (first 500 characters for better context)
    const abstractText = paper.abstract || '';
    const abstractPreview = abstractText.length > 500
        ? abstractText.substring(0, 500) + '...'
        : abstractText;

    // Only show abstract section if we have one
    const abstractHTML = abstractPreview
        ? `<p class="paper-abstract">${highlightText(abstractPreview, searchTerm)}</p>`
        : '';

    // Action buttons
    const readButton = paperUrl
        ? `<a href="${paperUrl}" target="_blank" rel="noopener noreferrer" class="paper-btn paper-btn-primary" onclick="event.stopPropagation()">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"></path>
                <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"></path>
            </svg>
            Read online
           </a>`
        : '';

    // Escape quotes for JSON data attribute
    const paperData = JSON.stringify({
        title: paper.title,
        authors: paper.authors,
        journal: paper.journal,
        date: paper.date,
        doi: paper.doi,
        url: paperUrl
    }).replace(/"/g, '&quot;');

    return `
        <div class="paper-card-content">
            <div class="paper-type-label">JOURNAL ARTICLE</div>
            <h3 class="paper-title">${highlightText(paper.title, searchTerm)}</h3>
            <p class="paper-authors">${highlightText(paper.authors, searchTerm)}</p>
            <div class="paper-meta">
                <span class="paper-journal">${escapeHtml(paper.journal)}</span>, ${formattedDate}
            </div>
            ${abstractHTML}
        </div>
        <div class="paper-card-actions">
            ${readButton}
            <button class="paper-btn paper-btn-secondary" onclick="showCitation(event, this)" data-paper="${paperData}">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"></path>
                    <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"></path>
                </svg>
                Cite
            </button>
        </div>
    `;
}

// Format date to readable format
function formatDate(dateString) {
    try {
        const options = { year: 'numeric', month: 'long', day: 'numeric' };
        return new Date(dateString).toLocaleDateString('en-US', options);
    } catch {
        return dateString;
    }
}

// Escape HTML to prevent XSS
function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// Show citation modal
function showCitation(event, button) {
    event.stopPropagation();

    const paperData = JSON.parse(button.getAttribute('data-paper').replace(/&quot;/g, '"'));

    // Parse date
    const date = new Date(paperData.date);
    const year = date.getFullYear();

    // Format authors for citation
    const authors = paperData.authors;
    const firstAuthor = authors.split(',')[0].trim();
    const authorCount = authors.split(',').length;

    // Generate citations
    const apaCitation = `${authors} (${year}). ${paperData.title}. <em>${paperData.journal}</em>. ${paperData.doi ? 'https://doi.org/' + paperData.doi : paperData.url || ''}`;

    const mlaCitation = `${authors}. "${paperData.title}." <em>${paperData.journal}</em>, ${year}. ${paperData.doi ? 'https://doi.org/' + paperData.doi : paperData.url || ''}`;

    const chicagoCitation = `${authors}. "${paperData.title}." <em>${paperData.journal}</em> (${year}). ${paperData.doi ? 'https://doi.org/' + paperData.doi : paperData.url || ''}`;

    const bibtexCitation = `@article{${firstAuthor.toLowerCase().replace(/\s+/g, '')}${year},
  title={${paperData.title}},
  author={${authors}},
  journal={${paperData.journal}},
  year={${year}},
  ${paperData.doi ? 'doi={' + paperData.doi + '}' : paperData.url ? 'url={' + paperData.url + '}' : ''}
}`;

    // Create modal
    const modal = document.createElement('div');
    modal.className = 'citation-modal';
    modal.innerHTML = `
        <div class="citation-modal-content">
            <div class="citation-modal-header">
                <h3>Cite this article</h3>
                <button class="citation-modal-close" onclick="this.closest('.citation-modal').remove()">&times;</button>
            </div>
            <div class="citation-modal-body">
                <div class="citation-format">
                    <h4>APA</h4>
                    <p>${apaCitation}</p>
                    <button class="copy-btn" onclick="copyCitation(this, \`${apaCitation.replace(/`/g, '\\`')}\`)">Copy</button>
                </div>
                <div class="citation-format">
                    <h4>MLA</h4>
                    <p>${mlaCitation}</p>
                    <button class="copy-btn" onclick="copyCitation(this, \`${mlaCitation.replace(/`/g, '\\`')}\`)">Copy</button>
                </div>
                <div class="citation-format">
                    <h4>Chicago</h4>
                    <p>${chicagoCitation}</p>
                    <button class="copy-btn" onclick="copyCitation(this, \`${chicagoCitation.replace(/`/g, '\\`')}\`)">Copy</button>
                </div>
                <div class="citation-format">
                    <h4>BibTeX</h4>
                    <pre>${bibtexCitation}</pre>
                    <button class="copy-btn" onclick="copyCitation(this, \`${bibtexCitation.replace(/`/g, '\\`')}\`)">Copy</button>
                </div>
            </div>
        </div>
    `;

    document.body.appendChild(modal);

    // Close on backdrop click
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.remove();
        }
    });
}

// Copy citation to clipboard
function copyCitation(button, text) {
    // Remove HTML tags for plain text copy
    const plainText = text.replace(/<[^>]*>/g, '');

    navigator.clipboard.writeText(plainText).then(() => {
        const originalText = button.textContent;
        button.textContent = 'Copied!';
        button.style.background = 'var(--primary)';

        setTimeout(() => {
            button.textContent = originalText;
            button.style.background = '';
        }, 2000);
    }).catch(err => {
        console.error('Failed to copy:', err);
    });
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', init);

// Advanced Search functionality
let rowCounter = 0;

function openAdvancedSearch() {
    document.getElementById('advancedSearchModal').style.display = 'flex';
}

function closeAdvancedSearch() {
    document.getElementById('advancedSearchModal').style.display = 'none';
}

function addSearchRow() {
    rowCounter++;
    const searchRows = document.getElementById('searchRows');
    
    const newRow = document.createElement('div');
    newRow.className = 'search-row';
    newRow.setAttribute('data-row', rowCounter);
    
    newRow.innerHTML = `
        <div class="search-row-with-boolean">
            <div class="search-field-group">
                <label>BOOLEAN</label>
                <select class="boolean-select">
                    <option value="AND">AND</option>
                    <option value="OR">OR</option>
                    <option value="NOT">NOT</option>
                </select>
            </div>
            <div class="search-field-group">
                <label>TERM(S)</label>
                <input type="text" class="term-input" placeholder="Enter search term">
            </div>
            <div class="search-field-group">
                <label>FIELD</label>
                <select class="field-select">
                    <option value="all">All fields</option>
                    <option value="title">Title</option>
                    <option value="author">Author</option>
                    <option value="abstract">Abstract</option>
                </select>
            </div>
            <button class="remove-row-btn" onclick="removeSearchRow(this)" title="Remove row">
                <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
                    <path d="M2 0a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2H2zm3.354 4.646L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 1 1 .708-.708z"/>
                </svg>
            </button>
        </div>
    `;
    
    searchRows.appendChild(newRow);
}

function removeSearchRow(button) {
    const row = button.closest('.search-row');
    row.remove();
}

function submitAdvancedSearch() {
    const rows = document.querySelectorAll('.search-row');
    const queries = [];
    
    rows.forEach((row, index) => {
        const term = row.querySelector('.term-input').value.trim();
        const field = row.querySelector('.field-select').value;
        const boolean = index > 0 ? row.querySelector('.boolean-select')?.value : null;
        
        if (term) {
            queries.push({ term, field, boolean });
        }
    });
    
    if (queries.length === 0) {
        alert('Please enter at least one search term');
        return;
    }
    
    // Execute the advanced search
    executeAdvancedSearch(queries);
    closeAdvancedSearch();
}

function executeAdvancedSearch(queries) {
    console.log('Advanced search queries:', queries);
    
    filteredPapers = papers.filter(paper => {
        let matches = true;
        
        queries.forEach((query, index) => {
            const { term, field, boolean } = query;
            const lowerTerm = term.toLowerCase();
            
            // Determine which field(s) to search
            let fieldMatch = false;
            
            if (field === 'all') {
                fieldMatch = 
                    paper.title.toLowerCase().includes(lowerTerm) ||
                    paper.authors.toLowerCase().includes(lowerTerm) ||
                    (paper.abstract && paper.abstract.toLowerCase().includes(lowerTerm));
            } else if (field === 'title') {
                fieldMatch = paper.title.toLowerCase().includes(lowerTerm);
            } else if (field === 'author') {
                fieldMatch = paper.authors.toLowerCase().includes(lowerTerm);
            } else if (field === 'abstract') {
                fieldMatch = paper.abstract && paper.abstract.toLowerCase().includes(lowerTerm);
            }
            
            // Apply boolean logic
            if (index === 0) {
                matches = fieldMatch;
            } else {
                if (boolean === 'AND') {
                    matches = matches && fieldMatch;
                } else if (boolean === 'OR') {
                    matches = matches || fieldMatch;
                } else if (boolean === 'NOT') {
                    matches = matches && !fieldMatch;
                }
            }
        });
        
        return matches;
    });
    
    console.log(`Advanced search found ${filteredPapers.length} papers`);
    
    // Also apply current sidebar filters
    applyFilters();
}

// Setup event listeners for advanced search
document.addEventListener('DOMContentLoaded', () => {
    const advancedSearchBtn = document.getElementById('advancedSearchBtn');
    const addRowBtn = document.getElementById('addRowBtn');
    
    if (advancedSearchBtn) {
        advancedSearchBtn.addEventListener('click', openAdvancedSearch);
    }
    
    if (addRowBtn) {
        addRowBtn.addEventListener('click', addSearchRow);
    }
    
    // Close modal when clicking outside
    const modal = document.getElementById('advancedSearchModal');
    if (modal) {
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                closeAdvancedSearch();
            }
        });
    }
});

