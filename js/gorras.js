// Gorras data - generated dynamically
const gorras = [];
const TOTAL_GORRAS = 10; // Define el número total de gorras aquí

for (let i = 1; i <= TOTAL_GORRAS; i++) {
    // ===== ASIGNACIÓN DE PRECIOS =====
    // Aquí puedes definir los precios para cada gorra.
    let price;
    if (i <= 5) {
        price = 150; // Precio para las gorras 1 a 5
    } else {
        price = 100; // Precio para las gorras 6 a 10
    }

    // Array con los números de las gorras que usan la extensión .jpg
    const jpgCaps = [6, 7, 8, 9, 10];

    // Por defecto, la extensión es .jpeg
    let extension = 'jpeg';

    // Si el número de la gorra actual está en el array, se usa .jpg
    if (jpgCaps.includes(i)) {
        extension = 'jpg';
    }

    gorras.push({
        id: `gorra${i}`,
        name: `Gorra ${i}`, // Nombre generado automáticamente
        // Estructura de imágenes actualizada
        images: [
            `gorra${i}.${extension}`,
            `gorra${i}.1.${extension}`,
            `gorra${i}.1.1.${extension}`,
            `gorra${i}.1.1.1.${extension}`
        ],
        price: price
    });
}

// Pagination variables
const ITEMS_PER_PAGE = 12;
let loadedItems = 0;
let currentGorraImages = [];
let currentImageIndex = 0;
let selectedSize = null;
let currentGorra = null;

// ===== INTERSECTION OBSERVER PARA ANIMACIONES =====
const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            observer.unobserve(entry.target);
        }
    });
}, {
    threshold: 0.1
});

// Load gorras on page load
document.addEventListener('DOMContentLoaded', function () {
    console.log('🚀 Inicializando página de gorras...');
    loadGorras();
    setupModal();
    setupMobileMenu(); // Función para el menú móvil
    setupImageErrorHandling();

    const elementosAnimados = document.querySelectorAll('.animate-on-scroll');
    elementosAnimados.forEach(el => observer.observe(el));

    // ===== EFECTO DE SCROLL EN EL HEADER =====
    const header = document.querySelector('.header');
    const navMovil = document.querySelector('.navegacion-movil');
    if (header) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 50) {
                header.classList.add('scrolled');
                if (navMovil) navMovil.classList.add('scrolled');
            } else {
                header.classList.remove('scrolled');
                if (navMovil) navMovil.classList.remove('scrolled');
            }
        });
    }

    // Ajustar la velocidad del video de la portada
    const headerVideo = document.querySelector('.gorras-header-videos video');
    if (headerVideo) {
        headerVideo.playbackRate = 1.0; // Velocidad normal
    }

    // Inicializar carrito al cargar la página
    updateCart();
});

// ===== MENÚ MÓVIL (copiado de dinamica.js para esta página) =====
function setupMobileMenu() {
    const botonMenu = document.querySelector('.boton-menu-movil');
    const navMovil = document.querySelector('.navegacion-movil');
    const botonCerrar = document.querySelector('.boton-cerrar-movil');
    const overlay = document.querySelector('.overlay-movil');
    const body = document.body;

    if (botonMenu && navMovil) {
        botonMenu.addEventListener('click', () => {
            navMovil.classList.add('activo');
            overlay.classList.add('activo');
            body.style.overflow = 'hidden';
        });

        [botonCerrar, overlay].forEach(elemento => {
            if (elemento) {
                elemento.addEventListener('click', () => {
                    navMovil.classList.remove('activo');
                    overlay.classList.remove('activo');
                    body.style.overflow = '';
                });
            }
        });

        // Cerrar al hacer clic en enlaces
        const enlacesMovil = navMovil.querySelectorAll('.nav-link');
        enlacesMovil.forEach(enlace => {
            enlace.addEventListener('click', () => {
                navMovil.classList.remove('activo');
                overlay.classList.remove('activo');
                body.style.overflow = '';
            });
        });
    } else {
        console.warn('⚠️ Elementos del menú móvil no encontrados.');
    }
}

// ===== SISTEMA DE CARGA DE GORRAS =====
function loadGorras() {
    loadGorrasBatch();
    setupLoadMore();
}

function loadGorrasBatch() {
    const grid = document.getElementById('gorras-grid');
    if (!grid) {
        console.error('❌ No se encontró el contenedor de gorras');
        return;
    }

    const startIndex = loadedItems;
    const endIndex = Math.min(startIndex + ITEMS_PER_PAGE, gorras.length);

    // Mostrar skeletons de carga
    showLoadingSkeletons(grid, startIndex, endIndex);

    // Cargar contenido real después de un delay
    setTimeout(() => {
        for (let i = startIndex; i < endIndex; i++) {
            const gorraCard = createGorraCard(gorras[i]);
            // Reemplazar skeleton con card real
            const skeleton = document.getElementById(`skeleton-${i}`);
            if (skeleton) {
                skeleton.replaceWith(gorraCard);
                observer.observe(gorraCard); // Observar la nueva tarjeta para la animación
            } else {
                grid.appendChild(gorraCard);
            }
        }

        loadedItems = endIndex;
        console.log(`✅ Cargadas ${loadedItems} de ${gorras.length} gorras`);

        // Ocultar botón si todas las gorras están cargadas
        const loadMoreBtn = document.getElementById('load-more-btn');
        if (loadMoreBtn && loadedItems >= gorras.length) {
            loadMoreBtn.style.display = 'none';
            loadMoreBtn.textContent = '🎉 Todas las gorras cargadas';
        }
    }, 300);
}

function showLoadingSkeletons(grid, startIndex, endIndex) {
    for (let i = startIndex; i < endIndex; i++) {
        const skeleton = document.createElement('div');
        skeleton.className = 'gorra-card gorra-card-loading';
        skeleton.id = `skeleton-${i}`;

        skeleton.innerHTML = `
            <div class="skeleton-image"></div>
            <div class="skeleton-info">
                <div class="skeleton-name"></div>
                <div class="skeleton-price"></div>
            </div>
        `;

        grid.appendChild(skeleton);
    }
}

function setupLoadMore() {
    const loadMoreBtn = document.getElementById('load-more-btn');
    if (loadMoreBtn) {
        loadMoreBtn.addEventListener('click', () => {
            // Agregar animación de carga
            loadMoreBtn.classList.add('loading');
            loadMoreBtn.disabled = true;
            loadMoreBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Cargando...';

            setTimeout(() => {
                loadGorrasBatch();
                loadMoreBtn.classList.remove('loading');
                loadMoreBtn.disabled = false;
                loadMoreBtn.innerHTML = '<i class="fas fa-plus"></i> Cargar Más Gorras';

                // Scroll suave a los nuevos elementos
                const newItems = document.querySelectorAll('.gorra-card:not(.gorra-card-loading)');
                if (newItems.length > 0) {
                    const lastNewItem = newItems[newItems.length - 1];
                    lastNewItem.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
                }
            }, 500);
        });
    }
}

function createGorraCard(gorra) {
    const card = document.createElement('div');
    card.className = 'gorra-card animate-on-scroll';
    card.setAttribute('data-id', gorra.id);

    const img = document.createElement('img');
    img.src = `../img/gorras/${gorra.images[0]}`;
    img.alt = gorra.name;
    img.loading = 'lazy';
    img.className = 'gorra-image';

    // El manejador de errores global se encargará de esto
    img.addEventListener('error', function() {
        // El manejador de errores global se encargará de reemplazar la imagen.
    });

    const info = document.createElement('div');
    info.className = 'gorra-info';

    const name = document.createElement('div');
    name.className = 'gorra-name';
    name.textContent = gorra.name;

    const price = document.createElement('div');
    price.className = 'gorra-price';
    price.innerHTML = `<i class="fas fa-tag"></i> ${gorra.price} Bs`;

    info.appendChild(name);
    info.appendChild(price);
    card.appendChild(img);
    card.appendChild(info);

    // Event listeners
    card.addEventListener('click', () => openModal(gorra));

    // Accesibilidad con teclado
    card.setAttribute('tabindex', '0');
    card.setAttribute('role', 'button');
    card.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            openModal(gorra);
        }
    });

    return card;
}

// ===== SISTEMA DE MODAL =====
function setupModal() {
    const modal = document.getElementById('gorra-modal');
    const closeBtn = document.querySelector('.close-modal');

    if (!modal) {
        console.error('No se encontró el modal');
        return;
    }

    if (closeBtn) {
        closeBtn.addEventListener('click', closeModal);
    }

    // Cerrar modal al hacer clic fuera
    window.addEventListener('click', (e) => {
        if (e.target === modal) {
            closeModal();
        }
    });

    // Navegación con teclado
    document.addEventListener('keydown', (e) => {
        if (modal.style.display === 'block') {
            if (e.key === 'Escape') {
                closeModal();
            } else if (e.key === 'ArrowLeft') {
                e.preventDefault();
                changeImage(currentImageIndex - 1);
            } else if (e.key === 'ArrowRight') {
                e.preventDefault();
                changeImage(currentImageIndex + 1);
            }
        }
    });

    // Botones de navegación
    const prevBtn = document.querySelector('.modal-prev');
    const nextBtn = document.querySelector('.modal-next');

    if (prevBtn) {
        prevBtn.addEventListener('click', () => changeImage(currentImageIndex - 1));
    }

    if (nextBtn) {
        nextBtn.addEventListener('click', () => changeImage(currentImageIndex + 1));
    }

    console.log('✅ Modal configurado correctamente');
}

function closeModal() {
    const modal = document.getElementById('gorra-modal');
    const modalContent = modal.querySelector('.modal-content');
    if (modal) {
        // Añadir animación de salida
        modalContent.classList.add('modal-close-anim');
        document.body.style.overflow = '';

        // Esperar a que termine la animación para ocultar el modal
        modalContent.addEventListener('animationend', function handler() {
            // Limpiar clases para la próxima vez que se abra
            modalContent.classList.remove('modal-close-anim');
            modalContent.removeEventListener('animationend', handler);
            // Ocultar el modal solo después de que la animación termine
            modal.style.display = 'none';
        });

        // Iniciar la transición de desvanecimiento del fondo del modal
        modal.classList.remove('visible');
    }
}

function openModal(gorra) {
    const modal = document.getElementById('gorra-modal');
    const modalContent = modal.querySelector('.modal-content');
    const modalMainImageContainer = document.querySelector('.modal-main-image');
    const modalThumbnailsContainer = document.querySelector('.modal-thumbnails');
    const modalTitle = document.getElementById('modal-title');
    const modalDescription = document.getElementById('modal-description');
    const modalPrice = document.querySelector('.modal-price-value');

    if (!modal || !modalMainImageContainer) {
        console.error('Elementos del modal no encontrados');
        return;
    }

    currentGorra = gorra;
    currentGorraImages = gorra.images;
    currentImageIndex = 0;
    selectedSize = null;

    // Asegurarse de que las clases de animación de salida no estén presentes
    modalContent.classList.remove('modal-close-anim');
    modalContent.classList.remove('modal-open-anim');

    // Limpiar contenedores
    modalMainImageContainer.innerHTML = '';
    modalThumbnailsContainer.innerHTML = '';

    // Crear imagen principal
    const mainImage = document.createElement('img');
    mainImage.className = 'modal-image';
    mainImage.alt = gorra.name;
    modalMainImageContainer.appendChild(mainImage);

    // Usar el array de imágenes ya definido para la gorra, que tiene la estructura correcta.
    const orderedImages = gorra.images;

    // Crear indicador de múltiples imágenes para móvil
    if (orderedImages.length > 1) {
        const mobileIndicator = document.createElement('div');
        mobileIndicator.className = 'modal-image-indicator-mobile';
        mobileIndicator.innerHTML = `<i class="fas fa-images"></i> ${orderedImages.length}`;
        modalMainImageContainer.appendChild(mobileIndicator);
    }

    // Crear thumbnails (solo para desktop)
    orderedImages.forEach((imageSrc, index) => {
        const thumbnail = document.createElement('img');
        thumbnail.src = `../img/gorras/${imageSrc}`;
        thumbnail.alt = `Vista ${index + 1} de ${gorra.name}`;
        thumbnail.className = 'modal-thumbnail';

        thumbnail.addEventListener('click', () => changeImage(index));
        thumbnail.addEventListener('error', function() {
            console.warn(`Thumbnail no encontrado: ${this.src} - se ocultará.`);
            this.remove(); // Si la imagen no existe, se elimina el thumbnail.
        });

        modalThumbnailsContainer.appendChild(thumbnail);
    });

    // Actualizar el array de imágenes actual para la navegación y llamar a la primera imagen
    currentGorraImages = orderedImages;
    changeImage(0);

    // Actualizar información
    if (modalTitle) {
        modalTitle.textContent = gorra.name;
    }

    if (modalDescription) {
        modalDescription.textContent = `Descubre los detalles de nuestra gorra ${gorra.name.toLowerCase()}. Un accesorio único de nuestra colección urbana, diseñado con materiales de primera calidad y un estilo inconfundible.`;
    }

    if (modalPrice) {
        modalPrice.textContent = `${gorra.price} Bs`;
    }

    // Configurar selección de tallas
    setupSizeSelection();
    updateWhatsAppLink();

    // Configurar gestos táctiles
    setupSwipeGestures(modalMainImageContainer);

    // Mostrar modal
    modal.style.display = 'block';
    modal.classList.add('visible');
    document.body.style.overflow = 'hidden'; // Evitar scroll de fondo
    // Aplicar la animación de apertura
    modalContent.classList.add('modal-open-anim');

    // Limpiar la clase de animación de apertura cuando termine
    modalContent.addEventListener('animationend', function handler() {
        modalContent.classList.remove('modal-open-anim');
        modalContent.removeEventListener('animationend', handler);
    }, { once: true });

    // Focus management para accesibilidad
    const closeBtn = modal.querySelector('.close-modal');
    if (closeBtn) {
        closeBtn.focus();
    }

    console.log(`📱 Modal abierto: ${gorra.name}`);
}

function changeImage(index) {
    if (currentGorraImages.length === 0) return;

    // Circular navigation
    if (index < 0) {
        index = currentGorraImages.length - 1;
    } else if (index >= currentGorraImages.length) {
        index = 0;
    }

    currentImageIndex = index;
    const imageSrc = currentGorraImages[index];

    const mainImageContainer = document.querySelector('.modal-main-image');
    const mainImage = document.querySelector('.modal-main-image .modal-image');
    if (mainImage && mainImageContainer) {
        // Remover la clase fade-in para iniciar la transición oscura
        mainImageContainer.classList.remove('fade-in');

        setTimeout(() => {
            mainImage.src = `../img/gorras/${imageSrc}`;
            mainImage.alt = `${currentGorra.name} - Vista ${index + 1}`;

            // Agregar la clase fade-in cuando la imagen cargue para revelar gradualmente
            mainImage.onload = function() {
                mainImageContainer.classList.add('fade-in');
            };
        }, 100); // Pequeño delay para asegurar que se quite la clase

        console.log(`Cambiando a imagen: ${imageSrc} (índice: ${index})`);
    }

    // Actualizar indicador de imagen
    const imageIndicator = document.querySelector('.modal-image-indicator');
    if (imageIndicator) {
        imageIndicator.textContent = `${index + 1} / ${currentGorraImages.length}`;
    }

    // Actualizar thumbnails activos (desktop)
    const thumbnails = document.querySelectorAll('.modal-thumbnail');
    thumbnails.forEach((thumbnail, i) => {
        if (i === index) {
            thumbnail.classList.add('active');
        } else {
            thumbnail.classList.remove('active');
        }
    });

    // No hay puntos para actualizar ya que se eliminaron
}

// Variables globales para swipe gestures
let isProcessingSwipe = false;
const SWIPE_THRESHOLD = 80;
const MIN_SWIPE_DISTANCE = 30;

function setupSwipeGestures(element) {
    // Inicializar los handlers una sola vez
    if (element.dataset.swipeInitialized) {
        return;
    }

    element.dataset.swipeInitialized = 'true';

    let startX = 0;
    let startY = 0;
    let isTracking = false;

    // Usar Pointer Events para mayor fiabilidad
    element.addEventListener('pointerdown', (e) => {
        if (isProcessingSwipe) return;

        startX = e.clientX;
        startY = e.clientY;
        isTracking = true;
        element.setPointerCapture(e.pointerId);
    }, { passive: true });

    element.addEventListener('pointermove', (e) => {
        if (!isTracking || isProcessingSwipe) return;

        const currentX = e.clientX;
        const currentY = e.clientY;
        const deltaX = startX - currentX;
        const deltaY = Math.abs(startY - currentY);

        // Threshold (umbral) y bloqueo de gestos mientras se procesa el cambio
        if (Math.abs(deltaX) > SWIPE_THRESHOLD && Math.abs(deltaX) > deltaY && Math.abs(deltaX) > MIN_SWIPE_DISTANCE) {
            isProcessingSwipe = true; // Bloquear múltiples disparos
            isTracking = false;

            if (deltaX > 0) {
                // Swipe izquierda - siguiente imagen
                changeImage(currentImageIndex + 1);
            } else {
                // Swipe derecha - imagen anterior
                changeImage(currentImageIndex - 1);
            }

            // Reset después de un breve delay
            setTimeout(() => {
                isProcessingSwipe = false;
            }, 300);
        }
    }, { passive: true });

    element.addEventListener('pointerup', () => {
        isTracking = false;
    }, { passive: true });

    element.addEventListener('pointercancel', () => {
        isTracking = false;
        isProcessingSwipe = false;
    }, { passive: true });

    console.log('🎯 Swipe gestures inicializados correctamente (una sola vez)');
}

// ===== SISTEMA DE TALLAS Y WHATSAPP =====
function setupSizeSelection() {
    const sizeButtons = document.querySelectorAll('.size-btn');
    sizeButtons.forEach(button => {
        button.addEventListener('click', () => {
            selectSize(button.dataset.size);
        });

        // Accesibilidad con teclado
        button.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                selectSize(button.dataset.size);
            }
        });
    });
}

function selectSize(size) {
    // Remover selección anterior
    const sizeButtons = document.querySelectorAll('.size-btn');
    sizeButtons.forEach(button => {
        button.classList.remove('selected');
        button.setAttribute('aria-pressed', 'false');
    });

    // Seleccionar nueva talla
    const selectedButton = document.querySelector(`.size-btn[data-size="${size}"]`);
    if (selectedButton) {
        selectedButton.classList.add('selected');
        selectedButton.setAttribute('aria-pressed', 'true');
        selectedSize = size;
        updateWhatsAppLink();
        console.log(`📏 Talla seleccionada: ${size}`);
    }
}

function updateWhatsAppLink() {
    const whatsappLink = document.querySelector('.cta-button');
    if (whatsappLink && currentGorra) {
        let message = `Hola, estoy interesado en la gorra ${currentGorra.name}`;
        if (selectedSize) {
            message += ` en talla ${selectedSize}`;
        }
        message += `. ¿Podrían darme más información?`;

        const encodedMessage = encodeURIComponent(message);
        whatsappLink.href = `https://wa.me/59162134776?text=${encodedMessage}`; // Reemplaza con tu número

        // Tracking de clicks
        whatsappLink.addEventListener('click', function() {
            console.log(`WhatsApp clickeado: ${currentGorra.name}, Talla: ${selectedSize || 'No seleccionada'}`);
            trackWhatsAppClick(currentGorra.name, selectedSize);
        });
    }
}

function trackWhatsAppClick(productName, size) {
    // Aquí puedes agregar Google Analytics o otro sistema de tracking
    // Ejemplo: gtag('event', 'whatsapp_click', { product_name: productName, size: size });
}

// ===== MANEJO DE ERRORES DE IMAGEN =====
function setupImageErrorHandling() {
    document.addEventListener('error', function(e) {
        if (e.target.tagName === 'IMG') {
            const img = e.target;
            if (img.src.includes('gorras/')) {
                console.warn(`⚠️ Error cargando imagen, no se encontró en la ruta: ${img.src}`);
                img.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgdmlld0JveD0iMCAwIDIwMCAyMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIyMDAiIGhlaWdodD0iMjAwIiBmaWxsPSIjRjBGMEYwIi8+CjxwYXRoIGQ9Ik03NSA1MEgxMjVWMTUwSDc1VjUwWiIgZmlsbD0iI0Q4RDhEOCIvPgo8cGF0aCBkPSJNODAgNjBIMTIwVjE0MEg4MFY2MFoiIGZpbGw9IiNGRkZGRkYiLz4KPHBhdGggZD0iTTEwMCAxMTBWOTBNMTAwIDEzMFYxMTBNOTAgMTIwSDEwME0xMDAgMTIwSDExMCIgc3Ryb2tlPSIjOTk5IiBzdHJva2Utd2lkdGg9IjIiLz4KPC9zdmc+';
                img.alt = 'Imagen no disponible';
            }
        }
    }, true);
}

// ===== OPTIMIZACIONES DE RENDIMIENTO =====
window.addEventListener('load', function() {
    // Pre-cargar siguiente lote de imágenes
    if (loadedItems < gorras.length) {
        const nextBatch = gorras.slice(loadedItems, loadedItems + ITEMS_PER_PAGE);
        preloadImages(nextBatch);
    }
});

function preloadImages(gorrasBatch) {
    gorrasBatch.forEach(gorra => {
        const img = new Image();
        img.src = `../img/gorras/${gorra.images[0]}`;
    });
}

// ===== CARRITO LATERAL =====
const cartButton = document.getElementById('cart-button');
const cartPanel = document.getElementById('cart-panel');
const closeCart = document.getElementById('close-cart');
const cartItemsContainer = document.getElementById('cart-items');
const cartSubtotal = document.getElementById('cart-subtotal');
const cartTotal = document.getElementById('cart-total');
const cartCount = document.getElementById('cart-count');
const checkoutBtn = document.getElementById('checkout-btn');

// Usar localStorage para persistencia permanente
let cart = JSON.parse(localStorage.getItem('galil_cart')) || [];

// ✅ Actualizar carrito visualmente
function updateCart() {
  cartItemsContainer.innerHTML = '';
  let subtotal = 0;

  cart.forEach((item, index) => {
    subtotal += item.price * item.quantity;

    const div = document.createElement('div');
    div.classList.add('cart-item');
    div.innerHTML = `
      <img src="${item.image}" alt="${item.name}" onerror="this.src='data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjYwIiBoZWlnaHQ9IjYwIiBmaWxsPSIjRjBGMEYwIi8+CjxwYXRoIGQ9Ik0zMCAxNUgzMFYzMEgzMFYxNVoiIGZpbGw9IiM5OTk5OTkiLz4KPHBhdGggZD0iTTMwIDI1SDE1VjMwSDE1VjI1WiIgZmlsbD0iIzk5OTk5OSIvc3Ryb2tlPSIjOTk5IiBzdHJva2Utd2lkdGg9IjIiLz4KPC9zdmc+'">
      <div class="cart-item-info">
        <p class="cart-item-title">${item.name}</p>
        <p class="cart-item-color">Talla: ${item.size}</p>
        <div style="display:flex;align-items:center;gap:8px;">
          <button class="qty-btn" onclick="changeQuantity(${index}, -1)">-</button>
          <span>${item.quantity}</span>
          <button class="qty-btn" onclick="changeQuantity(${index}, 1)">+</button>
        </div>
        <p class="cart-item-price">Bs ${(item.price * item.quantity).toFixed(2)}</p>
      </div>
      <i class="fas fa-trash" onclick="removeFromCart(${index})"></i>
    `;
    cartItemsContainer.appendChild(div);
  });

  cartSubtotal.textContent = `Bs ${subtotal.toFixed(2)}`;
  cartTotal.textContent = `Bs ${subtotal.toFixed(2)}`;
  cartCount.textContent = cart.reduce((sum, item) => sum + item.quantity, 0);

  // Guardar en localStorage (persiste permanentemente)
  localStorage.setItem('galil_cart', JSON.stringify(cart));
}

// ✅ Cambiar cantidad de productos
function changeQuantity(index, delta) {
  cart[index].quantity += delta;
  if (cart[index].quantity <= 0) cart.splice(index, 1);
  updateCart();
}

// ✅ Eliminar producto del carrito
function removeFromCart(index) {
  cart.splice(index, 1);
  updateCart();
}

// ✅ Agregar producto al carrito
function addToCart(product) {
  // Crear un identificador único basado en nombre, talla e imagen
  const productId = `${product.name}-${product.size}-${product.image}`;

  const existing = cart.find(p => `${p.name}-${p.size}-${p.image}` === productId);
  if (existing) {
    existing.quantity += 1;
  } else {
    cart.push({ ...product, quantity: 1 });
  }

  updateCart();
  cartPanel.classList.add('active');
}

// ✅ Eventos
if (cartButton) {
  cartButton.addEventListener('click', () => cartPanel.classList.add('active'));
}
if (closeCart) {
  closeCart.addEventListener('click', () => cartPanel.classList.remove('active'));
}
if (checkoutBtn) {
  checkoutBtn.addEventListener('click', () => {
    window.location.href = "../paginas/formulario.html"; // ajusta ruta si es necesario
  });
}

// ✅ Capturar los botones "Agregar al carrito"
document.addEventListener('click', (e) => {
  if (e.target.classList.contains('agregar-carrito') || e.target.closest('.agregar-carrito')) {
    const btn = e.target.classList.contains('agregar-carrito') ? e.target : e.target.closest('.agregar-carrito');

    // Obtener datos del producto actual desde el modal
    const modalTitle = document.getElementById('modal-title');
    const modalPrice = document.querySelector('.modal-price-value');

    if (modalTitle && modalPrice) {
      const product = {
        name: modalTitle.textContent,
        price: parseFloat(modalPrice.textContent.replace('Bs', '').trim()),
        size: 'N/A', // Por ahora sin talla específica para gorras
        image: currentGorra ? `../img/gorras/${currentGorra.images[0]}` : ''
      };

      addToCart(product);

      // ✅ Cerrar modal automáticamente si el producto está en uno
      const modal = btn.closest('.modal, .product-modal, .popup');
      if (modal) modal.style.display = 'none';
    }
  }
});


// ===== FUNCIONES GLOBALES =====
window.closeModal = closeModal;
window.openModal = openModal;
