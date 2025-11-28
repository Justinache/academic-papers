// Load papers from live data or fallback to samples
let papers = [];
let filteredPapers = [];

// DOM elements
const searchInput = document.getElementById('searchInput');
const yearFilter = document.getElementById('yearFilter');
const monthFilter = document.getElementById('monthFilter');
const journalFilter = document.getElementById('journalFilter');
const fieldFilter = document.getElementById('fieldFilter');
const resetBtn = document.getElementById('resetBtn');
const papersContainer = document.getElementById('papersContainer');
const resultCount = document.getElementById('count');
const noResults = document.getElementById('noResults');

// Generate month dropdown options based on paper dates
function generateMonthFilter() {
    const monthsMap = new Map();

    papers.forEach(paper => {
        const date = new Date(paper.date);
        const monthYear = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;

        if (!monthsMap.has(monthYear)) {
            const monthName = date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
            monthsMap.set(monthYear, {
                key: monthYear,
                name: monthName,
                date: date.getTime()
            });
        }
    });

    // Sort months by date (newest first)
    const sortedMonths = Array.from(monthsMap.values())
        .sort((a, b) => b.date - a.date);

    // Clear existing options except "All Months"
    monthFilter.innerHTML = '<option value="">All Months</option>';

    sortedMonths.forEach(month => {
        const option = document.createElement('option');
        option.value = month.key;
        option.textContent = month.name;
        monthFilter.appendChild(option);
    });
}

// Generate year dropdown options based on paper dates
function generateYearFilter() {
    const yearsSet = new Set();

    papers.forEach(paper => {
        const date = new Date(paper.date);
        const year = date.getFullYear();
        yearsSet.add(year);
    });

    // Sort years (newest first)
    const sortedYears = Array.from(yearsSet).sort((a, b) => b - a);

    // Clear existing options except "All Years"
    yearFilter.innerHTML = '<option value="">All Years</option>';

    sortedYears.forEach(year => {
        const option = document.createElement('option');
        option.value = year;
        option.textContent = year;
        yearFilter.appendChild(option);
    });
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

        const response = await fetch('papers-data.json');

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

            // Generate year and month filter dropdowns
            generateYearFilter();
            generateMonthFilter();

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
        generateYearFilter();
        generateMonthFilter();

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

    yearFilter.addEventListener('change', applyFilters);
    monthFilter.addEventListener('change', applyFilters);
    journalFilter.addEventListener('change', applyFilters);
    fieldFilter.addEventListener('change', applyFilters);
    resetBtn.addEventListener('click', resetFilters);
}

// Search functionality with highlighting
function performSearch() {
    const searchTerm = searchInput.value.toLowerCase().trim();

    if (searchTerm === '') {
        applyFilters();
        return;
    }

    filteredPapers = papers.filter(paper => {
        const titleMatch = paper.title.toLowerCase().includes(searchTerm);
        const authorMatch = paper.authors.toLowerCase().includes(searchTerm);
        const abstractMatch = paper.abstract && paper.abstract.toLowerCase().includes(searchTerm);
        return titleMatch || authorMatch || abstractMatch;
    });

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

// Filter functionality
function applyFilters() {
    const yearValue = yearFilter.value;
    const monthValue = monthFilter.value;
    const journalValue = journalFilter.value;
    const fieldValue = fieldFilter.value;
    const searchTerm = searchInput.value.toLowerCase().trim();

    filteredPapers = papers.filter(paper => {
        // Search match (title, authors, abstract)
        const searchMatch = searchTerm === '' ||
            paper.title.toLowerCase().includes(searchTerm) ||
            paper.authors.toLowerCase().includes(searchTerm) ||
            (paper.abstract && paper.abstract.toLowerCase().includes(searchTerm));

        // Journal match
        const journalMatch = journalValue === '' || paper.journal === journalValue;

        // Field match
        const fieldMatch = fieldValue === '' || paper.field === fieldValue;

        // Year match
        let yearMatch = true;
        if (yearValue !== '') {
            const paperDate = new Date(paper.date);
            const paperYear = paperDate.getFullYear();
            yearMatch = paperYear.toString() === yearValue;
        }

        // Month match
        let monthMatch = true;
        if (monthValue !== '') {
            const paperDate = new Date(paper.date);
            const paperMonthYear = `${paperDate.getFullYear()}-${String(paperDate.getMonth() + 1).padStart(2, '0')}`;
            monthMatch = paperMonthYear === monthValue;
        }

        // All filters must match (AND logic for multiple filters)
        return searchMatch && journalMatch && fieldMatch && yearMatch && monthMatch;
    });

    renderPapers(filteredPapers);
}

// Reset all filters
function resetFilters() {
    searchInput.value = '';
    yearFilter.value = '';
    monthFilter.value = '';
    journalFilter.value = '';
    fieldFilter.value = '';

    filteredPapers = [...papers];
    renderPapers(papers);
}

// Render papers to the DOM
function renderPapers(papersToRender) {
    papersContainer.innerHTML = '';

    if (papersToRender.length === 0) {
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
    const card = document.createElement('a');
    card.className = 'paper-card';

    // Set URL - use paper.url if available, otherwise use DOI or fallback
    if (paper.url) {
        card.href = paper.url;
    } else if (paper.doi) {
        card.href = `https://doi.org/${paper.doi}`;
    } else {
        // If no URL available, make it not clickable
        const div = document.createElement('div');
        div.className = 'paper-card';
        div.style.cursor = 'default';
        div.innerHTML = createPaperCardContent(paper);
        return div;
    }

    card.target = '_blank';
    card.rel = 'noopener noreferrer';

    card.innerHTML = createPaperCardContent(paper);

    return card;
}

// Create paper card content HTML
function createPaperCardContent(paper) {
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

    return `
        <h3 class="paper-title">${highlightText(paper.title, searchTerm)}</h3>
        <p class="paper-authors">${highlightText(paper.authors, searchTerm)}</p>
        <div class="paper-meta">
            <span class="paper-journal">${escapeHtml(paper.journal)}</span>
            <span class="paper-date">${formattedDate}</span>
        </div>
        ${abstractHTML}
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

// Initialize on page load
document.addEventListener('DOMContentLoaded', init);
