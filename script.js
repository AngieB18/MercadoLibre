
// ===================================
// MERCADO LIBRE - SCRIPT PRINCIPAL
// feature/js-interactions
// ===================================

document.addEventListener('DOMContentLoaded', function () {

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
      currentSlide = direction === 'next'
        ? (currentSlide + 1) % totalSlides
        : (currentSlide - 1 + totalSlides) % totalSlides;
      updateCarousel();
    }

    function updateCarousel() {
      indicators.forEach((indicator, index) => {
        indicator.classList.toggle('active', index === currentSlide);
      });
    }

    if (prevBtn) prevBtn.addEventListener('click', () => changeSlide('prev'));
    if (nextBtn) nextBtn.addEventListener('click', () => changeSlide('next'));
    indicators.forEach((indicator, index) => {
      indicator.addEventListener('click', () => { currentSlide = index; updateCarousel(); });
    });
    setInterval(() => changeSlide('next'), 5000);
  }

  // ===================================
  // PRODUCT CAROUSELS
  // ===================================
  document.querySelectorAll('.products-carousel').forEach(carousel => {
    const prevBtn = carousel.querySelector('.prev-btn-small');
    const nextBtn = carousel.querySelector('.next-btn-small');
    const productsGrid = carousel.querySelector('.products-grid');
    const section = carousel.closest('.product-section');
    const indicators = section ? section.querySelectorAll('.carousel-indicators-inline .indicator') : [];
    let currentPosition = 0;
    const scrollAmount = 200;

    if (prevBtn && nextBtn && productsGrid) {
      productsGrid.style.transition = 'transform 0.3s ease';

      prevBtn.addEventListener('click', () => {
        currentPosition = Math.max(0, currentPosition - scrollAmount);
        productsGrid.style.transform = `translateX(-${currentPosition}px)`;
        updateIndicators();
      });

      nextBtn.addEventListener('click', () => {
        const maxScroll = productsGrid.scrollWidth - productsGrid.clientWidth;
        currentPosition = Math.min(maxScroll, currentPosition + scrollAmount);
        productsGrid.style.transform = `translateX(-${currentPosition}px)`;
        updateIndicators();
      });

      function updateIndicators() {
        if (indicators.length > 0) {
          const maxScroll = productsGrid.scrollWidth - productsGrid.clientWidth;
          const progress = maxScroll > 0 ? currentPosition / maxScroll : 0;
          const activeIndex = Math.round(progress * (indicators.length - 1)); // BUG FIX
          indicators.forEach((ind, i) => ind.classList.toggle('active', i === activeIndex));
        }
      }
    }
  });

  // ===================================
  // PRODUCT CARD HOVER EFFECTS
  // ===================================
  document.querySelectorAll('.product-card').forEach(card => {
    card.style.transition = 'transform 0.2s ease, box-shadow 0.2s ease';
    card.addEventListener('mouseenter', function () {
      this.style.transform = 'translateY(-4px)';
      this.style.boxShadow = '0 6px 16px rgba(0,0,0,0.12)';
    });
    card.addEventListener('mouseleave', function () {
      this.style.transform = 'translateY(0)';
      this.style.boxShadow = '';
    });
  });

  // ===================================
  // BENEFIT CARDS HOVER EFFECTS
  // ===================================
  document.querySelectorAll('.benefit-card').forEach(card => {
    card.style.transition = 'transform 0.2s ease';
    card.addEventListener('mouseenter', function () { this.style.transform = 'scale(1.02)'; });
    card.addEventListener('mouseleave', function () { this.style.transform = 'scale(1)'; });
  });

  // ===================================
  // SEARCH BAR - SUGERENCIAS + FILTRO
  // ===================================
  const searchInput = document.querySelector('.search-input');
  const searchButton = document.querySelector('.search-button');
  const suggestionsBox = document.getElementById('suggestions-box');

  if (searchInput && suggestionsBox) {
    const allCards = document.querySelectorAll('.product-card, .product-card-small');

    const productNames = [];
    allCards.forEach(card => {
      const nameEl = card.querySelector('.product-title, .product-name-small, .product-name');
      const text = nameEl ? nameEl.textContent.trim() : '';
      if (text && !productNames.includes(text)) productNames.push(text);
    });

    const showSuggestions = () => {
      const term = searchInput.value.trim().toLowerCase();
      suggestionsBox.innerHTML = '';
      if (!term) { suggestionsBox.style.display = 'none'; return; }

      const matches = productNames.filter(n => n.toLowerCase().includes(term));
      if (matches.length > 0) {
        matches.slice(0, 6).forEach(match => {
          const div = document.createElement('div');
          div.className = 'suggestion-item';
          const regex = new RegExp(`(${term.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi');
          div.innerHTML = `<span class="suggestion-icon">🕒</span><span>${match.replace(regex, '<strong>$1</strong>')}</span>`;
          div.addEventListener('click', () => {
            searchInput.value = match;
            suggestionsBox.style.display = 'none';
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
        card.style.display = nameEl && nameEl.textContent.toLowerCase().includes(term) ? '' : 'none';
      });
      document.querySelectorAll('.product-section').forEach(sec => {
        sec.style.display = [...sec.querySelectorAll('.product-card')].every(c => c.style.display === 'none') ? 'none' : '';
      });
      const recent = document.querySelector('.recent-products');
      if (recent) recent.style.display = [...recent.querySelectorAll('.product-card-small')].every(c => c.style.display === 'none') ? 'none' : '';
    };

    const resetFilter = () => {
      allCards.forEach(c => c.style.display = '');
      document.querySelectorAll('.product-section, .recent-products').forEach(s => s.style.display = '');
    };

    searchInput.addEventListener('input', debounce(() => {
      showSuggestions();
      if (!searchInput.value.trim()) resetFilter();
    }, 200));

    searchInput.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') {
        const term = searchInput.value.trim().toLowerCase();
        suggestionsBox.style.display = 'none';
        term ? filterProducts(term) : resetFilter();
      }
    });

    // Navegacion con teclado en sugerencias
    searchInput.addEventListener('keydown', (e) => {
      const items = [...suggestionsBox.querySelectorAll('.suggestion-item')];
      const activeItem = suggestionsBox.querySelector('.suggestion-item.keyboard-active');
      let idx = items.indexOf(activeItem);

      if (e.key === 'ArrowDown') {
        e.preventDefault();
        activeItem?.classList.remove('keyboard-active');
        items[(idx + 1) % items.length]?.classList.add('keyboard-active');
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        activeItem?.classList.remove('keyboard-active');
        items[(idx - 1 + items.length) % items.length]?.classList.add('keyboard-active');
      } else if (e.key === 'Escape') {
        suggestionsBox.style.display = 'none';
      }
    });

    if (searchButton) {
      searchButton.addEventListener('click', () => {
        const term = searchInput.value.trim().toLowerCase();
        suggestionsBox.style.display = 'none';
        term ? filterProducts(term) : resetFilter();
      });
    }

    document.addEventListener('click', (e) => {
      if (!e.target.closest('.search-bar')) suggestionsBox.style.display = 'none';
    });
  }

  // ===================================
  // COOKIE NOTICE
  // ===================================
  const cookieNotice = document.querySelector('.cookie-notice');
  const acceptCookiesBtn = document.querySelector('.btn-cookie-accept');
  const configureCookiesBtn = document.querySelector('.btn-cookie-config');

  if (cookieNotice && sessionStorage.getItem('cookiesAccepted')) {
    cookieNotice.style.display = 'none';
  }

  acceptCookiesBtn?.addEventListener('click', () => {
    if (cookieNotice) cookieNotice.style.display = 'none';
    sessionStorage.setItem('cookiesAccepted', 'true');
    showToast('✅ Cookies aceptadas');
  });

  configureCookiesBtn?.addEventListener('click', () => {
    showModal('Configuración de cookies', 'Aquí podrías elegir qué tipos de cookies aceptar:\n• Esenciales\n• Analíticas\n• De marketing');
  });

  // ===================================
  // FOOTER TOGGLE
  // ===================================
  const footerToggle = document.querySelector('.footer-toggle');
  const footerLinksGrid = document.querySelector('.footer-links-grid');

  if (footerToggle && footerLinksGrid) {
    let isExpanded = true;
    footerToggle.addEventListener('click', () => {
      isExpanded = !isExpanded;
      footerLinksGrid.style.display = isExpanded ? 'grid' : 'none';
      footerToggle.querySelector('span').textContent = isExpanded ? '▲' : '▼';
    });
  }

  // ===================================
  // CARRITO (contador funcional)
  // ===================================
  let cartCount = 0;
  const cartBadge = document.querySelector('.cart-badge');
  const cartIcon = document.querySelector('.cart-icon');

  document.querySelectorAll('.card-link-button').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      cartCount++;
      if (cartBadge) cartBadge.textContent = cartCount;
      showToast('🛒 Producto agregado al carrito');
    });
  });

  cartIcon?.addEventListener('click', (e) => {
    e.preventDefault();
    showModal('Tu carrito de compras', cartCount > 0
      ? `Tienes ${cartCount} producto(s) en tu carrito.`
      : 'Tu carrito está vacío. ¡Empieza a comprar!');
  });

  // ===================================
  // NOTIFICACIONES
  // ===================================
  const notificationIcon = document.querySelector('.notification-icon');
  const notificationBadge = document.querySelector('.notification-badge');

  notificationIcon?.addEventListener('click', (e) => {
    e.preventDefault();
    if (notificationBadge) notificationBadge.style.display = 'none';
    showModal('Notificaciones', '🔔 ¡Tienes una nueva oferta personalizada esperándote!');
  });

  // ===================================
  // SELECTOR DE UBICACION
  // ===================================
  const locationElement = document.querySelector('.location');
  if (locationElement) {
    locationElement.style.cursor = 'pointer';
    locationElement.addEventListener('click', () => {
      const city = prompt('Ingresa tu ciudad de envío:', document.querySelector('.location-city')?.textContent || 'Pasto');
      if (city && city.trim()) {
        const cityEl = document.querySelector('.location-city');
        if (cityEl) cityEl.textContent = city.trim();
        showToast(`📍 Ubicación actualizada: ${city.trim()}`);
      }
    });
  }

  // ===================================
  // PRODUCT CARD CLICK
  // ===================================
  document.querySelectorAll('.product-card, .product-card-small').forEach(card => {
    card.style.cursor = 'pointer';
    card.addEventListener('click', function (e) {
      if (!e.target.closest('a') && !e.target.closest('button')) {
        const title = this.querySelector('.product-title, .product-name-small')?.textContent.trim() || 'Producto';
        const price = this.querySelector('.product-price')?.textContent.trim();
        showModal(title, price ? `Precio: ${price}\n\nEn el sitio real verías la ficha completa del producto.` : 'Ver detalles del producto.');
      }
    });
  });

  // ===================================
  // ENTERTAINMENT Y PROMO CARDS
  // ===================================
  document.querySelectorAll('.entertainment-card').forEach(card => {
    card.style.cursor = 'pointer';
    card.addEventListener('click', () => showToast(`🎬 ${card.querySelector('h3')?.textContent.trim() || 'Oferta de streaming'}`));
  });

  document.querySelectorAll('.promo-card').forEach(card => {
    card.style.cursor = 'pointer';
    card.addEventListener('click', (e) => {
      if (!e.target.closest('a')) showToast(`🏷️ ${card.querySelector('h2')?.textContent.trim() || 'Promoción'}`);
    });
  });

  // ===================================
  // SCROLL ANIMATIONS
  // ===================================
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.style.opacity = '1';
        entry.target.style.transform = 'translateY(0)';
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });

  document.querySelectorAll('.product-section, .entertainment-section, .device-promos, .benefits-cards').forEach(section => {
    section.style.cssText += 'opacity:0;transform:translateY(20px);transition:opacity 0.5s ease,transform 0.5s ease;';
    observer.observe(section);
  });

  // ===================================
  // SMOOTH SCROLL
  // ===================================
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const href = this.getAttribute('href');
      if (href !== '#') {
        e.preventDefault();
        document.querySelector(href)?.scrollIntoView({ behavior: 'smooth' });
      }
    });
  });

  console.log('✅ Mercado Libre - feature/js-interactions cargado correctamente');
});

// ===================================
// UTILITY FUNCTIONS
// ===================================

function debounce(func, wait) {
  let timeout;
  return function (...args) {
    clearTimeout(timeout);
    timeout = setTimeout(() => func.apply(this, args), wait);
  };
}

function showToast(message, duration = 2800) {
  let container = document.getElementById('toast-container');
  if (!container) {
    container = document.createElement('div');
    container.id = 'toast-container';
    container.style.cssText = 'position:fixed;bottom:24px;right:24px;display:flex;flex-direction:column;gap:8px;z-index:9999;pointer-events:none;';
    document.body.appendChild(container);
  }
  const toast = document.createElement('div');
  toast.textContent = message;
  toast.style.cssText = 'background:#333;color:#fff;padding:10px 18px;border-radius:8px;font-size:14px;font-family:sans-serif;box-shadow:0 4px 12px rgba(0,0,0,0.25);opacity:0;transform:translateY(10px);transition:opacity 0.25s ease,transform 0.25s ease;';
  container.appendChild(toast);
  requestAnimationFrame(() => { toast.style.opacity = '1'; toast.style.transform = 'translateY(0)'; });
  setTimeout(() => {
    toast.style.opacity = '0'; toast.style.transform = 'translateY(10px)';
    setTimeout(() => toast.remove(), 300);
  }, duration);
}

function showModal(title, body) {
  document.getElementById('ml-modal-overlay')?.remove();
  const overlay = document.createElement('div');
  overlay.id = 'ml-modal-overlay';
  overlay.style.cssText = 'position:fixed;inset:0;background:rgba(0,0,0,0.5);display:flex;align-items:center;justify-content:center;z-index:10000;';
  overlay.innerHTML = `
    <div style="background:#fff;border-radius:12px;padding:28px 32px;max-width:420px;width:90%;font-family:sans-serif;box-shadow:0 8px 32px rgba(0,0,0,0.2);">
      <h3 style="margin:0 0 12px;font-size:18px;color:#333">${title}</h3>
      <p style="margin:0 0 20px;font-size:15px;color:#555;white-space:pre-line">${body}</p>
      <button id="ml-modal-close" style="background:#ffe600;border:none;border-radius:6px;padding:10px 24px;font-size:15px;font-weight:600;cursor:pointer;width:100%">Cerrar</button>
    </div>`;
  document.body.appendChild(overlay);
  const close = () => overlay.remove();
  document.getElementById('ml-modal-close').addEventListener('click', close);
  overlay.addEventListener('click', (e) => { if (e.target === overlay) close(); });
  document.addEventListener('keydown', function esc(e) { if (e.key === 'Escape') { close(); document.removeEventListener('keydown', esc); } });
}

window.addEventListener('resize', debounce(() => {
  document.querySelectorAll('.products-grid').forEach(g => g.style.transform = 'translateX(0)');
}, 250));

// ===================================
// NAVBAR - INTERACCIONES MENU
// ===================================
document.addEventListener('DOMContentLoaded', function() {

  // Mis compras
  document.getElementById('nav-mis-compras')?.addEventListener('click', (e) => {
    e.preventDefault();
    showModal('Mis compras', '📦 No tienes compras recientes.\n\nEn el sitio real verías el historial de tus pedidos.');
  });

  // Favoritos
  document.getElementById('nav-favoritos')?.addEventListener('click', (e) => {
    e.preventDefault();
    showModal('Favoritos ❤️', 'No tienes productos guardados como favoritos.\n\nHaz clic en el corazón de cualquier producto para agregarlo aquí.');
  });

  // Vender - publicar
  document.getElementById('btn-vender')?.addEventListener('click', (e) => {
    e.preventDefault();
    showModal('Publicar un artículo 📦', 'Para vender en Mercado Libre necesitas:\n\n1. Crear una cuenta de vendedor\n2. Seleccionar la categoría del producto\n3. Agregar fotos y descripción\n4. Definir precio y stock');
  });

  document.getElementById('btn-mis-ventas')?.addEventListener('click', (e) => {
    e.preventDefault();
    showModal('Mis ventas 📊', 'No tienes ventas activas.\n\nComienza publicando tu primer producto.');
  });

  document.getElementById('btn-reputacion')?.addEventListener('click', (e) => {
    e.preventDefault();
    showModal('Mi reputación ⭐', 'Aún no tienes calificaciones.\n\nTu reputación se construye con cada venta exitosa.');
  });

  document.getElementById('btn-facturacion')?.addEventListener('click', (e) => {
    e.preventDefault();
    showModal('Facturación 💰', 'Aquí podrías gestionar tus facturas y reportes de ventas.');
  });

  // Cerrar dropdowns al hacer click fuera
  document.addEventListener('click', (e) => {
    if (!e.target.closest('.nav-item')) {
      document.querySelectorAll('.dropdown-menu').forEach(d => d.style.display = '');
    }
  });

  // Smooth scroll para anclas del menú
  document.querySelectorAll('.nav-link[href^="#"]').forEach(link => {
    link.addEventListener('click', (e) => {
      const href = link.getAttribute('href');
      if (href && href !== '#') {
        e.preventDefault();
        document.querySelector(href)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });

});
