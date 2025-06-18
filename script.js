
// Global variables
let highContrastMode = false;
let fontSizeLevel = 0;
let screenReaderMode = false;

// DOM Content Loaded
document.addEventListener('DOMContentLoaded', function() {
    initializeNavigation();
    initializeAccessibility();
    initializeCalculator();
    initializeSuppliers();
    initializeForum();
    initializeVideos();
    
    // Load saved accessibility preferences
    loadAccessibilityPreferences();
    
    // Add keyboard navigation support
    addKeyboardSupport();
});

// Navigation
function initializeNavigation() {
    const navToggle = document.querySelector('.nav-toggle');
    const navMenu = document.querySelector('.nav-menu');
    
    if (navToggle && navMenu) {
        navToggle.addEventListener('click', function() {
            navMenu.classList.toggle('active');
            const isExpanded = navMenu.classList.contains('active');
            navToggle.setAttribute('aria-expanded', isExpanded);
        });
        
        // Close menu when clicking on a link
        const navLinks = document.querySelectorAll('.nav-menu a');
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                navMenu.classList.remove('active');
                navToggle.setAttribute('aria-expanded', 'false');
            });
        });
    }
}

// Smooth scrolling function
function scrollToSection(sectionId) {
    const section = document.getElementById(sectionId);
    if (section) {
        section.scrollIntoView({ 
            behavior: 'smooth',
            block: 'start'
        });
        
        // Set focus to section for screen readers
        section.setAttribute('tabindex', '-1');
        section.focus();
        
        // Announce to screen readers
        announceToScreenReader(`Navegando para a seção ${section.querySelector('h1, h2, h3')?.textContent || sectionId}`);
    }
}

// Accessibility Functions
function initializeAccessibility() {
    const accessibilityToggle = document.getElementById('accessibility-toggle');
    const accessibilityControls = document.getElementById('accessibility-controls');
    
    if (accessibilityToggle && accessibilityControls) {
        accessibilityToggle.addEventListener('click', function() {
            const isVisible = accessibilityControls.classList.contains('show');
            accessibilityControls.classList.toggle('show');
            accessibilityToggle.setAttribute('aria-expanded', !isVisible);
        });
        
        // Close panel when clicking outside
        document.addEventListener('click', function(e) {
            if (!e.target.closest('.accessibility-panel')) {
                accessibilityControls.classList.remove('show');
                accessibilityToggle.setAttribute('aria-expanded', 'false');
            }
        });
    }
}

function toggleHighContrast() {
    highContrastMode = !highContrastMode;
    document.body.classList.toggle('high-contrast', highContrastMode);
    
    const button = event.target;
    button.setAttribute('aria-pressed', highContrastMode);
    
    // Save preference
    localStorage.setItem('highContrast', highContrastMode);
    
    announceToScreenReader(highContrastMode ? 'Alto contraste ativado' : 'Alto contraste desativado');
}

function increaseFontSize() {
    if (fontSizeLevel < 2) {
        fontSizeLevel++;
        updateFontSize();
        announceToScreenReader('Tamanho da fonte aumentado');
    }
}

function decreaseFontSize() {
    if (fontSizeLevel > -1) {
        fontSizeLevel--;
        updateFontSize();
        announceToScreenReader('Tamanho da fonte diminuído');
    }
}

function updateFontSize() {
    document.body.classList.remove('font-large', 'font-larger');
    
    if (fontSizeLevel === 1) {
        document.body.classList.add('font-large');
    } else if (fontSizeLevel === 2) {
        document.body.classList.add('font-larger');
    }
    
    // Save preference
    localStorage.setItem('fontSize', fontSizeLevel);
}

function toggleScreenReader() {
    screenReaderMode = !screenReaderMode;
    const button = event.target;
    button.setAttribute('aria-pressed', screenReaderMode);
    
    // Save preference
    localStorage.setItem('screenReader', screenReaderMode);
    
    announceToScreenReader(screenReaderMode ? 'Modo leitor de tela ativado' : 'Modo leitor de tela desativado');
    
    if (screenReaderMode) {
        enableScreenReaderMode();
    } else {
        disableScreenReaderMode();
    }
}

function enableScreenReaderMode() {
    // Add more descriptive text to elements
    const images = document.querySelectorAll('img:not([alt])');
    images.forEach(img => {
        img.setAttribute('alt', 'Imagem decorativa');
    });
    
    // Add skip links
    addSkipLinks();
}

function disableScreenReaderMode() {
    // Remove added skip links if any
    const addedSkipLinks = document.querySelectorAll('.added-skip-link');
    addedSkipLinks.forEach(link => link.remove());
}

function addSkipLinks() {
    const sections = document.querySelectorAll('section[id]');
    const nav = document.querySelector('nav');
    
    if (nav && sections.length > 0) {
        const skipContainer = document.createElement('div');
        skipContainer.className = 'skip-links added-skip-link';
        skipContainer.setAttribute('aria-label', 'Links de navegação rápida');
        
        sections.forEach(section => {
            const link = document.createElement('a');
            link.href = `#${section.id}`;
            link.textContent = `Ir para ${section.querySelector('h1, h2, h3')?.textContent || section.id}`;
            link.className = 'skip-link';
            skipContainer.appendChild(link);
        });
        
        nav.parentNode.insertBefore(skipContainer, nav);
    }
}

// Screen reader announcements
function announceToScreenReader(message) {
    const announcement = document.createElement('div');
    announcement.setAttribute('aria-live', 'polite');
    announcement.setAttribute('aria-atomic', 'true');
    announcement.className = 'sr-only';
    announcement.textContent = message;
    
    document.body.appendChild(announcement);
    
    setTimeout(() => {
        document.body.removeChild(announcement);
    }, 1000);
}

// Calculator Functions
function initializeCalculator() {
    // Calculator is already set up in HTML, just need the calculation function
}

function calculateIrrigation() {
    const area = parseFloat(document.getElementById('area').value);
    const cropType = document.getElementById('crop-type').value;
    const resultDiv = document.getElementById('calc-result');
    
    if (!area || !cropType) {
        resultDiv.textContent = 'Por favor, preencha todos os campos.';
        resultDiv.setAttribute('aria-live', 'polite');
        return;
    }
    
    // Simple calculation based on crop type
    const waterRequirements = {
        'milho': 500,
        'soja': 450,
        'feijao': 400,
        'tomate': 600
    };
    
    const dailyWater = area * waterRequirements[cropType];
    const weeklyWater = dailyWater * 7;
    
    resultDiv.innerHTML = `
        <strong>Necessidade de água calculada:</strong><br>
        Diária: ${dailyWater.toLocaleString()} litros<br>
        Semanal: ${weeklyWater.toLocaleString()} litros
    `;
    resultDiv.setAttribute('aria-live', 'polite');
    
    announceToScreenReader(`Cálculo concluído. Necessidade diária: ${dailyWater.toLocaleString()} litros`);
}

// Suppliers Functions
function initializeSuppliers() {
    // Suppliers filter is already set up in HTML
}

function filterSuppliers() {
    const filter = document.getElementById('region-filter').value;
    const suppliers = document.querySelectorAll('.supplier-card');
    let visibleCount = 0;
    
    suppliers.forEach(supplier => {
        const region = supplier.getAttribute('data-region');
        if (!filter || region === filter) {
            supplier.style.display = 'block';
            visibleCount++;
        } else {
            supplier.style.display = 'none';
        }
    });
    
    announceToScreenReader(`Filtro aplicado. ${visibleCount} fornecedores encontrados${filter ? ` na região ${filter}` : ''}.`);
}

// Forum Functions
function initializeForum() {
    // Add click handlers for forum topics
    const topics = document.querySelectorAll('.topic');
    topics.forEach(topic => {
        topic.addEventListener('click', function() {
            announceToScreenReader(`Abrindo tópico: ${this.querySelector('h3').textContent}`);
            // Here you would typically navigate to the full topic page
        });
        
        topic.addEventListener('keypress', function(e) {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                this.click();
            }
        });
    });
}

// Video Functions
function initializeVideos() {
    const playButtons = document.querySelectorAll('.play-button');
    const transcriptButtons = document.querySelectorAll('.transcript-button');
    
    playButtons.forEach(button => {
        button.addEventListener('click', function() {
            const videoCard = this.closest('.video-card');
            const videoTitle = videoCard.querySelector('h3').textContent;
            announceToScreenReader(`Reproduzindo vídeo: ${videoTitle}`);
            
            // Here you would typically open a video player or modal
            alert(`Reproduzindo: ${videoTitle}\n\nEm uma implementação real, isso abriria o player de vídeo com legendas e controles acessíveis.`);
        });
    });
    
    transcriptButtons.forEach(button => {
        button.addEventListener('click', function() {
            const videoCard = this.closest('.video-card');
            const videoTitle = videoCard.querySelector('h3').textContent;
            announceToScreenReader(`Abrindo transcrição do vídeo: ${videoTitle}`);
            
            // Here you would typically show the transcript
            alert(`Transcrição do vídeo: ${videoTitle}\n\nEm uma implementação real, isso mostraria a transcrição completa do vídeo para acessibilidade.`);
        });
    });
}

// Keyboard Support
function addKeyboardSupport() {
    // Add keyboard navigation for cards
    const cards = document.querySelectorAll('.blog-card, .tool-card, .supplier-card, .video-card, .topic');
    
    cards.forEach(card => {
        card.addEventListener('keypress', function(e) {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                const button = this.querySelector('button, .read-more, .tool-button, .contact-button, .play-button');
                if (button) {
                    button.click();
                } else {
                    this.click();
                }
            }
        });
    });
    
    // ESC key to close accessibility panel
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            const accessibilityControls = document.getElementById('accessibility-controls');
            const accessibilityToggle = document.getElementById('accessibility-toggle');
            
            if (accessibilityControls && accessibilityControls.classList.contains('show')) {
                accessibilityControls.classList.remove('show');
                accessibilityToggle.setAttribute('aria-expanded', 'false');
                accessibilityToggle.focus();
            }
        }
    });
}

// Load saved accessibility preferences
function loadAccessibilityPreferences() {
    // Load high contrast preference
    const savedHighContrast = localStorage.getItem('highContrast');
    if (savedHighContrast === 'true') {
        highContrastMode = true;
        document.body.classList.add('high-contrast');
        const button = document.querySelector('button[onclick="toggleHighContrast()"]');
        if (button) button.setAttribute('aria-pressed', 'true');
    }
    
    // Load font size preference
    const savedFontSize = localStorage.getItem('fontSize');
    if (savedFontSize) {
        fontSizeLevel = parseInt(savedFontSize);
        updateFontSize();
    }
    
    // Load screen reader preference
    const savedScreenReader = localStorage.getItem('screenReader');
    if (savedScreenReader === 'true') {
        screenReaderMode = true;
        enableScreenReaderMode();
        const button = document.querySelector('button[onclick="toggleScreenReader()"]');
        if (button) button.setAttribute('aria-pressed', 'true');
    }
}

// Contact functions for supplier cards
function contactSupplier(supplierName) {
    announceToScreenReader(`Abrindo contato para ${supplierName}`);
    alert(`Entrando em contato com ${supplierName}\n\nEm uma implementação real, isso abriria um formulário de contato ou informações de comunicação.`);
}

// Blog functions
function readArticle(articleTitle) {
    announceToScreenReader(`Abrindo artigo: ${articleTitle}`);
    alert(`Lendo: ${articleTitle}\n\nEm uma implementação real, isso levaria para a página completa do artigo.`);
}

// Tool details functions
function showToolDetails(toolName) {
    announceToScreenReader(`Mostrando detalhes da ferramenta: ${toolName}`);
    alert(`Detalhes: ${toolName}\n\nEm uma implementação real, isso mostraria informações detalhadas sobre a ferramenta.`);
}

// Add event listeners for buttons after DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    // Read more buttons
    const readMoreButtons = document.querySelectorAll('.read-more');
    readMoreButtons.forEach((button, index) => {
        button.addEventListener('click', function() {
            const article = this.closest('.blog-card');
            const title = article.querySelector('h3').textContent;
            readArticle(title);
        });
    });
    
    // Tool buttons
    const toolButtons = document.querySelectorAll('.tool-button');
    toolButtons.forEach(button => {
        button.addEventListener('click', function() {
            const toolCard = this.closest('.tool-card');
            const toolName = toolCard.querySelector('h3').textContent;
            showToolDetails(toolName);
        });
    });
    
    // Contact buttons
    const contactButtons = document.querySelectorAll('.contact-button');
    contactButtons.forEach(button => {
        button.addEventListener('click', function() {
            const supplierCard = this.closest('.supplier-card');
            const supplierName = supplierCard.querySelector('h3').textContent;
            contactSupplier(supplierName);
        });
    });
    
    // Join forum button
    const joinForumButton = document.querySelector('.join-forum');
    if (joinForumButton) {
        joinForumButton.addEventListener('click', function() {
            announceToScreenReader('Abrindo página de cadastro do fórum');
            alert('Participar do Fórum\n\nEm uma implementação real, isso levaria para a página de cadastro/login do fórum da comunidade.');
        });
    }
});

// Utility function to handle focus management
function manageFocus(element) {
    if (element) {
        element.focus();
        element.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
}

// Error handling for accessibility features
window.addEventListener('error', function(e) {
    console.error('Erro de acessibilidade:', e.error);
    announceToScreenReader('Ocorreu um erro. Por favor, recarregue a página ou entre em contato conosco.');
});

// Service worker registration for offline functionality (accessibility consideration)
if ('serviceWorker' in navigator) {
    window.addEventListener('load', function() {
        navigator.serviceWorker.register('/sw.js')
            .then(function(registration) {
                console.log('ServiceWorker registrado com sucesso:', registration.scope);
            })
            .catch(function(error) {
                console.log('Falha ao registrar ServiceWorker:', error);
            });
    });
}
