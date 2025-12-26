// ===============================================
// 🌐 API CLIENT - Clean & Modern
// ===============================================

class ApiClient {
  constructor() {
    this.baseURL = CONFIG.API_URL;
    this.updateToken();
  }
  
  // Helper to always get fresh token
  updateToken() {
    this.token = localStorage.getItem(CONFIG.STORAGE_KEYS.TOKEN);
  }
  
  // ===============================================
  // CORE REQUEST METHOD
  // ===============================================
  async request(method, endpoint, data = null, options = {}) {
    try {
      // Always get fresh token before request
      this.updateToken();
      
      const url = `${this.baseURL}${endpoint}`;
      
      // 📝 LOG: Request details
      // console.log(`📤 API ${method}:`, url);
      if (data) // console.log('📋 Request data:', data);
      // console.log('🔑 Token:', this.token ? 'Found ✅' : 'NOT FOUND ❌');
      
      const fetchOptions = {
        method,
        headers: {
          'Content-Type': 'application/json',
          ...(this.token && { 'Authorization': `Bearer ${this.token}` }),
          ...options.headers
        }
      };
      
      if (data && method !== 'GET') {
        fetchOptions.body = JSON.stringify(data);
      }
      
      const response = await fetch(url, fetchOptions);
      
      // 📝 LOG: Response status
      // console.log(`📡 Response status: ${response.status} ${response.statusText}`);
      
      const result = await response.json();
      
      // 📝 LOG: Response data
      // console.log('📦 Response data:', result);
      
      // Handle token expiration
      if (response.status === 401 || response.status === 403) {
        console.error('❌ Unauthorized - redirecting to login');
        this.handleUnauthorized();
        throw new Error('Unauthorized');
      }
      
      // Handle errors
      if (!result.ok) {
        const errorMsg = result.error?.message || result.error || 'Unknown error';
        console.error('❌ API Error:', errorMsg);
        throw new Error(errorMsg);
      }
      
      // console.log('✅ Request successful');
      
      // Return the appropriate data based on what the server sent
      // Some endpoints return { ok, data }, others return { ok, driver }, { ok, ride }, etc.
      return result.data || result.driver || result.ride || result.payment || result;
    } catch (error) {
      console.error('❌ API Error:', error);
      throw error;
    }
  }
  
  // ===============================================
  // CONVENIENCE METHODS
  // ===============================================
  get(endpoint, options) {
    return this.request('GET', endpoint, null, options);
  }
  
  post(endpoint, data, options) {
    return this.request('POST', endpoint, data, options);
  }
  
  patch(endpoint, data, options) {
    return this.request('PATCH', endpoint, data, options);
  }
  
  delete(endpoint, options) {
    return this.request('DELETE', endpoint, null, options);
  }
  
  // ===============================================
  // TOKEN MANAGEMENT
  // ===============================================
  setToken(token) {
    this.token = token;
    localStorage.setItem(CONFIG.STORAGE_KEYS.TOKEN, token);
  }
  
  clearToken() {
    this.token = null;
    localStorage.removeItem(CONFIG.STORAGE_KEYS.TOKEN);
    localStorage.removeItem(CONFIG.STORAGE_KEYS.USER);
  }
  
  handleUnauthorized() {
    this.clearToken();
    if (window.location.pathname !== '/index.html') {
      window.location.href = '/index.html';
    }
  }
  
  // ===============================================
  // AUTH ENDPOINTS
  // ===============================================
  async login(password) {
    const data = await this.post(CONFIG.ENDPOINTS.LOGIN, { password });
    this.setToken(data.token);
    return data;
  }
  
  async logout() {
    await this.post(CONFIG.ENDPOINTS.LOGOUT);
    this.clearToken();
  }
  
  async getMe() {
    const user = await this.get(CONFIG.ENDPOINTS.ME);
    localStorage.setItem(CONFIG.STORAGE_KEYS.USER, JSON.stringify(user));
    return user;
  }
  
  // ===============================================
  // DRIVERS ENDPOINTS
  // ===============================================
  async getDrivers(params = {}) {
    const queryString = new URLSearchParams(params).toString();
    return this.get(`${CONFIG.ENDPOINTS.DRIVERS}?${queryString}`);
  }
  
  async getDriver(id) {
    return this.get(CONFIG.ENDPOINTS.DRIVER(id));
  }
  
  async createDriver(data) {
    return this.post(CONFIG.ENDPOINTS.DRIVERS, data);
  }
  
  async updateDriver(id, data) {
    return this.patch(CONFIG.ENDPOINTS.DRIVER(id), data);
  }
  
  async blockDriver(id, reason) {
    return this.post(CONFIG.ENDPOINTS.DRIVER_BLOCK(id), { reason });
  }
  
  async unblockDriver(id) {
    return this.post(CONFIG.ENDPOINTS.DRIVER_UNBLOCK(id));
  }
  
  async verifyDocument(id, documentType) {
    return this.post(CONFIG.ENDPOINTS.DRIVER_VERIFY(id), { documentType });
  }
  
  // ===============================================
  // RIDES ENDPOINTS
  // ===============================================
  async getRides(params = {}) {
    const queryString = new URLSearchParams(params).toString();
    return this.get(`${CONFIG.ENDPOINTS.RIDES}?${queryString}`);
  }
  
  async getRide(id) {
    return this.get(CONFIG.ENDPOINTS.RIDE(id));
  }
  
  async createRide(data) {
    return this.post(CONFIG.ENDPOINTS.RIDES, data);
  }
  
  async assignRide(id, driverId) {
    return this.post(CONFIG.ENDPOINTS.RIDE_ASSIGN(id), { driverId });
  }
  
  async updateRideStatus(id, status) {
    return this.post(CONFIG.ENDPOINTS.RIDE_STATUS(id), { status });
  }
  
  async cancelRide(id, reason) {
    return this.post(CONFIG.ENDPOINTS.RIDE_CANCEL(id), { reason });
  }
  
  async lockRide(id) {
    return this.post(CONFIG.ENDPOINTS.RIDE_LOCK(id));
  }
  
  async unlockRide(id) {
    return this.post(CONFIG.ENDPOINTS.RIDE_UNLOCK(id));
  }
  
  async redispatchRide(id) {
    return this.post(CONFIG.ENDPOINTS.RIDE_REDISPATCH(id));
  }
  
  // ===============================================
  // PAYMENTS ENDPOINTS
  // ===============================================
  async getPayments(params = {}) {
    const queryString = new URLSearchParams(params).toString();
    return this.get(`${CONFIG.ENDPOINTS.PAYMENTS}?${queryString}`);
  }
  
  async getPayment(id) {
    return this.get(CONFIG.ENDPOINTS.PAYMENT(id));
  }
  
  async verifyPayment(id) {
    return this.post(CONFIG.ENDPOINTS.PAYMENT_VERIFY(id));
  }
  
  async markPaymentPaid(id) {
    return this.post(CONFIG.ENDPOINTS.PAYMENT_MARK_PAID(id));
  }
  
  async sendPaymentReminder(id) {
    return this.post(CONFIG.ENDPOINTS.PAYMENT_REMIND(id));
  }
  
  async getPaymentSummary() {
    return this.get(CONFIG.ENDPOINTS.PAYMENT_SUMMARY);
  }
  
  // ===============================================
  // REGISTRATIONS ENDPOINTS
  // ===============================================
  async getRegistrations(params = {}) {
    const queryString = new URLSearchParams(params).toString();
    return this.get(`${CONFIG.ENDPOINTS.REGISTRATIONS}?${queryString}`);
  }
  
  async getRegistration(id) {
    return this.get(CONFIG.ENDPOINTS.REGISTRATION(id));
  }
  
  async approveRegistration(id) {
    return this.post(CONFIG.ENDPOINTS.REGISTRATION_APPROVE(id));
  }
  
  async rejectRegistration(id, reason) {
    return this.post(CONFIG.ENDPOINTS.REGISTRATION_REJECT(id), { reason });
  }
  
  async resendRegistrationCode(id) {
    return this.post(CONFIG.ENDPOINTS.REGISTRATION_RESEND(id));
  }
  
  async cancelRegistration(id) {
    return this.post(CONFIG.ENDPOINTS.REGISTRATION_CANCEL(id));
  }
  
  // ===============================================
  // MESSAGES ENDPOINTS
  // ===============================================
  async sendMessage(recipients, message) {
    return this.post(CONFIG.ENDPOINTS.SEND_MESSAGE, { recipients, message });
  }
  
  // ===============================================
  // SYSTEM ENDPOINTS
  // ===============================================
  async getSystemHealth() {
    return this.get(CONFIG.ENDPOINTS.SYSTEM_HEALTH);
  }
  
  async getDashboardSummary() {
    return this.get(CONFIG.ENDPOINTS.DASHBOARD_SUMMARY);
  }
  
  async cleanupLogs() {
    return this.post(CONFIG.ENDPOINTS.LOGS_CLEANUP);
  }
  
  async createBackup() {
    return this.post(CONFIG.ENDPOINTS.BACKUPS_CREATE);
  }
  
  // ===============================================
  // ADVANCED DRIVER APIs (NEW!)
  // ===============================================
  async getDriver(id) {
    return this.get(`/v2/drivers/${id}`);
  }
  
  async addDriverNote(driverId, text) {
    return this.post(`/v2/drivers/${driverId}/notes`, { text });
  }
  
  async uploadDriverDocument(driverId, formData) {
    const url = `${this.baseURL}/v2/drivers/${driverId}/documents`;
    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${this.token}` },
      body: formData
    });
    const result = await response.json();
    if (!result.ok) throw new Error(result.error?.message);
    return result.data;
  }
  
  async verifyDriverDocument(driverId, documentId) {
    return this.put(`/v2/drivers/${driverId}/documents/${documentId}/verify`);
  }
  
  // ===============================================
  // ADVANCED RIDE APIs (NEW!)
  // ===============================================
  async getRide(id) {
    return this.get(`/v2/rides/${id}`);
  }
  
  async redispatchRide(id) {
    return this.post(`/v2/rides/${id}/redispatch`);
  }
  
  async lockRide(id) {
    return this.post(`/v2/rides/${id}/lock`);
  }
  
  async unlockRide(id) {
    return this.post(`/v2/rides/${id}/unlock`);
  }
  
  async getRideHistory(id) {
    return this.get(`/v2/rides/${id}/history`);
  }
  
  async addRideIssue(id, issue) {
    return this.post(`/v2/rides/${id}/issues`, issue);
  }
  
  // ===============================================
  // ADVANCED PAYMENT APIs (NEW!)
  // ===============================================
  async getPayment(id) {
    return this.get(`/v2/payments/${id}`);
  }
  
  async uploadReceipt(paymentId, formData) {
    const url = `${this.baseURL}/v2/payments/${paymentId}/receipt`;
    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${this.token}` },
      body: formData
    });
    const result = await response.json();
    if (!result.ok) throw new Error(result.error?.message);
    return result.data;
  }
  
  async runPaymentOCR(paymentId) {
    return this.post(`/v2/payments/${paymentId}/ocr`);
  }
  
  async getOverduePayments() {
    return this.get('/v2/payments/overdue');
  }
  
  async getPaymentReports(params) {
    const query = new URLSearchParams(params).toString();
    return this.get(`/v2/payments/reports?${query}`);
  }
  
  // ===============================================
  // MESSAGES APIs (NEW!)
  // ===============================================
  async getMessageTemplates() {
    return this.get('/v2/messages/templates');
  }
  
  async createMessageTemplate(data) {
    return this.post('/v2/messages/templates', data);
  }
  
  async updateMessageTemplate(id, data) {
    return this.put(`/v2/messages/templates/${id}`, data);
  }
  
  async deleteMessageTemplate(id) {
    return this.delete(`/v2/messages/templates/${id}`);
  }
  
  async sendSingleMessage(recipientId, text) {
    return this.post('/v2/messages/send', { recipientId, text });
  }
  
  async broadcastMessage(text, audience) {
    return this.post('/v2/messages/broadcast', { text, audience });
  }
  
  async scheduleMessage(text, scheduleTime) {
    return this.post('/v2/messages/schedule', { text, scheduleTime });
  }
  
  async getCampaigns() {
    return this.get('/v2/messages/campaigns');
  }
  
  async createCampaign(data) {
    return this.post('/v2/messages/campaigns', data);
  }
  
  async getMessageHistory(params = {}) {
    const query = new URLSearchParams(params).toString();
    return this.get(`/v2/messages/history?${query}`);
  }
  
  async getMessageStats() {
    return this.get('/v2/messages/stats');
  }
  
  // ===============================================
  // REPORTS APIs (NEW!)
  // ===============================================
  async getReportData(period, type) {
    return this.get(`/v2/reports/${type}?period=${period}`);
  }
  
  async exportReport(type, format = 'xlsx') {
    return this.get(`/v2/reports/${type}/export?format=${format}`);
  }
  
  // ===============================================
  // DASHBOARD ENHANCED APIs (NEW!)
  // ===============================================
  async getDashboardCharts() {
    return this.get('/v2/dashboard/charts');
  }
  
  async getRecentRides(limit = 10) {
    return this.get(`/v2/rides/recent?limit=${limit}`);
  }
  
  async getActiveDrivers() {
    return this.get('/v2/drivers/active');
  }
  
  // ===============================================
  // AUDIT LOGS APIs (NEW!)
  // ===============================================
  async getAuditLogs(params = {}) {
    const query = new URLSearchParams(params).toString();
    return this.get(`/v2/system/audit-logs?${query}`);
  }
  
  async searchAuditLogs(searchTerm) {
    return this.get(`/v2/system/audit-logs/search?q=${searchTerm}`);
  }
  
  // ===============================================
  // SYSTEM ENHANCED APIs (NEW!)
  // ===============================================
  async getDetailedSystemHealth() {
    return this.get('/v2/system/health/detailed');
  }
  
  async getCurrentUser() {
    return this.get('/v2/auth/me');
  }
  
  async changePassword(currentPassword, newPassword) {
    return this.post('/v2/auth/change-password', { currentPassword, newPassword });
  }
  
  async getSystemLogs(params = {}) {
    const query = new URLSearchParams(params).toString();
    return this.get(`/v2/system/logs?${query}`);
  }
  
  async clearCache() {
    return this.post('/v2/system/cache/clear');
  }
  
  async restartServer() {
    return this.post('/v2/system/restart');
  }
  
  // ===============================================
  // REGISTRATION ENHANCED APIs (NEW!)
  // ===============================================
  async getRegistrations(filters = {}) {
    const query = new URLSearchParams(filters).toString();
    return this.get(`/v2/registrations?${query}`);
  }
  
  async getRegistration(id) {
    return this.get(`/v2/registrations/${id}`);
  }
  
  async approveRegistration(id) {
    return this.post(`/v2/registrations/${id}/approve`);
  }
  
  async rejectRegistration(id, reason) {
    return this.post(`/v2/registrations/${id}/reject`, { reason });
  }
  
  async sendRegistrationMessage(id, message) {
    return this.post(`/v2/registrations/${id}/message`, { message });
  }
  
  // ===============================================
  // USERS MANAGEMENT APIs (NEW!)
  // ===============================================
  async getUsers() {
    return this.get('/v2/users');
  }
  
  async createUser(userData) {
    return this.post('/v2/users', userData);
  }
  
  async updateUser(id, userData) {
    return this.put(`/v2/users/${id}`, userData);
  }
  
  async deleteUser(id) {
    return this.delete(`/v2/users/${id}`);
  }
  
  async getUserActivity(id) {
    return this.get(`/v2/users/${id}/activity`);
  }
}

// Create global instance
const api = new ApiClient();