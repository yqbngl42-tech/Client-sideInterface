// ===============================================
// 🔧 CONFIGURATION
// ===============================================

const CONFIG = {
  // API Base URL
  API_URL: 'https://taxiserver-system.onrender.com',
  
  // API Endpoints (Matching Server Routes!)
  ENDPOINTS: {
    // Auth - mounted at /auth
    LOGIN: '/auth/login',
    LOGOUT: '/auth/logout',
    ME: '/auth/me',
    
    // Drivers - mounted at /api/drivers
    DRIVERS: '/api/drivers',
    DRIVER: (id) => `/api/drivers/${id}`,
    DRIVER_BLOCK: (id) => `/api/drivers/${id}/block`,
    DRIVER_UNBLOCK: (id) => `/api/drivers/${id}/unblock`,
    DRIVER_VERIFY: (id) => `/api/drivers/${id}/verify-document`,
    
    // Rides - mounted at /api/rides
    RIDES: '/api/rides',
    RIDE: (id) => `/api/rides/${id}`,
    RIDE_ASSIGN: (id) => `/api/rides/${id}/assign`,
    RIDE_STATUS: (id) => `/api/rides/${id}/status`,
    RIDE_CANCEL: (id) => `/api/rides/${id}/cancel`,
    RIDE_LOCK: (id) => `/api/rides/${id}/lock`,
    RIDE_UNLOCK: (id) => `/api/rides/${id}/unlock`,
    RIDE_REDISPATCH: (id) => `/api/rides/${id}/redispatch`,
    
    // Payments - mounted at /api/payments
    PAYMENTS: '/api/payments',
    PAYMENT: (id) => `/api/payments/${id}`,
    PAYMENT_VERIFY: (id) => `/api/payments/${id}/verify`,
    PAYMENT_MARK_PAID: (id) => `/api/payments/${id}/mark-paid`,
    PAYMENT_REMIND: (id) => `/api/payments/${id}/remind`,
    PAYMENT_SUMMARY: '/api/payments/reports/summary',
    
    // Registrations - mounted at /api/registrations
    REGISTRATIONS: '/api/registrations',
    REGISTRATION: (id) => `/api/registrations/${id}`,
    REGISTRATION_APPROVE: (id) => `/api/registrations/${id}/approve`,
    REGISTRATION_REJECT: (id) => `/api/registrations/${id}/reject`,
    REGISTRATION_RESEND: (id) => `/api/registrations/${id}/resend-code`,
    REGISTRATION_CANCEL: (id) => `/api/registrations/${id}/cancel`,
    
    // Messages - mounted at /api/messages
    SEND_MESSAGE: '/api/messages/send',
    
    // System - mounted at /api/system
    SYSTEM_HEALTH: '/api/system/health',
    DASHBOARD_SUMMARY: '/api/dashboard/summary',
    LOGS_CLEANUP: '/api/system/logs/cleanup',
    BACKUPS_CREATE: '/api/system/backups/create'
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
