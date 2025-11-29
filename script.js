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

// Generate month checkboxes based on paper dates
function generateMonthFilter() {
    const monthsMap = new Map();

    papers.forEach(paper => {
        const date = new Date(paper.date);
        if (isNaN(date.getTime())) {
            console.warn('Invalid date for month filter:', paper.title, paper.date);
            return;
        }

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

    console.log('Months found:', sortedMonths.map(m => m.name));

    // Clear existing checkboxes
    monthFilter.innerHTML = '';

    sortedMonths.forEach(month => {
        const label = document.createElement('label');
        label.className = 'filter-checkbox';

        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.value = month.key;
        checkbox.addEventListener('change', applyFilters);

        const span = document.createElement('span');
        span.textContent = month.name;

        label.appendChild(checkbox);
        label.appendChild(span);
        monthFilter.appendChild(label);
    });

    console.log(`Generated ${sortedMonths.length} month filters`);
}

// Generate year checkboxes based on paper dates
function generateYearFilter() {
    const yearsSet = new Set();

    papers.forEach(paper => {
        const date = new Date(paper.date);
        const year = date.getFullYear();
        if (!isNaN(year)) {
            yearsSet.add(year);
        } else {
            console.warn('Invalid date for paper:', paper.title, paper.date);
        }
    });

    // Sort years (newest first)
    const sortedYears = Array.from(yearsSet).sort((a, b) => b - a);

    console.log('Years found:', sortedYears);

    // Clear existing checkboxes
    yearFilter.innerHTML = '';

    sortedYears.forEach(year => {
        const label = document.createElement('label');
        label.className = 'filter-checkbox';

        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.value = year;
        checkbox.addEventListener('change', applyFilters);

        const span = document.createElement('span');
        span.textContent = year;

        label.appendChild(checkbox);
        label.appendChild(span);
        yearFilter.appendChild(label);
    });

    console.log(`Generated ${sortedYears.length} year filters`);
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

    // Journal and field checkboxes (year/month added dynamically)
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

// Filter functionality
function applyFilters() {
    // Get checked values from each filter group
    const selectedYears = Array.from(yearFilter.querySelectorAll('input[type="checkbox"]:checked'))
        .map(cb => cb.value);

    const selectedMonths = Array.from(monthFilter.querySelectorAll('input[type="checkbox"]:checked'))
        .map(cb => cb.value);

    const selectedJournals = Array.from(journalFilter.querySelectorAll('input[type="checkbox"]:checked'))
        .map(cb => cb.value);

    const selectedFields = Array.from(fieldFilter.querySelectorAll('input[type="checkbox"]:checked'))
        .map(cb => cb.value);

    const searchTerm = searchInput.value.toLowerCase().trim();

    filteredPapers = papers.filter(paper => {
        // Search match (title, authors, abstract)
        const searchMatch = searchTerm === '' ||
            paper.title.toLowerCase().includes(searchTerm) ||
            paper.authors.toLowerCase().includes(searchTerm) ||
            (paper.abstract && paper.abstract.toLowerCase().includes(searchTerm));

        // Year match - if any years selected, paper must match one of them
        const yearMatch = selectedYears.length === 0 ||
            selectedYears.includes(new Date(paper.date).getFullYear().toString());

        // Month match - if any months selected, paper must match one of them
        let monthMatch = true;
        if (selectedMonths.length > 0) {
            const paperDate = new Date(paper.date);
            const paperMonthYear = `${paperDate.getFullYear()}-${String(paperDate.getMonth() + 1).padStart(2, '0')}`;
            monthMatch = selectedMonths.includes(paperMonthYear);
        }

        // Journal match - if any journals selected, paper must match one of them
        const journalMatch = selectedJournals.length === 0 ||
            selectedJournals.includes(paper.journal);

        // Field match - if any fields selected, paper must match one of them
        const fieldMatch = selectedFields.length === 0 ||
            selectedFields.includes(paper.field);

        // All filter categories must match (AND logic between categories, OR within categories)
        return searchMatch && journalMatch && fieldMatch && yearMatch && monthMatch;
    });

    renderPapers(filteredPapers);
}

// Reset all filters
function resetFilters() {
    searchInput.value = '';

    // Uncheck all checkboxes
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
