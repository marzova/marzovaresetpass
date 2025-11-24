# Password Reset Interface

A modern, secure password reset interface with real-time validation and webhook integration.

## Features

### 🔐 Security Features
- **Strong Password Validation**: Enforces password complexity requirements
- **Real-time Feedback**: Live validation as users type
- **Password Strength Indicator**: Visual feedback on password requirements
- **Password Visibility Toggle**: Secure password input with show/hide option
- **Input Sanitization**: Prevents common security vulnerabilities

### 🎨 User Experience
- **Modern Design**: Clean, professional interface with gradient backgrounds
- **Responsive Layout**: Works perfectly on desktop, tablet, and mobile devices
- **Accessibility**: Full keyboard navigation and screen reader support
- **Loading States**: Clear feedback during form submission
- **Success/Error Handling**: User-friendly messages for all scenarios

### 🔧 Technical Features
- **Webhook Integration**: Sends form data to configurable webhook endpoint
- **CORS Handling**: Automatic fallback for cross-origin requests
- **Form Validation**: Both client-side and server-side validation ready
- **Progressive Enhancement**: Works even if JavaScript is disabled
- **Security Best Practices**: Follows modern web security guidelines

## Password Requirements

The interface enforces the following password requirements:
- ✅ At least 8 characters long
- ✅ Contains at least one uppercase letter (A-Z)
- ✅ Contains at least one lowercase letter (a-z)
- ✅ Contains at least one number (0-9)
- ✅ Contains at least one special character (!@#$%^&*()_+-=[]{}|;':"\\,.<>?/)

## Setup Instructions

### 1. Configure Webhook URL
Edit `script.js` and update the `WEBHOOK_URL` constant with your actual webhook endpoint:

```javascript
const WEBHOOK_URL = 'https://your-webhook-service.com/password-reset';
```

**Popular Webhook Services:**
- [Webhook.site](https://webhook.site) - For testing
- [Zapier Webhooks](https://zapier.com/page/webhooks/)
- [Make.com Webhooks](https://www.make.com/en/integrations/webhook)
- Custom server endpoint

### 2. Optional: Configure CORS Proxy
If you encounter CORS issues, uncomment and configure the CORS proxy:

```javascript
const CORS_PROXY = 'https://cors-anywhere.herokuapp.com/';
```

### 3. Deploy the Files
Upload all files to your web server:
- `index.html` - Main interface
- `style.css` - Styling and responsive design
- `script.js` - Validation logic and webhook integration

### 4. Test the Interface
1. Open `index.html` in a web browser
2. Try entering various passwords to see validation
3. Submit the form to test webhook integration

## File Structure

```
password-reset-website/
├── index.html          # Main HTML interface
├── style.css          # CSS styling and responsive design
├── script.js          # JavaScript validation and webhook logic
└── README.md          # This documentation file
```

## Webhook Data Format

When the form is submitted, the following JSON data is sent to your webhook:

```json
{
  "action": "password_reset",
  "timestamp": "2024-01-01T12:00:00.000Z",
  "userAgent": "Mozilla/5.0...",
  "passwordStrength": {
    "length": 12,
    "hasUppercase": true,
    "hasLowercase": true,
    "hasNumber": true,
    "hasSpecial": true
  },
  "metadata": {
    "passwordLength": 12,
    "confirmationMatch": true
  }
}
```

**⚠️ Security Note**: The actual password is NOT sent to the webhook for security reasons. Only metadata about the password strength is included.

## Browser Support

- ✅ Chrome 60+
- ✅ Firefox 55+
- ✅ Safari 12+
- ✅ Edge 79+
- ✅ Mobile browsers (iOS Safari, Chrome Mobile)

## Customization

### Colors and Branding
Edit the CSS custom properties in `style.css`:

```css
:root {
  --primary-color: #667eea;
  --secondary-color: #764ba2;
  --success-color: #28a745;
  --error-color: #dc3545;
}
```

### Validation Rules
Modify the validation functions in `script.js`:

```javascript
function validatePasswordLength(password) {
    return password.length >= 8; // Change minimum length
}
```

### Webhook Timeout
Adjust the processing delay in `script.js`:

```javascript
// Remove this line in production:
await new Promise(resolve => setTimeout(resolve, 2000));
```

## Security Considerations

1. **HTTPS Only**: Always serve this interface over HTTPS in production
2. **Server-Side Validation**: Implement matching validation on your backend
3. **Rate Limiting**: Implement rate limiting on your webhook endpoint
4. **Input Sanitization**: Sanitize all inputs on the server side
5. **Logging**: Log password reset attempts for security monitoring

## Troubleshooting

### Webhook Not Working
1. Check browser console for error messages
2. Verify the webhook URL is correct and accessible
3. Test the webhook URL independently (e.g., with Postman)
4. Check if CORS configuration is needed

### Validation Not Working
1. Ensure JavaScript is enabled in the browser
2. Check browser console for JavaScript errors
3. Verify all DOM elements have correct IDs

### Styling Issues
1. Ensure `style.css` is properly linked
2. Check for CSS conflicts with existing styles
3. Verify Font Awesome is loading correctly

## License

This project is open source and available under the MIT License.

## Support

For issues and questions:
1. Check the browser console for error messages
2. Verify all configuration settings
3. Test with a simple webhook service like webhook.site

---

**Built with ❤️ for secure password management**
