/**
 * PRASENJIT SINGHA - EXECUTIVE CONSULTING PLATFORM ENGINE
 * Core Interactive Architecture, Form Processors, State Map & Admin Portal
 */

(function () {
  'use strict';

  // In-Memory Enquiry Store (initialized with mock records and populated via forms)
  const ENQUIRY_STORE = [
    {
      id: "REC-7821B0A1",
      type: "Recruiter Enquiry",
      name: "Siddharth Malhotra",
      org: "Tata Philanthropic Trust / Corporate CSR",
      email: "siddharth.m@tatatrusts.org",
      phone: "+91 98200 11223",
      category: "Head of CSR / Director",
      location: "Mumbai / PAN-India",
      timeline: "Q1 2027",
      details: "Seeking Senior CSR Director to lead multi-state healthcare & rural development initiatives (₹40 Cr+ annual budget).",
      status: "UNDER_REVIEW",
      date: "2026-11-10"
    },
    {
      id: "SIA-4A92F13C",
      type: "Impact Assessment",
      name: "Dr. Ananya Roy",
      org: "Global Development Research Council",
      email: "ananya.roy@gdrc-india.org",
      phone: "+91 98310 44556",
      category: "Mandatory CSR Impact Assessment",
      location: "Odisha & Jharkhand",
      timeline: "Immediate (3 Months)",
      details: "Third-party evaluation of 40 rural drinking water RO plants and sanitation facilities under MCA Rule 8(3).",
      status: "IN_DISCUSSION",
      date: "2026-11-08"
    },
    {
      id: "FND-19D4E290",
      type: "Funding Partnership",
      name: "Rameshwar Sen",
      org: "Pragati Rural Development Society (Registered NGO)",
      email: "rameshwar@pragati-ngo.org",
      phone: "+91 94340 77889",
      category: "CSR Proposal & Opportunity Mapping",
      location: "Purulia, West Bengal",
      timeline: "FY 2026-27",
      details: "Seeking guidance to draft corporate CSR proposal for FPO sustainable agriculture and minor irrigation convergence.",
      status: "NEW",
      date: "2026-11-11"
    }
  ];

  // Document Ready Initializer
  document.addEventListener('DOMContentLoaded', () => {
    initScrollNav();
    initMobileMenu();
    initCounterAnimations();
    initPowerBIDashboard();
    initGeographicMap();
    initProjectFilters();
    initArticleFilters();
    initAskPrasenjit();
    initForms();
    initModals();
    initAdminDashboard();
  });

  /* ==========================================================================
     1. NAVIGATION & SCROLL HIGHLIGHTING (10 SECTIONS)
     ========================================================================== */
  function initScrollNav() {
    const header = document.querySelector('.site-header');
    const navLinks = document.querySelectorAll('.nav-link');
    const sections = document.querySelectorAll('section[id]');

    window.addEventListener('scroll', () => {
      // Header shadow on scroll
      if (window.scrollY > 40) {
        header?.classList.add('scrolled');
      } else {
        header?.classList.remove('scrolled');
      }

      // Active link highlight
      let currentSectionId = '';
      const scrollPosition = window.scrollY + 120;

      sections.forEach(section => {
        const top = section.offsetTop;
        const height = section.offsetHeight;
        if (scrollPosition >= top && scrollPosition < top + height) {
          currentSectionId = section.getAttribute('id');
        }
      });

      if (currentSectionId === 'teaching') {
        currentSectionId = 'career';
      }

      navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${currentSectionId}`) {
          link.classList.add('active');
        }
      });
    }, { passive: true });

    // Smooth scroll for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
      anchor.addEventListener('click', function (e) {
        const targetId = this.getAttribute('href');
        if (targetId === '#' || !targetId.startsWith('#')) return;

        const targetEl = document.querySelector(targetId);
        if (targetEl) {
          e.preventDefault();
          const headerHeight = header ? header.offsetHeight : 70;
          const targetPosition = targetEl.getBoundingClientRect().top + window.pageYOffset - headerHeight;

          window.scrollTo({
            top: targetPosition,
            behavior: 'smooth'
          });

          // Close mobile menu if open
          const navWrapper = document.querySelector('.nav-menu-wrapper');
          if (navWrapper && navWrapper.classList.contains('mobile-open')) {
            navWrapper.classList.remove('mobile-open');
            document.body.classList.remove('menu-locked');
          }
        }
      });
    });
  }

  /* ==========================================================================
     2. MOBILE MENU CONTROLLER
     ========================================================================== */
  function initMobileMenu() {
    const toggleBtn = document.getElementById('mobileNavToggle');
    const navWrapper = document.querySelector('.nav-menu-wrapper');

    if (!toggleBtn || !navWrapper) return;

    toggleBtn.addEventListener('click', () => {
      navWrapper.classList.toggle('mobile-open');
      document.body.classList.toggle('menu-locked');
      const icon = toggleBtn.querySelector('i');
      if (icon) {
        if (navWrapper.classList.contains('mobile-open')) {
          icon.className = 'fa-solid fa-xmark';
        } else {
          icon.className = 'fa-solid fa-bars';
        }
      }
    });
  }

  /* ==========================================================================
     3. KPI COUNTER ANIMATIONS
     ========================================================================== */
  function initCounterAnimations() {
    const counters = document.querySelectorAll('.stat-number[data-target]');
    if (!counters.length) return;

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const el = entry.target;
          const targetStr = el.getAttribute('data-target') || el.innerText;
          animateValue(el, targetStr);
          observer.unobserve(el);
        }
      });
    }, { threshold: 0.4 });

    counters.forEach(counter => observer.observe(counter));

    function animateValue(obj, targetStr) {
      // Check for suffixes like +, L+, M+
      let suffix = '';
      if (targetStr.includes('M+')) suffix = 'M+';
      else if (targetStr.includes('L+')) suffix = 'L+';
      else if (targetStr.includes('+')) suffix = '+';

      const numericVal = parseFloat(targetStr.replace(/[^0-9.]/g, ''));
      if (isNaN(numericVal)) return;

      let start = 0;
      const duration = 1400;
      const stepTime = 25;
      const steps = duration / stepTime;
      const increment = numericVal / steps;

      const timer = setInterval(() => {
        start += increment;
        if (start >= numericVal) {
          clearInterval(timer);
          obj.innerText = targetStr;
        } else {
          obj.innerText = (numericVal % 1 === 0 ? Math.floor(start) : start.toFixed(1)) + suffix;
        }
      }, stepTime);
    }
  }

  /* ==========================================================================
     4. INTERACTIVE 11-STATE GEOGRAPHIC COVERAGE MAP
     ========================================================================== */
  function initGeographicMap() {
    const stateButtons = document.querySelectorAll('.state-map-btn');
    const stateCard = document.getElementById('stateDetailsCard');
    if (!stateButtons.length || !stateCard) return;

    const statesData = window.PROFILE_DATA?.geographicCoverage || [];

    function renderStateDetails(stateName) {
      const data = statesData.find(s => s.state.toLowerCase() === stateName.toLowerCase());
      if (!data) return;

      stateCard.innerHTML = `
        <div class="state-detail-header">
          <div class="state-badge-large">${data.code}</div>
          <div class="state-title-wrap">
            <h4 class="state-name-heading">${data.state}</h4>
            <span class="state-reach-tag"><i class="fa-solid fa-users"></i> ${data.beneficiaries} Lives Reached</span>
          </div>
        </div>
        <div class="state-detail-body">
          <div class="state-detail-row">
            <strong><i class="fa-solid fa-map-pin"></i> Key Districts:</strong>
            <p>${data.districts}</p>
          </div>
          <div class="state-detail-row">
            <strong><i class="fa-solid fa-handshake"></i> Corporate / Donors:</strong>
            <p>${data.partnerOrgs}</p>
          </div>
          <div class="state-detail-row">
            <strong><i class="fa-solid fa-bullseye"></i> Core Interventions:</strong>
            <p>${data.keyInterventions}</p>
          </div>
        </div>
        <div class="state-detail-footer">
          <button class="btn btn-outline btn-sm state-inquire-btn" data-state="${data.state}">
            <i class="fa-solid fa-envelope"></i> Inquire for ${data.state} Projects
          </button>
        </div>
      `;

      // Attach inquiry listener
      const inquireBtn = stateCard.querySelector('.state-inquire-btn');
      if (inquireBtn) {
        inquireBtn.addEventListener('click', () => {
          const targetInput = document.querySelector('#contactForm [name="location"]') || document.querySelector('#contactForm [name="message"]');
          if (targetInput) {
            targetInput.value = `Intervention inquiry for ${data.state}: `;
          }
          const contactSec = document.getElementById('contact');
          contactSec?.scrollIntoView({ behavior: 'smooth' });
        });
      }
    }

    stateButtons.forEach(btn => {
      btn.addEventListener('click', () => {
        stateButtons.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        const stateName = btn.getAttribute('data-state');
        if (stateName) renderStateDetails(stateName);
      });
    });

    // Initial render for West Bengal
    renderStateDetails("West Bengal");
  }

  /* ==========================================================================
     5. PROJECT PORTFOLIO FILTERS & MODAL POPUPS
     ========================================================================== */
  function initProjectFilters() {
    const filterTabs = document.querySelectorAll('.portfolio-filter-tab');
    const projectCards = document.querySelectorAll('.project-item-card');

    filterTabs.forEach(tab => {
      tab.addEventListener('click', () => {
        filterTabs.forEach(t => t.classList.remove('active'));
        tab.classList.add('active');

        const selectedFilter = tab.getAttribute('data-filter');

        projectCards.forEach(card => {
          const cardCategory = card.getAttribute('data-category');
          if (selectedFilter === 'all' || cardCategory === selectedFilter) {
            card.style.display = 'flex';
          } else {
            card.style.display = 'none';
          }
        });
      });
    });

    // Case Study Detail Modal Triggers
    document.querySelectorAll('.view-project-modal-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        const projectId = btn.getAttribute('data-project-id');
        openProjectModal(projectId);
      });
    });
  }

  function openProjectModal(projectId) {
    const projects = window.PROFILE_DATA?.projects || [];
    const project = projects.find(p => p.id === projectId);
    if (!project) return;

    const modalBody = document.getElementById('projectModalBody');
    if (!modalBody) return;

    modalBody.innerHTML = `
      <div class="project-modal-header">
        <span class="project-badge">${project.sector}</span>
        <h3 class="modal-project-title">${project.title}</h3>
        <p class="modal-project-meta">
          <span><i class="fa-solid fa-location-dot"></i> ${project.location}</span>
          <span><i class="fa-solid fa-building-columns"></i> ${project.partners}</span>
        </p>
      </div>

      <div class="project-modal-content">
        <div class="modal-section-block">
          <h4><i class="fa-solid fa-bullseye"></i> Project Objectives</h4>
          <p>${project.objective}</p>
        </div>

        <div class="modal-section-block">
          <h4><i class="fa-solid fa-user-gear"></i> Leadership Responsibilities</h4>
          <p>${project.responsibilities}</p>
        </div>

        <div class="modal-section-block">
          <h4><i class="fa-solid fa-diagram-project"></i> Implementation Strategy</h4>
          <p>${project.strategy}</p>
        </div>

        <div class="modal-section-block">
          <h4><i class="fa-solid fa-people-arrows"></i> Key Stakeholders & Convergence</h4>
          <p>${project.stakeholders}</p>
        </div>

        <div class="modal-section-block highlight-block">
          <h4><i class="fa-solid fa-trophy"></i> Verified Outcomes & Impact</h4>
          <p>${project.outcomes}</p>
        </div>
      </div>

      <div class="modal-footer-actions">
        <button class="btn btn-primary" onclick="window.location.href='#contact'">
          <i class="fa-solid fa-handshake"></i> Discuss Similar Programme
        </button>
      </div>
    `;

    openModal('projectModal');
  }

  /* ==========================================================================
     6. KNOWLEDGE CENTRE & ARTICLE READER
     ========================================================================== */
  function initArticleFilters() {
    const filterPills = document.querySelectorAll('.article-cat-pill');
    const articleCards = document.querySelectorAll('.article-card');

    filterPills.forEach(pill => {
      pill.addEventListener('click', () => {
        filterPills.forEach(p => p.classList.remove('active'));
        pill.classList.add('active');

        const filter = pill.getAttribute('data-cat');
        articleCards.forEach(card => {
          const cat = card.getAttribute('data-cat');
          if (filter === 'all' || cat === filter) {
            card.style.display = 'flex';
          } else {
            card.style.display = 'none';
          }
        });
      });
    });

    // Read Full Article Triggers
    document.querySelectorAll('.read-article-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        const articleId = btn.getAttribute('data-article-id');
        openArticleModal(articleId);
      });
    });
  }

  function openArticleModal(articleId) {
    const articles = window.PROFILE_DATA?.knowledgeCentre?.articles || [];
    const article = articles.find(a => a.id === articleId);
    if (!article) return;

    const modalBody = document.getElementById('articleModalBody');
    if (!modalBody) return;

    modalBody.innerHTML = `
      <div class="article-modal-header">
        <span class="category-pill">${article.category}</span>
        <h2 class="modal-article-title">${article.title}</h2>
        <div class="modal-article-meta">
          <span><i class="fa-solid fa-calendar"></i> ${article.date}</span>
          <span><i class="fa-solid fa-clock"></i> ${article.readTime}</span>
          <span><i class="fa-solid fa-user-pen"></i> By Prasenjit Singha</span>
        </div>
      </div>

      <div class="article-modal-text">
        ${formatMarkdownToHtml(article.fullContent)}
      </div>

      <div class="article-modal-footer">
        <p class="article-citation">Citation: Singha, P. (2026). "${article.title}". Development Knowledge & Social Impact Insights.</p>
        <button class="btn btn-outline btn-sm" onclick="window.print()">
          <i class="fa-solid fa-print"></i> Print Insight
        </button>
      </div>
    `;

    openModal('articleModal');
  }

  /* ==========================================================================
     7. "ASK PRASENJIT" COMMUNITY QUERY SUBMISSION
     ========================================================================== */
  function initAskPrasenjit() {
    const askForm = document.getElementById('askPrasenjitForm');
    if (!askForm) return;

    askForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const name = askForm.querySelector('[name="name"]')?.value.trim();
      const email = askForm.querySelector('[name="email"]')?.value.trim();
      const role = askForm.querySelector('[name="role"]')?.value.trim();
      const category = askForm.querySelector('[name="category"]')?.value;
      const question = askForm.querySelector('[name="question"]')?.value.trim();

      if (!name || !email || !question) {
        showToast('Please fill in all required question fields.', 'warning');
        return;
      }

      // Add to memory store
      const queryId = 'ASK-' + Math.random().toString(36).substring(2, 10).toUpperCase();
      ENQUIRY_STORE.unshift({
        id: queryId,
        type: "Ask Prasenjit Query",
        name: name,
        org: role || "Community Member",
        email: email,
        phone: "N/A",
        category: category || "Technical Query",
        location: "Web Portal",
        timeline: "Advisory",
        details: question,
        status: "NEW",
        date: new Date().toISOString().split('T')[0]
      });

      showToast(`Thank you, ${name}! Your question has been submitted to Prasenjit Singha.`, 'success');
      askForm.reset();
    });
  }

  /* ==========================================================================
     8. FORMS HANDLER (RECRUITER, FUNDING, SIA, CONSULTANCY & CONTACT)
     ========================================================================== */
  function initForms() {
    // 1. Recruiter Connect Form
    const recruiterForm = document.getElementById('recruiterForm');
    if (recruiterForm) {
      recruiterForm.addEventListener('submit', (e) => {
        e.preventDefault();
        handleFormSubmit(recruiterForm, 'Recruiter Enquiry', 'REC');
      });
    }

    // 2. Funding Partnership Form
    const fundingForm = document.getElementById('fundingForm');
    if (fundingForm) {
      fundingForm.addEventListener('submit', (e) => {
        e.preventDefault();
        handleFormSubmit(fundingForm, 'Funding Partnership', 'FND');
      });
    }

    // 3. SIA Impact Assessment Form
    const siaForm = document.getElementById('siaForm');
    if (siaForm) {
      siaForm.addEventListener('submit', (e) => {
        e.preventDefault();
        handleFormSubmit(siaForm, 'Impact Assessment Request', 'SIA');
      });
    }

    // 4. General / Multi-stream Contact Form
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
      contactForm.addEventListener('submit', (e) => {
        e.preventDefault();
        handleFormSubmit(contactForm, 'General Enquiry', 'ENQ');
      });
    }

    // 5. Technical Consultancy Modal Form
    const technicalForm = document.getElementById('technicalConsultancyForm');
    if (technicalForm) {
      technicalForm.addEventListener('submit', (e) => {
        e.preventDefault();
        handleFormSubmit(technicalForm, 'Technical Writing / DPR', 'DOC');
        closeModal('technicalConsultancyModal');
      });
    }

    function handleFormSubmit(formEl, enquiryType, prefix) {
      // Honeypot spam check
      const honeypot = formEl.querySelector('[name="_gotcha"]');
      if (honeypot && honeypot.value) {
        console.warn('Bot detected via honeypot.');
        return;
      }

      const formData = new FormData(formEl);
      const name = formData.get('name') || formData.get('recruiter_name') || formData.get('contact_person') || 'Anonymous Contact';
      const email = formData.get('email') || 'N/A';
      const org = formData.get('organisation') || formData.get('company') || 'Direct Professional';
      const phone = formData.get('phone') || 'N/A';
      const category = formData.get('category') || formData.get('target_role') || formData.get('study_type') || enquiryType;
      const message = formData.get('message') || formData.get('details') || formData.get('concept') || 'No additional details provided.';
      const location = formData.get('location') || formData.get('geography') || 'India';

      const refCode = `${prefix}-${Math.random().toString(36).substring(2, 10).toUpperCase()}`;

      // Insert record
      ENQUIRY_STORE.unshift({
        id: refCode,
        type: enquiryType,
        name: String(name),
        org: String(org),
        email: String(email),
        phone: String(phone),
        category: String(category),
        location: String(location),
        timeline: 'As per brief',
        details: String(message),
        status: 'NEW',
        date: new Date().toISOString().split('T')[0]
      });

      showToast(`Success! Your inquiry has been logged [Ref: ${refCode}]. Prasenjit Singha will respond shortly.`, 'success');
      formEl.reset();
    }
  }

  /* ==========================================================================
     9. MODAL CONTROLLER
     ========================================================================== */
  function initModals() {
    // Close modal on click backdrop or close button
    document.querySelectorAll('.modal-overlay').forEach(modal => {
      modal.addEventListener('click', (e) => {
        if (e.target === modal || e.target.closest('.modal-close-btn')) {
          closeModal(modal.id);
        }
      });
    });

    // Close on Escape key
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        document.querySelectorAll('.modal-overlay.active').forEach(m => closeModal(m.id));
      }
    });

    // Technical Consultancy Trigger Buttons
    document.querySelectorAll('.technical-consultancy-trigger').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        const serviceName = btn.getAttribute('data-service') || 'Project Design & Technical Writing';
        const modal = document.getElementById('technicalConsultancyModal');
        if (modal) {
          const serviceInput = modal.querySelector('[name="service_required"]');
          if (serviceInput) serviceInput.value = serviceName;
          openModal('technicalConsultancyModal');
        }
      });
    });
  }

  function openModal(modalId) {
    const modal = document.getElementById(modalId);
    if (!modal) return;
    modal.classList.add('active');
    document.body.classList.add('modal-locked');
  }

  function closeModal(modalId) {
    const modal = document.getElementById(modalId);
    if (!modal) return;
    modal.classList.remove('active');
    document.body.classList.remove('modal-locked');
  }

  /* ==========================================================================
     10. SECURE ADMIN DASHBOARD (PROMPT 11)
     ========================================================================== */
  function initAdminDashboard() {
    const adminTrigger = document.getElementById('adminPortalTrigger');
    const adminModal = document.getElementById('adminModal');
    if (!adminModal) return;

    // Trigger Admin
    if (adminTrigger) {
      adminTrigger.addEventListener('click', (e) => {
        e.preventDefault();
        openModal('adminModal');
      });
    }

    // Shortcut: Ctrl + Alt + A
    document.addEventListener('keydown', (e) => {
      if (e.ctrlKey && e.altKey && (e.key === 'a' || e.key === 'A')) {
        e.preventDefault();
        openModal('adminModal');
      }
    });

    const loginSection = document.getElementById('adminLoginSection');
    const panelSection = document.getElementById('adminPanelSection');
    const loginForm = document.getElementById('adminLoginForm');
    const passInput = document.getElementById('adminPasswordInput');

    loginForm?.addEventListener('submit', (e) => {
      e.preventDefault();
      const entered = passInput?.value.trim();
      // Verified passkey for executive access
      if (entered === 'psadmin2026' || entered === 'singha2026') {
        loginSection.style.display = 'none';
        panelSection.style.display = 'block';
        renderAdminPipeline();
        showToast('Admin Authentication Verified. Welcome, Prasenjit Singha.', 'success');
      } else {
        showToast('Invalid access credentials.', 'error');
      }
    });

    // Admin Filter Buttons
    document.querySelectorAll('.admin-filter-pill').forEach(pill => {
      pill.addEventListener('click', () => {
        document.querySelectorAll('.admin-filter-pill').forEach(p => p.classList.remove('active'));
        pill.classList.add('active');
        const filter = pill.getAttribute('data-admin-filter');
        renderAdminPipeline(filter);
      });
    });

    // SQL Schema Download Button
    document.getElementById('downloadSchemaSqlBtn')?.addEventListener('click', () => {
      const link = document.createElement('a');
      link.href = 'schema.sql';
      link.download = 'schema.sql';
      link.click();
      showToast('Downloading complete PostgreSQL / Supabase schema.sql', 'info');
    });
  }

  function renderAdminPipeline(filter = 'ALL') {
    const tbody = document.getElementById('adminEnquiryTableBody');
    if (!tbody) return;

    let records = ENQUIRY_STORE;
    if (filter !== 'ALL') {
      records = records.filter(r => r.type.toUpperCase().includes(filter) || r.status === filter);
    }

    if (records.length === 0) {
      tbody.innerHTML = `<tr><td colspan="7" class="text-center py-4">No records found for this category.</td></tr>`;
      return;
    }

    tbody.innerHTML = records.map((r, idx) => `
      <tr>
        <td><code>${r.id}</code></td>
        <td><strong>${r.name}</strong><br><small class="text-muted">${r.org}</small></td>
        <td><span class="admin-type-badge">${r.type}</span></td>
        <td><small>${r.email}<br>${r.phone}</small></td>
        <td><small>${r.details.substring(0, 75)}...</small></td>
        <td>
          <select class="admin-status-select" data-id="${r.id}">
            <option value="NEW" ${r.status === 'NEW' ? 'selected' : ''}>NEW</option>
            <option value="UNDER_REVIEW" ${r.status === 'UNDER_REVIEW' ? 'selected' : ''}>UNDER REVIEW</option>
            <option value="IN_DISCUSSION" ${r.status === 'IN_DISCUSSION' ? 'selected' : ''}>IN DISCUSSION</option>
            <option value="ENGAGED" ${r.status === 'ENGAGED' ? 'selected' : ''}>ENGAGED</option>
            <option value="CLOSED" ${r.status === 'CLOSED' ? 'selected' : ''}>CLOSED</option>
          </select>
        </td>
        <td><small>${r.date}</small></td>
      </tr>
    `).join('');

    // Attach change listener to selects
    tbody.querySelectorAll('.admin-status-select').forEach(sel => {
      sel.addEventListener('change', (e) => {
        const id = sel.getAttribute('data-id');
        const newStatus = sel.value;
        const target = ENQUIRY_STORE.find(x => x.id === id);
        if (target) {
          target.status = newStatus;
          showToast(`Status for ${id} updated to ${newStatus}`, 'info');
        }
      });
    });
  }

  /* ==========================================================================
     11. UTILITIES: TOAST NOTIFICATIONS & MARKDOWN PARSER
     ========================================================================== */
  function showToast(message, type = 'info') {
    let container = document.getElementById('toastContainer');
    if (!container) {
      container = document.createElement('div');
      container.id = 'toastContainer';
      container.className = 'toast-container';
      document.body.appendChild(container);
    }

    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;

    let icon = 'fa-circle-info';
    if (type === 'success') icon = 'fa-circle-check';
    if (type === 'warning') icon = 'fa-triangle-exclamation';
    if (type === 'error') icon = 'fa-circle-xmark';

    toast.innerHTML = `
      <i class="fa-solid ${icon}"></i>
      <div class="toast-message">${message}</div>
      <button class="toast-close-btn">&times;</button>
    `;

    container.appendChild(toast);

    toast.querySelector('.toast-close-btn').addEventListener('click', () => {
      toast.remove();
    });

    setTimeout(() => {
      toast.classList.add('fade-out');
      setTimeout(() => toast.remove(), 400);
    }, 4500);
  }

  function formatMarkdownToHtml(mdText) {
    if (!mdText) return '';
    return mdText
      .replace(/^### (.*$)/gim, '<h4>$1</h4>')
      .replace(/^## (.*$)/gim, '<h3>$1</h3>')
      .replace(/^# (.*$)/gim, '<h2>$1</h2>')
      .replace(/\*\*(.*)\*\*/gim, '<strong>$1</strong>')
      .replace(/\*(.*)\*/gim, '<em>$1</em>')
      .replace(/^\- (.*$)/gim, '<li>$1</li>')
      .replace(/\n\n/gim, '<p></p>')
      .replace(/<li>/gim, '<ul><li>')
      .replace(/<\/li>\n(?!<li>)/gim, '</li></ul>');
  }

  /* ==========================================================================
     POWER BI EXECUTIVE ANALYTICS DASHBOARD CONTROLLER
     ========================================================================== */
  function initPowerBIDashboard() {
    const frame = document.getElementById('powerbiDashboardFrame');
    if (!frame) return;

    const slicerChips = document.querySelectorAll('.pb-chip');
    const viewTabs = document.querySelectorAll('.pb-view-tab');
    const kpiCards = document.querySelectorAll('.pb-card-visual');
    const resetBtn = document.getElementById('pbResetFiltersBtn');
    const exportBtn = document.getElementById('pbExportCsvBtn');
    const fullscreenBtn = document.getElementById('pbFullscreenBtn');

    // 1. Slicer Filtering
    slicerChips.forEach(chip => {
      chip.addEventListener('click', () => {
        slicerChips.forEach(c => c.classList.remove('active'));
        chip.classList.add('active');

        const sector = chip.getAttribute('data-sector');
        filterKpiCards(sector);
      });
    });

    function filterKpiCards(sector) {
      kpiCards.forEach(card => {
        const cardSector = card.getAttribute('data-sector') || '';
        if (sector === 'all' || cardSector.includes(sector)) {
          card.classList.remove('pb-card-dimmed');
        } else {
          card.classList.add('pb-card-dimmed');
        }
      });
    }

    // 2. View Mode Tabs Switching
    viewTabs.forEach(tab => {
      tab.addEventListener('click', () => {
        viewTabs.forEach(t => t.classList.remove('active'));
        tab.classList.add('active');

        const view = tab.getAttribute('data-view');
        const kpiGrid = document.getElementById('pbKpiGrid');
        const chartsView = document.getElementById('pbChartsView');
        const matrixView = document.getElementById('pbMatrixView');

        if (view === 'kpi' && kpiGrid) {
          kpiGrid.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        } else if (view === 'charts' && chartsView) {
          chartsView.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        } else if (view === 'matrix' && matrixView) {
          matrixView.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        }
      });
    });

    // 3. Reset Button
    resetBtn?.addEventListener('click', () => {
      slicerChips.forEach(c => c.classList.remove('active'));
      const allChip = document.querySelector('.pb-chip[data-sector="all"]');
      allChip?.classList.add('active');
      filterKpiCards('all');

      viewTabs.forEach(t => t.classList.remove('active'));
      document.querySelector('.pb-view-tab[data-view="kpi"]')?.classList.add('active');

      showToast('Power BI dashboard filters reset to default view', 'fa-solid fa-arrow-rotate-left');
    });

    // 4. Export CSV Button
    exportBtn?.addEventListener('click', () => {
      exportExecutiveCsv();
    });

    function exportExecutiveCsv() {
      const csvHeader = "Metric_ID,Key_Performance_Indicator,Empirical_Value,Statutory_Scope,Sector_Domain,Verification_Status\n";
      const csvRows = [
        "KPI-01,Total CSR Budget Utilization Oversight,₹100 Cr+,MCA Sec 135 Compliant across 11 Indian States,CSR & BFSI Governance,100% Audited & Reconciled",
        "KPI-02,Direct CSR Budget & Resource Mobilization,₹20 Cr+,Corporate Foundations & BFSI Institutional Donors,Resource Mobilization,100% Fund Deployed",
        "KPI-03,Agency Impact Assessments Completed,₹20 Cr+,Mandatory MCA Rule 8(3) Third-Party SIA & SROI,Impact Assessment & Research,Successfully Executed",
        "KPI-04,High-Impact Technical Project Proposals & DPRs,15+ Proposals,Detailed Project Reports / Theory of Change / LFAs,Technical Project Architecture,100% Donor Approval Track",
        "KPI-05,Renowned FPO Strategic Advisor & Volunteering,Renowned FPO + 5 Orgs,Board Governance / Post-Harvest Value Chains / Volunteering,Rural Livelihoods & Agro,Active Governance",
        "KPI-06,Government Flagship Project Coordinations,5+ Projects,Convergence: WCD 1098 / NHM / ADMIP World Bank / JJM,Government Convergence,State & Central Executed",
        "KPI-07,Corporate & Foundation Leaders Network,500+ Connections,Direct Access to Corporate CSR Heads & ESG Directors,Corporate Networking,Verified Industry Network",
        "KPI-08,Verified LinkedIn Professional Reach,7.5k+ Followers,Senior CSR Leaders / Researchers / Development Peers,Professional Reach,Verified LinkedIn Network"
      ];

      const csvContent = "data:text/csv;charset=utf-8," + encodeURIComponent(csvHeader + csvRows.join("\n"));
      const dlAnchor = document.createElement("a");
      dlAnchor.setAttribute("href", csvContent);
      dlAnchor.setAttribute("download", "Prasenjit_Singha_Executive_Governance_KPIs.csv");
      document.body.appendChild(dlAnchor);
      dlAnchor.click();
      document.body.removeChild(dlAnchor);

      showToast("Executive KPI Dataset exported successfully as CSV!", "fa-solid fa-file-csv");
    }

    // 5. Fullscreen Mode Toggle
    fullscreenBtn?.addEventListener('click', () => {
      toggleFullscreen();
    });

    function toggleFullscreen() {
      const isFull = frame.classList.toggle('pb-fullscreen-mode');
      const icon = fullscreenBtn.querySelector('i');
      const text = fullscreenBtn.querySelector('span');

      if (isFull) {
        document.body.classList.add('modal-locked');
        if (icon) icon.className = 'fa-solid fa-compress';
        if (text) text.innerText = 'Exit Fullscreen';
        showToast('Power BI Dashboard: Fullscreen Mode Enabled (Press ESC to exit)', 'fa-solid fa-expand');
      } else {
        document.body.classList.remove('modal-locked');
        if (icon) icon.className = 'fa-solid fa-expand';
        if (text) text.innerText = 'Fullscreen';
      }
    }

    // ESC key closes fullscreen
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && frame.classList.contains('pb-fullscreen-mode')) {
        toggleFullscreen();
      }
    });
  }

  // Expose global modal triggers
  window.openModal = openModal;
  window.closeModal = closeModal;
  window.showToast = showToast;

})();
