document.addEventListener('DOMContentLoaded', function() {
    // Hamburger Menu Functionality
    const hamburgerMenu = document.querySelector('.hamburger-menu');
    const navMenu = document.querySelector('.nav-menu');
    const body = document.body;

    if (hamburgerMenu && navMenu) {
        hamburgerMenu.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            this.classList.toggle('active');
            navMenu.classList.toggle('active');
            body.classList.toggle('menu-open');
        });

        // Close menu when clicking outside
        document.addEventListener('click', function(e) {
            if (!hamburgerMenu.contains(e.target) && !navMenu.contains(e.target)) {
                hamburgerMenu.classList.remove('active');
                navMenu.classList.remove('active');
                body.classList.remove('menu-open');
            }
        });

        // Close menu when clicking a link
        navMenu.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                hamburgerMenu.classList.remove('active');
                navMenu.classList.remove('active');
                body.classList.remove('menu-open');
            });
        });

        // Prevent menu links from bubbling up
        navMenu.addEventListener('click', function(e) {
            e.stopPropagation();
        });
    }

    // Menu category filtering
    const categoryBtns = document.querySelectorAll('.categoria-btn');
    const menuItems = document.querySelectorAll('.menu-item');
    
    if (categoryBtns.length > 0 && menuItems.length > 0) {
        categoryBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                categoryBtns.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                
                const category = btn.dataset.categoria;
                menuItems.forEach(item => {
                    if (category === 'all' || item.dataset.category === category) {
                        item.style.display = 'block';
                    } else {
                        item.style.display = 'none';
                    }
                });
            });
        });
    }

    // Form submission handling
    const reservaForm = document.querySelector('.reserva-form');
    if (reservaForm) {
        reservaForm.addEventListener('submit', function(e) {
            e.preventDefault();
            alert('Reserva recebida! Entraremos em contacto em breve.');
            this.reset();
        });
    }

    // Quantity Control Functionality
    const quantityControls = document.querySelectorAll('.quantity-control');
    
    quantityControls.forEach(control => {
        const decreaseBtn = control.querySelector('.decrease-quantity');
        const increaseBtn = control.querySelector('.increase-quantity');
        const quantityInput = control.querySelector('.quantity-input');

        if (decreaseBtn && increaseBtn && quantityInput) {
            // Set initial value
            if (!quantityInput.value) {
                quantityInput.value = '1';
            }

            // Decrease quantity
            decreaseBtn.addEventListener('click', () => {
                let currentValue = parseInt(quantityInput.value);
                if (currentValue > 1) {
                    quantityInput.value = currentValue - 1;
                }
            });

            // Increase quantity
            increaseBtn.addEventListener('click', () => {
                let currentValue = parseInt(quantityInput.value);
                if (currentValue < 99) {
                    quantityInput.value = currentValue + 1;
                }
            });

            // Validate manual input
            quantityInput.addEventListener('change', () => {
                let value = parseInt(quantityInput.value);
                if (isNaN(value) || value < 1) {
                    quantityInput.value = '1';
                } else if (value > 99) {
                    quantityInput.value = '99';
                }
            });

            // Prevent non-numeric input
            quantityInput.addEventListener('keypress', (e) => {
                if (!/[0-9]/.test(e.key)) {
                    e.preventDefault();
                }
            });
        }
    });

    // Enhanced date and time validation for takeaway orders
    const pickupDate = document.getElementById('pickup-date');
    const pickupTime = document.getElementById('pickup-time');

    if (pickupDate && pickupTime) {
        // Set current date and time
        const now = new Date();
        
        // Format today's date for the date input min attribute
        const todayFormatted = now.toISOString().split('T')[0];
        pickupDate.min = todayFormatted;
        pickupDate.value = todayFormatted; // Set default date to today
        
        // Set restaurant operating hours (24-hour format)
        const openingTime = 11; // 11:00
        const closingTime = 22; // 22:00
        
        // Calculate the next available pickup time (current time + 30 minutes, rounded to next 15 min)
        function calculateNextAvailableTime() {
            const currentDate = new Date();
            
            // Add 30 minutes for preparation
            currentDate.setMinutes(currentDate.getMinutes() + 30);
            
            // Round to next 15-minute interval
            const minutes = currentDate.getMinutes();
            const roundedMinutes = Math.ceil(minutes / 15) * 15;
            currentDate.setMinutes(roundedMinutes, 0, 0); // Reset seconds and milliseconds
            
            // If time is before opening, set to opening time
            if (currentDate.getHours() < openingTime) {
                currentDate.setHours(openingTime, 0, 0, 0);
            }
            
            // If time is after closing, set to opening time of next day
            if (currentDate.getHours() >= closingTime) {
                currentDate.setDate(currentDate.getDate() + 1);
                currentDate.setHours(openingTime, 0, 0, 0);
                
                // Update the date picker to next day
                const nextDayFormatted = currentDate.toISOString().split('T')[0];
                pickupDate.value = nextDayFormatted;
            }
            
            return currentDate;
        }
        
        // Set the default time to the next available time
        function setDefaultTime() {
            const nextAvailableTime = calculateNextAvailableTime();
            const hours = nextAvailableTime.getHours().toString().padStart(2, '0');
            const mins = nextAvailableTime.getMinutes().toString().padStart(2, '0');
            pickupTime.value = `${hours}:${mins}`;
        }
        
        // Set default time when page loads
        setDefaultTime();
        
        // Update min time when date changes
        pickupDate.addEventListener('change', function() {
            const selectedDate = new Date(this.value);
            const today = new Date();
            
            // Reset time if date is changed
            if (selectedDate.toDateString() === today.toDateString()) {
                // If today is selected, set min time to next available time
                const nextAvailableTime = calculateNextAvailableTime();
                const minHours = nextAvailableTime.getHours().toString().padStart(2, '0');
                const minMins = nextAvailableTime.getMinutes().toString().padStart(2, '0');
                
                pickupTime.min = `${minHours}:${minMins}`;
                
                // If current time value is before min time, update it
                if (pickupTime.value < pickupTime.min) {
                    pickupTime.value = pickupTime.min;
                }
            } else {
                // If future date is selected, set min time to opening time
                pickupTime.min = `${openingTime.toString().padStart(2, '0')}:00`;
                
                // Set default time to opening time for future dates
                pickupTime.value = `${openingTime.toString().padStart(2, '0')}:00`;
            }
            
            validateDateTime();
        });
        
        // Validate time when it changes
        pickupTime.addEventListener('change', validateDateTime);
        
        // Function to validate date and time
        function validateDateTime() {
            const selectedDate = new Date(pickupDate.value);
            const [hours, minutes] = pickupTime.value.split(':').map(Number);
            selectedDate.setHours(hours, minutes, 0, 0);
            
            const now = new Date();
            const minPickupTime = new Date(now.getTime() + 30 * 60000); // Current time + 30 minutes
            
            // Check if selected time is in the past
            if (selectedDate < minPickupTime) {
                alert('Por favor, selecione uma hora futura para o levantamento (mínimo 30 minutos a partir de agora).');
                setDefaultTime(); // Reset to default time
                return false;
            }
            
            // Check if selected time is within operating hours
            if (hours < openingTime || hours >= closingTime) {
                alert(`Por favor, selecione uma hora entre ${openingTime}:00 e ${closingTime}:00.`);
                
                // Reset to a valid time
                if (hours < openingTime) {
                    pickupTime.value = `${openingTime.toString().padStart(2, '0')}:00`;
                } else {
                    // If after closing, set to opening time of next day
                    pickupDate.valueAsDate = new Date(selectedDate.getTime() + 24 * 60 * 60 * 1000); // Next day
                    pickupTime.value = `${openingTime.toString().padStart(2, '0')}:00`;
                }
                
                return false;
            }
            
            return true;
        }
        
        // Validate on form submission
        const checkoutBtn = document.querySelector('.checkout-btn');
        if (checkoutBtn) {
            const originalClickHandler = checkoutBtn.onclick;
            
            checkoutBtn.onclick = function(e) {
                if (!validateDateTime()) {
                    e.preventDefault();
                    return false;
                }
                
                // Call original handler if it exists
                if (typeof originalClickHandler === 'function') {
                    return originalClickHandler.call(this, e);
                }
            };
        }
    }
    
    // Shopping cart functionality
    const cartToggle = document.querySelector('.cart-toggle');
    const cartContainer = document.querySelector('.cart-container');
    const closeCart = document.querySelector('.close-cart');
    const cartItems = document.querySelector('.cart-items');
    const cartTotal = document.querySelector('.cart-total');
    const cartBadge = document.querySelector('.cart-badge');
    const navCartBadge = document.querySelector('.nav-cart-badge');
    
    if (cartToggle && cartContainer && closeCart) {
        // Toggle cart visibility
        cartToggle.addEventListener('click', () => {
            cartContainer.classList.toggle('active');
        });
        
        // Close cart
        closeCart.addEventListener('click', () => {
            cartContainer.classList.remove('active');
        });
    }
    
    // Order confirmation modal functionality
    const orderConfirmationModal = document.getElementById('orderConfirmationModal');
    const closeModalBtn = document.querySelector('.close-modal');
    
    if (orderConfirmationModal && closeModalBtn) {
        closeModalBtn.addEventListener('click', () => {
            orderConfirmationModal.classList.remove('active');
        });
    }
}); 
