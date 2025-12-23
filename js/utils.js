// ===============================================
// 🛠️ UTILITY FUNCTIONS - Complete Version
// ===============================================

const Utils = {
  // ===============================================
  // LOADING STATES (Global)
  // ===============================================
  
  loadingElement: null,
  
  showLoading(message = 'טוען...') {
    // Remove existing loader if any
    this.hideLoading();
    
    // Create new loader
    const loader = document.createElement('div');
    loader.className = 'global-loader';
    loader.id = 'globalLoader';
    loader.innerHTML = `
      <div class="loader-backdrop"></div>
      <div class="loader-content">
        <div class="spinner"></div>
        <p>${message}</p>
      </div>
    `;
    
    document.body.appendChild(loader);
    this.loadingElement = loader;
    
    // Fade in
    setTimeout(() => loader.classList.add('show'), 10);
  },
  
  hideLoading() {
    const loader = document.getElementById('globalLoader');
    if (loader) {
      loader.classList.remove('show');
      setTimeout(() => {
        if (loader.parentNode) {
          loader.remove();
        }
      }, 300);
    }
    this.loadingElement = null;
  },
  
  // Alternative: Show loading on specific element
  showElementLoading(element) {
    if (!element) return null;
    
    const originalContent = element.innerHTML;
    const originalDisabled = element.disabled;
    
    element.innerHTML = '<i class="fas fa-spinner fa-spin"></i> טוען...';
    element.disabled = true;
    
    // Return cleanup function
    return () => {
      element.innerHTML = originalContent;
      element.disabled = originalDisabled;
    };
  },
  
  // ===============================================
  // ALERTS & NOTIFICATIONS
  // ===============================================
  
  showAlert(message, type = 'info', duration = 3000) {
    // Remove existing alerts
    const existing = document.querySelectorAll('.alert-toast');
    existing.forEach(alert => alert.remove());
    
    // Create alert
    const alert = document.createElement('div');
    alert.className = `alert-toast alert-${type}`;
    
    const icon = this.getAlertIcon(type);
    
    alert.innerHTML = `
      <div class="alert-content">
        <i class="fas fa-${icon}"></i>
        <span>${message}</span>
      </div>
      <button class="alert-close" onclick="this.parentElement.remove()">
        <i class="fas fa-times"></i>
      </button>
    `;
    
    document.body.appendChild(alert);
    
    // Fade in
    setTimeout(() => alert.classList.add('show'), 10);
    
    // Auto remove
    if (duration > 0) {
      setTimeout(() => {
        alert.classList.remove('show');
        setTimeout(() => alert.remove(), 300);
      }, duration);
    }
    
    return alert;
  },
  
  getAlertIcon(type) {
    const icons = {
      success: 'check-circle',
      error: 'exclamation-circle',
      warning: 'exclamation-triangle',
      info: 'info-circle',
      danger: 'times-circle'
    };
    return icons[type] || 'info-circle';
  },
  
  // Show notification (alias for showAlert)
  showNotification(message, type = 'success', duration = 3000) {
    return this.showAlert(message, type, duration);
  },
  
  // ===============================================
  // CONFIRM DIALOG
  // ===============================================
  
  async confirm(message, title = 'אישור פעולה') {
    return new Promise((resolve) => {
      // Create modal backdrop
      const backdrop = document.createElement('div');
      backdrop.className = 'modal-backdrop';
      
      // Create modal
      const modal = document.createElement('div');
      modal.className = 'confirm-modal';
      modal.innerHTML = `
        <div class="modal-header">
          <h3>${title}</h3>
        </div>
        <div class="modal-body">
          <p>${message}</p>
        </div>
        <div class="modal-footer">
          <button class="btn btn-secondary" id="confirmCancel">
            <i class="fas fa-times"></i>
            ביטול
          </button>
          <button class="btn btn-primary" id="confirmOk">
            <i class="fas fa-check"></i>
            אישור
          </button>
        </div>
      `;
      
      document.body.appendChild(backdrop);
      document.body.appendChild(modal);
      
      // Fade in
      setTimeout(() => {
        backdrop.classList.add('show');
        modal.classList.add('show');
      }, 10);
      
      // Cleanup function
      const cleanup = () => {
        backdrop.classList.remove('show');
        modal.classList.remove('show');
        setTimeout(() => {
          backdrop.remove();
          modal.remove();
        }, 300);
      };
      
      // Event listeners
      document.getElementById('confirmCancel').onclick = () => {
        cleanup();
        resolve(false);
      };
      
      document.getElementById('confirmOk').onclick = () => {
        cleanup();
        resolve(true);
      };
      
      backdrop.onclick = () => {
        cleanup();
        resolve(false);
      };
    });
  },
  
  // ===============================================
  // PROMPT DIALOG
  // ===============================================
  
  async prompt(message, defaultValue = '', title = 'הזן ערך') {
    return new Promise((resolve) => {
      const backdrop = document.createElement('div');
      backdrop.className = 'modal-backdrop';
      
      const modal = document.createElement('div');
      modal.className = 'prompt-modal';
      modal.innerHTML = `
        <div class="modal-header">
          <h3>${title}</h3>
        </div>
        <div class="modal-body">
          <p>${message}</p>
          <input type="text" class="form-control" id="promptInput" value="${defaultValue}">
        </div>
        <div class="modal-footer">
          <button class="btn btn-secondary" id="promptCancel">ביטול</button>
          <button class="btn btn-primary" id="promptOk">אישור</button>
        </div>
      `;
      
      document.body.appendChild(backdrop);
      document.body.appendChild(modal);
      
      setTimeout(() => {
        backdrop.classList.add('show');
        modal.classList.add('show');
        document.getElementById('promptInput').focus();
      }, 10);
      
      const cleanup = () => {
        backdrop.classList.remove('show');
        modal.classList.remove('show');
        setTimeout(() => {
          backdrop.remove();
          modal.remove();
        }, 300);
      };
      
      document.getElementById('promptCancel').onclick = () => {
        cleanup();
        resolve(null);
      };
      
      document.getElementById('promptOk').onclick = () => {
        const value = document.getElementById('promptInput').value;
        cleanup();
        resolve(value);
      };
      
      document.getElementById('promptInput').onkeypress = (e) => {
        if (e.key === 'Enter') {
          const value = document.getElementById('promptInput').value;
          cleanup();
          resolve(value);
        }
      };
      
      backdrop.onclick = () => {
        cleanup();
        resolve(null);
      };
    });
  },
  
  // ===============================================
  // DATE & TIME FORMATTING
  // ===============================================
  
  formatDate(date) {
    if (!date) return '-';
    const d = new Date(date);
    return d.toLocaleDateString('he-IL', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit'
    });
  },
  
  formatTime(date) {
    if (!date) return '-';
    const d = new Date(date);
    return d.toLocaleTimeString('he-IL', {
      hour: '2-digit',
      minute: '2-digit'
    });
  },
  
  formatDateTime(date) {
    if (!date) return '-';
    const d = new Date(date);
    return d.toLocaleString('he-IL', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    });
  },
  
  // ===============================================
  // NUMBER FORMATTING
  // ===============================================
  
  formatNumber(num) {
    if (num === null || num === undefined) return '0';
    return Number(num).toLocaleString('he-IL');
  },
  
  formatCurrency(amount) {
    if (amount === null || amount === undefined) return '₪0';
    return `₪${Number(amount).toLocaleString('he-IL')}`;
  },
  
  formatPhone(phone) {
    if (!phone) return '-';
    // Remove all non-digits
    const cleaned = phone.replace(/\D/g, '');
    // Format: 050-123-4567
    if (cleaned.length === 10) {
      return cleaned.replace(/(\d{3})(\d{3})(\d{4})/, '$1-$2-$3');
    }
    return phone;
  },
  
  // ===============================================
  // STATUS BADGES
  // ===============================================
  
  getStatusBadge(status) {
    const statusMap = {
      // Rides
      'created': { text: 'נוצר', class: 'info' },
      'sent': { text: 'נשלח', class: 'warning' },
      'distributed': { text: 'הופץ', class: 'warning' },
      'locked': { text: 'נעול', class: 'warning' },
      'assigned': { text: 'שובץ', class: 'primary' },
      'approved': { text: 'אושר', class: 'success' },
      'enroute': { text: 'בדרך', class: 'info' },
      'arrived': { text: 'הגיע', class: 'success' },
      'finished': { text: 'הסתיים', class: 'success' },
      'completed': { text: 'הושלם', class: 'success' },
      'cancelled': { text: 'בוטל', class: 'danger' },
      
      // Drivers
      'active': { text: 'פעיל', class: 'success' },
      'inactive': { text: 'לא פעיל', class: 'secondary' },
      'blocked': { text: 'חסום', class: 'danger' },
      
      // Registrations
      'pending': { text: 'ממתין', class: 'warning' },
      'in_progress': { text: 'בתהליך', class: 'info' },
      'rejected': { text: 'נדחה', class: 'danger' },
      
      // Payments
      'paid': { text: 'שולם', class: 'success' },
      'unpaid': { text: 'לא שולם', class: 'danger' },
      'partial': { text: 'שולם חלקית', class: 'warning' }
    };
    
    const statusInfo = statusMap[status] || { text: status, class: 'secondary' };
    return `<span class="badge badge-${statusInfo.class}">${statusInfo.text}</span>`;
  },
  
  // ===============================================
  // VALIDATION
  // ===============================================
  
  validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  },
  
  validatePhone(phone) {
    const cleaned = phone.replace(/\D/g, '');
    return cleaned.length === 10 && cleaned.startsWith('05');
  },
  
  validateIsraeliId(id) {
    if (!id || id.length !== 9) return false;
    
    const digits = id.split('').map(Number);
    const sum = digits.reduce((acc, digit, i) => {
      const step = digit * ((i % 2) + 1);
      return acc + (step > 9 ? step - 9 : step);
    }, 0);
    
    return sum % 10 === 0;
  },
  
  // ===============================================
  // DEBOUNCE
  // ===============================================
  
  debounce(func, wait = 300) {
    let timeout;
    return function executedFunction(...args) {
      const later = () => {
        clearTimeout(timeout);
        func(...args);
      };
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
    };
  },
  
  // ===============================================
  // COPY TO CLIPBOARD
  // ===============================================
  
  async copyToClipboard(text) {
    try {
      await navigator.clipboard.writeText(text);
      this.showAlert('הועתק ללוח', 'success', 1500);
      return true;
    } catch (err) {
      this.showAlert('שגיאה בהעתקה', 'error');
      return false;
    }
  },
  
  // ===============================================
  // DOWNLOAD FILE
  // ===============================================
  
  downloadFile(data, filename, mimeType = 'text/plain') {
    const blob = new Blob([data], { type: mimeType });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    link.click();
    window.URL.revokeObjectURL(url);
  },
  
  // ===============================================
  // SCROLL TO TOP
  // ===============================================
  
  scrollToTop(smooth = true) {
    window.scrollTo({
      top: 0,
      behavior: smooth ? 'smooth' : 'auto'
    });
  },
  
  // ===============================================
  // GET QUERY PARAMS
  // ===============================================
  
  getQueryParam(param) {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get(param);
  },
  
  getAllQueryParams() {
    const urlParams = new URLSearchParams(window.location.search);
    const params = {};
    for (const [key, value] of urlParams) {
      params[key] = value;
    }
    return params;
  },
  
  // ===============================================
  // STORAGE HELPERS
  // ===============================================
  
  setLocal(key, value) {
    try {
      localStorage.setItem(key, JSON.stringify(value));
      return true;
    } catch (err) {
      console.error('Error saving to localStorage:', err);
      return false;
    }
  },
  
  getLocal(key, defaultValue = null) {
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : defaultValue;
    } catch (err) {
      console.error('Error reading from localStorage:', err);
      return defaultValue;
    }
  },
  
  removeLocal(key) {
    localStorage.removeItem(key);
  },
  
  // ===============================================
  // GENERATE RANDOM ID
  // ===============================================
  
  generateId() {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
  },
  
  // ===============================================
  // TRUNCATE TEXT
  // ===============================================
  
  truncate(text, length = 50) {
    if (!text) return '';
    if (text.length <= length) return text;
    return text.substring(0, length) + '...';
  }
};

// ===============================================
// CSS FOR LOADING & ALERTS (Auto-inject)
// ===============================================

if (!document.getElementById('utilsStyles')) {
  const style = document.createElement('style');
  style.id = 'utilsStyles';
  style.textContent = `
    /* Global Loader */
    .global-loader {
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      z-index: 99999;
      opacity: 0;
      transition: opacity 0.3s;
      pointer-events: none;
    }
    
    .global-loader.show {
      opacity: 1;
      pointer-events: all;
    }
    
    .loader-backdrop {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: rgba(0, 0, 0, 0.5);
    }
    
    .loader-content {
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      background: white;
      padding: 30px 50px;
      border-radius: 12px;
      text-align: center;
      box-shadow: 0 10px 40px rgba(0,0,0,0.2);
    }
    
    .loader-content .spinner {
      width: 50px;
      height: 50px;
      border: 4px solid #e2e8f0;
      border-top-color: #6366f1;
      border-radius: 50%;
      animation: spin 0.8s linear infinite;
      margin: 0 auto 15px;
    }
    
    .loader-content p {
      margin: 0;
      color: #64748b;
      font-size: 16px;
    }
    
    @keyframes spin {
      to { transform: rotate(360deg); }
    }
    
    /* Alert Toast */
    .alert-toast {
      position: fixed;
      top: 20px;
      right: 20px;
      background: white;
      padding: 15px 20px;
      border-radius: 8px;
      box-shadow: 0 4px 20px rgba(0,0,0,0.15);
      display: flex;
      align-items: center;
      gap: 15px;
      z-index: 10000;
      transform: translateX(400px);
      transition: transform 0.3s;
      min-width: 300px;
      max-width: 500px;
    }
    
    .alert-toast.show {
      transform: translateX(0);
    }
    
    .alert-toast .alert-content {
      display: flex;
      align-items: center;
      gap: 10px;
      flex: 1;
    }
    
    .alert-toast .alert-content i {
      font-size: 20px;
    }
    
    .alert-toast.alert-success .alert-content i { color: #10b981; }
    .alert-toast.alert-error .alert-content i { color: #ef4444; }
    .alert-toast.alert-warning .alert-content i { color: #f59e0b; }
    .alert-toast.alert-info .alert-content i { color: #3b82f6; }
    .alert-toast.alert-danger .alert-content i { color: #ef4444; }
    
    .alert-close {
      background: none;
      border: none;
      cursor: pointer;
      color: #94a3b8;
      font-size: 18px;
      padding: 5px;
      transition: color 0.2s;
    }
    
    .alert-close:hover {
      color: #64748b;
    }
    
    /* Modal Backdrop */
    .modal-backdrop {
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: rgba(0, 0, 0, 0.5);
      z-index: 9998;
      opacity: 0;
      transition: opacity 0.3s;
    }
    
    .modal-backdrop.show {
      opacity: 1;
    }
    
    /* Confirm Modal */
    .confirm-modal, .prompt-modal {
      position: fixed;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%) scale(0.9);
      background: white;
      border-radius: 12px;
      box-shadow: 0 10px 40px rgba(0,0,0,0.2);
      z-index: 9999;
      min-width: 400px;
      max-width: 500px;
      opacity: 0;
      transition: all 0.3s;
    }
    
    .confirm-modal.show, .prompt-modal.show {
      transform: translate(-50%, -50%) scale(1);
      opacity: 1;
    }
    
    .confirm-modal .modal-header, .prompt-modal .modal-header {
      padding: 20px 25px;
      border-bottom: 1px solid #e2e8f0;
    }
    
    .confirm-modal .modal-header h3, .prompt-modal .modal-header h3 {
      margin: 0;
      font-size: 18px;
      color: #1e293b;
    }
    
    .confirm-modal .modal-body, .prompt-modal .modal-body {
      padding: 25px;
    }
    
    .confirm-modal .modal-body p, .prompt-modal .modal-body p {
      margin: 0 0 15px 0;
      color: #64748b;
      line-height: 1.6;
    }
    
    .prompt-modal .modal-body input {
      width: 100%;
      padding: 10px 15px;
      border: 1px solid #e2e8f0;
      border-radius: 6px;
      font-size: 14px;
      transition: border-color 0.2s;
    }
    
    .prompt-modal .modal-body input:focus {
      outline: none;
      border-color: #6366f1;
    }
    
    .confirm-modal .modal-footer, .prompt-modal .modal-footer {
      padding: 15px 25px;
      border-top: 1px solid #e2e8f0;
      display: flex;
      justify-content: flex-end;
      gap: 10px;
    }
  `;
  document.head.appendChild(style);
}

// Make Utils globally available
window.Utils = Utils;
