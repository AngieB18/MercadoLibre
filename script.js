
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

        function changeSlide(direction) {
            if (direction === 'next') {
                currentSlide = (currentSlide + 1) % totalSlides;
            } else {
                currentSlide = (currentSlide - 1 + totalSlides) % totalSlides;
            }
            updateCarousel();
        }

        function updateCarousel() {
            indicators.forEach((indicator, index) => {
                if (index === currentSlide) {
                    indicator.classList.add('active');
                } else {
                    indicator.classList.remove('active');
                }
            });
        }

        if (prevBtn) prevBtn.addEventListener('click', () => changeSlide('prev'));
        if (nextBtn) nextBtn.addEventListener('click', () => changeSlide('next'));

        indicators.forEach((indicator, index) => {
            indicator.addEventListener('click', () => {
                currentSlide = index;
                updateCarousel();
            });
        });

        setInterval(() => changeSlide('next'), 5000);
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
        const scrollAmount = 200;
        
        if (prevBtn && nextBtn && productsGrid) {
            prevBtn.addEventListener('click', () => {
                const newPosition = Math.max(0, currentPosition - scrollAmount);
                productsGrid.style.transform = `translateX(-${newPosition}px)`;
                currentPosition = newPosition;
                updateCarouselIndicators();
            });
            
            nextBtn.addEventListener('click', () => {
                const maxScroll = productsGrid.scrollWidth - productsGrid.clientWidth;
                const newPosition = Math.min(maxScroll, currentPosition + scrollAmount);
                productsGrid.style.transform = `translateX(-${newPosition}px)`;
                currentPosition = newPosition;
                updateCarouselIndicators();
            });
            
            function updateCarouselIndicators() {
                if (indicators.length > 0) {
                    const maxScroll = productsGrid.scrollWidth - productsGrid.clientWidth;
                    const progress = currentPosition / maxScroll;
                    const activeIndex = Math.floor(progress  (indicators.length - 1));
                    indicators.forEach((indicator, index) => {
                        if (index === activeIndex) {
                            indicator.classList.add('active');
                        } else {
                            indicator.classList.remove('active');
                        }
                    });
                }
            }
            
            productsGrid.style.transition = 'transform 0.3s ease';
        }
    });

    // ===================================
    // PRODUCT CARD HOVER EFFECTS
    // ===================================
    const productCards = document.querySelectorAll('.product-card');
    
    productCards.forEach(card => {
        card.addEventListener('mouseenter', function() { this.style.transform = 'translateY(-4px)'; });
        card.addEventListener('mouseleave', function() { this.style.transform = 'translateY(0)'; });
    });

    // ===================================
    // BENEFIT CARDS HOVER EFFECTS
    // ===================================
    const benefitCards = document.querySelectorAll('.benefit-card');
    
    benefitCards.forEach(card => {
        card.addEventListener('mouseenter', function() { this.style.transform = 'scale(1.02)'; });
        card.addEventListener('mouseleave', function() { this.style.transform = 'scale(1)'; });
    });

    // ===================================
    // SEARCH BAR - SUGERENCIAS TIPO MERCADO LIBRE
    // ===================================
    const searchInput = document.querySelector('.search-input');
    const searchButton = document.querySelector('.search-button');
    const suggestionsBox = document.getElementById('suggestions-box');

    if (searchInput && suggestionsBox) {
        const allCards = document.querySelectorAll('.product-card, .product-card-small');

        // Recopilar todos los nombres de productos únicos
        const productNames = [];
        allCards.forEach(card => {
            const nameEl = card.querySelector('.product-title, .product-name-small, .product-name');
            const text = nameEl ? nameEl.textContent.trim() : '';
            if (text && !productNames.includes(text)) {
                productNames.push(text);
            }
        });

        const showSuggestions = () => {
            const term = searchInput.value.trim().toLowerCase();
            suggestionsBox.innerHTML = '';

            if (term.length === 0) {
                suggestionsBox.style.display = 'none';
                return;
            }

            const matches = productNames.filter(name => name.toLowerCase().includes(term));

            if (matches.length > 0) {
                matches.slice(0, 6).forEach(match => {
                    const div = document.createElement('div');
                    div.className = 'suggestion-item';
                    // Resaltar la parte que coincide
                    const regex = new RegExp(`(${term})`, 'gi');
                    const highlighted = match.replace(regex, '<strong>$1</strong>');
                    div.innerHTML = `<span class="suggestion-icon">🕒</span><span>${highlighted}</span>`;
                    
                    div.addEventListener('click', () => {
                        searchInput.value = match;
                        suggestionsBox.style.display = 'none';
                        // Filtrar productos al seleccionar sugerencia
                        filterProducts(match.toLowerCase());
                    });
                    suggestionsBox.appendChild(div);
                });
                suggestionsBox.style.display = 'block';
            } else {
                suggestionsBox.style.display = 'none';
            }
        };

        const filterProducts = (term) => {
            allCards.forEach(card => {
                const nameEl = card.querySelector('.product-title, .product-name-small, .product-name');
                const text = nameEl ? nameEl.textContent.toLowerCase() : '';
                card.style.display = text.includes(term) ? '' : 'none';
            });

            document.querySelectorAll('.product-section').forEach(section => {
                const cards = section.querySelectorAll('.product-card');
                const allHidden = [...cards].every(c => c.style.display === 'none');
                section.style.display = allHidden ? 'none' : '';
            });

            const recentSection = document.querySelector('.recent-products');
            if (recentSection) {
                const smallCards = recentSection.querySelectorAll('.product-card-small');
                const allHidden = [...smallCards].every(c => c.style.display === 'none');
                recentSection.style.display = allHidden ? 'none' : '';
            }
        };

        const resetFilter = () => {
            allCards.forEach(card => { card.style.display = ''; });
            document.querySelectorAll('.product-section, .recent-products').forEach(sec => {
                sec.style.display = '';
            });
        };

        // Mostrar sugerencias mientras escribe
        searchInput.addEventListener('input', debounce(showSuggestions, 200));

        // Buscar al presionar Enter
        searchInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                const term = searchInput.value.trim().toLowerCase();
                suggestionsBox.style.display = 'none';
                if (term) {
                    filterProducts(term);
                } else {
                    resetFilter();
                }
            }
        });

        // Buscar al hacer clic en el botón
        if (searchButton) {
            searchButton.addEventListener('click', () => {
                const term = searchInput.value.trim().toLowerCase();
                suggestionsBox.style.display = 'none';
                if (term) {
                    filterProducts(term);
                } else {
                    resetFilter();
                }
            });
        }

        // Cerrar sugerencias al hacer clic fuera
        document.addEventListener('click', (e) => {
            if (!e.target.closest('.search-bar')) {
                suggestionsBox.style.display = 'none';
            }
        });

        // Limpiar filtro si se borra el input
        searchInput.addEventListener('input', () => {
            if (searchInput.value.trim() === '') resetFilter();
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
            if (cookieNotice) cookieNotice.style.display = 'none';
            console.log('Cookies aceptadas');
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
        let isExpanded = true;
        
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
            if (link.getAttribute('href') === '#') {
                e.preventDefault();
                console.log('Navegación a:', link.textContent.trim());
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
                    target.scrollIntoView({ behavior: 'smooth', block: 'start' });
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

    const sections = document.querySelectorAll('.product-section, .entertainment-section, .device-promos');
    sections.forEach(section => {
        section.style.opacity = '0';
        section.style.transform = 'translateY(20px)';
        section.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
        observer.observe(section);
    });

    console.log('✅ Mercado Libre - Réplica cargada correctamente');
    console.log('📦 Esta es una demostración educativa de la interfaz de Mercado Libre');
});

// ===================================
// UTILITY FUNCTIONS
// ===================================

function formatPrice(price) {
    return new Intl.NumberFormat('es-CO', {
        style: 'currency',
        currency: 'COP',
        minimumFractionDigits: 0
    }).format(price);
}

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

window.addEventListener('resize', debounce(() => {
    console.log('Ventana redimensionada');
}, 250));

function isInViewport(element) {
    const rect = element.getBoundingClientRect();
    return (
        rect.top >= 0 &&
        rect.left >= 0 &&
        rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
        rect.right <= (window.innerWidth || document.documentElement.clientWidth)
    );
}

document.addEventListener('wheel', (e) => {
    if (e.deltaX !== 0) {
        const target = e.target.closest('.products-grid');
        if (!target) e.preventDefault();
    }
}, { passive: false });