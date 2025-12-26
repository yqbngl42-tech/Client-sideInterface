// ===============================================
// 📊 DASHBOARD LOGIC
// ===============================================

(async () => {
  // Auth check
  await Utils.checkAuth();
  
  // Load dashboard data
  loadDashboard();
  
  // Setup event listeners
  setupEventListeners();
  
  // Auto refresh every 30 seconds
  setInterval(loadDashboard, 30000);
})();

// ===============================================
// LOAD DASHBOARD
// ===============================================
async function loadDashboard() {
  try {
    await Promise.all([
      loadStats(),
      loadRecentRides(),
      loadSystemHealth()
    ]);
  } catch (error) {
    Utils.handleError(error);
  }
}

// ===============================================
// LOAD STATS
// ===============================================
async function loadStats() {
  try {
    // NOTE: This endpoint needs to be created in the server
    // For now, we'll use the old API endpoint
    const response = await fetch(`${CONFIG.API_URL}/api/dashboard/stats`, {
      headers: {
        'Authorization': `Bearer ${api.token}`
      }
    });
    
    if (!response.ok) throw new Error('Failed to load stats');
    
    const result = await response.json();
    const stats = result.stats || result;
    
    // Update UI
    document.getElementById('todayRides').textContent = stats.todayRides || 0;
    document.getElementById('activeDrivers').textContent = stats.activeDrivers || 0;
    document.getElementById('pendingRegistrations').textContent = stats.pendingRegistrations || 0;
    document.getElementById('todayRevenue').textContent = Utils.formatCurrency(stats.todayRevenue || 0);
    
  } catch (error) {
    console.error('Error loading stats:', error);
    // Show placeholder data
    document.getElementById('todayRides').textContent = '-';
    document.getElementById('activeDrivers').textContent = '-';
    document.getElementById('pendingRegistrations').textContent = '-';
    document.getElementById('todayRevenue').textContent = '-';
  }
}

// ===============================================
// LOAD RECENT RIDES
// ===============================================
async function loadRecentRides() {
  const tbody = document.getElementById('recentRidesBody');
  
  try {
    // Get recent rides (limit 10)
    const response = await fetch(`${CONFIG.API_URL}/api/rides?limit=10&page=1`, {
      headers: {
        'Authorization': `Bearer ${api.token}`
      }
    });
    
    if (!response.ok) throw new Error('Failed to load rides');
    
    const result = await response.json();
    const rides = result.rides || result.data || [];
    
    if (rides.length === 0) {
      tbody.innerHTML = `
        <tr>
          <td colspan="7" class="empty-state">
            <i class="fas fa-inbox"></i>
            <h3>אין נסיעות</h3>
            <p>לא נמצאו נסיעות אחרונות</p>
          </td>
        </tr>
      `;
      return;
    }
    
    tbody.innerHTML = rides.map(ride => `
      <tr>
        <td><strong>${ride.rideNumber || '-'}</strong></td>
        <td>${ride.customerName || '-'}</td>
        <td>${extractCity(ride.pickup || '-')}</td>
        <td>${extractCity(ride.destination || '-')}</td>
        <td>${ride.driverName || '-'}</td>
        <td>${Utils.getStatusBadge(ride.status)}</td>
        <td>${Utils.formatDate(ride.createdAt)}</td>
      </tr>
    `).join('');
    
  } catch (error) {
    console.error('Error loading recent rides:', error);
    tbody.innerHTML = `
      <tr>
        <td colspan="7" class="empty-state">
          <i class="fas fa-exclamation-circle"></i>
          <h3>שגיאה בטעינת נתונים</h3>
          <p>${error.message}</p>
        </td>
      </tr>
    `;
  }
}

// ===============================================
// LOAD SYSTEM HEALTH
// ===============================================
async function loadSystemHealth() {
  const container = document.getElementById('systemHealth');
  
  try {
    const response = await fetch(`${CONFIG.API_URL}/health`);
    const health = await response.json();
    
    const statusIcon = health.status === 'ok' ? 'check-circle' : 'exclamation-triangle';
    const statusColor = health.status === 'ok' ? 'var(--success)' : 'var(--warning)';
    
    container.innerHTML = `
      <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 20px;">
        <div style="text-align: center; padding: 20px;">
          <i class="fas fa-${statusIcon}" style="font-size: 48px; color: ${statusColor}; margin-bottom: 10px;"></i>
          <h3>סטטוס כללי</h3>
          <p style="color: ${statusColor}; font-weight: 600;">${health.status === 'ok' ? 'תקין' : 'בעיה'}</p>
        </div>
        
        <div style="text-align: center; padding: 20px;">
          <i class="fas fa-database" style="font-size: 48px; color: ${getHealthColor(health.components?.mongodb)}; margin-bottom: 10px;"></i>
          <h3>מסד נתונים</h3>
          <p style="font-weight: 600;">${health.components?.mongodb || 'unknown'}</p>
        </div>
        
        <div style="text-align: center; padding: 20px;">
          <i class="fas fa-robot" style="font-size: 48px; color: ${getHealthColor(health.components?.bot)}; margin-bottom: 10px;"></i>
          <h3>בוט WhatsApp</h3>
          <p style="font-weight: 600;">${health.components?.bot || 'not configured'}</p>
        </div>
        
        <div style="text-align: center; padding: 20px;">
          <i class="fas fa-clock" style="font-size: 48px; color: var(--info); margin-bottom: 10px;"></i>
          <h3>זמן פעילות</h3>
          <p style="font-weight: 600;">${formatUptime(health.uptime)}</p>
        </div>
      </div>
    `;
    
  } catch (error) {
    console.error('Error loading system health:', error);
    container.innerHTML = `
      <div style="text-align: center; padding: 40px; color: var(--danger);">
        <i class="fas fa-exclamation-circle" style="font-size: 48px; margin-bottom: 10px;"></i>
        <h3>שגיאה בבדיקת מצב המערכת</h3>
        <p>${error.message}</p>
      </div>
    `;
  }
}

// ===============================================
// HELPER FUNCTIONS
// ===============================================
function extractCity(address) {
  if (!address) return '-';
  
  const parts = address.split(',');
  if (parts.length > 1) {
    return parts[parts.length - 1].trim();
  }
  
  // Take last 2 words
  const words = address.split(' ');
  if (words.length >= 2) {
    return words.slice(-2).join(' ');
  }
  
  return address;
}

function getHealthColor(status) {
  switch (status) {
    case 'connected':
    case 'online':
      return 'var(--success)';
    case 'disconnected':
    case 'offline':
    case 'error':
      return 'var(--danger)';
    default:
      return 'var(--gray)';
  }
}

function formatUptime(seconds) {
  if (!seconds) return '-';
  
  const days = Math.floor(seconds / 86400);
  const hours = Math.floor((seconds % 86400) / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  
  const parts = [];
  if (days > 0) parts.push(`${days}d`);
  if (hours > 0) parts.push(`${hours}h`);
  if (minutes > 0) parts.push(`${minutes}m`);
  
  return parts.join(' ') || '< 1m';
}

// ===============================================
// EVENT LISTENERS
// ===============================================
function setupEventListeners() {
  // Logout button
  document.getElementById('logoutBtn').addEventListener('click', async (e) => {
    e.preventDefault();
    
    const confirmed = await Utils.showConfirm(MESSAGES.CONFIRM_3, 'התנתקות');
    
    if (confirmed) {
      try {
        await api.logout();
        Utils.showNotification(MESSAGES.SUCCESS_15, 'success');
        setTimeout(() => {
          window.location.href = '/index.html';
        }, 500);
      } catch (error) {
        // Even if logout fails, clear token and redirect
        api.clearToken();
        window.location.href = '/index.html';
      }
    }
  });
  
  // Refresh button
  document.getElementById('refreshBtn').addEventListener('click', async () => {
    const btn = document.getElementById('refreshBtn');
    btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i>';
    
    await loadDashboard();
    
    btn.innerHTML = '<i class="fas fa-sync-alt"></i>';
    Utils.showNotification(MESSAGES.MSG_20, 'success');
  });
}
