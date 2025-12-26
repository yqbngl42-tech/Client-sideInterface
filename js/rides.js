// ===============================================
// 🚗 RIDES MANAGEMENT
// ===============================================

let currentPage = 1;
let currentFilters = {};

(async () => {
  // Auth check
  await Utils.checkAuth();
  
  // Load rides
  await loadRides();
  
  // Setup event listeners
  setupEventListeners();
})();

// ===============================================
// LOAD RIDES
// ===============================================
async function loadRides(page = 1) {
  const tbody = document.getElementById('ridesTableBody');
  currentPage = page;
  
  try {
    // Build query params
    const params = {
      page,
      limit: CONFIG.DEFAULT_PAGE_SIZE,
      ...currentFilters
    };
    
    // Fetch rides (using old API for now - will update when new API is ready)
    const response = await fetch(
      `${CONFIG.API_URL}/api/rides?${new URLSearchParams(params)}`,
      {
        headers: {
          'Authorization': `Bearer ${api.token}`
        }
      }
    );
    
    if (!response.ok) throw new Error('Failed to load rides');
    
    const result = await response.json();
    const rides = result.rides || result.data || [];
    const pagination = result.pagination || {};
    
    // Update count
    document.getElementById('ridesCount').textContent = 
      `סה"כ: ${pagination.total || rides.length} נסיעות`;
    
    // Render table
    if (rides.length === 0) {
      tbody.innerHTML = `
        <tr>
          <td colspan="10" class="empty-state">
            <i class="fas fa-inbox"></i>
            <h3>אין נסיעות</h3>
            <p>לא נמצאו נסיעות התואמות את הסינון</p>
          </td>
        </tr>
      `;
    } else {
      tbody.innerHTML = rides.map(ride => createRideRow(ride)).join('');
    }
    
    // Render pagination
    if (pagination.pages > 1) {
      Utils.renderPagination(
        document.getElementById('pagination'),
        pagination.page,
        pagination.pages,
        (newPage) => loadRides(newPage)
      );
    } else {
      document.getElementById('pagination').innerHTML = '';
    }
    
  } catch (error) {
    Utils.handleError(error);
    tbody.innerHTML = `
      <tr>
        <td colspan="10" class="empty-state">
          <i class="fas fa-exclamation-circle"></i>
          <h3>שגיאה</h3>
          <p>${error.message}</p>
        </td>
      </tr>
    `;
  }
}

// ===============================================
// CREATE RIDE ROW
// ===============================================
function createRideRow(ride) {
  return `
    <tr>
      <td><strong>${ride.rideNumber || '-'}</strong></td>
      <td>${ride.customerName || '-'}</td>
      <td>${Utils.formatPhone(ride.customerPhone)}</td>
      <td>${extractCity(ride.pickup)}</td>
      <td>${extractCity(ride.destination)}</td>
      <td>${ride.driverName || '-'}</td>
      <td>${Utils.formatCurrency(ride.price)}</td>
      <td>${Utils.getStatusBadge(ride.status)}</td>
      <td>${Utils.formatDate(ride.createdAt)}</td>
      <td>
        <div style="display: flex; gap: 5px;">
          <button class="btn btn-sm btn-primary" onclick="viewRide('${ride._id}')" title="צפה">
            <i class="fas fa-eye"></i>
          </button>
          ${canCancelRide(ride) ? `
            <button class="btn btn-sm btn-danger" onclick="cancelRide('${ride._id}')" title="בטל">
              <i class="fas fa-times"></i>
            </button>
          ` : ''}
          ${canRedispatch(ride) ? `
            <button class="btn btn-sm btn-warning" onclick="redispatchRide('${ride._id}')" title="שלח מחדש">
              <i class="fas fa-redo"></i>
            </button>
          ` : ''}
        </div>
      </td>
    </tr>
  `;
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
  
  const words = address.split(' ');
  if (words.length >= 2) {
    return words.slice(-2).join(' ');
  }
  
  return address;
}

function canCancelRide(ride) {
  return ['created', 'sent', 'locked', 'assigned'].includes(ride.status);
}

function canRedispatch(ride) {
  return ['cancelled', 'created'].includes(ride.status);
}

// ===============================================
// ACTIONS
// ===============================================
async function viewRide(rideId) {
  try {
    const response = await fetch(`${CONFIG.API_URL}/api/rides/${rideId}`, {
      headers: {
        'Authorization': `Bearer ${api.token}`
      }
    });
    
    if (!response.ok) throw new Error('Failed to load ride');
    
    const result = await response.json();
    const ride = result.ride || result.data;
    
    Utils.showModal(`
      <div style="line-height: 1.8;">
        <h3 style="margin-bottom: 20px;">פרטי נסיעה ${ride.rideNumber}</h3>
        
        <div style="background: var(--light); padding: 15px; border-radius: 8px; margin-bottom: 15px;">
          <h4 style="margin-bottom: 10px;">פרטי לקוח</h4>
          <p><strong>שם:</strong> ${ride.customerName}</p>
          <p><strong>טלפון:</strong> ${Utils.formatPhone(ride.customerPhone)}</p>
        </div>
        
        <div style="background: var(--light); padding: 15px; border-radius: 8px; margin-bottom: 15px;">
          <h4 style="margin-bottom: 10px;">פרטי נסיעה</h4>
          <p><strong>מוצא:</strong> ${ride.pickup}</p>
          <p><strong>יעד:</strong> ${ride.destination}</p>
          <p><strong>מחיר:</strong> ${Utils.formatCurrency(ride.price)}</p>
          <p><strong>עמלה:</strong> ${Utils.formatCurrency(ride.commissionAmount)}</p>
          ${ride.notes ? `<p><strong>הערות:</strong> ${ride.notes}</p>` : ''}
        </div>
        
        <div style="background: var(--light); padding: 15px; border-radius: 8px; margin-bottom: 15px;">
          <h4 style="margin-bottom: 10px;">פרטי נהג</h4>
          <p><strong>שם:</strong> ${ride.driverName || '-'}</p>
          <p><strong>טלפון:</strong> ${ride.driverPhone ? Utils.formatPhone(ride.driverPhone) : '-'}</p>
        </div>
        
        <div style="background: var(--light); padding: 15px; border-radius: 8px;">
          <h4 style="margin-bottom: 10px;">מידע כללי</h4>
          <p><strong>סטטוס:</strong> ${Utils.getStatusBadge(ride.status)}</p>
          <p><strong>נוצר:</strong> ${Utils.formatDate(ride.createdAt)}</p>
          <p><strong>עודכן:</strong> ${Utils.formatDate(ride.updatedAt)}</p>
        </div>
      </div>
    `, `נסיעה ${ride.rideNumber}`);
    
  } catch (error) {
    Utils.handleError(error);
  }
}

async function cancelRide(rideId) {
  const confirmed = await Utils.showConfirm(
    'האם אתה בטוח שברצונך לבטל נסיעה זו?',
    'ביטול נסיעה'
  );
  
  if (!confirmed) return;
  
  try {
    // NOTE: Using old API - will update when new API is ready
    const response = await fetch(`${CONFIG.API_URL}/api/rides/${rideId}/status`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${api.token}`
      },
      body: JSON.stringify({ status: 'cancelled' })
    });
    
    if (!response.ok) throw new Error('Failed to cancel ride');
    
    Utils.showNotification(MESSAGES.SUCCESS_9, 'success');
    await loadRides(currentPage);
    
  } catch (error) {
    Utils.handleError(error);
  }
}

async function redispatchRide(rideId) {
  const confirmed = await Utils.showConfirm(
    'האם לשלוח מחדש את הנסיעה לנהגים?',
    'שליחה מחדש'
  );
  
  if (!confirmed) return;
  
  try {
    // NOTE: This is a new endpoint that needs to be created
    // For now, we'll just show a message
    Utils.showNotification(MESSAGES.MSG_29, 'info');
    
    // When ready:
    // await api.redispatchRide(rideId);
    // Utils.showNotification(MESSAGES.MSG_3, 'success');
    // await loadRides(currentPage);
    
  } catch (error) {
    Utils.handleError(error);
  }
}

// ===============================================
// EVENT LISTENERS
// ===============================================
function setupEventListeners() {
  // Logout
  document.getElementById('logoutBtn').addEventListener('click', async (e) => {
    e.preventDefault();
    const confirmed = await Utils.showConfirm(MESSAGES.CONFIRM_8, 'התנתקות');
    if (confirmed) {
      await api.logout();
      window.location.href = '/index.html';
    }
  });
  
  // Create ride button
  document.getElementById('createRideBtn').addEventListener('click', () => {
    showCreateRideModal();
  });
  
  // Filter status
  document.getElementById('filterStatus').addEventListener('change', (e) => {
    if (e.target.value) {
      currentFilters.status = e.target.value;
    } else {
      delete currentFilters.status;
    }
    loadRides(1);
  });
  
  // Search
  const searchInput = document.getElementById('searchQuery');
  searchInput.addEventListener('input', Utils.debounce((e) => {
    if (e.target.value.trim()) {
      currentFilters.search = e.target.value.trim();
    } else {
      delete currentFilters.search;
    }
    loadRides(1);
  }, 500));
  
  // Clear filters
  document.getElementById('clearFiltersBtn').addEventListener('click', () => {
    currentFilters = {};
    document.getElementById('filterStatus').value = '';
    document.getElementById('searchQuery').value = '';
    loadRides(1);
  });
}

// ===============================================
// CREATE RIDE MODAL
// ===============================================
function showCreateRideModal() {
  Utils.showModal(`
    <form id="createRideForm">
      <div class="form-group">
        <label>שם לקוח *</label>
        <input type="text" id="customerName" class="form-control" required>
      </div>
      
      <div class="form-group">
        <label>טלפון לקוח *</label>
        <input type="tel" id="customerPhone" class="form-control" placeholder="050-123-4567" required>
      </div>
      
      <div class="form-group">
        <label>כתובת איסוף *</label>
        <input type="text" id="pickup" class="form-control" required>
      </div>
      
      <div class="form-group">
        <label>כתובת יעד *</label>
        <input type="text" id="destination" class="form-control" required>
      </div>
      
      <div class="form-group">
        <label>מחיר *</label>
        <input type="number" id="price" class="form-control" value="50" min="0" required>
      </div>
      
      <div class="form-group">
        <label>הערות</label>
        <textarea id="notes" class="form-control" rows="3"></textarea>
      </div>
      
      <div class="modal-actions">
        <button type="button" class="btn btn-secondary" onclick="this.closest('.modal').remove()">ביטול</button>
        <button type="submit" class="btn btn-primary">צור נסיעה</button>
      </div>
    </form>
  `, 'נסיעה חדשה');
  
  // Handle form submit
  document.getElementById('createRideForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const data = {
      customerName: document.getElementById('customerName').value.trim(),
      customerPhone: document.getElementById('customerPhone').value.trim(),
      pickup: document.getElementById('pickup').value.trim(),
      destination: document.getElementById('destination').value.trim(),
      price: parseFloat(document.getElementById('price').value),
      notes: document.getElementById('notes').value.trim() || null
    };
    
    try {
      // NOTE: Using old API - will update when new API is ready
      const response = await fetch(`${CONFIG.API_URL}/api/rides`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${api.token}`
        },
        body: JSON.stringify(data)
      });
      
      if (!response.ok) throw new Error('Failed to create ride');
      
      Utils.showNotification(MESSAGES.SUCCESS_17, 'success');
      document.querySelector('.modal').remove();
      await loadRides(1);
      
    } catch (error) {
      Utils.handleError(error);
    }
  });
}
