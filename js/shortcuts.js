// ===============================================
// ⌨️ KEYBOARD SHORTCUTS
// ===============================================

const Shortcuts = {
  init() {
    document.addEventListener('keydown', (e) => {
      // Ctrl+N: New item
      if (e.ctrlKey && e.key === 'n') {
        e.preventDefault();
        this.triggerNew();
      }
      
      // Ctrl+S: Save
      if (e.ctrlKey && e.key === 's') {
        e.preventDefault();
        this.triggerSave();
      }
      
      // Ctrl+F: Search
      if (e.ctrlKey && e.key === 'f') {
        e.preventDefault();
        const search = document.getElementById('searchQuery') || document.getElementById('searchInput');
        if (search) search.focus();
      }
      
      // Escape: Close modal
      if (e.key === 'Escape') {
        const modal = document.querySelector('.modal');
        if (modal) modal.remove();
      }
      
      // /: Focus search
      if (e.key === '/' && !e.ctrlKey && document.activeElement.tagName !== 'INPUT') {
        e.preventDefault();
        const search = document.getElementById('searchQuery') || document.getElementById('searchInput');
        if (search) search.focus();
      }
    });
  },
  
  triggerNew() {
    const btns = [
      document.getElementById('createRideBtn'),
      document.getElementById('addDriverBtn'),
      document.querySelector('[data-action="create"]')
    ];
    
    for (const btn of btns) {
      if (btn) {
        btn.click();
        break;
      }
    }
  },
  
  triggerSave() {
    const btns = [
      document.querySelector('[data-action="save"]'),
      document.querySelector('.modal form button[type="submit"]')
    ];
    
    for (const btn of btns) {
      if (btn) {
        btn.click();
        break;
      }
    }
  }
};

// Auto-init
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => Shortcuts.init());
} else {
  Shortcuts.init();
}
