// ===============================================
// 🔧 CONFIGURATION
// ===============================================

const CONFIG = {
  // API Base URL
  API_URL: 'http://localhost:3000',
  
  // API Endpoints (NEW CLEAN API!)
  ENDPOINTS: {
    // Auth
    LOGIN: '/auth/login',
    LOGOUT: '/auth/logout',
    ME: '/auth/me',
    
    // Drivers
    DRIVERS: '/drivers',
    DRIVER: (id) => `/drivers/${id}`,
    DRIVER_BLOCK: (id) => `/drivers/${id}/block`,
    DRIVER_UNBLOCK: (id) => `/drivers/${id}/unblock`,
    DRIVER_VERIFY: (id) => `/drivers/${id}/verify-document`,
    
    // Rides
    RIDES: '/rides',
    RIDE: (id) => `/rides/${id}`,
    RIDE_ASSIGN: (id) => `/rides/${id}/assign`,
    RIDE_STATUS: (id) => `/rides/${id}/status`,
    RIDE_CANCEL: (id) => `/rides/${id}/cancel`,
    RIDE_LOCK: (id) => `/rides/${id}/lock`,
    RIDE_UNLOCK: (id) => `/rides/${id}/unlock`,
    RIDE_REDISPATCH: (id) => `/rides/${id}/redispatch`,
    
    // Payments
    PAYMENTS: '/payments',
    PAYMENT: (id) => `/payments/${id}`,
    PAYMENT_VERIFY: (id) => `/payments/${id}/verify`,
    PAYMENT_MARK_PAID: (id) => `/payments/${id}/mark-paid`,
    PAYMENT_REMIND: (id) => `/payments/${id}/remind`,
    PAYMENT_SUMMARY: '/payments/reports/summary',
    
    // Registrations
    REGISTRATIONS: '/registrations',
    REGISTRATION: (id) => `/registrations/${id}`,
    REGISTRATION_APPROVE: (id) => `/registrations/${id}/approve`,
    REGISTRATION_REJECT: (id) => `/registrations/${id}/reject`,
    REGISTRATION_RESEND: (id) => `/registrations/${id}/resend-code`,
    REGISTRATION_CANCEL: (id) => `/registrations/${id}/cancel`,
    
    // Messages
    SEND_MESSAGE: '/messages/send',
    
    // System
    SYSTEM_HEALTH: '/system/health',
    DASHBOARD_SUMMARY: '/dashboard/summary',
    LOGS_CLEANUP: '/system/logs/cleanup',
    BACKUPS_CREATE: '/system/backups/create'
  },
  
  // App Settings
  APP_NAME: 'Taxi Management System',
  VERSION: '2.0.0',
  
  // Theme Colors
  COLORS: {
    primary: '#6366f1',
    secondary: '#8b5cf6',
    success: '#10b981',
    danger: '#ef4444',
    warning: '#f59e0b',
    info: '#3b82f6',
    dark: '#1e293b',
    light: '#f8fafc'
  },
  
  // Pagination
  DEFAULT_PAGE_SIZE: 20,
  MAX_PAGE_SIZE: 100,
  
  // Storage Keys
  STORAGE_KEYS: {
    TOKEN: 'taxi_admin_token',
    USER: 'taxi_admin_user'
  }
};

// Export for use in other files
if (typeof module !== 'undefined' && module.exports) {
  module.exports = CONFIG;
}
