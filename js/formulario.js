// Formulario de checkout
document.addEventListener('DOMContentLoaded', function() {
    console.log('🚀 Inicializando formulario de checkout...');

    // Inicializar funcionalidades
    setupBackButton();
    loadCartItems();
    setupPaymentMethods();
    setupFormValidation();
    setupFormSubmission();

    // Efecto de scroll en el header
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
});

// ===== FUNCIONALIDAD DEL BOTÓN VOLVER =====
function setupBackButton() {
    const backButton = document.querySelector('.back-button');
    if (backButton) {
        backButton.addEventListener('click', () => {
            // Si hay historial, volver atrás
            if (window.history.length > 1) {
                window.history.back();
            } else {
                // Si no hay historial, ir al index
                window.location.href = '../index.html';
            }
        });
    }
}

// ===== CARRITO Y RESUMEN =====
function loadCartItems() {
    const cart = JSON.parse(localStorage.getItem('galil_cart')) || [];
    const orderSummary = document.getElementById('order-summary');

    if (!orderSummary) return;

    if (cart.length === 0) {
        orderSummary.innerHTML = '<p>No hay productos en el carrito</p>';
        return;
    }

    let subtotal = 0;
    let html = '';

    cart.forEach(item => {
        const itemTotal = item.price * item.quantity;
        subtotal += itemTotal;

        html += `
            <div class="order-item">
                <div style="display: flex; align-items: center; gap: 15px;">
                    <img src="${item.image}" alt="${item.name}" style="width: 70px; height: 70px; object-fit: cover; border-radius: 8px; border: 1px solid #eee;" onerror="this.style.display='none'">
                    <div>
                        <strong>${item.name}</strong>
                        <br>
                        <small>Talla: ${item.size} | Cantidad: ${item.quantity}</small>
                    </div>
                </div>
                <span>Bs ${(itemTotal).toFixed(2)}</span>
            </div>
        `;
    });

    // Subtotal
    html += `
        <div class="order-item">
            <strong>Subtotal:</strong>
            <span>Bs ${subtotal.toFixed(2)}</span>
        </div>
    `;

    // Costo de envío (fijo por ahora)
    const shipping = 20;
    const total = subtotal + shipping;

    html += `
        <div class="order-item">
            <strong>Envío:</strong>
            <span>Bs ${shipping.toFixed(2)}</span>
        </div>
        <div class="order-item order-total">
            <strong>Total:</strong>
            <span class="order-total">Bs ${total.toFixed(2)}</span>
        </div>
    `;

    orderSummary.innerHTML = html;
}

// ===== MÉTODOS DE PAGO =====
function setupPaymentMethods() {
    const paymentMethods = document.querySelectorAll('.payment-method');
    const paymentDetails = document.getElementById('payment-details');

    paymentMethods.forEach(method => {
        method.addEventListener('click', () => {
            // Remover selección anterior
            paymentMethods.forEach(m => m.classList.remove('selected'));

            // Seleccionar método actual
            method.classList.add('selected');

            // Actualizar información de pago
            const methodType = method.dataset.method;
            updatePaymentDetails(methodType);
        });
    });
}

function updatePaymentDetails(method) {
    const paymentDetails = document.getElementById('payment-details');

    switch (method) {
        case 'transferencia':
            paymentDetails.innerHTML = `
                <div class="payment-info">
                    <h4>Información para Transferencia Bancaria:</h4>
                    <p><strong>Banco:</strong> Banco Unión</p>
                    <p><strong>Cuenta:</strong> 1234567890</p>
                    <p><strong>Nombre:</strong> GALIL_BO</p>
                    <p><strong>CI:</strong> 12345678</p>
                    <p style="color: #007bff; margin-top: 10px;">
                        <i class="fas fa-info-circle"></i>
                        Una vez realizada la transferencia, envíanos el comprobante por WhatsApp.
                    </p>
                </div>
            `;
            break;

        case 'qr':
            paymentDetails.innerHTML = `
                <div class="payment-info">
                    <h4>Pago con Código QR:</h4>
                    <p>Escanea el código QR que te enviaremos por WhatsApp para realizar el pago.</p>
                    <p style="color: #007bff; margin-top: 10px;">
                        <i class="fas fa-info-circle"></i>
                        Recibirás el QR después de confirmar el pedido.
                    </p>
                </div>
            `;
            break;

        case 'efectivo':
            paymentDetails.innerHTML = `
                <div class="payment-info">
                    <h4>Pago en Efectivo:</h4>
                    <p>Puedes pagar en efectivo al momento de la entrega.</p>
                    <p style="color: #007bff; margin-top: 10px;">
                        <i class="fas fa-info-circle"></i>
                        Solo disponible para entregas en Santa Cruz.
                    </p>
                </div>
            `;
            break;
    }
}

// ===== VALIDACIÓN DE FORMULARIO =====
function setupFormValidation() {
    const form = document.getElementById('checkout-form');
    const inputs = form.querySelectorAll('input[required], select[required], textarea[required]');

    inputs.forEach(input => {
        input.addEventListener('blur', validateField);
        input.addEventListener('input', clearFieldError);
    });

    // Validación de email en tiempo real
    const emailInput = document.getElementById('email');
    if (emailInput) {
        emailInput.addEventListener('input', validateEmail);
    }
}

function validateField(e) {
    const field = e.target;
    const errorElement = document.getElementById(`${field.id}-error`);

    if (!field.checkValidity()) {
        showFieldError(field, errorElement);
    } else {
        hideFieldError(field, errorElement);
    }
}

function validateEmail(e) {
    const email = e.target.value;
    const errorElement = document.getElementById('email-error');

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (email && !emailRegex.test(email)) {
        showFieldError(e.target, errorElement, 'Ingresa un correo electrónico válido');
    } else {
        hideFieldError(e.target, errorElement);
    }
}

function showFieldError(field, errorElement, message = null) {
    field.style.borderColor = '#dc3545';
    if (errorElement) {
        errorElement.textContent = message || errorElement.textContent;
        errorElement.style.display = 'block';
    }
}

function hideFieldError(field, errorElement) {
    field.style.borderColor = '#e1e1e1';
    if (errorElement) {
        errorElement.style.display = 'none';
    }
}

function clearFieldError(e) {
    const field = e.target;
    const errorElement = document.getElementById(`${field.id}-error`);

    if (field.value.trim() !== '') {
        hideFieldError(field, errorElement);
    }
}

// ===== ENVÍO DEL FORMULARIO =====
function setupFormSubmission() {
    const form = document.getElementById('checkout-form');
    const submitBtn = document.getElementById('submit-btn');
    const successMessage = document.getElementById('success-message');

    form.addEventListener('submit', async (e) => {
        e.preventDefault();

        // Validar formulario completo
        if (!validateForm()) {
            return;
        }

        // Deshabilitar botón
        submitBtn.disabled = true;
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Procesando...';

        try {
            // Simular envío (aquí iría la lógica real de envío)
            await submitOrder();

            // Mostrar mensaje de éxito
            form.style.display = 'none';
            successMessage.style.display = 'block';

            // Limpiar carrito
            localStorage.removeItem('galil_cart');

            // Scroll al mensaje de éxito
            successMessage.scrollIntoView({ behavior: 'smooth' });

        } catch (error) {
            console.error('Error al enviar el pedido:', error);
            alert('Hubo un error al procesar tu pedido. Por favor, intenta nuevamente.');
        } finally {
            // Rehabilitar botón
            submitBtn.disabled = false;
            submitBtn.innerHTML = '<i class="fas fa-check"></i> Confirmar Pedido';
        }
    });
}

function validateForm() {
    const requiredFields = document.querySelectorAll('input[required], select[required]');
    let isValid = true;

    requiredFields.forEach(field => {
        if (!field.value.trim()) {
            const errorElement = document.getElementById(`${field.id}-error`);
            showFieldError(field, errorElement);
            isValid = false;
        }
    });

    // Validar email
    const emailInput = document.getElementById('email');
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (emailInput && emailInput.value && !emailRegex.test(emailInput.value)) {
        const errorElement = document.getElementById('email-error');
        showFieldError(emailInput, errorElement, 'Ingresa un correo electrónico válido');
        isValid = false;
    }

    // Verificar que hay productos en el carrito
    const cart = JSON.parse(localStorage.getItem('galil_cart')) || [];
    if (cart.length === 0) {
        alert('No hay productos en el carrito');
        isValid = false;
    }

    return isValid;
}

async function submitOrder() {
    // Recopilar datos del formulario
    const formData = new FormData(document.getElementById('checkout-form'));

    const orderData = {
        customer: {
            firstName: formData.get('firstName'),
            lastName: formData.get('lastName'),
            email: formData.get('email'),
            phone: formData.get('phone')
        },
        shipping: {
            address: formData.get('address'),
            city: formData.get('city'),
            postalCode: formData.get('postalCode'),
            notes: formData.get('notes')
        },
        payment: {
            method: document.querySelector('.payment-method.selected').dataset.method
        },
        cart: JSON.parse(localStorage.getItem('galil_cart')) || [],
        timestamp: new Date().toISOString()
    };

    // Calcular totales
    let subtotal = 0;
    orderData.cart.forEach(item => {
        subtotal += item.price * item.quantity;
    });
    orderData.totals = {
        subtotal: subtotal,
        shipping: 20,
        total: subtotal + 20
    };

    // Aquí iría la lógica para enviar los datos a un servidor
    // Por ahora, simulamos el envío
    console.log('Pedido enviado:', orderData);

    // Simular delay de envío
    await new Promise(resolve => setTimeout(resolve, 2000));

    // Enviar por WhatsApp como respaldo
    sendOrderByWhatsApp(orderData);

    return orderData;
}

function sendOrderByWhatsApp(orderData) {
    let message = `🛍️ *NUEVO PEDIDO - GALIL_BO*\n\n`;
    message += `👤 *Cliente:* ${orderData.customer.firstName} ${orderData.customer.lastName}\n`;
    message += `📧 *Email:* ${orderData.customer.email}\n`;
    message += `📱 *Teléfono:* ${orderData.customer.phone}\n\n`;

    message += `📍 *Dirección de envío:*\n`;
    message += `${orderData.shipping.address}\n`;
    message += `${orderData.shipping.city}\n`;
    if (orderData.shipping.notes) {
        message += `📝 *Notas:* ${orderData.shipping.notes}\n`;
    }
    message += `\n`;

    message += `💳 *Método de pago:* ${getPaymentMethodName(orderData.payment.method)}\n\n`;

    message += `🛒 *Productos:*\n`;
    orderData.cart.forEach(item => {
        message += `• ${item.name} (Talla: ${item.size}) x${item.quantity} - Bs ${(item.price * item.quantity).toFixed(2)}\n`;
    });

    message += `\n💰 *Total: Bs ${orderData.totals.total.toFixed(2)}*\n`;
    message += `(Subtotal: Bs ${orderData.totals.subtotal.toFixed(2)} + Envío: Bs ${orderData.totals.shipping.toFixed(2)})\n\n`;

    message += `✅ *Pedido confirmado - ${new Date().toLocaleString('es-ES')}*`;

    const encodedMessage = encodeURIComponent(message);
    const whatsappUrl = `https://wa.me/59162134776?text=${encodedMessage}`;

    // Abrir WhatsApp en nueva ventana
    window.open(whatsappUrl, '_blank');
}

function getPaymentMethodName(method) {
    switch (method) {
        case 'transferencia': return 'Transferencia Bancaria';
        case 'qr': return 'Código QR';
        case 'efectivo': return 'Efectivo';
        default: return method;
    }
}