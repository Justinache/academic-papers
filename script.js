// Standalone version - works without backend server
// Sample paper data
const papers = [
    // American Economic Review
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

    // Quarterly Journal of Economics
    {
        title: "Network Effects in Digital Platform Markets",
        authors: "Robert Williams, Jennifer Lee, Thomas Zhang",
        journal: "Quarterly Journal of Economics",
        field: "Economics",
        date: "2025-11-20",
        abstract: "Examining how network effects shape competition and pricing in digital platforms."
    },
    {
        title: "The Gender Wage Gap: Decomposing Discrimination and Human Capital",
        authors: "Maria Garcia, James Wilson",
        journal: "Quarterly Journal of Economics",
        field: "Economics",
        date: "2025-11-12",
        abstract: "A comprehensive analysis of factors contributing to persistent gender wage disparities."
    },

    // Journal of Political Economy
    {
        title: "Taxation and Innovation: Evidence from Patent Data",
        authors: "Christopher Brown, Sophie Martin",
        journal: "Journal of Political Economy",
        field: "Economics",
        date: "2025-11-18",
        abstract: "This study examines how corporate tax policies affect innovation output."
    },
    {
        title: "Healthcare Policy and Life Expectancy: Cross-Country Evidence",
        authors: "Daniel Kim, Rachel Cohen",
        journal: "Journal of Political Economy",
        field: "Economics",
        date: "2025-11-05",
        abstract: "Analyzing the relationship between healthcare spending and life expectancy outcomes."
    },

    // Journal of Finance
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
        title: "Central Bank Digital Currencies: Implications for Monetary Policy",
        authors: "Francesco Rossi, Yuki Tanaka",
        journal: "Journal of Finance",
        field: "Finance",
        date: "2025-11-03",
        abstract: "Analysis of how CBDCs may affect monetary policy transmission mechanisms."
    },

    // Journal of Financial Economics
    {
        title: "Machine Learning in Credit Risk Assessment",
        authors: "Kevin Anderson, Priya Sharma, Nathan Brooks",
        journal: "Journal of Financial Economics",
        field: "Finance",
        date: "2025-11-25",
        abstract: "Evaluating machine learning models for predicting credit defaults."
    },
    {
        title: "Stock Market Reactions to Federal Reserve Announcements",
        authors: "Victoria Chen, Benjamin White",
        journal: "Journal of Financial Economics",
        field: "Finance",
        date: "2025-11-17",
        abstract: "How equity markets respond to Fed policy communications and decisions."
    },
    {
        title: "Private Equity Performance in Emerging Markets",
        authors: "Carlos Silva, Amira Hassan",
        journal: "Journal of Financial Economics",
        field: "Finance",
        date: "2025-11-09",
        abstract: "Analyzing returns and risk factors in emerging market private equity investments."
    },

    // Review of Financial Studies
    {
        title: "High-Frequency Trading and Market Quality",
        authors: "Oliver Parker, Sophia Lee, Lucas Miller",
        journal: "Review of Financial Studies",
        field: "Finance",
        date: "2025-11-21",
        abstract: "Examining the impact of HFT on liquidity, volatility, and price efficiency."
    },
    {
        title: "Corporate Governance and Firm Valuation in Asia",
        authors: "Hiroshi Yamamoto, Grace Wang",
        journal: "Review of Financial Studies",
        field: "Finance",
        date: "2025-11-11",
        abstract: "How governance structures affect firm value in Asian markets."
    },

    // Journal of Accounting and Economics
    {
        title: "Earnings Management and Audit Quality: New Evidence",
        authors: "Patricia Davis, Richard Thompson, Susan Miller",
        journal: "Journal of Accounting and Economics",
        field: "Accounting",
        date: "2025-11-19",
        abstract: "Investigating the relationship between audit quality and earnings manipulation."
    },
    {
        title: "Tax Avoidance Strategies in Multinational Corporations",
        authors: "Hans Mueller, Isabella Rossi",
        journal: "Journal of Accounting and Economics",
        field: "Accounting",
        date: "2025-11-07",
        abstract: "Analysis of tax planning strategies used by global corporations."
    },
    {
        title: "The Role of Non-Financial Disclosure in Investment Decisions",
        authors: "Ahmed Al-Mansour, Claire Dubois",
        journal: "Journal of Accounting and Economics",
        field: "Accounting",
        date: "2025-11-02",
        abstract: "How non-financial information affects investor behavior and firm valuation."
    },

    // Journal of Accounting Research
    {
        title: "Blockchain Technology in Accounting Information Systems",
        authors: "Ryan O'Brien, Mei Lin, Gabriel Santos",
        journal: "Journal of Accounting Research",
        field: "Accounting",
        date: "2025-11-23",
        abstract: "Exploring blockchain applications for financial reporting and auditing."
    },
    {
        title: "CEO Compensation and Firm Performance: A Meta-Analysis",
        authors: "Natalie Anderson, Marcus Johnson",
        journal: "Journal of Accounting Research",
        field: "Accounting",
        date: "2025-11-13",
        abstract: "Comprehensive review of the relationship between executive pay and performance."
    },

    // The Accounting Review
    {
        title: "Internal Controls and Financial Reporting Quality",
        authors: "Elizabeth Taylor, Andrew Kim, Monica Rodriguez",
        journal: "The Accounting Review",
        field: "Accounting",
        date: "2025-11-24",
        abstract: "Examining how internal control systems affect reporting accuracy and reliability."
    },
    {
        title: "Artificial Intelligence in Auditing: Opportunities and Challenges",
        authors: "Peter Nguyen, Sarah O'Connor",
        journal: "The Accounting Review",
        field: "Accounting",
        date: "2025-11-16",
        abstract: "Analysis of AI implementation in audit procedures and quality outcomes."
    },
    {
        title: "Financial Statement Comparability and Capital Market Benefits",
        authors: "Julia Hoffman, Derek Chen",
        journal: "The Accounting Review",
        field: "Accounting",
        date: "2025-11-06",
        abstract: "How accounting comparability affects market liquidity and cost of capital."
    },

    // Nature
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
    },
    {
        title: "Antarctic Ice Sheet Melting Accelerates Beyond Climate Model Predictions",
        authors: "Catherine Brown, Erik Larsen, Yuki Matsuda",
        journal: "Nature",
        field: "Science",
        date: "2025-11-10",
        abstract: "New satellite data reveals faster-than-expected ice loss in Antarctica."
    },
    {
        title: "Neural Networks Replicate Human Decision-Making Patterns",
        authors: "Robert Chang, Emma Wilson, Lucas Dias",
        journal: "Nature",
        field: "Science",
        date: "2025-11-04",
        abstract: "AI systems show remarkable similarity to human cognitive processes in decision-making tasks."
    }
];

// Global state
let filteredPapers = [...papers];

// DOM elements
const searchInput = document.getElementById('searchInput');
const searchBtn = document.getElementById('searchBtn');
const journalFilter = document.getElementById('journalFilter');
const fieldFilter = document.getElementById('fieldFilter');
const resetBtn = document.getElementById('resetBtn');
const papersContainer = document.getElementById('papersContainer');
const resultCount = document.getElementById('count');
const noResults = document.getElementById('noResults');

// Initialize the page
function init() {
    renderPapers(papers);
    attachEventListeners();
}

// Attach event listeners
function attachEventListeners() {
    searchBtn.addEventListener('click', performSearch);
    searchInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') performSearch();
    });
    journalFilter.addEventListener('change', applyFilters);
    fieldFilter.addEventListener('change', applyFilters);
    resetBtn.addEventListener('click', resetFilters);
}

// Search functionality
function performSearch() {
    const searchTerm = searchInput.value.toLowerCase().trim();

    if (searchTerm === '') {
        applyFilters();
        return;
    }

    filteredPapers = papers.filter(paper => {
        const titleMatch = paper.title.toLowerCase().includes(searchTerm);
        const authorMatch = paper.authors.toLowerCase().includes(searchTerm);
        return titleMatch || authorMatch;
    });

    applyFilters();
}

// Filter functionality
function applyFilters() {
    const journalValue = journalFilter.value;
    const fieldValue = fieldFilter.value;
    const searchTerm = searchInput.value.toLowerCase().trim();

    filteredPapers = papers.filter(paper => {
        // Search filter
        const searchMatch = searchTerm === '' ||
            paper.title.toLowerCase().includes(searchTerm) ||
            paper.authors.toLowerCase().includes(searchTerm);

        // Journal filter
        const journalMatch = journalValue === '' || paper.journal === journalValue;

        // Field filter
        const fieldMatch = fieldValue === '' || paper.field === fieldValue;

        return searchMatch && journalMatch && fieldMatch;
    });

    renderPapers(filteredPapers);
}

// Reset all filters
function resetFilters() {
    searchInput.value = '';
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
        resultCount.textContent = 'Showing 0 papers';
        return;
    }

    noResults.style.display = 'none';
    resultCount.textContent = `Showing ${papersToRender.length} paper${papersToRender.length === 1 ? '' : 's'}`;

    papersToRender.forEach(paper => {
        const paperCard = createPaperCard(paper);
        papersContainer.appendChild(paperCard);
    });
}

// Create a paper card element
function createPaperCard(paper) {
    const card = document.createElement('div');
    card.className = 'paper-card';

    const formattedDate = formatDate(paper.date);

    card.innerHTML = `
        <h3 class="paper-title">${paper.title}</h3>
        <p class="paper-authors">${paper.authors}</p>
        <div class="paper-meta">
            <span class="paper-journal">${paper.journal}</span>
            <span class="paper-field">${paper.field}</span>
            <span class="paper-date">Published: ${formattedDate}</span>
        </div>
    `;

    return card;
}

// Format date to readable format
function formatDate(dateString) {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('en-US', options);
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', init);
