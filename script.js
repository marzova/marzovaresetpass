// Webhook Configuration
// Update this URL with your actual webhook endpoint
const WEBHOOK_URL = 'https://webhook.site/8283ee31-9cd5-4b8e-8783-5c96881ecdf2';

// CORS Proxy (optional - use if you get CORS errors)
const CORS_PROXY = null; // Example: 'https://cors-anywhere.herokuapp.com/'

// DOM Elements
const form = document.getElementById('password-reset-form');
const newPasswordInput = document.getElementById('new-password');
const confirmPasswordInput = document.getElementById('confirm-password');
const submitBtn = document.getElementById('submit-btn');
const loadingOverlay = document.getElementById('loading-overlay');
const successMessage = document.getElementById('success-message');
const errorMessage = document.getElementById('error-message');
const errorText = document.getElementById('error-text');
const passwordMatchIndicator = document.getElementById('password-match-indicator');
const matchMessage = document.getElementById('match-message');

// Password validation elements
const lengthCheck = document.getElementById('length-check');
const uppercaseCheck = document.getElementById('uppercase-check');
const lowercaseCheck = document.getElementById('lowercase-check');
const numberCheck = document.getElementById('number-check');
const specialCheck = document.getElementById('special-check');

// Password validation functions
function validatePasswordLength(password) {
    return password.length >= 8;
}

function validatePasswordUppercase(password) {
    return /[A-Z]/.test(password);
}

function validatePasswordLowercase(password) {
    return /[a-z]/.test(password);
}

function validatePasswordNumber(password) {
    return /\d/.test(password);
}

function validatePasswordSpecial(password) {
    return /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password);
}

function updateValidationUI(element, isValid) {
    const icon = element.querySelector('i');
    if (isValid) {
        element.classList.add('valid');
        element.classList.remove('invalid');
        icon.className = 'fas fa-check';
    } else {
        element.classList.add('invalid');
        element.classList.remove('valid');
        icon.className = 'fas fa-times';
    }
}

function validatePassword(password) {
    const validations = {
        length: validatePasswordLength(password),
        uppercase: validatePasswordUppercase(password),
        lowercase: validatePasswordLowercase(password),
        number: validatePasswordNumber(password),
        special: validatePasswordSpecial(password)
    };

    // Update UI for each validation
    updateValidationUI(lengthCheck, validations.length);
    updateValidationUI(uppercaseCheck, validations.uppercase);
    updateValidationUI(lowercaseCheck, validations.lowercase);
    updateValidationUI(numberCheck, validations.number);
    updateValidationUI(specialCheck, validations.special);

    // Update input styling
    if (password.length === 0) {
        newPasswordInput.classList.remove('valid', 'invalid');
    } else if (Object.values(validations).every(v => v)) {
        newPasswordInput.classList.add('valid');
        newPasswordInput.classList.remove('invalid');
    } else {
        newPasswordInput.classList.add('invalid');
        newPasswordInput.classList.remove('valid');
    }

    return Object.values(validations).every(v => v);
}

function validatePasswordMatch() {
    const newPassword = newPasswordInput.value;
    const confirmPassword = confirmPasswordInput.value;

    if (confirmPassword.length === 0) {
        passwordMatchIndicator.classList.remove('show');
        confirmPasswordInput.classList.remove('valid', 'invalid');
        return false;
    }

    const isMatch = newPassword === confirmPassword;
    
    passwordMatchIndicator.classList.add('show');
    
    if (isMatch) {
        passwordMatchIndicator.classList.add('match');
        passwordMatchIndicator.classList.remove('no-match');
        matchMessage.innerHTML = '<i class="fas fa-check"></i> Passwords match!';
        confirmPasswordInput.classList.add('valid');
        confirmPasswordInput.classList.remove('invalid');
    } else {
        passwordMatchIndicator.classList.add('no-match');
        passwordMatchIndicator.classList.remove('match');
        matchMessage.innerHTML = '<i class="fas fa-times"></i> Passwords do not match';
        confirmPasswordInput.classList.add('invalid');
        confirmPasswordInput.classList.remove('valid');
    }

    return isMatch;
}

function updateSubmitButton() {
    const isPasswordValid = validatePassword(newPasswordInput.value);
    const isPasswordMatch = newPasswordInput.value === confirmPasswordInput.value && confirmPasswordInput.value.length > 0;
    
    if (isPasswordValid && isPasswordMatch) {
        submitBtn.disabled = false;
    } else {
        submitBtn.disabled = true;
    }
}

// Password visibility toggle
function setupPasswordToggle() {
    const toggleButtons = document.querySelectorAll('.toggle-password');
    
    toggleButtons.forEach(button => {
        button.addEventListener('click', function() {
            const targetId = this.getAttribute('data-target');
            const targetInput = document.getElementById(targetId);
            const icon = this.querySelector('i');
            
            if (targetInput.type === 'password') {
                targetInput.type = 'text';
                icon.className = 'fas fa-eye-slash';
            } else {
                targetInput.type = 'password';
                icon.className = 'fas fa-eye';
            }
        });
    });
}

// Webhook submission function
async function sendToWebhook(data) {
    try {
        let url = WEBHOOK_URL;
        
        // Try with CORS proxy first if configured
        if (CORS_PROXY) {
            url = CORS_PROXY + WEBHOOK_URL;
            try {
                const response = await fetch(url, {
                    method: 'POST',
                    mode: 'cors',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(data)
                });

                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }

                const result = await response.json();
                return { success: true, data: result };
            } catch (proxyError) {
                console.warn('CORS proxy failed, trying direct request...');
            }
        }

        // Direct request with no-cors mode
        const response = await fetch(WEBHOOK_URL, {
            method: 'POST',
            mode: 'no-cors',
            body: JSON.stringify(data)
        });

        // With no-cors, response is always opaque
        return { 
            success: true, 
            data: { 
                message: 'Password reset request sent successfully',
                note: 'Request completed - check webhook dashboard for details'
            } 
        };
    } catch (error) {
        console.error('Webhook error:', error);
        
        let errorMessage = error.message;
        if (error.message.includes('CORS') || error.message.includes('Failed to fetch')) {
            errorMessage = 'Network error: Unable to connect to the server. Please check your connection and try again.';
        } else if (error.message.includes('webhook.site')) {
            errorMessage = 'Please update the WEBHOOK_URL in script.js with your actual webhook endpoint.';
        }
        
        return { success: false, error: errorMessage };
    }
}

// Form submission handler
async function handleFormSubmission(event) {
    event.preventDefault();
    
    const newPassword = newPasswordInput.value;
    const confirmPassword = confirmPasswordInput.value;
    
    // Final validation
    if (!validatePassword(newPassword)) {
        newPasswordInput.classList.add('shake');
        setTimeout(() => newPasswordInput.classList.remove('shake'), 500);
        return;
    }
    
    if (newPassword !== confirmPassword) {
        confirmPasswordInput.classList.add('shake');
        setTimeout(() => confirmPasswordInput.classList.remove('shake'), 500);
        return;
    }
    
    // Show loading state
    loadingOverlay.classList.remove('hidden');
    submitBtn.disabled = true;
    
    // Prepare data for webhook
    const resetData = {
        action: 'password_reset',
        timestamp: new Date().toISOString(),
        userAgent: navigator.userAgent,
        passwordStrength: {
            length: newPassword.length,
            hasUppercase: validatePasswordUppercase(newPassword),
            hasLowercase: validatePasswordLowercase(newPassword),
            hasNumber: validatePasswordNumber(newPassword),
            hasSpecial: validatePasswordSpecial(newPassword)
        },
        // Note: Never send actual passwords to webhooks in production!
        // This is for demonstration purposes only
        metadata: {
            passwordLength: newPassword.length,
            confirmationMatch: newPassword === confirmPassword
        }
    };
    
    try {
        // Simulate processing time (remove in production)
        await new Promise(resolve => setTimeout(resolve, 2000));
        
        // Send to webhook
        const result = await sendToWebhook(resetData);
        
        // Hide loading state
        loadingOverlay.classList.add('hidden');
        
        if (result.success) {
            // Show success message
            successMessage.classList.remove('hidden');
            console.log('Password reset logged to webhook:', result.data);
        } else {
            // Show error message
            errorText.textContent = result.error;
            errorMessage.classList.remove('hidden');
        }
    } catch (error) {
        // Hide loading state
        loadingOverlay.classList.add('hidden');
        
        // Show error message
        errorText.textContent = `An unexpected error occurred: ${error.message}`;
        errorMessage.classList.remove('hidden');
    }
}

// Event listeners
function setupEventListeners() {
    // Password validation on input
    newPasswordInput.addEventListener('input', function() {
        validatePassword(this.value);
        if (confirmPasswordInput.value.length > 0) {
            validatePasswordMatch();
        }
        updateSubmitButton();
    });
    
    // Confirm password validation on input
    confirmPasswordInput.addEventListener('input', function() {
        validatePasswordMatch();
        updateSubmitButton();
    });
    
    // Form submission
    form.addEventListener('submit', handleFormSubmission);
    
    // Back to login button
    document.getElementById('back-to-login').addEventListener('click', function() {
        // In a real application, this would redirect to the login page
        alert('Redirecting to login page... (This would navigate to your login page in a real application)');
        // window.location.href = '/login';
    });
    
    // Retry button
    document.getElementById('retry-btn').addEventListener('click', function() {
        errorMessage.classList.add('hidden');
        submitBtn.disabled = false;
    });
    
    // Keyboard accessibility
    document.addEventListener('keydown', function(event) {
        // Close messages with Escape key
        if (event.key === 'Escape') {
            if (!successMessage.classList.contains('hidden')) {
                successMessage.classList.add('hidden');
            }
            if (!errorMessage.classList.contains('hidden')) {
                errorMessage.classList.add('hidden');
                submitBtn.disabled = false;
            }
        }
    });
}

// Security features
function setupSecurityFeatures() {
    // Prevent password field autocomplete in some cases
    newPasswordInput.setAttribute('autocomplete', 'new-password');
    confirmPasswordInput.setAttribute('autocomplete', 'new-password');
    
    // Clear sensitive data on page unload
    window.addEventListener('beforeunload', function() {
        newPasswordInput.value = '';
        confirmPasswordInput.value = '';
    });
    
    // Disable right-click context menu on password fields (optional)
    [newPasswordInput, confirmPasswordInput].forEach(input => {
        input.addEventListener('contextmenu', function(e) {
            e.preventDefault();
        });
    });
}

// Initialize the application
document.addEventListener('DOMContentLoaded', function() {
    setupPasswordToggle();
    setupEventListeners();
    setupSecurityFeatures();
    
    // Initial validation state
    updateSubmitButton();
    
    // Focus on first input
    newPasswordInput.focus();
    
    console.log('Password Reset Interface initialized successfully!');
    console.log('⚠️  Remember to update WEBHOOK_URL with your actual webhook endpoint');
});

// Utility functions for testing
window.passwordResetUtils = {
    validatePassword,
    validatePasswordMatch,
    sendToWebhook
};
