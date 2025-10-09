// Smooth scrolling for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Add active class to current section in viewport
const sections = document.querySelectorAll('.section, .hero-section');
const navLinks = document.querySelectorAll('nav ul li a');

function highlightNavigation() {
    let currentSection = '';
    
    sections.forEach(section => {
        const sectionTop = section.offsetTop - 100;
        const sectionHeight = section.clientHeight;
        if (window.scrollY >= sectionTop && window.scrollY < sectionTop + sectionHeight) {
            currentSection = section.getAttribute('id');
        }
    });
    
    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href').slice(1) === currentSection) {
            link.classList.add('active');
        }
    });
}

window.addEventListener('scroll', highlightNavigation);

// Edit Mode Functionality
let isEditMode = false;
let originalContent = {};

const editModeBtn = document.querySelector('.edit-mode-btn');
const saveBtn = document.querySelector('.save-btn');
const cancelBtn = document.querySelector('.cancel-btn');

// Store original content
function storeOriginalContent() {
    const editableElements = document.querySelectorAll('.editable, .editable-content');
    editableElements.forEach(element => {
        const field = element.getAttribute('data-field') || element.textContent;
        originalContent[field] = element.innerHTML;
    });
}

// Toggle edit mode
function toggleEditMode() {
    isEditMode = !isEditMode;
    const editableElements = document.querySelectorAll('.editable, .editable-content');
    
    if (isEditMode) {
        storeOriginalContent();
        
        editableElements.forEach(element => {
            element.classList.add('editing');
            element.contentEditable = true;
            
            // Add placeholder text for empty fields
            if (element.textContent.trim() === '' || element.textContent.includes('[') || element.textContent.includes('X')) {
                const field = element.getAttribute('data-field');
                const placeholders = {
                    'years': 'Ej: 15',
                    'clients': 'Ej: 500+',
                    'employees': 'Ej: 25',
                    'date': 'Fecha: [DD/MM/AAAA]',
                    'duration': 'Duración: [X horas]',
                    'interviewee': 'Entrevistado: [Nombre y Cargo]',
                    'location': 'Ubicación: [Dirección]',
                    'university': '[Nombre de la Universidad]'
                };
                
                if (placeholders[field]) {
                    element.innerHTML = placeholders[field];
                }
            }
        });
        
        editModeBtn.style.display = 'none';
        saveBtn.style.display = 'inline-flex';
        cancelBtn.style.display = 'inline-flex';
        
        // Show notification
        showNotification('Modo edición activado. Haz clic en cualquier elemento para editarlo.', 'info');
        
    } else {
        editableElements.forEach(element => {
            element.classList.remove('editing');
            element.contentEditable = false;
        });
        
        editModeBtn.style.display = 'inline-flex';
        saveBtn.style.display = 'none';
        cancelBtn.style.display = 'none';
    }
}

// Save changes
function saveChanges() {
    const editableElements = document.querySelectorAll('.editable, .editable-content');
    let hasChanges = false;
    
    editableElements.forEach(element => {
        const field = element.getAttribute('data-field') || element.textContent;
        if (originalContent[field] !== element.innerHTML) {
            hasChanges = true;
        }
    });
    
    if (hasChanges) {
        // Save to localStorage for persistence
        const currentContent = {};
        editableElements.forEach(element => {
            const field = element.getAttribute('data-field');
            if (field) {
                currentContent[field] = element.innerHTML;
            }
        });
        
        localStorage.setItem('tkc-project-content', JSON.stringify(currentContent));
        showNotification('Cambios guardados exitosamente!', 'success');
    }
    
    toggleEditMode();
}

// Cancel changes
function cancelChanges() {
    const editableElements = document.querySelectorAll('.editable, .editable-content');
    
    editableElements.forEach(element => {
        const field = element.getAttribute('data-field') || element.textContent;
        if (originalContent[field]) {
            element.innerHTML = originalContent[field];
        }
    });
    
    showNotification('Cambios cancelados', 'warning');
    toggleEditMode();
}

// Load saved content
function loadSavedContent() {
    const savedContent = localStorage.getItem('tkc-project-content');
    if (savedContent) {
        const content = JSON.parse(savedContent);
        
        Object.keys(content).forEach(field => {
            const element = document.querySelector(`[data-field="${field}"]`);
            if (element) {
                element.innerHTML = content[field];
            }
        });
    }
}

// Show notification
function showNotification(message, type) {
    // Remove existing notifications
    const existingNotification = document.querySelector('.notification');
    if (existingNotification) {
        existingNotification.remove();
    }
    
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <div class="notification-content">
            <i class="fas fa-${type === 'success' ? 'check-circle' : type === 'warning' ? 'exclamation-triangle' : 'info-circle'}"></i>
            <span>${message}</span>
        </div>
    `;
    
    // Add notification styles
    notification.style.cssText = `
        position: fixed;
        top: 100px;
        right: 20px;
        background: ${type === 'success' ? '#27ae60' : type === 'warning' ? '#f39c12' : '#3498db'};
        color: white;
        padding: 1rem 1.5rem;
        border-radius: 10px;
        box-shadow: 0 5px 15px rgba(0,0,0,0.2);
        z-index: 10000;
        transform: translateX(400px);
        transition: transform 0.3s ease;
    `;
    
    document.body.appendChild(notification);
    
    // Animate in
    setTimeout(() => {
        notification.style.transform = 'translateX(0)';
    }, 100);
    
    // Auto remove after 3 seconds
    setTimeout(() => {
        notification.style.transform = 'translateX(400px)';
        setTimeout(() => {
            if (notification.parentNode) {
                notification.remove();
            }
        }, 300);
    }, 3000);
}

// Event listeners
if (editModeBtn) {
    editModeBtn.addEventListener('click', toggleEditMode);
}

if (saveBtn) {
    saveBtn.addEventListener('click', saveChanges);
}

if (cancelBtn) {
    cancelBtn.addEventListener('click', cancelChanges);
}

// Animation on scroll
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

// Add animation styles and observe elements
document.addEventListener('DOMContentLoaded', () => {
    const animatedElements = document.querySelectorAll('.section, .project-card, .team-member, .topic-card, .stat-card');
    
    animatedElements.forEach(element => {
        element.style.opacity = '0';
        element.style.transform = 'translateY(20px)';
        element.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(element);
    });
    
    // Load saved content on page load
    loadSavedContent();
});

// Keyboard shortcuts for edit mode
document.addEventListener('keydown', (e) => {
    // Ctrl + E to toggle edit mode
    if (e.ctrlKey && e.key === 'e') {
        e.preventDefault();
        if (editModeBtn) {
            toggleEditMode();
        }
    }
    
    // Escape to cancel edit mode
    if (e.key === 'Escape' && isEditMode) {
        e.preventDefault();
        cancelChanges();
    }
    
    // Ctrl + S to save changes
    if (e.ctrlKey && e.key === 's' && isEditMode) {
        e.preventDefault();
        saveChanges();
    }
});

// Enhanced hover effects for interactive elements
document.addEventListener('DOMContentLoaded', () => {
    const cards = document.querySelectorAll('.project-card, .team-member, .topic-card, .stat-card, .detail-item');
    
    cards.forEach(card => {
        card.addEventListener('mouseenter', () => {
            card.style.transform = card.classList.contains('stat-card') ? 'scale(1.05)' : 'translateY(-5px)';
        });
        
        card.addEventListener('mouseleave', () => {
            card.style.transform = card.classList.contains('stat-card') ? 'scale(1)' : 'translateY(0)';
        });
    });
});

// Console welcome message
console.log('%c🌿 TKC Group Research Project', 'color: #27ae60; font-size: 20px; font-weight: bold;');
console.log('%cProyecto de Investigación en Gestión', 'color: #2c3e50; font-size: 14px;');
console.log('%cEquipo: Juan Bravo, Samuel Correa, Alejandro Davila, María Zabala', 'color: #7f8c8d; font-size: 12px;');
console.log('%c\nAtajos de teclado:', 'color: #e74c3c; font-weight: bold;');
console.log('Ctrl + E: Activar/Desactivar modo edición');
console.log('Ctrl + S: Guardar cambios (en modo edición)');
console.log('Escape: Cancelar edición');

// Performance monitoring
window.addEventListener('load', () => {
    const loadTime = performance.now();
    console.log(`%cPágina cargada en ${Math.round(loadTime)}ms`, 'color: #27ae60;');
});
