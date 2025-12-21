// ===============================================
// 🛠️ UTILITY FUNCTIONS
// ===============================================

const Utils = {
  // ===============================================
  // AUTH GUARD
  // ===============================================
  async checkAuth() {
    try {
      const user = await api.getMe();
      return user;
    } catch (error) {
      window.location.href = '/index.html';
      return null;
    }
  },
  
  // ===============================================
  // NOTIFICATIONS
  // ===============================================
  showNotification(message, type = 'success') {
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
      <div class="notification-content">
        <i class="fas fa-${this.getNotificationIcon(type)}"></i>
        <span>${message}</span>
      </div>
    `;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
      notification.classList.add('show');
    }, 10);
    
    setTimeout(() => {
      notification.classList.remove('show');
      setTimeout(() => notification.remove(), 300);
    }, 3000);
  },
  
  getNotificationIcon(type) {
    const icons = {
      success: 'check-circle',
      error: 'exclamation-circle',
      warning: 'exclamation-triangle',
      info: 'info-circle'
    };
    return icons[type] || 'info-circle';
  },
  
  // ===============================================
  // MODALS
  // ===============================================
  showModal(content, title = '') {
    const modal = document.createElement('div');
    modal.className = 'modal';
    modal.innerHTML = `
      <div class="modal-overlay"></div>
      <div class="modal-content">
        ${title ? `<div class="modal-header">
          <h3>${title}</h3>
          <button class="modal-close">&times;</button>
        </div>` : ''}
        <div class="modal-body">
          ${content}
        </div>
      </div>
    `;
    
    document.body.appendChild(modal);
    
    setTimeout(() => modal.classList.add('show'), 10);
    
    const closeBtn = modal.querySelector('.modal-close');
    const overlay = modal.querySelector('.modal-overlay');
    
    const closeModal = () => {
      modal.classList.remove('show');
      setTimeout(() => modal.remove(), 300);
    };
    
    if (closeBtn) closeBtn.onclick = closeModal;
    overlay.onclick = closeModal;
    
    return modal;
  },
  
  async showConfirm(message, title = 'אישור') {
    return new Promise((resolve) => {
      const modal = this.showModal(`
        <p class="confirm-message">${message}</p>
        <div class="modal-actions">
          <button class="btn btn-danger" id="confirmNo">ביטול</button>
          <button class="btn btn-primary" id="confirmYes">אישור</button>
        </div>
      `, title);
      
      document.getElementById('confirmYes').onclick = () => {
        modal.remove();
        resolve(true);
      };
      
      document.getElementById('confirmNo').onclick = () => {
        modal.remove();
        resolve(false);
      };
    });
  },
  
  // ===============================================
  // LOADING STATES
  // ===============================================
  showLoading(element) {
    const originalContent = element.innerHTML;
    element.innerHTML = '<i class="fas fa-spinner fa-spin"></i> טוען...';
    element.disabled = true;
    
    return () => {
      element.innerHTML = originalContent;
      element.disabled = false;
    };
  },
  
  showPageLoading() {
    const loader = document.createElement('div');
    loader.className = 'page-loader';
    loader.innerHTML = `
      <div class="loader-content">
        <div class="spinner"></div>
        <p>טוען...</p>
      </div>
    `;
    document.body.appendChild(loader);
    
    return () => loader.remove();
  },
  
  // ===============================================
  // FORMATTING
  // ===============================================
  formatDate(date) {
    if (!date) return '-';
    const d = new Date(date);
    return d.toLocaleDateString('he-IL', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    });
  },
  
  formatCurrency(amount) {
    if (amount === null || amount === undefined) return '-';
    return `₪${Number(amount).toLocaleString('he-IL')}`;
  },
  
  formatPhone(phone) {
    if (!phone) return '-';
    // Format: 050-123-4567
    return phone.replace(/(\d{3})(\d{3})(\d{4})/, '$1-$2-$3');
  },
  
  // ===============================================
  // STATUS BADGES
  // ===============================================
  getStatusBadge(status) {
    const statusMap = {
      // Rides
      'created': { text: 'נוצר', class: 'info' },
      'sent': { text: 'נשלח', class: 'warning' },
      'locked': { text: 'נעול', class: 'warning' },
      'assigned': { text: 'שובץ', class: 'primary' },
      'approved': { text: 'אושר', class: 'success' },
      'enroute': { text: 'בדרך', class: 'info' },
      'arrived': { text: 'הגיע', class: 'success' },
      'finished': { text: 'הסתיים', class: 'success' },
      'cancelled': { text: 'בוטל', class: 'danger' },
      
      // Drivers
      'active': { text: 'פעיל', class: 'success' },
      'inactive': { text: 'לא פעיל', class: 'secondary' },
      'blocked': { text: 'חסום', class: 'danger' },
      
      // Registrations
      'pending': { text: 'ממתין', class: 'warning' },
      'approved': { text: 'מאושר', class: 'success' },
      'rejected': { text: 'נדחה', class: 'danger' },
      
      // Payments
      'paid': { text: 'שולם', class: 'success' },
      'unpaid': { text: 'לא שולם', class: 'danger' },
      'pending': { text: 'ממתין', class: 'warning' }
    };
    
    const statusInfo = statusMap[status] || { text: status, class: 'secondary' };
    return `<span class="badge badge-${statusInfo.class}">${statusInfo.text}</span>`;
  },
  
  // ===============================================
  // DEBOUNCE
  // ===============================================
  debounce(func, wait) {
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
  // QUERY PARAMS
  // ===============================================
  getQueryParams() {
    const params = {};
    const searchParams = new URLSearchParams(window.location.search);
    for (const [key, value] of searchParams) {
      params[key] = value;
    }
    return params;
  },
  
  updateQueryParams(params) {
    const searchParams = new URLSearchParams(window.location.search);
    Object.entries(params).forEach(([key, value]) => {
      if (value) {
        searchParams.set(key, value);
      } else {
        searchParams.delete(key);
      }
    });
    const newUrl = `${window.location.pathname}?${searchParams.toString()}`;
    window.history.pushState({}, '', newUrl);
  },
  
  // ===============================================
  // VALIDATION
  // ===============================================
  validatePhone(phone) {
    const phoneRegex = /^(0|\+972)?5\d{8}$/;
    return phoneRegex.test(phone.replace(/[\s\-]/g, ''));
  },
  
  validateRequired(value) {
    return value && value.trim().length > 0;
  },
  
  // ===============================================
  // ERROR HANDLING
  // ===============================================
  handleError(error) {
    console.error('Error:', error);
    this.showNotification(error.message || 'שגיאה לא ידועה', 'error');
  },
  
  // ===============================================
  // LOCAL STORAGE
  // ===============================================
  getUser() {
    const userJson = localStorage.getItem(CONFIG.STORAGE_KEYS.USER);
    return userJson ? JSON.parse(userJson) : null;
  },
  
  // ===============================================
  // TABLE HELPERS
  // ===============================================
  createTableRow(data, columns) {
    const tr = document.createElement('tr');
    
    columns.forEach(column => {
      const td = document.createElement('td');
      
      if (column.render) {
        td.innerHTML = column.render(data);
      } else {
        td.textContent = data[column.key] || '-';
      }
      
      tr.appendChild(td);
    });
    
    return tr;
  },
  
  // ===============================================
  // PAGINATION
  // ===============================================
  renderPagination(container, currentPage, totalPages, onPageChange) {
    container.innerHTML = '';
    
    if (totalPages <= 1) return;
    
    const createButton = (text, page, disabled = false) => {
      const btn = document.createElement('button');
      btn.className = `pagination-btn ${disabled ? 'disabled' : ''}`;
      btn.textContent = text;
      if (!disabled) {
        btn.onclick = () => onPageChange(page);
      }
      return btn;
    };
    
    // Previous
    container.appendChild(createButton('←', currentPage - 1, currentPage === 1));
    
    // Pages
    const startPage = Math.max(1, currentPage - 2);
    const endPage = Math.min(totalPages, currentPage + 2);
    
    for (let i = startPage; i <= endPage; i++) {
      const btn = createButton(i, i);
      if (i === currentPage) {
        btn.classList.add('active');
      }
      container.appendChild(btn);
    }
    
    // Next
    container.appendChild(createButton('→', currentPage + 1, currentPage === totalPages));
  }
};
