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
            
            // Close mobile menu after clicking a link
            const navMenu = document.getElementById('navMenu');
            const navToggle = document.getElementById('navToggle');
            if (navMenu && navToggle) {
                navMenu.classList.remove('active');
                navToggle.classList.remove('active');
            }
        }
    });
});

// Mobile Navigation Toggle
const navToggle = document.getElementById('navToggle');
const navMenu = document.getElementById('navMenu');

if (navToggle && navMenu) {
    navToggle.addEventListener('click', () => {
        navMenu.classList.toggle('active');
        navToggle.classList.toggle('active');
    });

    // Close mobile menu when clicking outside
    document.addEventListener('click', (e) => {
        if (!navToggle.contains(e.target) && !navMenu.contains(e.target)) {
            navMenu.classList.remove('active');
            navToggle.classList.remove('active');
        }
    });

    // Close mobile menu on window resize if screen becomes larger
    window.addEventListener('resize', () => {
        if (window.innerWidth > 768) {
            navMenu.classList.remove('active');
            navToggle.classList.remove('active');
        }
    });
}

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

// ==================== Línea de Tiempo Interactiva ====================
document.addEventListener('DOMContentLoaded', () => {
    const timelineData = [
        { year: '1969', title: 'Origen y primeros años', detail: 'Liliana Morales Mora nace el 28 de mayo de 1969 en Garagoa, Boyacá. Crece en condiciones económicas difíciles y trabaja desde niña vendiendo papas en la plaza del pueblo, experiencia que fortalece su carácter emprendedor.' },
        { year: '1989', title: 'Llegada a Bogotá', detail: 'A los 20 años se traslada a Bogotá para estudiar Administración de Empresas en la Universidad Distrital. Este cambio marca el inicio de su formación profesional.' },
        { year: '1994–2004', title: 'Experiencia en el sector', detail: 'Tras graduarse, trabaja durante una década en Rentokill, empresa dedicada a la desinfección de áreas. En este periodo identifica la falta de regulación en el control de plagas y los riesgos sanitarios derivados de la obsolescencia tecnológica en Colombia.' },
        { year: '2004', title: 'Fundación de TKC Fumigaciones', detail: 'Motivada por las necesidades del país y en medio de la transición hacia tecnologías más modernas, Liliana funda Fumigaciones TKC, enfocada en servicios de fumigación y desinfección con una visión orientada a la salud pública.' },
        { year: '2004–2017', title: 'Consolidación y crecimiento', detail: 'La empresa crece sostenidamente. Se introducen prácticas administrativas modernas: diseño organizacional, creación de departamentos, especialización del trabajo y formalización de procesos. Estos avances le permiten posicionarse con fuerza en el mercado nacional.' },
        { year: '2017', title: 'Cambio de gerencia', detail: 'Por razones personales, Liliana cede la gerencia a su hermana Yesenia Morales Mora, profesional en seguridad y salud en el trabajo. Su llegada impulsa la diversificación de servicios y una nueva etapa de expansión.' },
        { year: '2017–Actualidad', title: 'Diversificación y fortalecimiento', detail: 'Bajo la dirección de Yesenia surgen nuevas líneas: TKC Corp (saneamiento y control integrado de plagas); TKC Home (bienestar en el hogar y control de plagas domésticas); Hidriko (monitoreo, lavado y desinfección de sistemas de agua potable y vertimientos); TKC Security (asesorías en seguridad y salud en el trabajo).' },
        { year: 'Actualidad', title: 'Reconocimiento y liderazgo', detail: 'TKC cuenta con más de 70 empleados administrativos, 200 técnicos y dos sedes operativas. Ha sido reconocida por el PREAD gracias a su desempeño ambiental. Hoy es una de las empresas más destacadas del sector en Colombia y un referente en salud ambiental y control de plagas.' }
    ];

    const timelineContainer = document.getElementById('timelineContainer');
    const timelineDetail = document.getElementById('timelineDetail');

    if (timelineContainer) {
        timelineData.forEach((evt, idx) => {
            const card = document.createElement('div');
            card.className = 'timeline-event';
            card.setAttribute('tabindex','0');
            card.setAttribute('role','button');
            card.setAttribute('aria-label', `${evt.year} ${evt.title}`);
            card.innerHTML = `<time>${evt.year}</time><h4>${evt.title}</h4><p>${evt.detail.slice(0, 80)}...</p>`;
            card.addEventListener('click', () => selectTimeline(idx));
            card.addEventListener('keypress', (e) => { if(e.key==='Enter'){ selectTimeline(idx); }});
            timelineContainer.appendChild(card);
        });
    }

    function selectTimeline(index){
        const evt = timelineData[index];
        document.querySelectorAll('.timeline-event').forEach(el => el.classList.remove('active'));
        const active = timelineContainer.children[index];
        active.classList.add('active');
        if (timelineDetail){
            timelineDetail.innerHTML = `<h3>${evt.year} · ${evt.title}</h3><p>${evt.detail}</p>`;
        }
    }
});

// ==================== Flujo Ley de la Situación ====================
document.addEventListener('DOMContentLoaded', () => {
    const flowStepsData = [
        { key:'diagnostico', title:'Diagnóstico del Sitio', text:'La acción surge de la situación: tipo de plaga, condiciones ambientales, historial y contexto operativo. Autoridad = hechos.' },
        { key:'riesgos', title:'Riesgos y Normativa', text:'Condiciones legales HSEQ y riesgos sanitarios orientan decisiones. No impone jerarquía, guía el marco regulatorio aplicado.' },
        { key:'metodo', title:'Selección del Método', text:'Técnica química, biológica o física elegida por adecuación situacional; evita tradición o rutina sin análisis.' },
        { key:'verificacion', title:'Verificación HSEQ & Ejecución', text:'Controles de seguridad y protocolos antes y durante la intervención. Protege vida y entorno.' },
        { key:'retro', title:'Retroalimentación Cliente', text:'Cliente aporta datos que reorientan decisiones futuras. Ejemplifica respuesta circular y “poder con”.' }
    ];

    const flowSteps = document.getElementById('flowSteps');
    const flowDetail = document.getElementById('flowDetail');

    if (flowSteps){
        flowStepsData.forEach((st, idx) => {
            const stepEl = document.createElement('div');
            stepEl.className = 'flow-step';
            stepEl.textContent = st.title;
            stepEl.setAttribute('tabindex','0');
            stepEl.setAttribute('role','button');
            stepEl.setAttribute('aria-label', st.title);
            stepEl.addEventListener('click',()=>selectFlow(idx));
            stepEl.addEventListener('keypress',(e)=>{ if(e.key==='Enter'){ selectFlow(idx); }});
            flowSteps.appendChild(stepEl);
        });
    }

    function selectFlow(index){
        document.querySelectorAll('.flow-step').forEach(el=>el.classList.remove('active'));
        const active = flowSteps.children[index];
        active.classList.add('active');
        const data = flowStepsData[index];
        if (flowDetail){
            flowDetail.innerHTML = `<h3>${data.title}</h3><p>${data.text}</p>`;
        }
    }
});
