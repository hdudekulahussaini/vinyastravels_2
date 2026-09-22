// Global Modal Management Helpers
window.openModal = function (modalId) {
  const modal = document.getElementById(modalId);
  if (modal) {
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
  }
};

window.closeModal = function (modalId) {
  const modal = document.getElementById(modalId);
  if (modal) {
    modal.classList.remove('active');
    document.body.style.overflow = '';
  }
};

document.addEventListener('DOMContentLoaded', () => {
  // --- Sticky Header Scroll Effect ---
  const siteHeader = document.getElementById('siteHeader');
  if (siteHeader) {
    const handleScroll = () => {
      const scrollPos = window.scrollY || window.pageYOffset || document.documentElement.scrollTop || 0;
      if (scrollPos > 20) {
        siteHeader.classList.add('scrolled');
      } else {
        siteHeader.classList.remove('scrolled');
      }
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('load', handleScroll);
    handleScroll();
  }

  // --- Hero Search Console Tabs (All Tours, Group Tours) ---
  const heroTabBtns = document.querySelectorAll('.hero-tab-btn');
  const heroSearchFormElement = document.getElementById('heroSearchForm');

  if (heroTabBtns.length) {
    heroTabBtns.forEach((btn, index) => {
      btn.addEventListener('click', () => {
        heroTabBtns.forEach(b => {
          b.classList.remove('active');
          b.setAttribute('aria-selected', 'false');
        });
        btn.classList.add('active');
        btn.setAttribute('aria-selected', 'true');

        if (heroSearchFormElement) {
          if (index === 0) {
            heroSearchFormElement.classList.remove('first-tab-inactive');
          } else {
            heroSearchFormElement.classList.add('first-tab-inactive');
          }
        }
      });
    });
  }


  // --- Duration / Days Range Dual Slider Controller (Matching User Reference) ---
  const durationTriggerBtn = document.getElementById('durationTriggerBtn');
  const durationRangePopover = document.getElementById('durationRangePopover');
  const heroDurationCol = document.getElementById('heroDurationCol');
  const durationChevron = document.getElementById('durationChevron');
  const popoverToggleBtn = document.getElementById('popoverToggleBtn');
  const popoverRangeTitle = document.getElementById('popoverRangeTitle');
  const durationDisplayVal = document.getElementById('durationDisplayVal');
  const heroDurationInput = document.getElementById('heroDurationInput');
  const heroMinDays = document.getElementById('heroMinDays');
  const heroMaxDays = document.getElementById('heroMaxDays');

  const rangeMinDays = document.getElementById('rangeMinDays');
  const rangeMaxDays = document.getElementById('rangeMaxDays');
  const dualSliderFill = document.getElementById('dualSliderFill');
  const labelMinDays = document.getElementById('labelMinDays');
  const labelMaxDays = document.getElementById('labelMaxDays');

  if (rangeMinDays && rangeMaxDays) {
    const minLimit = parseInt(rangeMinDays.min, 10) || 3;
    const maxLimit = parseInt(rangeMaxDays.max, 10) || 16;

    const updateSlider = () => {
      let minVal = parseInt(rangeMinDays.value, 10);
      let maxVal = parseInt(rangeMaxDays.value, 10);

      // Prevent thumbs from crossing
      if (minVal >= maxVal) {
        if (document.activeElement === rangeMinDays) {
          minVal = maxVal - 1;
          rangeMinDays.value = minVal;
        } else {
          maxVal = minVal + 1;
          rangeMaxDays.value = maxVal;
        }
      }

      // Calculate fill bar percentage between the thumbs
      const leftPercent = ((minVal - minLimit) / (maxLimit - minLimit)) * 100;
      const rightPercent = ((maxVal - minLimit) / (maxLimit - minLimit)) * 100;

      if (dualSliderFill) {
        dualSliderFill.style.left = `${leftPercent}%`;
        dualSliderFill.style.width = `${rightPercent - leftPercent}%`;
      }

      const minText = `${minVal} Day${minVal > 1 ? 's' : ''}`;
      const maxText = `${maxVal} Days`;
      const combinedText = `${minText} - ${maxText}`;

      if (labelMinDays) labelMinDays.textContent = minText;
      if (labelMaxDays) labelMaxDays.textContent = maxText;
      if (popoverRangeTitle) popoverRangeTitle.textContent = combinedText;
      if (durationDisplayVal) durationDisplayVal.textContent = combinedText;
      if (heroDurationInput) heroDurationInput.value = combinedText;
      if (heroMinDays) heroMinDays.value = minVal;
      if (heroMaxDays) heroMaxDays.value = maxVal;
    };

    rangeMinDays.addEventListener('input', updateSlider);
    rangeMaxDays.addEventListener('input', updateSlider);

    // Initial sync
    updateSlider();

    // Toggle popover visibility
    const openPopover = () => {
      if (durationRangePopover) {
        durationRangePopover.classList.add('show');
        if (durationTriggerBtn) durationTriggerBtn.setAttribute('aria-expanded', 'true');
        if (heroDurationCol) heroDurationCol.classList.add('is-active');
        // Close price popover if open
        const pPopover = document.getElementById('priceRangePopover');
        const pTrigger = document.getElementById('priceTriggerBtn');
        const pCol = document.getElementById('heroPriceCol');
        if (pPopover) pPopover.classList.remove('show');
        if (pTrigger) pTrigger.setAttribute('aria-expanded', 'false');
        if (pCol) pCol.classList.remove('is-active');
      }
    };

    const closePopover = () => {
      if (durationRangePopover) {
        durationRangePopover.classList.remove('show');
        if (durationTriggerBtn) durationTriggerBtn.setAttribute('aria-expanded', 'false');
        if (heroDurationCol) heroDurationCol.classList.remove('is-active');
      }
    };

    const togglePopover = (e) => {
      if (e) e.stopPropagation();
      const isOpen = durationRangePopover && durationRangePopover.classList.contains('show');
      if (isOpen) {
        closePopover();
      } else {
        openPopover();
      }
    };

    if (durationTriggerBtn) {
      durationTriggerBtn.addEventListener('click', togglePopover);
      durationTriggerBtn.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          togglePopover(e);
        }
      });
    }

    if (heroDurationCol) {
      heroDurationCol.addEventListener('click', (e) => {
        if (durationRangePopover && !durationRangePopover.contains(e.target) && e.target !== durationTriggerBtn) {
          togglePopover(e);
        }
      });
    }

    if (popoverToggleBtn) {
      popoverToggleBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        closePopover();
      });
    }

    // Close on click outside
    document.addEventListener('click', (e) => {
      if (durationRangePopover && durationRangePopover.classList.contains('show')) {
        if (heroDurationCol && !heroDurationCol.contains(e.target)) {
          closePopover();
        }
      }
    });

    // Close on Escape key
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && durationRangePopover && durationRangePopover.classList.contains('show')) {
        closePopover();
      }
    });
  }

  // --- Price Range Dual Slider Controller (Exact Match to User Reference) ---
  const priceCol = document.getElementById('heroPriceCol');
  const priceTrigger = document.getElementById('priceTriggerBtn');
  const pricePopover = document.getElementById('priceRangePopover');
  const priceToggleBtn = document.getElementById('pricePopoverToggleBtn');
  const priceResetBtn = document.getElementById('priceResetBtn');
  const priceApplyBtn = document.getElementById('priceApplyBtn');
  const rangeMinPrice = document.getElementById('rangeMinPrice');
  const rangeMaxPrice = document.getElementById('rangeMaxPrice');
  const priceSliderFill = document.getElementById('priceSliderFill');
  const labelMinPrice = document.getElementById('labelMinPrice');
  const labelMaxPrice = document.getElementById('labelMaxPrice');
  const priceDisplayVal = document.getElementById('priceDisplayVal');
  const pricePopoverTitle = document.getElementById('pricePopoverTitle');
  const heroPriceInput = document.getElementById('heroPriceInput');
  const heroMinPrice = document.getElementById('heroMinPrice');
  const heroMaxPrice = document.getElementById('heroMaxPrice');
  const pricePresetChips = document.querySelectorAll('.price-preset-chip');

  if (rangeMinPrice && rangeMaxPrice && priceSliderFill) {
    const MIN_PRICE_LIMIT = 0;
    const MAX_PRICE_LIMIT = 305441;
    const MIN_PRICE_GAP = 5000;

    function formatPrice(val) {
      return '₹' + val;
    }

    function updatePriceFill(e) {
      let minVal = parseInt(rangeMinPrice.value, 10);
      let maxVal = parseInt(rangeMaxPrice.value, 10);

      if (maxVal - minVal < MIN_PRICE_GAP) {
        if (e && e.target === rangeMinPrice) {
          rangeMinPrice.value = maxVal - MIN_PRICE_GAP;
          minVal = maxVal - MIN_PRICE_GAP;
        } else if (e && e.target === rangeMaxPrice) {
          rangeMaxPrice.value = minVal + MIN_PRICE_GAP;
          maxVal = minVal + MIN_PRICE_GAP;
        }
      }

      const percent1 = ((minVal - MIN_PRICE_LIMIT) / (MAX_PRICE_LIMIT - MIN_PRICE_LIMIT)) * 100;
      const percent2 = ((maxVal - MIN_PRICE_LIMIT) / (MAX_PRICE_LIMIT - MIN_PRICE_LIMIT)) * 100;

      priceSliderFill.style.left = `${percent1}%`;
      priceSliderFill.style.right = `${100 - percent2}%`;

      const displayText = `${formatPrice(minVal)} - ${formatPrice(maxVal)}`;

      if (labelMinPrice) labelMinPrice.textContent = formatPrice(minVal);
      if (labelMaxPrice) labelMaxPrice.textContent = formatPrice(maxVal);
      if (priceDisplayVal) priceDisplayVal.textContent = displayText;
      if (pricePopoverTitle) pricePopoverTitle.textContent = displayText;
      if (heroPriceInput) heroPriceInput.value = displayText;
      if (heroMinPrice) heroMinPrice.value = minVal;
      if (heroMaxPrice) heroMaxPrice.value = maxVal;

      pricePresetChips.forEach(chip => {
        const chipMin = parseInt(chip.getAttribute('data-min'), 10);
        const chipMax = parseInt(chip.getAttribute('data-max'), 10);
        chip.classList.toggle('active', chipMin === minVal && chipMax === maxVal);
      });
    }

    rangeMinPrice.addEventListener('input', updatePriceFill);
    rangeMaxPrice.addEventListener('input', updatePriceFill);

    pricePresetChips.forEach(chip => {
      chip.addEventListener('click', (e) => {
        e.stopPropagation();
        const cMin = parseInt(chip.getAttribute('data-min'), 10);
        const cMax = parseInt(chip.getAttribute('data-max'), 10);
        rangeMinPrice.value = cMin;
        rangeMaxPrice.value = cMax;
        updatePriceFill();
      });
    });

    const openPricePopover = () => {
      if (pricePopover) {
        pricePopover.classList.add('show');
        if (priceTrigger) priceTrigger.setAttribute('aria-expanded', 'true');
        if (priceCol) priceCol.classList.add('is-active');
        // Close duration popover if open
        const dPopover = document.getElementById('durationRangePopover');
        const dTrigger = document.getElementById('durationTriggerBtn');
        const dCol = document.getElementById('heroDurationCol');
        if (dPopover) dPopover.classList.remove('show');
        if (dTrigger) dTrigger.setAttribute('aria-expanded', 'false');
        if (dCol) dCol.classList.remove('is-active');
      }
    };

    const closePricePopover = () => {
      if (pricePopover) {
        pricePopover.classList.remove('show');
        if (priceTrigger) priceTrigger.setAttribute('aria-expanded', 'false');
        if (priceCol) priceCol.classList.remove('is-active');
      }
    };

    const togglePricePopover = (e) => {
      if (e) e.stopPropagation();
      const isOpen = pricePopover && pricePopover.classList.contains('show');
      if (isOpen) {
        closePricePopover();
      } else {
        openPricePopover();
      }
    };

    if (priceTrigger) {
      priceTrigger.addEventListener('click', togglePricePopover);
      priceTrigger.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          togglePricePopover(e);
        }
      });
    }

    if (priceCol) {
      priceCol.addEventListener('click', (e) => {
        if (pricePopover && !pricePopover.contains(e.target) && e.target !== priceTrigger) {
          togglePricePopover(e);
        }
      });
    }

    if (priceToggleBtn) {
      priceToggleBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        closePricePopover();
      });
    }

    if (priceApplyBtn) {
      priceApplyBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        closePricePopover();
      });
    }

    if (priceResetBtn) {
      priceResetBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        rangeMinPrice.value = 0;
        rangeMaxPrice.value = 305441;
        updatePriceFill();
      });
    }

    document.addEventListener('click', (e) => {
      if (pricePopover && pricePopover.classList.contains('show')) {
        if (priceCol && !priceCol.contains(e.target)) {
          closePricePopover();
        }
      }
    });

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && pricePopover && pricePopover.classList.contains('show')) {
        closePricePopover();
      }
    });

    // Initial setup
    updatePriceFill();
  }

  // Booking Modal Departure Input Date Setup
  const bookingDepartureInput = document.getElementById('bookingDeparture');
  if (bookingDepartureInput) {
    const today = new Date();
    const yyyy = today.getFullYear();
    const mm = String(today.getMonth() + 1).padStart(2, '0');
    const dd = String(today.getDate()).padStart(2, '0');
    bookingDepartureInput.min = `${yyyy}-${mm}-${dd}`;
  }

  // --- Mobile Menu Toggle ---
  const mobileToggle = document.getElementById('mobileToggle');
  const navMenuWrap = document.getElementById('navMenuWrap');
  const navMenuCloseBtn = document.getElementById('navMenuCloseBtn');

  if (mobileToggle && navMenuWrap) {
    const closeDrawer = () => {
      navMenuWrap.classList.remove('open');
      mobileToggle.classList.remove('is-active');
    };

    mobileToggle.addEventListener('click', (e) => {
      e.stopPropagation();
      const isOpen = navMenuWrap.classList.toggle('open');
      mobileToggle.classList.toggle('is-active', isOpen);
    });

    if (navMenuCloseBtn) {
      navMenuCloseBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        closeDrawer();
      });
    }

    // Close mobile menu when clicking on a link
    document.querySelectorAll('.nav-link').forEach(link => {
      link.addEventListener('click', () => {
        closeDrawer();
      });
    });

    // Close mobile menu when clicking outside
    document.addEventListener('click', (e) => {
      if (navMenuWrap.classList.contains('open') &&
        !navMenuWrap.contains(e.target) &&
        !mobileToggle.contains(e.target)) {
        closeDrawer();
      }
    });
  }

  // --- Modal Management Helper ---
  function openModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
      modal.classList.add('active');
      document.body.style.overflow = 'hidden';
    }
  }

  function closeModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
      modal.classList.remove('active');
      document.body.style.overflow = '';
    }
  }

  // --- Traveler Account / Profile Dropdown Card Handler ---
  const headerUserBtn = document.getElementById('headerUserBtn');
  const profileDropdownCard = document.getElementById('profileDropdownCard');
  const headerProfileDropdownWrap = document.getElementById('headerProfileDropdownWrap');

  if (headerUserBtn && profileDropdownCard) {
    // User click is cleanly dispatched by onclick="toggleProfileDropdown(event)"
    // As a robust fallback, assign onclick without adding duplicate addEventListener
    if (!headerUserBtn.onclick) {
      headerUserBtn.onclick = (e) => {
        if (typeof window.toggleProfileDropdown === 'function') {
          window.toggleProfileDropdown(e);
        }
      };
    }

    // Close dropdown when clicking anywhere outside
    document.addEventListener('click', (e) => {
      if (profileDropdownCard.classList.contains('show')) {
        if (!profileDropdownCard.contains(e.target) && !headerUserBtn.contains(e.target)) {
          profileDropdownCard.classList.remove('show');
          headerUserBtn.setAttribute('aria-expanded', 'false');
        }
      }
    });

    // Close on Escape key
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && profileDropdownCard.classList.contains('show')) {
        profileDropdownCard.classList.remove('show');
        headerUserBtn.setAttribute('aria-expanded', 'false');
      }
    });

    // Prevent clicking inside form or inputs from closing dropdown
    profileDropdownCard.addEventListener('click', (e) => {
      e.stopPropagation();
    });

    // Quick Sign-In Form submission
    const quickSignInForm = document.getElementById('quickSignInForm');
    if (quickSignInForm) {
      quickSignInForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const emailInput = document.getElementById('quickUserEmail');
        const userVal = emailInput ? emailInput.value : 'Traveler';
        profileDropdownCard.classList.remove('show');
        headerUserBtn.setAttribute('aria-expanded', 'false');
        quickSignInForm.reset();
        showToast(`Welcome back, ${userVal}! Successfully signed in.`);
      });
    }

    // Quick Book Tour link inside dropdown
    const quickBookingLinks = profileDropdownCard.querySelectorAll('.trigger-booking-modal');
    quickBookingLinks.forEach(link => {
      link.addEventListener('click', (e) => {
        e.preventDefault();
        profileDropdownCard.classList.remove('show');
        headerUserBtn.setAttribute('aria-expanded', 'false');
        openModal('bookingModal');
      });
    });

    // Quick Help Desk link inside dropdown
    const quickSupportLink = document.getElementById('quickSupportLink');
    if (quickSupportLink) {
      quickSupportLink.addEventListener('click', () => {
        profileDropdownCard.classList.remove('show');
        headerUserBtn.setAttribute('aria-expanded', 'false');
      });
    }
  }

  // Close modals on close-btn click or clicking backdrop
  document.querySelectorAll('.modal-backdrop').forEach(backdrop => {
    backdrop.addEventListener('click', (e) => {
      if (e.target === backdrop) {
        backdrop.classList.remove('active');
        document.body.style.overflow = '';
      }
    });

    const closeBtn = backdrop.querySelector('.modal-close-btn');
    if (closeBtn) {
      closeBtn.addEventListener('click', () => {
        backdrop.classList.remove('active');
        document.body.style.overflow = '';
      });
    }
  });

  // ESC key closes all active modals
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      document.querySelectorAll('.modal-backdrop.active').forEach(modal => {
        modal.classList.remove('active');
      });
      document.body.style.overflow = '';
    }
  });

  // --- Toast Notification Helper ---
  function showToast(message) {
    let toast = document.getElementById('toastMsg');
    if (!toast) {
      toast = document.createElement('div');
      toast.id = 'toastMsg';
      toast.className = 'toast-msg';
      document.body.appendChild(toast);
    }
    toast.textContent = message;
    toast.classList.add('show');
    setTimeout(() => {
      toast.classList.remove('show');
    }, 4000);
  }

  // --- Booking Modal Triggering ---
  const bookingModalTriggers = document.querySelectorAll(
    '#headerContactBtn, a[href="#bookingModal"], .trigger-booking-modal, .top-quick-link[data-action="booking"]'
  );
  bookingModalTriggers.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const packageName = btn.getAttribute('data-package') || 'Custom Luxury Tour';
      const packageInput = document.getElementById('bookingTourInput');
      if (packageInput) {
        packageInput.value = packageName;
      }
      openModal('bookingModal');
    });
  });

  // Global click event delegation for #headerContactBtn, #menubarBookNowBtn, or any a[href="#bookingModal"]
  document.addEventListener('click', (e) => {
    const trigger = e.target.closest('#headerContactBtn, #menubarBookNowBtn, a[href="#bookingModal"], .trigger-booking-modal');
    if (trigger) {
      e.preventDefault();

      // Close mobile menubar drawer if open
      const navMenuWrap = document.getElementById('navMenuWrap');
      const mobileToggle = document.getElementById('mobileToggle');
      if (navMenuWrap && navMenuWrap.classList.contains('open')) {
        navMenuWrap.classList.remove('open');
        if (mobileToggle) mobileToggle.classList.remove('is-active');
      }

      // Close profile dropdown if open
      const profileCard = document.getElementById('profileDropdownCard');
      if (profileCard && profileCard.classList.contains('show')) {
        profileCard.classList.remove('show');
      }

      const packageName = trigger.getAttribute('data-package') || 'Custom Luxury Tour';
      const packageInput = document.getElementById('bookingTourInput');
      if (packageInput) {
        packageInput.value = packageName;
      }
      openModal('bookingModal');
    }
  });

  // Booking Form Submission
  const bookingForm = document.getElementById('bookingForm');
  if (bookingForm) {
    bookingForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const name = document.getElementById('bookingName').value;
      const tour = document.getElementById('bookingTourInput').value;
      closeModal('bookingModal');
      bookingForm.reset();
      showToast(`Thank you, ${name}! Your inquiry for "${tour}" has been sent to our travel team.`);
    });
  }

  // --- Plan Your Next Journey Form Submission ---
  const journeyInquiryForm = document.getElementById('journeyInquiryForm');
  if (journeyInquiryForm) {
    journeyInquiryForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const name = document.getElementById('journeyName').value || 'Traveler';
      const destination = document.getElementById('journeyDestination').value || 'your destination';
      journeyInquiryForm.reset();
      showToast(`Thank you, ${name}! Your trip inquiry for "${destination}" has been received. Our luxury travel advisor will contact you shortly.`);
    });
  }

  // --- Search Overlay Modal ---
  const searchBtn = document.getElementById('searchBtn');
  const searchInput = document.getElementById('searchQueryInput');
  const searchResults = document.getElementById('searchResults');

  const tourData = [
    { title: 'Golden Triangle Heritage', location: 'Delhi - Agra - Jaipur', price: '₹18,500' },
    { title: 'Kerala Serene Backwaters & Hills', location: 'Munnar - Alleppey - Cochin', price: '₹22,999' },
    { title: 'Royal Rajasthan Palace Tour', location: 'Udaipur - Jodhpur - Jaisalmer', price: '₹28,500' },
    { title: 'Kashmir Valley & Dal Lake Heaven', location: 'Srinagar - Gulmarg - Pahalgam', price: '₹26,000' },
    { title: 'Hyderabad City & Ramoji Film Tour', location: 'Charminar - Golconda - Ramoji', price: '₹9,999' },
    { title: 'Varanasi Spiritual Ganges Experience', location: 'Kashi - Sarnath - Prayagraj', price: '₹14,200' },
    { title: 'International Visa & Passport Guidelines', location: 'International Travel Desk', price: 'Info' },
    { title: 'Forex & International Currency Guidance', location: 'Travel Desk Support', price: 'Info' }
  ];

  if (searchBtn) {
    searchBtn.addEventListener('click', () => {
      openModal('searchModal');
      setTimeout(() => {
        if (searchInput) searchInput.focus();
      }, 150);
    });
  }

  if (searchInput && searchResults) {
    searchInput.addEventListener('input', (e) => {
      const q = e.target.value.toLowerCase().trim();
      searchResults.innerHTML = '';
      if (!q) {
        searchResults.innerHTML = '<p style="color:#718096; font-size:0.88rem; padding:8px;">Start typing destination, package name, or guidelines...</p>';
        return;
      }

      const filtered = tourData.filter(item =>
        item.title.toLowerCase().includes(q) || item.location.toLowerCase().includes(q)
      );

      if (filtered.length === 0) {
        searchResults.innerHTML = '<p style="color:#e53e3e; font-size:0.88rem; padding:8px;">No matching destinations found. Please contact our desk.</p>';
      } else {
        filtered.forEach(item => {
          const div = document.createElement('div');
          div.className = 'search-result-item';
          div.innerHTML = `<strong>${item.title}</strong><div style="font-size:0.8rem; color:#6b7280;">${item.location} • <span style="color:#826210; font-weight:bold;">${item.price}</span></div>`;
          div.addEventListener('click', () => {
            closeModal('searchModal');
            const target = document.getElementById('packages');
            if (target) target.scrollIntoView({ behavior: 'smooth' });
          });
          searchResults.appendChild(div);
        });
      }
    });
  }

  // (Profile dropdown menu logic is consolidated above)



  // Quick Hero Search Form handler
  const heroSearchForm = document.getElementById('heroSearchForm');
  if (heroSearchForm) {
    heroSearchForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const dest = document.getElementById('heroDest') ? document.getElementById('heroDest').value : 'Selected Destination';
      const duration = document.getElementById('heroDurationInput') ? document.getElementById('heroDurationInput').value : '3 Days - 16 Days';
      const price = document.getElementById('heroPriceInput') ? document.getElementById('heroPriceInput').value : '₹0 - ₹305441';
      const packageInput = document.getElementById('bookingTourInput');
      if (packageInput) {
        packageInput.value = `${dest} (${duration}, Budget: ${price})`;
      }
      openModal('bookingModal');
    });
  }

  // Contact Form Submission
  const contactForm = document.getElementById('contactForm');
  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const name = document.getElementById('contactName').value;
      contactForm.reset();
      showToast(`Thank you, ${name}! We have received your message and will respond shortly.`);
    });
  }

  // (Sticky header scroll effect is handled at top of script)

  // Active scroll highlight
  const sections = document.querySelectorAll('section[id]');
  window.addEventListener('scroll', () => {
    let scrollY = window.pageYOffset;
    sections.forEach(current => {
      const sectionHeight = current.offsetHeight;
      const sectionTop = current.offsetTop - 120;
      const sectionId = current.getAttribute('id');
      const navItem = document.querySelector(`.nav-links a[href*="${sectionId}"]`);
      if (navItem) {
        if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
          navItem.classList.add('active');
        } else {
          navItem.classList.remove('active');
        }
      }
    });
  });

  // --- Popular Destinations Carousel Navigation & Auto-Scroll ---
  const destTrack = document.getElementById('destCardsTrack');
  const destPrevBtn = document.getElementById('destPrevBtn');
  const destNextBtn = document.getElementById('destNextBtn');

  if (destTrack && destPrevBtn && destNextBtn) {
    const getScrollStep = () => {
      const card = destTrack.querySelector('.dest-card-item');
      return card ? card.offsetWidth + 28 : 280;
    };

    const scrollNext = () => {
      const maxScrollLeft = destTrack.scrollWidth - destTrack.clientWidth;
      if (destTrack.scrollLeft >= maxScrollLeft - 15) {
        destTrack.scrollTo({ left: 0, behavior: 'smooth' });
      } else {
        destTrack.scrollBy({ left: getScrollStep(), behavior: 'smooth' });
      }
    };

    const scrollPrev = () => {
      if (destTrack.scrollLeft <= 15) {
        destTrack.scrollTo({ left: destTrack.scrollWidth, behavior: 'smooth' });
      } else {
        destTrack.scrollBy({ left: -getScrollStep(), behavior: 'smooth' });
      }
    };

    destNextBtn.addEventListener('click', () => {
      scrollNext();
      resetAutoScroll();
    });

    destPrevBtn.addEventListener('click', () => {
      scrollPrev();
      resetAutoScroll();
    });

    // Auto-Scroll Engine
    let autoScrollInterval = null;
    let isPaused = false;

    const startAutoScroll = () => {
      if (!autoScrollInterval && !isPaused) {
        autoScrollInterval = setInterval(() => {
          scrollNext();
        }, 3200);
      }
    };

    const stopAutoScroll = () => {
      if (autoScrollInterval) {
        clearInterval(autoScrollInterval);
        autoScrollInterval = null;
      }
    };

    const resetAutoScroll = () => {
      stopAutoScroll();
      startAutoScroll();
    };

    // Pause on user hover and resume on mouse leave
    destTrack.addEventListener('mouseenter', () => {
      isPaused = true;
      stopAutoScroll();
    });

    destTrack.addEventListener('mouseleave', () => {
      isPaused = false;
      startAutoScroll();
    });

    // Pause on mobile touch
    destTrack.addEventListener('touchstart', () => {
      isPaused = true;
      stopAutoScroll();
    }, { passive: true });

    destTrack.addEventListener('touchend', () => {
      isPaused = false;
      resetAutoScroll();
    }, { passive: true });

    // Auto-scroll only when visible in viewport
    if ('IntersectionObserver' in window) {
      const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            isPaused = false;
            startAutoScroll();
          } else {
            stopAutoScroll();
          }
        });
      }, { threshold: 0.2 });

      observer.observe(destTrack);
    } else {
      startAutoScroll();
    }
  }

  // --- 10. Testimonials Auto-Scroll Engine & Dot Controls ---
  const testiTrack = document.getElementById('testiTrackWrap');
  const testiDots = document.querySelectorAll('.testi-dot');
  const testiCardCols = document.querySelectorAll('.testi-card-col');

  if (testiTrack && testiCardCols.length > 0) {
    let testiAutoScrollInterval = null;
    let isTestiPaused = false;

    const getTestiStep = () => {
      const firstCard = testiTrack.querySelector('.testi-card-col');
      return firstCard ? firstCard.offsetWidth + 24 : 340;
    };

    const updateTestiActiveDot = () => {
      if (testiDots.length === 0) return;
      const step = getTestiStep();
      const currentScroll = testiTrack.scrollLeft;
      const activeIdx = Math.round(currentScroll / step) % testiDots.length;
      testiDots.forEach((dot, i) => {
        dot.classList.toggle('active', i === activeIdx);
      });
    };

    const scrollTestiNext = () => {
      const maxScrollLeft = testiTrack.scrollWidth - testiTrack.clientWidth;
      const step = getTestiStep();
      if (testiTrack.scrollLeft >= maxScrollLeft - 20) {
        testiTrack.scrollTo({ left: 0, behavior: 'smooth' });
      } else {
        testiTrack.scrollBy({ left: step, behavior: 'smooth' });
      }
      setTimeout(updateTestiActiveDot, 350);
    };

    const startTestiAutoScroll = () => {
      if (!testiAutoScrollInterval && !isTestiPaused) {
        testiAutoScrollInterval = setInterval(() => {
          scrollTestiNext();
        }, 3200);
      }
    };

    const stopTestiAutoScroll = () => {
      if (testiAutoScrollInterval) {
        clearInterval(testiAutoScrollInterval);
        testiAutoScrollInterval = null;
      }
    };

    const resetTestiAutoScroll = () => {
      stopTestiAutoScroll();
      startTestiAutoScroll();
    };

    // Pause on hover, resume on mouse leave
    testiTrack.addEventListener('mouseenter', () => {
      isTestiPaused = true;
      stopTestiAutoScroll();
    });

    testiTrack.addEventListener('mouseleave', () => {
      isTestiPaused = false;
      startTestiAutoScroll();
    });

    // Pause on mobile touch
    testiTrack.addEventListener('touchstart', () => {
      isTestiPaused = true;
      stopTestiAutoScroll();
    }, { passive: true });

    testiTrack.addEventListener('touchend', () => {
      isTestiPaused = false;
      resetTestiAutoScroll();
    }, { passive: true });

    // Sync dots on user scroll
    testiTrack.addEventListener('scroll', () => {
      updateTestiActiveDot();
    }, { passive: true });

    // Clicking pagination dots scrolls to corresponding position
    testiDots.forEach((dot, idx) => {
      dot.addEventListener('click', () => {
        const step = getTestiStep();
        testiTrack.scrollTo({ left: idx * step, behavior: 'smooth' });
        testiDots.forEach((d, i) => d.classList.toggle('active', i === idx));
        resetTestiAutoScroll();
      });
    });

    // Auto-scroll only when visible in viewport
    if ('IntersectionObserver' in window) {
      const testiObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            isTestiPaused = false;
            startTestiAutoScroll();
          } else {
            stopTestiAutoScroll();
          }
        });
      }, { threshold: 0.15 });

      testiObserver.observe(testiTrack);
    } else {
      startTestiAutoScroll();
    }
  }
});

// Global helper for opening/closing the profile dropdown card
window.toggleProfileDropdown = function (e) {
  if (e) {
    e.preventDefault();
    e.stopPropagation();
  }
  const card = document.getElementById('profileDropdownCard');
  const btn = document.getElementById('headerUserBtn');
  if (card) {
    const isShowing = card.classList.toggle('show');
    if (btn) btn.setAttribute('aria-expanded', isShowing ? 'true' : 'false');
  }
};


