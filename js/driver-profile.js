// ===============================================
// 👤 DRIVER PROFILE PAGE
// ===============================================

const DriverProfile = {
  driverId: null,
  driver: null,
  currentRotation: 0,
  
  async init() {
    // Get driver ID from URL
    const params = new URLSearchParams(window.location.search);
    this.driverId = params.get('id');
    
    if (!this.driverId) {
      Utils.showAlert('מזהה נהג חסר', 'error');
      setTimeout(() => window.location.href = 'drivers.html', 1500);
      return;
    }
    
    this.attachEventListeners();
    await this.loadDriverData();
  },
  
  attachEventListeners() {
    // Theme toggle
    document.getElementById('themeToggle')?.addEventListener('click', () => {
      document.body.classList.toggle('dark-mode');
      const icon = document.querySelector('#themeToggle i');
      icon.className = document.body.classList.contains('dark-mode') ? 'fas fa-sun' : 'fas fa-moon';
    });
    
    // Tab navigation
    document.querySelectorAll('.tab-btn').forEach(btn => {
      btn.addEventListener('click', () => this.switchTab(btn.dataset.tab));
    });
    
    // Edit driver
    document.getElementById('editDriverBtn')?.addEventListener('click', () => this.editDriver());
    
    // History filter
    document.getElementById('historyFilter')?.addEventListener('change', (e) => this.filterHistory(e.target.value));
    
    // Logout
    document.getElementById('logoutBtn')?.addEventListener('click', (e) => {
      e.preventDefault();
      API.logout();
      window.location.href = 'index.html';
    });
  },
  
  // ===============================================
  // DATA LOADING
  // ===============================================
  
  async loadDriverData() {
    try {
      Utils.showLoading();
      
      // Load driver details
      this.driver = await API.getDriver(this.driverId);
      
      if (!this.driver) {
        throw new Error('נהג לא נמצא');
      }
      
      this.renderDriver();
      
      // Load additional data in parallel
      await Promise.all([
        this.loadHistory(),
        this.loadPayments(),
        this.loadReviews()
      ]);
      
    } catch (error) {
      Utils.showAlert('שגיאה בטעינת נתוני נהג: ' + error.message, 'error');
      console.error('Error loading driver:', error);
    } finally {
      Utils.hideLoading();
    }
  },
  
  renderDriver() {
    const d = this.driver;
    
    // Header
    document.getElementById('driverNameHeader').textContent = d.name;
    document.title = `${d.name} - פרופיל נהג`;
    
    // Avatar
    const avatar = document.getElementById('driverAvatar');
    if (d.documents?.profilePhoto?.url) {
      avatar.innerHTML = `<img src="${d.documents.profilePhoto.url}" alt="${d.name}">`;
    } else {
      avatar.innerHTML = `<i class="fas fa-user"></i>`;
    }
    
    // Status badge
    const statusBadge = document.getElementById('driverStatusBadge');
    if (d.isBlocked) {
      statusBadge.className = 'status-badge blocked';
      statusBadge.innerHTML = '<i class="fas fa-circle"></i> חסום';
    } else if (d.isActive) {
      statusBadge.className = 'status-badge active';
      statusBadge.innerHTML = '<i class="fas fa-circle"></i> פעיל';
    } else {
      statusBadge.className = 'status-badge inactive';
      statusBadge.innerHTML = '<i class="fas fa-circle"></i> לא פעיל';
    }
    
    // Basic info
    document.getElementById('driverName').textContent = d.name;
    document.getElementById('driverId').textContent = d.driverId;
    
    const phoneLink = document.getElementById('driverPhone');
    phoneLink.href = `tel:${d.phone}`;
    phoneLink.textContent = d.phone;
    
    document.getElementById('driverJoinDate').textContent = Utils.formatDate(d.createdAt);
    
    // Quick stats
    document.getElementById('totalRides').textContent = d.stats?.completedRides || 0;
    document.getElementById('driverRating').textContent = (d.rating?.average || 5.0).toFixed(1);
    document.getElementById('totalEarnings').textContent = `₪${Utils.formatNumber(d.earnings?.total || 0)}`;
    document.getElementById('unpaidAmount').textContent = `₪${Utils.formatNumber(d.earnings?.unpaid || 0)}`;
    
    // Block button text
    document.getElementById('blockBtnText').textContent = d.isBlocked ? 'בטל חסימה' : 'חסום נהג';
    
    // Overview tab
    document.getElementById('detailName').textContent = d.name;
    document.getElementById('detailIdNumber').textContent = d.idNumber || '-';
    
    const detailPhone = document.getElementById('detailPhone');
    detailPhone.href = `tel:${d.phone}`;
    detailPhone.textContent = d.phone;
    
    document.getElementById('detailCity').textContent = d.city || '-';
    document.getElementById('detailWorkArea').textContent = d.workArea || '-';
    
    document.getElementById('detailVehicleType').textContent = d.vehicleType || '-';
    document.getElementById('detailVehicleNumber').textContent = d.vehicleNumber || '-';
    document.getElementById('detailLicenseNumber').textContent = d.licenseNumber || '-';
    
    const statusText = d.isBlocked ? 'חסום' : d.isActive ? 'פעיל' : 'לא פעיל';
    const statusClass = d.isBlocked ? 'danger' : d.isActive ? 'success' : 'gray';
    document.getElementById('detailStatus').innerHTML = `<span style="color: var(--${statusClass}); font-weight: 600;">${statusText}</span>`;
    
    document.getElementById('detailJoinDate').textContent = Utils.formatDate(d.createdAt);
    document.getElementById('detailApprovedBy').textContent = d.approvedBy || '-';
    document.getElementById('detailMonthlyRides').textContent = d.stats?.completedRides || 0;
    document.getElementById('detailAcceptanceRate').textContent = `${((d.stats?.acceptanceRate || 0) * 100).toFixed(0)}%`;
    
    // Documents
    this.renderDocuments();
    
    // Financial summary
    document.getElementById('financialTotal').textContent = `₪${Utils.formatNumber(d.earnings?.total || 0)}`;
    document.getElementById('financialThisMonth').textContent = `₪${Utils.formatNumber(d.earnings?.thisMonth || 0)}`;
    document.getElementById('financialLastMonth').textContent = `₪${Utils.formatNumber(d.earnings?.lastMonth || 0)}`;
    document.getElementById('financialUnpaid').textContent = `₪${Utils.formatNumber(d.earnings?.unpaid || 0)}`;
    
    // Commission (example: 10% per ride)
    const commissionRate = '10%';
    document.getElementById('commissionRate').textContent = commissionRate;
    
    const thisMonthCommission = (d.earnings?.thisMonth || 0) * 0.1;
    document.getElementById('monthlyCommission').textContent = `₪${Utils.formatNumber(thisMonthCommission)}`;
    
    const unpaidRides = Math.floor((d.earnings?.unpaid || 0) / 50); // Assuming avg ₪50 per ride
    document.getElementById('unpaidRides').textContent = unpaidRides;
    
    // Reviews summary
    this.renderReviewsSummary();
  },
  
  renderDocuments() {
    const docs = this.driver.documents || {};
    
    // Profile Photo
    if (docs.profilePhoto?.url) {
      const preview = document.getElementById('profilePhotoPreview');
      preview.innerHTML = `<img src="${docs.profilePhoto.url}" alt="תמונת פרופיל" onclick="DriverProfile.viewDocument('profilePhoto')">`;
      
      const verified = document.getElementById('profilePhotoVerified');
      if (docs.profilePhoto.verified) {
        verified.className = 'verification-badge verified';
        verified.innerHTML = '<i class="fas fa-check-circle"></i> מאומת';
      } else {
        verified.className = 'verification-badge unverified';
        verified.innerHTML = '<i class="fas fa-question-circle"></i> לא אומת';
      }
    }
    
    // ID Document
    if (docs.idDocument?.url) {
      const preview = document.getElementById('idDocumentPreview');
      preview.innerHTML = `<img src="${docs.idDocument.url}" alt="רישיון" onclick="DriverProfile.viewDocument('idDocument')">`;
      
      const verified = document.getElementById('idDocumentVerified');
      if (docs.idDocument.verified) {
        verified.className = 'verification-badge verified';
        verified.innerHTML = '<i class="fas fa-check-circle"></i> מאומת';
      } else {
        verified.className = 'verification-badge unverified';
        verified.innerHTML = '<i class="fas fa-question-circle"></i> לא אומת';
      }
    }
    
    // Car Photo
    if (docs.carPhoto?.url) {
      const preview = document.getElementById('carPhotoPreview');
      preview.innerHTML = `<img src="${docs.carPhoto.url}" alt="תמונת רכב" onclick="DriverProfile.viewDocument('carPhoto')">`;
      
      const verified = document.getElementById('carPhotoVerified');
      if (docs.carPhoto.verified) {
        verified.className = 'verification-badge verified';
        verified.innerHTML = '<i class="fas fa-check-circle"></i> מאומת';
      } else {
        verified.className = 'verification-badge unverified';
        verified.innerHTML = '<i class="fas fa-question-circle"></i> לא אומת';
      }
    }
  },
  
  renderReviewsSummary() {
    const rating = this.driver.rating || { average: 5.0, count: 0, breakdown: {} };
    
    document.getElementById('avgRating').textContent = rating.average.toFixed(1);
    document.getElementById('reviewCount').textContent = `${rating.count} ביקורות`;
    
    // Stars
    const stars = this.getStarsHTML(rating.average);
    document.getElementById('avgRatingStars').innerHTML = stars;
    
    // Breakdown
    const breakdown = rating.breakdown || { five: 0, four: 0, three: 0, two: 0, one: 0 };
    const total = rating.count || 1; // Avoid division by zero
    
    const breakdownHTML = `
      ${this.getRatingBarHTML(5, breakdown.five, total)}
      ${this.getRatingBarHTML(4, breakdown.four, total)}
      ${this.getRatingBarHTML(3, breakdown.three, total)}
      ${this.getRatingBarHTML(2, breakdown.two, total)}
      ${this.getRatingBarHTML(1, breakdown.one, total)}
    `;
    
    document.getElementById('ratingBreakdown').innerHTML = breakdownHTML;
  },
  
  getStarsHTML(rating) {
    const fullStars = Math.floor(rating);
    const halfStar = rating % 1 >= 0.5;
    const emptyStars = 5 - fullStars - (halfStar ? 1 : 0);
    
    let html = '';
    for (let i = 0; i < fullStars; i++) {
      html += '<i class="fas fa-star"></i>';
    }
    if (halfStar) {
      html += '<i class="fas fa-star-half-alt"></i>';
    }
    for (let i = 0; i < emptyStars; i++) {
      html += '<i class="far fa-star"></i>';
    }
    return html;
  },
  
  getRatingBarHTML(stars, count, total) {
    const percentage = (count / total * 100).toFixed(0);
    return `
      <div class="rating-bar">
        <div class="rating-bar-label">${stars} כוכבים</div>
        <div class="rating-bar-track">
          <div class="rating-bar-fill" style="width: ${percentage}%"></div>
        </div>
        <div class="rating-bar-count">${count}</div>
      </div>
    `;
  },
  
  async loadHistory() {
    try {
      const rides = await API.getDriverRides(this.driverId);
      this.renderHistory(rides);
    } catch (error) {
      console.error('Error loading history:', error);
      document.getElementById('historyTableBody').innerHTML = `
        <tr>
          <td colspan="7" style="text-align: center; padding: 40px; color: var(--danger);">
            שגיאה בטעינת היסטוריה
          </td>
        </tr>
      `;
    }
  },
  
  renderHistory(rides) {
    const tbody = document.getElementById('historyTableBody');
    document.getElementById('historyCount').textContent = rides.length;
    
    if (rides.length === 0) {
      tbody.innerHTML = `
        <tr>
          <td colspan="7" style="text-align: center; padding: 40px;">
            <i class="fas fa-car" style="font-size: 48px; color: var(--gray); opacity: 0.3;"></i>
            <p style="margin-top: 10px; color: var(--gray);">אין נסיעות עדיין</p>
          </td>
        </tr>
      `;
      return;
    }
    
    tbody.innerHTML = rides.map(ride => `
      <tr>
        <td>
          <a href="ride-details.html?id=${ride._id}" style="color: var(--primary); text-decoration: none; font-weight: 600;">
            ${ride.rideNumber}
          </a>
        </td>
        <td>
          ${Utils.formatDate(ride.createdAt)}
          <br>
          <small style="color: var(--gray);">${Utils.formatTime(ride.createdAt)}</small>
        </td>
        <td>${this.truncateAddress(ride.pickup)}</td>
        <td>${this.truncateAddress(ride.destination)}</td>
        <td style="font-weight: 600;">₪${ride.price || '-'}</td>
        <td>${this.getStatusBadge(ride.status)}</td>
        <td>
          <button class="btn-icon btn-sm" onclick="window.location.href='ride-details.html?id=${ride._id}'" title="צפה">
            <i class="fas fa-eye"></i>
          </button>
        </td>
      </tr>
    `).join('');
  },
  
  truncateAddress(address) {
    if (!address) return '-';
    return address.length > 30 ? address.substring(0, 30) + '...' : address;
  },
  
  getStatusBadge(status) {
    const badges = {
      completed: '<span class="badge badge-success">הושלמה</span>',
      cancelled: '<span class="badge badge-danger">בוטלה</span>',
      locked: '<span class="badge badge-warning">ממתינה</span>',
      sent: '<span class="badge badge-info">נשלחה</span>'
    };
    return badges[status] || '<span class="badge">לא ידוע</span>';
  },
  
  filterHistory(filter) {
    // This would filter the rides table based on status
    // For now, just reload
    this.loadHistory();
  },
  
  async loadPayments() {
    try {
      // Mock data - replace with actual API call
      const payments = [];
      
      this.renderPayments(payments);
    } catch (error) {
      console.error('Error loading payments:', error);
    }
  },
  
  renderPayments(payments) {
    const tbody = document.getElementById('paymentsTableBody');
    
    if (payments.length === 0) {
      tbody.innerHTML = `
        <tr>
          <td colspan="5" style="text-align: center; padding: 40px;">
            <i class="fas fa-receipt" style="font-size: 48px; color: var(--gray); opacity: 0.3;"></i>
            <p style="margin-top: 10px; color: var(--gray);">אין תשלומים להצגה</p>
          </td>
        </tr>
      `;
      return;
    }
    
    tbody.innerHTML = payments.map(payment => `
      <tr>
        <td>${Utils.formatDate(payment.date)}</td>
        <td>${payment.type}</td>
        <td style="font-weight: 600; color: var(--success);">₪${payment.amount}</td>
        <td>${payment.method}</td>
        <td>${payment.notes || '-'}</td>
      </tr>
    `).join('');
  },
  
  async loadReviews() {
    try {
      const reviews = this.driver.reviews || [];
      this.renderReviews(reviews);
    } catch (error) {
      console.error('Error loading reviews:', error);
    }
  },
  
  renderReviews(reviews) {
    const container = document.getElementById('reviewsList');
    
    if (reviews.length === 0) {
      container.innerHTML = `
        <div style="text-align: center; padding: 40px;">
          <i class="fas fa-comments" style="font-size: 48px; color: var(--gray); opacity: 0.3;"></i>
          <p style="margin-top: 10px; color: var(--gray);">אין ביקורות עדיין</p>
        </div>
      `;
      return;
    }
    
    container.innerHTML = reviews.map(review => `
      <div class="review-item">
        <div class="review-header">
          <div>
            <div class="review-author">${review.customerName}</div>
            <div class="review-stars">${this.getStarsHTML(review.rating)}</div>
          </div>
          <div class="review-date">${Utils.formatDate(review.timestamp)}</div>
        </div>
        <div class="review-body">${review.comment || 'ללא תגובה'}</div>
        <div class="review-ride">
          נסיעה: <a href="ride-details.html?id=${review.rideId}">${review.rideId}</a>
        </div>
      </div>
    `).join('');
  },
  
  // ===============================================
  // TAB SWITCHING
  // ===============================================
  
  switchTab(tab) {
    // Update buttons
    document.querySelectorAll('.tab-btn').forEach(btn => {
      btn.classList.remove('active');
      if (btn.dataset.tab === tab) {
        btn.classList.add('active');
      }
    });
    
    // Update content
    document.querySelectorAll('.tab-content').forEach(content => {
      content.classList.remove('active');
    });
    document.getElementById(`tab-${tab}`).classList.add('active');
  },
  
  // ===============================================
  // DOCUMENT VIEWER
  // ===============================================
  
  viewDocument(docType) {
    const docs = this.driver.documents || {};
    const doc = docs[docType];
    
    if (!doc || !doc.url) {
      Utils.showAlert('מסמך לא זמין', 'error');
      return;
    }
    
    const modal = document.getElementById('imageViewerModal');
    const img = document.getElementById('viewerImage');
    
    img.src = doc.url;
    img.style.transform = 'rotate(0deg)';
    this.currentRotation = 0;
    this.currentImageUrl = doc.url;
    
    modal.classList.add('active');
  },
  
  closeImageViewer() {
    const modal = document.getElementById('imageViewerModal');
    modal.classList.remove('active');
  },
  
  rotateImage(degrees) {
    this.currentRotation += degrees;
    const img = document.getElementById('viewerImage');
    img.style.transform = `rotate(${this.currentRotation}deg)`;
  },
  
  downloadImage() {
    const link = document.createElement('a');
    link.href = this.currentImageUrl;
    link.download = `document_${Date.now()}.jpg`;
    link.click();
  },
  
  async verifyDocument(docType) {
    try {
      const confirmed = await Utils.confirm(`האם לאמת את המסמך?`);
      if (!confirmed) return;
      
      Utils.showLoading();
      
      await API.verifyDocument(this.driverId, docType);
      
      Utils.showAlert('המסמך אומת בהצלחה', 'success');
      await this.loadDriverData();
      
    } catch (error) {
      Utils.showAlert('שגיאה באימות מסמך: ' + error.message, 'error');
    } finally {
      Utils.hideLoading();
    }
  },
  
  // ===============================================
  // ACTIONS
  // ===============================================
  
  async sendMessage() {
    const message = prompt('הודעה לנהג:');
    if (!message) return;
    
    try {
      Utils.showLoading();
      
      await API.sendDriverMessage(this.driverId, message);
      
      Utils.showAlert('ההודעה נשלחה בהצלחה', 'success');
      
    } catch (error) {
      Utils.showAlert('שגיאה בשליחת הודעה: ' + error.message, 'error');
    } finally {
      Utils.hideLoading();
    }
  },
  
  async makePayment() {
    // This would open a payment modal
    Utils.showAlert('מערכת התשלומים בפיתוח', 'info');
  },
  
  async toggleBlock() {
    const action = this.driver.isBlocked ? 'בטל חסימה' : 'חסום';
    const confirmed = await Utils.confirm(`האם ${action} של ${this.driver.name}?`);
    
    if (!confirmed) return;
    
    try {
      Utils.showLoading();
      
      await API.toggleDriverBlock(this.driverId);
      
      Utils.showAlert(`נהג ${action === 'חסום' ? 'נחסם' : 'שוחרר'} בהצלחה`, 'success');
      await this.loadDriverData();
      
    } catch (error) {
      Utils.showAlert('שגיאה: ' + error.message, 'error');
    } finally {
      Utils.hideLoading();
    }
  },
  
  async editDriver() {
    Utils.showAlert('עריכת נהג בפיתוח', 'info');
  }
};

// Initialize on page load
document.addEventListener('DOMContentLoaded', () => {
  DriverProfile.init();
});
