// ===================================
// MERCADO LIBRE - SCRIPT PRINCIPAL
// ===================================

document.addEventListener('DOMContentLoaded', function() {
    
    // ===================================
    // HERO BANNER CAROUSEL
    // ===================================
    const heroBanner = document.querySelector('.hero-banner');
    if (heroBanner) {
        const prevBtn = heroBanner.querySelector('.prev-btn');
        const nextBtn = heroBanner.querySelector('.next-btn');
        const indicators = heroBanner.querySelectorAll('.carousel-indicators .indicator');
        let currentSlide = 0;
        const totalSlides = indicators.length;

        // Función para cambiar slide
        function changeSlide(direction) {
            if (direction === 'next') {
                currentSlide = (currentSlide + 1) % totalSlides;
            } else {
                currentSlide = (currentSlide - 1 + totalSlides) % totalSlides;
            }
            updateCarousel();
        }

        // Función para actualizar el carrusel
        function updateCarousel() {
            indicators.forEach((indicator, index) => {
                if (index === currentSlide) {
                    indicator.classList.add('active');
                } else {
                    indicator.classList.remove('active');
                }
            });
        }

        // Event listeners para botones
        if (prevBtn) {
            prevBtn.addEventListener('click', () => changeSlide('prev'));
        }
        
        if (nextBtn) {
            nextBtn.addEventListener('click', () => changeSlide('next'));
        }

        // Event listeners para indicadores
        indicators.forEach((indicator, index) => {
            indicator.addEventListener('click', () => {
                currentSlide = index;
                updateCarousel();
            });
        });

        // Auto-play del carrusel (cada 5 segundos)
        setInterval(() => {
            changeSlide('next');
        }, 5000);
    }

    // ===================================
    // PRODUCT CAROUSELS
    // ===================================
    const productCarousels = document.querySelectorAll('.products-carousel');
    
    productCarousels.forEach(carousel => {
        const prevBtn = carousel.querySelector('.prev-btn-small');
        const nextBtn = carousel.querySelector('.next-btn-small');
        const productsGrid = carousel.querySelector('.products-grid');
        const section = carousel.closest('.product-section');
        const indicators = section ? section.querySelectorAll('.carousel-indicators-inline .indicator') : [];
        
        let currentPosition = 0;
        const scrollAmount = 200; // Cantidad de píxeles a desplazar
        
        if (prevBtn && nextBtn && productsGrid) {
            // Scroll hacia la izquierda
            prevBtn.addEventListener('click', () => {
                const newPosition = Math.max(0, currentPosition - scrollAmount);
                productsGrid.style.transform = `translateX(-${newPosition}px)`;
                currentPosition = newPosition;
                updateCarouselIndicators();
            });
            
            // Scroll hacia la derecha
            nextBtn.addEventListener('click', () => {
                const maxScroll = productsGrid.scrollWidth - productsGrid.clientWidth;
                const newPosition = Math.min(maxScroll, currentPosition + scrollAmount);
                productsGrid.style.transform = `translateX(-${newPosition}px)`;
                currentPosition = newPosition;
                updateCarouselIndicators();
            });
            
            // Actualizar indicadores del carrusel
            function updateCarouselIndicators() {
                if (indicators.length > 0) {
                    const maxScroll = productsGrid.scrollWidth - productsGrid.clientWidth;
                    const progress = currentPosition / maxScroll;
                    const activeIndex = Math.floor(progress * (indicators.length - 1));
                    
                    indicators.forEach((indicator, index) => {
                        if (index === activeIndex) {
                            indicator.classList.add('active');
                        } else {
                            indicator.classList.remove('active');
                        }
                    });
                }
            }
            
            // Agregar transición suave
            productsGrid.style.transition = 'transform 0.3s ease';
        }
    });

    // ===================================
    // PRODUCT CARD HOVER EFFECTS
    // ===================================
    const productCards = document.querySelectorAll('.product-card');
    
    productCards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-4px)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0)';
        });
    });

    // ===================================
    // BENEFIT CARDS HOVER EFFECTS
    // ===================================
    const benefitCards = document.querySelectorAll('.benefit-card');
    
    benefitCards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'scale(1.02)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'scale(1)';
        });
    });

    // ===================================
    // SEARCH BAR FUNCTIONALITY
    // ===================================
    const searchInput = document.querySelector('.search-input');
    const searchButton = document.querySelector('.search-button');
    
    if (searchButton && searchInput) {
        searchButton.addEventListener('click', () => {
            const searchTerm = searchInput.value.trim();
            if (searchTerm) {
                console.log('Buscando:', searchTerm);
                // Aquí iría la lógica de búsqueda real
                alert(`Buscando: "${searchTerm}"\n\nEsta es una demostración. En un sitio real, esto redireccionaría a los resultados de búsqueda.`);
            }
        });
        
        searchInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                searchButton.click();
            }
        });
    }

    // ===================================
    // COOKIE NOTICE
    // ===================================
    const cookieNotice = document.querySelector('.cookie-notice');
    const acceptCookiesBtn = document.querySelector('.btn-cookie-accept');
    const configureCookiesBtn = document.querySelector('.btn-cookie-config');
    
    if (acceptCookiesBtn) {
        acceptCookiesBtn.addEventListener('click', () => {
            if (cookieNotice) {
                cookieNotice.style.display = 'none';
            }
            console.log('Cookies aceptadas');
            // Aquí iría la lógica para guardar la preferencia
        });
    }
    
    if (configureCookiesBtn) {
        configureCookiesBtn.addEventListener('click', () => {
            console.log('Configurar cookies');
            alert('Esta es una demostración. En un sitio real, esto abriría un modal para configurar las preferencias de cookies.');
        });
    }

    // ===================================
    // FOOTER TOGGLE
    // ===================================
    const footerToggle = document.querySelector('.footer-toggle');
    const footerLinksGrid = document.querySelector('.footer-links-grid');
    
    if (footerToggle && footerLinksGrid) {
        let isExpanded = true; // Por defecto está expandido
        
        footerToggle.addEventListener('click', () => {
            isExpanded = !isExpanded;
            
            if (isExpanded) {
                footerLinksGrid.style.display = 'grid';
                footerToggle.querySelector('span').textContent = '▲';
                footerToggle.childNodes[0].textContent = 'Más información ';
            } else {
                footerLinksGrid.style.display = 'none';
                footerToggle.querySelector('span').textContent = '▼';
                footerToggle.childNodes[0].textContent = 'Más información ';
            }
        });
    }

    // ===================================
    // NAVIGATION LINKS FUNCTIONALITY
    // ===================================
    const navLinks = document.querySelectorAll('.main-nav a, .benefit-card a, .card-link, .card-link-button');
    
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            // Solo prevenir el comportamiento predeterminado si no es una navegación real
            if (link.getAttribute('href') === '#') {
                e.preventDefault();
                console.log('Navegación a:', link.textContent.trim());
                // En un sitio real, aquí iría la lógica de navegación
            }
        });
    });

    // ===================================
    // SMOOTH SCROLL FOR INTERNAL LINKS
    // ===================================
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const href = this.getAttribute('href');
            if (href !== '#') {
                e.preventDefault();
                const target = document.querySelector(href);
                if (target) {
                    target.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            }
        });
    });

    // ===================================
    // CART AND NOTIFICATIONS
    // ===================================
    const cartIcon = document.querySelector('.cart-icon');
    const notificationIcon = document.querySelector('.notification-icon');
    
    if (cartIcon) {
        cartIcon.addEventListener('click', (e) => {
            e.preventDefault();
            console.log('Ver carrito');
            alert('Esta es una demostración. En un sitio real, esto abriría el carrito de compras.');
        });
    }
    
    if (notificationIcon) {
        notificationIcon.addEventListener('click', (e) => {
            e.preventDefault();
            console.log('Ver notificaciones');
            alert('Esta es una demostración. En un sitio real, esto mostraría las notificaciones.');
        });
    }

    // ===================================
    // LOCATION SELECTOR
    // ===================================
    const locationElement = document.querySelector('.location');
    
    if (locationElement) {
        locationElement.addEventListener('click', () => {
            console.log('Cambiar ubicación');
            alert('Esta es una demostración. En un sitio real, esto permitiría cambiar la ubicación de envío.');
        });
        
        locationElement.style.cursor = 'pointer';
    }

    // ===================================
    // PRODUCT CARD CLICK HANDLING
    // ===================================
    const allProductCards = document.querySelectorAll('.product-card, .product-card-small');
    
    allProductCards.forEach(card => {
        card.addEventListener('click', function(e) {
            // Evitar navegación si se hace clic en un enlace o botón dentro de la tarjeta
            if (!e.target.closest('a') && !e.target.closest('button')) {
                console.log('Ver detalles del producto');
                alert('Esta es una demostración. En un sitio real, esto abriría la página de detalles del producto.');
            }
        });
    });

    // ===================================
    // ENTERTAINMENT CARDS
    // ===================================
    const entertainmentCards = document.querySelectorAll('.entertainment-card');
    
    entertainmentCards.forEach(card => {
        card.addEventListener('click', () => {
            console.log('Ver oferta de entretenimiento');
            alert('Esta es una demostración. En un sitio real, esto abriría los detalles de la oferta de streaming.');
        });
        
        card.style.cursor = 'pointer';
    });

    // ===================================
    // PROMO CARDS
    // ===================================
    const promoCards = document.querySelectorAll('.promo-card');
    
    promoCards.forEach(card => {
        card.addEventListener('click', (e) => {
            if (!e.target.closest('a')) {
                console.log('Ver promoción');
                alert('Esta es una demostración. En un sitio real, esto abriría los detalles de la promoción.');
            }
        });
        
        card.style.cursor = 'pointer';
    });

    // ===================================
    // INITIALIZE ANIMATIONS
    // ===================================
    // Agregar clase de animación a elementos cuando entran en el viewport
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

    // Observar secciones para animaciones
    const sections = document.querySelectorAll('.product-section, .entertainment-section, .device-promos');
    sections.forEach(section => {
        section.style.opacity = '0';
        section.style.transform = 'translateY(20px)';
        section.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
        observer.observe(section);
    });

    // ===================================
    // CONSOLE LOG - READY
    // ===================================
    console.log('✅ Mercado Libre - Réplica cargada correctamente');
    console.log('📦 Esta es una demostración educativa de la interfaz de Mercado Libre');
});

// ===================================
// UTILITY FUNCTIONS
// ===================================

// Función para formatear precios
function formatPrice(price) {
    return new Intl.NumberFormat('es-CO', {
        style: 'currency',
        currency: 'COP',
        minimumFractionDigits: 0
    }).format(price);
}

// Función para debounce (útil para eventos que se disparan frecuentemente)
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Event listener para el resize de ventana (con debounce)
window.addEventListener('resize', debounce(() => {
    console.log('Ventana redimensionada');
    // Aquí se pueden agregar ajustes responsivos adicionales si es necesario
}, 250));

// Función para detectar si un elemento está en el viewport
function isInViewport(element) {
    const rect = element.getBoundingClientRect();
    return (
        rect.top >= 0 &&
        rect.left >= 0 &&
        rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
        rect.right <= (window.innerWidth || document.documentElement.clientWidth)
    );
}

// Prevenir que el scroll horizontal afecte la experiencia
document.addEventListener('wheel', (e) => {
    if (e.deltaX !== 0) {
        // Permitir scroll horizontal dentro de carruseles específicamente
        const target = e.target.closest('.products-grid');
        if (!target) {
            e.preventDefault();
        }
    }
}, { passive: false });
