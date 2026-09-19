/**
 * Vinyas Travels - Interactive Script
 */

document.addEventListener('DOMContentLoaded', () => {
  // --- Mobile Menu Toggle ---
  const mobileToggle = document.getElementById('mobileToggle');
  const navMenuWrap = document.getElementById('navMenuWrap');

  if (mobileToggle && navMenuWrap) {
    mobileToggle.addEventListener('click', () => {
      navMenuWrap.classList.toggle('open');
    });

    // Close mobile menu when clicking outside or on a link
    document.querySelectorAll('.nav-link').forEach(link => {
      link.addEventListener('click', () => {
        navMenuWrap.classList.remove('open');
      });
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
  const bookingModalTriggers = document.querySelectorAll('.trigger-booking-modal, .top-quick-link[data-action="booking"]');
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

  // --- Profile / Account Modal ---
  const profileBtn = document.getElementById('profileBtn');
  if (profileBtn) {
    profileBtn.addEventListener('click', () => {
      openModal('profileModal');
    });
  }

  // --- Category Tabs Sync with Tour Type Dropdown ---
  const searchTabs = document.querySelectorAll('.search-tab');
  const tourTypeSelect = document.getElementById('heroTourType');
  if (searchTabs.length && tourTypeSelect) {
    searchTabs.forEach(tab => {
      tab.addEventListener('click', () => {
        searchTabs.forEach(t => t.classList.remove('active'));
        tab.classList.add('active');
        const targetType = tab.getAttribute('data-type');
        if (targetType) {
          tourTypeSelect.value = targetType;
        }
      });
    });

    tourTypeSelect.addEventListener('change', () => {
      searchTabs.forEach(tab => {
        if (tab.getAttribute('data-type') === tourTypeSelect.value) {
          tab.classList.add('active');
        } else {
          tab.classList.remove('active');
        }
      });
    });
  }

  // Quick Hero Search Form handler
  const heroSearchForm = document.getElementById('heroSearchForm');
  if (heroSearchForm) {
    heroSearchForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const dest = document.getElementById('heroDest').value || 'Selected Destination';
      const date = document.getElementById('heroDate').value;
      const type = document.getElementById('heroTourType').value;
      const packageInput = document.getElementById('bookingTourInput');
      if (packageInput) {
        packageInput.value = `${dest} (${type}${date ? ' - ' + date : ''})`;
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

  // --- Sticky Header Transparent-to-White on Scroll ---
  const siteHeader = document.getElementById('siteHeader');
  if (siteHeader) {
    const onScroll = () => {
      const scrollPos = window.scrollY || window.pageYOffset || document.documentElement.scrollTop || 0;
      if (scrollPos > 30) {
        siteHeader.classList.add('scrolled');
      } else {
        siteHeader.classList.remove('scrolled');
      }
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('load', onScroll);
    onScroll();
  }

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


