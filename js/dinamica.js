// ===== FUNCIONALIDAD PRINCIPAL DE LA PÁGINA =====
document.addEventListener('DOMContentLoaded', function() {

    // ===== EFECTO DE SCROLL EN EL ENCABEZADO =====
    const encabezado = document.querySelector('.encabezado');
    const navMovil = document.querySelector('.navegacion-movil'); // Seleccionamos el menú móvil
    if (encabezado) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 50) { // Se activa después de bajar 50px
                encabezado.classList.add('scrolled');
                if (navMovil) navMovil.classList.add('scrolled'); // Añadimos la clase al menú móvil
            } else {
                encabezado.classList.remove('scrolled');
                if (navMovil) navMovil.classList.remove('scrolled'); // Quitamos la clase del menú móvil
            }
        });
    } else {
        console.warn('⚠️ No se encontró el elemento .encabezado');
    }

    // ===== NAVEGACIÓN SUAVE =====
    const enlacesNav = document.querySelectorAll('.enlace-nav');
    enlacesNav.forEach(enlace => {
        enlace.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            if (href.startsWith('#')) {
                e.preventDefault();
                const seccion = document.querySelector(href);
                if (seccion) {
                    const posicion = seccion.offsetTop;
                    window.scrollTo({
                        top: posicion,
                        behavior: 'smooth'
                    });
                }
            }
        });
    });

    // ===== DESTACAR ENLACE ACTIVO =====
    const secciones = document.querySelectorAll('section[id]');
    function resaltarEnlaceActivo() {
        const posicionScroll = window.scrollY + 150;
        secciones.forEach(seccion => {
            const inicio = seccion.offsetTop;
            const fin = inicio + seccion.offsetHeight;
            const id = seccion.getAttribute('id');
            const enlace = document.querySelector(`.enlace-nav[href="#${id}"]`);
            if (posicionScroll >= inicio && posicionScroll < fin) {
                enlacesNav.forEach(e => e.classList.remove('activo'));
                if (enlace) enlace.classList.add('activo');
            }
        });
    }
    window.addEventListener('scroll', resaltarEnlaceActivo);

    // ===== MENÚ MÓVIL =====
    const botonMenu = document.querySelector('.boton-menu-movil');
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
        const enlacesMovil = navMovil.querySelectorAll('.enlace-nav');
        enlacesMovil.forEach(enlace => {
            enlace.addEventListener('click', () => {
                navMovil.classList.remove('activo');
                overlay.classList.remove('activo');
                body.style.overflow = '';
            });
        });
    }

    // ===== FORMULARIO DE CONTACTO =====
    const formulario = document.getElementById('formulario-contacto');
    if (formulario) {
        formulario.addEventListener('submit', function(e) {
            e.preventDefault();
            alert('¡Gracias por tu mensaje! Pronto nos pondremos en contacto.');
            formulario.reset();
        });
    }

    // ===== ANIMACIONES AL HACER SCROLL =====
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('is-visible');
                observer.unobserve(entry.target); // Para que la animación se ejecute solo una vez
            }
        });
    }, {
        threshold: 0.1 // La animación se dispara cuando el 10% del elemento es visible
    });

    const elementosAnimados = document.querySelectorAll('.animate-blur-in, .animate-tracking-in, .animate-tracking-in-fast');
    elementosAnimados.forEach(el => observer.observe(el));

    setupHeroCarousel(); // Iniciar el carrusel de la página principal

    console.log('✅ Página GALIL_BO cargada correctamente');

    // ===== CARRITO LATERAL =====
    setupCart();

    function setupCart() {
        const cartPanel = document.getElementById('cart-panel');
        const cartFloatBtn = document.getElementById('cart-float-btn');
        const closeCartBtn = document.getElementById('close-cart-btn');
        const cartItems = document.getElementById('cart-items');
        const cartCount = document.getElementById('cart-count');
        const cartSubtotal = document.getElementById('cart-subtotal');
        const cartTotal = document.getElementById('cart-total');
        const checkoutBtn = document.getElementById('checkout-btn');

        // Usar localStorage para persistencia permanente
        let cart = JSON.parse(localStorage.getItem('galil_cart')) || [];

        // Función para actualizar el carrito
        function updateCart() {
            cartItems.innerHTML = '';
            let subtotal = 0;

            if (cart.length === 0) {
                cartItems.innerHTML = '<p class="empty-cart">Tu carrito está vacío</p>';
            } else {
                cart.forEach((item, index) => {
                    const itemElement = document.createElement('div');
                    itemElement.className = 'cart-item';
                    itemElement.innerHTML = `
                        <div class="cart-item-info">
                            <img src="${item.image}" alt="${item.name}" class="cart-item-img">
                            <div class="cart-item-details">
                                <h4>${item.name}</h4>
                                <p>Talla: ${item.size}</p>
                                <p>Bs. ${item.price}</p>
                                <div class="cart-item-quantity">
                                    <button class="quantity-btn" data-action="decrease" data-index="${index}">-</button>
                                    <span>${item.quantity}</span>
                                    <button class="quantity-btn" data-action="increase" data-index="${index}">+</button>
                                </div>
                            </div>
                        </div>
                        <button class="remove-item-btn" data-index="${index}">&times;</button>
                    `;
                    cartItems.appendChild(itemElement);
                    subtotal += item.price * item.quantity;
                });
            }

            cartSubtotal.textContent = `Bs. ${subtotal}`;
            cartTotal.textContent = `Bs. ${subtotal}`;
            cartCount.textContent = cart.reduce((total, item) => total + item.quantity, 0);

            localStorage.setItem('galil_cart', JSON.stringify(cart));
        }

        // Función para agregar producto al carrito
        window.addToCart = function(product) {
            // Crear identificador único basado en nombre, talla e imagen
            const productId = `${product.name}-${product.size}-${product.image}`;

            const existingItem = cart.find(item => `${item.name}-${item.size}-${item.image}` === productId);
            if (existingItem) {
                existingItem.quantity += 1;
            } else {
                cart.push({ ...product, quantity: 1 });
            }
            updateCart();
            showCart();
        };

        // Función para mostrar el carrito
        function showCart() {
            if (cartPanel) {
                cartPanel.classList.add('active');
            }
        }

        // Función para ocultar el carrito
        function hideCart() {
            if (cartPanel) {
                cartPanel.classList.remove('active');
            }
        }

        // Event listeners
        if (cartFloatBtn) {
            cartFloatBtn.addEventListener('click', showCart);
        }
        if (closeCartBtn) {
            closeCartBtn.addEventListener('click', hideCart);
        }

        // Event delegation para botones del carrito
        if (cartItems) {
            cartItems.addEventListener('click', (e) => {
                const target = e.target;
                const index = target.dataset.index;

                if (target.classList.contains('quantity-btn')) {
                    const action = target.dataset.action;
                    if (action === 'increase') {
                        cart[index].quantity += 1;
                    } else if (action === 'decrease') {
                        cart[index].quantity -= 1;
                        if (cart[index].quantity <= 0) {
                            cart.splice(index, 1);
                        }
                    }
                    updateCart();
                } else if (target.classList.contains('remove-item-btn')) {
                    cart.splice(index, 1);
                    updateCart();
                }
            });
        }

        if (checkoutBtn) {
            checkoutBtn.addEventListener('click', () => {
                if (cart.length === 0) {
                    alert('Tu carrito está vacío');
                } else {
                    alert('Funcionalidad de checkout próximamente');
                }
            });
        }

        // Inicializar carrito
        updateCart();
    }

    // ===== BOTÓN VER MÁS CATEGORÍAS =====
    const botonVerMas = document.getElementById('ver-mas-categorias');
    if (botonVerMas) {
        botonVerMas.addEventListener('click', function() {
            const categoriasOcultas = document.querySelectorAll('.categoria-oculta');
            
            categoriasOcultas.forEach(categoria => {
                // Usamos un pequeño delay para que la animación de aparición sea más fluida
                setTimeout(() => {
                    categoria.style.display = 'block';
                    categoria.classList.remove('categoria-oculta');
                }, 100);
            });

            // Ocultar el botón después de mostrar todas las categorías
            this.style.display = 'none';
        });
    }
    
});

document.addEventListener('DOMContentLoaded', function() {
    document.querySelectorAll('.categoria-oculta').forEach(el => el.style.display = 'none');
});



// ===== HERO CAROUSEL (para index.html) =====
function setupHeroCarousel() {
    const slides = document.querySelectorAll('.hero-carousel .slide');
    const dotsContainer = document.querySelector('.carousel-dots');
    const nextBtn = document.querySelector('.next-btn');
    const prevBtn = document.querySelector('.prev-btn');
    let currentSlide = 0;
    let slideInterval;

    if (slides.length === 0) return;

    // Crear puntos de paginación
    slides.forEach((_, i) => {
        const dot = document.createElement('button');
        dot.classList.add('dot');
        if (i === 0) dot.classList.add('active');
        dot.setAttribute('aria-label', `Ir a la diapositiva ${i + 1}`);
        dot.addEventListener('click', () => {
            goToSlide(i);
            resetInterval();
        });
        dotsContainer.appendChild(dot);
    });

    const dots = document.querySelectorAll('.carousel-dots .dot');

    function goToSlide(slideIndex) {
        slides[currentSlide].classList.remove('active');
        dots[currentSlide].classList.remove('active');
        
        currentSlide = (slideIndex + slides.length) % slides.length;

        slides[currentSlide].classList.add('active');
        dots[currentSlide].classList.add('active');
    }

    function nextSlide() {
        goToSlide(currentSlide + 1);
    }

    function prevSlide() {
        goToSlide(currentSlide - 1);
    }

    function startInterval() {
        slideInterval = setInterval(nextSlide, 7000); // Cambia cada 7 segundos
    }

    function resetInterval() {
        clearInterval(slideInterval);
        startInterval();
    }

    nextBtn.addEventListener('click', () => { nextSlide(); resetInterval(); });
    prevBtn.addEventListener('click', () => { prevSlide(); resetInterval(); });

    startInterval(); // Iniciar el carrusel automático
    setupCarouselSwipe(); // Activar la funcionalidad de swipe
}

// ===== SWIPE GESTURES PARA EL CARRUSEL (MÓVIL) =====
function setupCarouselSwipe() {
    const carousel = document.querySelector('.hero-carousel');
    if (!carousel) return;

    let startX = 0;
    let isSwiping = false;
    const swipeThreshold = 50; // Mínimo de píxeles para considerar un swipe

    carousel.addEventListener('pointerdown', (e) => {
        // Solo activar para eventos táctiles
        if (e.pointerType === 'touch') {
            startX = e.clientX;
            isSwiping = true;
            // Evitar que el navegador realice acciones por defecto (como seleccionar texto)
            carousel.style.touchAction = 'none'; 
        }
    }, { passive: true });

    carousel.addEventListener('pointermove', (e) => {
        if (!isSwiping || e.pointerType !== 'touch') return;

        const currentX = e.clientX;
        const diffX = startX - currentX;

        // Si el swipe supera el umbral
        if (Math.abs(diffX) > swipeThreshold) {
            const nextBtn = document.querySelector('.next-btn');
            const prevBtn = document.querySelector('.prev-btn');

            if (diffX > 0) {
                // Swipe a la izquierda -> Siguiente imagen
                if(nextBtn) nextBtn.click();
            } else {
                // Swipe a la derecha -> Imagen anterior
                if(prevBtn) prevBtn.click();
            }
            // Una vez que se detecta un swipe, dejamos de rastrear hasta el próximo toque
            isSwiping = false; 
        }
    }, { passive: true });

    carousel.addEventListener('pointerup', (e) => {
        if (e.pointerType === 'touch') {
            isSwiping = false;
            carousel.style.touchAction = 'auto'; // Restaurar comportamiento por defecto
        }
    });

    carousel.addEventListener('pointercancel', (e) => {
        if (e.pointerType === 'touch') {
            isSwiping = false;
            carousel.style.touchAction = 'auto';
        }
    });
}