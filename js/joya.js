// Joyas data - generated dynamically
const joyas = [];
const TOTAL_JOYAS = 6; // Define el número total de joyas aquí

for (let i = 1; i <= TOTAL_JOYAS; i++) {
    // ===== ASIGNACIÓN DE PRECIOS =====
    // Aquí puedes definir los precios para cada joya.
    let price;
    if (i === 1 || i === 5) {
        price = 450; // Precio para las joyas 1 y 5
        
    } else if (i === 2) {
        price = 2100; // Precio para la joya 2
    } else {
        price = 1200; // Precio para las joyas 3, 4 y 6
    }
   

    // Determinar las imágenes disponibles para cada joya
    let images = [];
    if (i >= 1 && i <= 6) {
        // Las joyas solo tienen una imagen cada una
        images = [`joya${i}.jpeg`];
    }

    joyas.push({
        id: `joya${i}`,
        name: `Joya ${i}`, // Nombre generado automáticamente
        images: images,
        price: price
    });
}

// Pagination variables
const ITEMS_PER_PAGE = 12;
let loadedItems = 0;
let currentJoyaImages = [];
let currentImageIndex = 0;
let currentJoya = null;

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

// Load joyas on page load
document.addEventListener('DOMContentLoaded', function () {
    console.log('🚀 Inicializando página de joyas...');
    loadJoyas();
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
    const headerVideo = document.querySelector('.joyas-header-videos video');
    if (headerVideo) {
        headerVideo.playbackRate = 0.7; // Un valor menor a 1.0 hace el video más lento.
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

// ===== SISTEMA DE CARGA DE JOYAS =====
function loadJoyas() {
    loadJoyasBatch();
    setupLoadMore();
}

function loadJoyasBatch() {
    const grid = document.getElementById('joyas-grid');
    if (!grid) {
        console.error('❌ No se encontró el contenedor de joyas');
        return;
    }

    const startIndex = loadedItems;
    const endIndex = Math.min(startIndex + ITEMS_PER_PAGE, joyas.length);

    // Mostrar skeletons de carga
    showLoadingSkeletons(grid, startIndex, endIndex);

    // Cargar contenido real después de un delay
    setTimeout(() => {
        for (let i = startIndex; i < endIndex; i++) {
            const joyaCard = createJoyaCard(joyas[i]);
            // Reemplazar skeleton con card real
            const skeleton = document.getElementById(`skeleton-${i}`);
            if (skeleton) {
                skeleton.replaceWith(joyaCard);
                observer.observe(joyaCard); // Observar la nueva tarjeta para la animación
            } else {
                grid.appendChild(joyaCard);
            }
        }

        loadedItems = endIndex;
        console.log(`✅ Cargadas ${loadedItems} de ${joyas.length} joyas`);

        // Ocultar botón si todas las joyas están cargadas
        const loadMoreBtn = document.getElementById('load-more-btn');
        if (loadMoreBtn && loadedItems >= joyas.length) {
            loadMoreBtn.style.display = 'none';
            loadMoreBtn.textContent = '🎉 Todas las joyas cargadas';
        }
    }, 300);
}

function showLoadingSkeletons(grid, startIndex, endIndex) {
    for (let i = startIndex; i < endIndex; i++) {
        const skeleton = document.createElement('div');
        skeleton.className = 'joya-card joya-card-loading';
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
                loadJoyasBatch();
                loadMoreBtn.classList.remove('loading');
                loadMoreBtn.disabled = false;
                loadMoreBtn.innerHTML = '<i class="fas fa-plus"></i> Cargar Más Joyas';

                // Scroll suave a los nuevos elementos
                const newItems = document.querySelectorAll('.joya-card:not(.joya-card-loading)');
                if (newItems.length > 0) {
                    const lastNewItem = newItems[newItems.length - 1];
                    lastNewItem.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
                }
            }, 500);
        });
    }
}

function createJoyaCard(joya) {
    const card = document.createElement('div');
    card.className = 'joya-card animate-on-scroll';
    card.setAttribute('data-id', joya.id);

    const img = document.createElement('img');
    img.src = `../img/joyas/${joya.images[0]}`;
    img.alt = joya.name;
    img.loading = 'lazy';
    img.className = 'joya-image';

    // Manejo de errores de imagen
    img.addEventListener('error', function() {
        console.warn(`⚠️ Imagen no encontrada: ${this.src}`);
        this.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgdmlld0JveD0iMCAwIDIwMCAyMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIyMDAiIGhlaWdodD0iMjAwIiBmaWxsPSIjRjBGMEYwIi8+CjxwYXRoIGQ9Ik03NSA1MEgxMjVWMTUwSDc1VjUwWiIgZmlsbD0iI0Q4RDhEOCIvPgo8cGF0aCBkPSJNODAgNjBIMTIwVjE0MEg4MFY2MFoiIGZpbGw9IiNGRkZGRkYiLz4KPHBhdGggZD0iTTEwMCAxMTBWOTBNMTAwIDEzMFYxMTBNOTAgMTIwSDEwME0xMDAgMTIwSDExMCIgc3Ryb2tlPSIjOTk5IiBzdHJva2Utd2lkdGg9IjIiLz4KPC9zdmc+';
        this.alt = 'Imagen no disponible';
        this.style.display = 'none';
    });

    const info = document.createElement('div');
    info.className = 'joya-info';

    const name = document.createElement('div');
    name.className = 'joya-name';
    name.textContent = joya.name;

    const price = document.createElement('div');
    price.className = 'joya-price';
    price.innerHTML = `<i class="fas fa-tag"></i> ${joya.price} Bs`;

    info.appendChild(name);
    info.appendChild(price);
    card.appendChild(img);
    card.appendChild(info);

    // Event listeners
    card.addEventListener('click', () => openModal(joya));

    // Accesibilidad con teclado
    card.setAttribute('tabindex', '0');
    card.setAttribute('role', 'button');
    card.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            openModal(joya);
        }
    });

    return card;
}

// ===== SISTEMA DE MODAL =====
function setupModal() {
    const modal = document.getElementById('joya-modal');
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
    const modal = document.getElementById('joya-modal');
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

function openModal(joya) {
    const modal = document.getElementById('joya-modal');
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

    currentJoya = joya;
    currentJoyaImages = joya.images;
    currentImageIndex = 0;

    // Asegurarse de que las clases de animación de salida no estén presentes
    modalContent.classList.remove('modal-close-anim');
    modalContent.classList.remove('modal-open-anim');

    // Limpiar contenedores
    modalMainImageContainer.innerHTML = '';
    modalThumbnailsContainer.innerHTML = '';

    // Crear imagen principal
    const mainImage = document.createElement('img');
    mainImage.className = 'modal-image';
    mainImage.alt = joya.name;
    modalMainImageContainer.appendChild(mainImage);

    // Usar el array de imágenes individual de la joya
    const orderedImages = joya.images;

    // Crear indicador de imagen actual para móvil (como Instagram)
    if (orderedImages.length > 1) {
        const mobileIndicator = document.createElement('div');
        mobileIndicator.className = 'modal-image-indicator-mobile';
        mobileIndicator.innerHTML = `1/${orderedImages.length}`;
        modalMainImageContainer.appendChild(mobileIndicator);
    }

    orderedImages.forEach((imageSrc, index) => {
        const thumbnail = document.createElement('img');
        thumbnail.src = `../img/joyas/${imageSrc}`;
        thumbnail.alt = `Vista ${index + 1} de ${joya.name}`;
        thumbnail.className = 'modal-thumbnail';

        thumbnail.addEventListener('click', () => changeImage(index));
        thumbnail.addEventListener('error', function() {
            console.warn(`Thumbnail no encontrado: ${this.src} - removiendo del DOM`);
            this.remove();
        });

        modalThumbnailsContainer.appendChild(thumbnail);
    });

    // Actualizar el array de imágenes actual y cargar la primera
    currentJoyaImages = orderedImages;
    changeImage(0);

    // Actualizar información
    if (modalTitle) {
        modalTitle.textContent = joya.name;
    }

    if (modalDescription) {
        modalDescription.textContent = `Descubre los detalles de nuestra ${joya.name.toLowerCase()}. Una joya única de nuestra colección, diseñada con materiales de primera calidad y estilo inconfundible.`;
    }

    if (modalPrice) {
        modalPrice.textContent = `${joya.price} Bs`;
    }

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

    console.log(`📱 Modal abierto: ${joya.name}`);
}

function changeImage(index) {
    if (currentJoyaImages.length === 0) return;

    // Circular navigation
    if (index < 0) {
        index = currentJoyaImages.length - 1;
    } else if (index >= currentJoyaImages.length) {
        index = 0;
    }

    currentImageIndex = index;
    const imageSrc = currentJoyaImages[index];

    const mainImage = document.querySelector('.modal-main-image .modal-image');
    if (mainImage) {
        mainImage.src = `../img/joyas/${imageSrc}`;
        mainImage.alt = `${currentJoya.name} - Vista ${index + 1}`;
        console.log(`Cambiando a imagen: ${imageSrc} (índice: ${index})`);
    }

    // Actualizar indicador de imagen actual para móvil (como Instagram)
    const imageIndicator = document.querySelector('.modal-image-indicator-mobile');
    if (imageIndicator && currentJoyaImages.length > 1) {
        imageIndicator.innerHTML = `${index + 1}/${currentJoyaImages.length}`;
    }

    // Actualizar thumbnails activos
    const thumbnails = document.querySelectorAll('.modal-thumbnail');
    thumbnails.forEach((thumbnail, i) => {
        if (i === index) {
            thumbnail.classList.add('active');
        } else {
            thumbnail.classList.remove('active');
        }
    });
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

// ===== MANEJO DE ERRORES DE IMAGEN =====
function setupImageErrorHandling() {
    document.addEventListener('error', function(e) {
        if (e.target.tagName === 'IMG') {
            const img = e.target; // No es necesario cambiar aquí, ya que el path es 'joyas/' (minúscula)
            if (img.src.includes('/joyas/')) {
                console.warn(`⚠️ Error cargando imagen: ${img.src}`);
                img.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgdmlld0JveD0iMCAwIDIwMCAyMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIyMDAiIGhlaWdodD0iMjAwIiBmaWxsPSIjRjBGMEYwIi8+CjxwYXRoIGQ9Ik03NSA1MEgxMjVWMTUwSDc1VjUwWiIgZmlsbD0iI0Q4RDhEOCIvPgo8cGF0aCBkPSJNODAgNjBIMTIwVjE0MEg4MFY2MFoiIGZpbGw9IiNGRkZGRkYiLz4KPHBhdGggZD0iTTEwMCAxMTBWOTBNMTAwIDEzMFYxMTBNOTAgMTIwSDEwME0xMDAgMTIwSDExMCIgc3Ryb2tlPSIjOTk5IiBzdHJva2Utd2lkdGg9IjIiLz4KPC9zdmc+';
                img.alt = 'Imagen no disponible';
                img.style.display = 'none';
            }
        }
    }, true);
}

// ===== OPTIMIZACIONES DE RENDIMIENTO =====
window.addEventListener('load', function() {
    // Pre-cargar siguiente lote de imágenes
    if (loadedItems < joyas.length) {
        const nextBatch = joyas.slice(loadedItems, loadedItems + ITEMS_PER_PAGE);
        preloadImages(nextBatch);
    }
});

function preloadImages(joyasBatch) {
    joyasBatch.forEach(joya => {
        const img = new Image();
        img.src = `../img/joyas/${joya.images[0]}`;
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
        size: 'N/A', // Joyas no tienen tallas específicas
        image: currentJoya ? `../img/joyas/${currentJoya.images[0]}` : ''
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