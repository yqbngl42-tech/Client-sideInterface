// ===============================================
// 🔍 ADVANCED SEARCH COMPONENT
// ===============================================

const SearchComponent = {
  searchTerm: '',
  filters: {},
  debounceTimer: null,
  config: null,
  
  /**
   * Initialize search component
   * @param {Object} config - Configuration object
   * @param {Array} config.searchFields - Fields to search in
   * @param {Function} config.onSearch - Callback when search is performed
   * @param {Function} config.onFilter - Callback when filters change
   * @param {Array} config.advancedFilters - Advanced filter definitions (optional)
   */
  init(config) {
    this.config = {
      searchFields: config.searchFields || [],
      onSearch: config.onSearch || (() => []),
      onFilter: config.onFilter || (() => {}),
      advancedFilters: config.advancedFilters || [],
      debounceDelay: config.debounceDelay || 300,
      highlightResults: config.highlightResults !== false
    };
    
    this.attachEventListeners();
    this.buildAdvancedFilters();
  },
  
  /**
   * Attach event listeners to search elements
   */
  attachEventListeners() {
    const searchInput = document.getElementById('globalSearch');
    const clearBtn = document.getElementById('clearSearch');
    const advancedBtn = document.getElementById('advancedSearch');
    const resetBtn = document.getElementById('resetFilters');
    
    if (!searchInput) {
      console.error('Search input not found! Make sure element with id="globalSearch" exists.');
      return;
    }
    
    // Real-time search with debounce
    searchInput.addEventListener('input', (e) => {
      clearTimeout(this.debounceTimer);
      this.searchTerm = e.target.value;
      
      // Show/hide clear button
      if (clearBtn) {
        clearBtn.style.display = this.searchTerm ? 'flex' : 'none';
      }
      
      // Debounce search
      this.debounceTimer = setTimeout(() => {
        this.performSearch();
      }, this.config.debounceDelay);
    });
    
    // Clear search
    if (clearBtn) {
      clearBtn.addEventListener('click', () => {
        searchInput.value = '';
        this.searchTerm = '';
        clearBtn.style.display = 'none';
        this.performSearch();
      });
    }
    
    // Toggle advanced filters
    if (advancedBtn) {
      advancedBtn.addEventListener('click', () => {
        const panel = document.getElementById('advancedFilters');
        if (panel) {
          const isVisible = panel.style.display !== 'none';
          panel.style.display = isVisible ? 'none' : 'block';
          advancedBtn.innerHTML = isVisible 
            ? '<i class="fas fa-sliders-h"></i> סינון מתקדם' 
            : '<i class="fas fa-sliders-h"></i> הסתר סינון';
        }
      });
    }
    
    // Reset all filters
    if (resetBtn) {
      resetBtn.addEventListener('click', () => {
        this.resetSearch();
      });
    }
  },
  
  /**
   * Build advanced filters panel dynamically
   */
  buildAdvancedFilters() {
    const panel = document.getElementById('advancedFilters');
    if (!panel || !this.config.advancedFilters.length) return;
    
    let html = '<div class="filter-row">';
    
    this.config.advancedFilters.forEach(filter => {
      html += `
        <div class="filter-group">
          <label>${filter.label}</label>
          ${this.buildFilterInput(filter)}
        </div>
      `;
    });
    
    html += '</div>';
    html += `
      <div style="display: flex; justify-content: flex-end; gap: 10px; margin-top: 15px;">
        <button class="btn btn-sm btn-secondary" onclick="SearchComponent.resetFilters()">
          <i class="fas fa-undo"></i> אפס סינונים
        </button>
        <button class="btn btn-sm btn-primary" onclick="SearchComponent.applyAdvancedFilters()">
          <i class="fas fa-check"></i> החל סינון
        </button>
      </div>
    `;
    
    panel.innerHTML = html;
  },
  
  /**
   * Build filter input based on type
   */
  buildFilterInput(filter) {
    switch (filter.type) {
      case 'select':
        return `
          <select id="filter_${filter.id}" class="filter-select">
            <option value="">הכל</option>
            ${filter.options.map(opt => `<option value="${opt.value}">${opt.label}</option>`).join('')}
          </select>
        `;
      
      case 'number':
        return `
          <input 
            type="number" 
            id="filter_${filter.id}" 
            class="filter-input"
            placeholder="${filter.placeholder || ''}"
            min="${filter.min || 0}"
            max="${filter.max || ''}">
        `;
      
      case 'date':
        return `
          <input 
            type="date" 
            id="filter_${filter.id}" 
            class="filter-input">
        `;
      
      case 'dateRange':
        return `
          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 5px;">
            <input type="date" id="filter_${filter.id}_from" class="filter-input" placeholder="מ-">
            <input type="date" id="filter_${filter.id}_to" class="filter-input" placeholder="עד">
          </div>
        `;
      
      default:
        return `
          <input 
            type="text" 
            id="filter_${filter.id}" 
            class="filter-input"
            placeholder="${filter.placeholder || ''}">
        `;
    }
  },
  
  /**
   * Apply advanced filters
   */
  applyAdvancedFilters() {
    this.filters = {};
    
    this.config.advancedFilters.forEach(filter => {
      if (filter.type === 'dateRange') {
        const from = document.getElementById(`filter_${filter.id}_from`)?.value;
        const to = document.getElementById(`filter_${filter.id}_to`)?.value;
        if (from || to) {
          this.filters[filter.id] = { from, to };
        }
      } else {
        const value = document.getElementById(`filter_${filter.id}`)?.value;
        if (value) {
          this.filters[filter.id] = value;
        }
      }
    });
    
    this.performSearch();
  },
  
  /**
   * Reset only advanced filters
   */
  resetFilters() {
    this.filters = {};
    
    this.config.advancedFilters.forEach(filter => {
      if (filter.type === 'dateRange') {
        const fromEl = document.getElementById(`filter_${filter.id}_from`);
        const toEl = document.getElementById(`filter_${filter.id}_to`);
        if (fromEl) fromEl.value = '';
        if (toEl) toEl.value = '';
      } else {
        const el = document.getElementById(`filter_${filter.id}`);
        if (el) el.value = '';
      }
    });
    
    this.performSearch();
  },
  
  /**
   * Perform search with current term and filters
   */
  performSearch() {
    const results = this.config.onSearch(this.searchTerm, this.filters);
    this.displayResultsInfo(results);
    
    if (this.config.highlightResults && this.searchTerm) {
      this.highlightSearchTerm(this.searchTerm);
    }
    
    return results;
  },
  
  /**
   * Display search results information
   */
  displayResultsInfo(results) {
    const info = document.getElementById('searchInfo');
    const count = document.getElementById('resultsCount');
    
    if (!info || !count) return;
    
    const hasActiveFilters = this.searchTerm || Object.keys(this.filters).length > 0;
    
    if (hasActiveFilters) {
      info.style.display = 'flex';
      const resultsText = results.length === 1 ? 'תוצאה אחת' : `${results.length} תוצאות`;
      count.textContent = `נמצאו ${resultsText}`;
    } else {
      info.style.display = 'none';
    }
  },
  
  /**
   * Reset all search and filters
   */
  resetSearch() {
    const searchInput = document.getElementById('globalSearch');
    const clearBtn = document.getElementById('clearSearch');
    const advancedPanel = document.getElementById('advancedFilters');
    
    if (searchInput) searchInput.value = '';
    if (clearBtn) clearBtn.style.display = 'none';
    if (advancedPanel) advancedPanel.style.display = 'none';
    
    this.searchTerm = '';
    this.filters = {};
    this.resetFilters();
    this.performSearch();
  },
  
  /**
   * Search in multiple fields of an item
   * @param {Object} item - Item to search in
   * @param {String} searchTerm - Term to search for
   * @param {Array} fields - Fields to search in
   * @returns {Boolean} - True if found
   */
  searchInFields(item, searchTerm, fields) {
    if (!searchTerm || !searchTerm.trim()) return true;
    
    const term = searchTerm.toLowerCase().trim();
    const searchWords = term.split(' ').filter(w => w.length > 0);
    
    return searchWords.every(word => 
      fields.some(field => {
        const value = this.getNestedValue(item, field);
        if (!value) return false;
        return String(value).toLowerCase().includes(word);
      })
    );
  },
  
  /**
   * Get nested object value
   * @param {Object} obj - Object to get value from
   * @param {String} path - Dot notation path (e.g., "driver.name")
   * @returns {*} - Value at path
   */
  getNestedValue(obj, path) {
    return path.split('.').reduce((curr, prop) => curr?.[prop], obj);
  },
  
  /**
   * Highlight search term in results (simple version)
   * @param {String} term - Term to highlight
   */
  highlightSearchTerm(term) {
    // This is a simple version - can be enhanced with more sophisticated highlighting
    // For now, this is handled by the page-specific rendering
  },
  
  /**
   * Apply date range filter
   * @param {String} dateString - Date string to check
   * @param {Object} range - Range object with from/to
   * @returns {Boolean} - True if in range
   */
  isInDateRange(dateString, range) {
    if (!range || (!range.from && !range.to)) return true;
    
    const date = new Date(dateString);
    const from = range.from ? new Date(range.from) : null;
    const to = range.to ? new Date(range.to) : null;
    
    if (from && date < from) return false;
    if (to && date > to) return false;
    
    return true;
  },
  
  /**
   * Apply number range filter
   * @param {Number} value - Value to check
   * @param {Object} range - Range object with min/max
   * @returns {Boolean} - True if in range
   */
  isInNumberRange(value, range) {
    if (!range) return true;
    
    const num = parseFloat(value);
    if (isNaN(num)) return false;
    
    if (range.min !== undefined && num < parseFloat(range.min)) return false;
    if (range.max !== undefined && num > parseFloat(range.max)) return false;
    
    return true;
  }
};

// Export for use in other scripts
if (typeof module !== 'undefined' && module.exports) {
  module.exports = SearchComponent;
}
