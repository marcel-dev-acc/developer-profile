(function () {
  var PROJECT_TYPES = [
    {
      value: 'info',
      label: 'Info Website',
      basePrice: 300,
      weeksMin: 1,
      weeksMax: 2,
      marketMin: 500,
      marketMax: 900,
      description: 'A clean, content-focused site to establish your online presence. Perfect for portfolios, personal brands, or a simple set of pages introducing what you do.'
    },
    {
      value: 'business',
      label: 'Business Website',
      basePrice: 1500,
      weeksMin: 3,
      weeksMax: 5,
      marketMin: 2500,
      marketMax: 4500,
      description: 'A multi-page site built to represent your company professionally, with service pages, testimonials, and enquiry forms designed to turn visitors into leads.'
    },
    {
      value: 'ecommerce',
      label: 'E-Commerce',
      basePrice: 3000,
      weeksMin: 6,
      weeksMax: 10,
      marketMin: 5000,
      marketMax: 9000,
      description: 'A fully-featured online store with product listings, cart, and secure checkout &mdash; built to help you sell directly to customers.'
    },
    {
      value: 'webapp',
      label: 'Web Application (SPA)',
      basePrice: 10000,
      weeksMin: 10,
      weeksMax: 16,
      marketMin: 18000,
      marketMax: 30000,
      description: 'A custom-built, interactive application tailored to your business logic. Ideal for dashboards, portals, or tools that go beyond a standard website.'
    }
  ];

  var AVAILABLE_FEATURES = [
    {
      value: 'seo',
      label: 'SEO',
      price: 100,
      weeks: 0.5,
      description: 'On-page search engine optimisation, meta tags, and a sitemap to help your site rank and get found on Google.'
    },
    {
      value: 'cms',
      label: 'Content Management',
      price: 1000,
      weeks: 2,
      description: 'A content management system so you can update text, images, and pages yourself without needing a developer.'
    },
    {
      value: 'analytics',
      label: 'Analytics Integration',
      price: 250,
      weeks: 0.5,
      description: 'Visitor and conversion tracking wired up so you can see how people are using your site.'
    },
    {
      value: 'auth',
      label: 'Authentication',
      price: 750,
      weeks: 1.5,
      description: 'Secure user accounts with sign-up, login, and password reset &mdash; needed for members-only areas or personalised experiences.'
    }
  ];

  var TIMELINES = [
    {
      value: 'immediate',
      label: 'Immediate Start',
      extraCharge: 250,
      weeksMultiplier: 0.85,
      description: 'Work begins as soon as the quote is accepted and is prioritised ahead of other queued projects. Best if you need to move fast.'
    },
    {
      value: 'flexible',
      label: 'Flexible',
      extraCharge: 0,
      weeksMultiplier: 1,
      description: "Work is scheduled into the standard project queue &mdash; a great option if you don't have a fixed deadline and want the best value."
    }
  ];

  var STORAGE_KEY = 'website-cost-estimator:v1';
  var DEPOSIT_RATE = 0.25;

  function formatGBP(n) {
    return '£' + Math.round(n).toLocaleString();
  }

  function formatGBPRange(min, max) {
    return formatGBP(min) + '–' + formatGBP(max);
  }

  function formatWeeks(min, max) {
    var roundedMin = Math.max(1, Math.round(min));
    var roundedMax = Math.max(roundedMin, Math.round(max));
    if (roundedMin === roundedMax) {
      return roundedMin + (roundedMin === 1 ? ' week' : ' weeks');
    }
    return roundedMin + '-' + roundedMax + ' weeks';
  }

  document.addEventListener('DOMContentLoaded', function () {
    var projectTypeGrid = document.querySelector('[data-project-type-grid]');
    var featuresGrid = document.querySelector('[data-features-grid]');
    var timelineGrid = document.querySelector('[data-timeline-grid]');
    var totalPriceEl = document.querySelector('[data-total-price]');
    var totalTimeframeEl = document.querySelector('[data-total-timeframe]');
    var breakdownToggle = document.querySelector('[data-breakdown-toggle]');
    var breakdownToggleText = document.querySelector('[data-breakdown-toggle-text]');
    var breakdownPanel = document.querySelector('[data-estimate-breakdown]');
    var breakdownList = document.querySelector('[data-breakdown-list]');
    var resetBtn = document.querySelector('[data-reset-estimate]');

    var leadForm = document.querySelector('[data-lead-form]');
    var leadNameEl = document.querySelector('[data-lead-name]');
    var leadEmailEl = document.querySelector('[data-lead-email]');
    var leadPhoneEl = document.querySelector('[data-lead-phone]');
    var leadStatusEl = document.querySelector('[data-lead-status]');
    var leadSubmitBtn = document.querySelector('[data-lead-submit]');

    if (!projectTypeGrid) return;

    var state = loadSavedState();
    var isSending = false;
    var isBreakdownOpen = false;

    function loadSavedState() {
      var fallback = { projectType: '', features: [], timeline: '' };
      try {
        var raw = window.localStorage.getItem(STORAGE_KEY);
        if (!raw) return fallback;
        var saved = JSON.parse(raw);

        var projectType = PROJECT_TYPES.some(function (p) { return p.value === saved.projectType; }) ? saved.projectType : '';
        var timeline = TIMELINES.some(function (t) { return t.value === saved.timeline; }) ? saved.timeline : '';
        var features = Array.isArray(saved.features)
          ? saved.features.filter(function (value) { return AVAILABLE_FEATURES.some(function (f) { return f.value === value; }); })
          : [];

        return { projectType: projectType, features: features, timeline: timeline };
      } catch (e) {
        return fallback;
      }
    }

    function saveState() {
      try {
        window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
      } catch (e) {
        // Storage unavailable (private browsing, disabled, etc) — fail silently.
      }
    }

    function renderOptions(grid, items, selectedCheck, onClick, priceText, extraContent) {
      grid.innerHTML = '';
      items.forEach(function (item) {
        var btn = document.createElement('button');
        btn.type = 'button';
        btn.className = 'option-btn' + (selectedCheck(item) ? ' selected' : '');

        var head = document.createElement('div');
        head.className = 'option-head';

        var labelDiv = document.createElement('span');
        labelDiv.className = 'option-label';
        labelDiv.textContent = item.label;
        head.appendChild(labelDiv);

        var priceValue = priceText(item);
        if (priceValue) {
          var priceDiv = document.createElement('span');
          priceDiv.className = 'option-price';
          priceDiv.textContent = priceValue;
          head.appendChild(priceDiv);
        }

        btn.appendChild(head);

        var descP = document.createElement('p');
        descP.className = 'option-desc';
        descP.innerHTML = item.description;
        btn.appendChild(descP);

        if (extraContent) {
          var extraValue = extraContent(item);
          if (extraValue) {
            var extraP = document.createElement('p');
            extraP.className = 'option-market';
            extraP.textContent = extraValue;
            btn.appendChild(extraP);
          }
        }

        btn.addEventListener('click', function () {
          onClick(item.value);
          saveState();
          renderAll();
          updateEstimate();
          updateSubmitState();
          updateResetVisibility();
        });

        grid.appendChild(btn);
      });
    }

    function renderAll() {
      renderOptions(
        projectTypeGrid,
        PROJECT_TYPES,
        function (item) { return state.projectType === item.value; },
        function (value) { state.projectType = value; },
        function (item) { return 'From ' + formatGBP(item.basePrice); },
        function (item) { return 'Agencies typically charge ' + formatGBPRange(item.marketMin, item.marketMax) + ' for this.'; }
      );

      renderOptions(
        featuresGrid,
        AVAILABLE_FEATURES,
        function (item) { return state.features.indexOf(item.value) !== -1; },
        function (value) {
          var idx = state.features.indexOf(value);
          if (idx === -1) {
            state.features.push(value);
          } else {
            state.features.splice(idx, 1);
          }
        },
        function (item) { return '+' + formatGBP(item.price); }
      );

      renderOptions(
        timelineGrid,
        TIMELINES,
        function (item) { return state.timeline === item.value; },
        function (value) { state.timeline = value; },
        function (item) { return item.extraCharge > 0 ? '+' + formatGBP(item.extraCharge) : 'No extra charge'; }
      );
    }

    function selectedProject() {
      return PROJECT_TYPES.filter(function (p) { return p.value === state.projectType; })[0];
    }

    function selectedTimeline() {
      return TIMELINES.filter(function (t) { return t.value === state.timeline; })[0];
    }

    function selectedFeatures() {
      return state.features.map(function (value) {
        return AVAILABLE_FEATURES.filter(function (f) { return f.value === value; })[0];
      }).filter(Boolean);
    }

    function calculateEstimate() {
      var project = selectedProject();
      if (!project) return null;

      var timeline = selectedTimeline();
      var features = selectedFeatures();

      var price = project.basePrice;
      var weeksMin = project.weeksMin;
      var weeksMax = project.weeksMax;

      features.forEach(function (feature) {
        price += feature.price;
        weeksMin += feature.weeks;
        weeksMax += feature.weeks;
      });

      if (timeline) {
        price += timeline.extraCharge;
        weeksMin *= timeline.weeksMultiplier;
        weeksMax *= timeline.weeksMultiplier;
      }

      return {
        price: price,
        timeframeText: formatWeeks(weeksMin, weeksMax)
      };
    }

    function updateEstimate() {
      var estimate = calculateEstimate();
      if (!estimate) {
        totalPriceEl.textContent = 'Select a project type';
        totalTimeframeEl.textContent = '—';
        renderBreakdown(null);
        return;
      }
      totalPriceEl.textContent = formatGBP(estimate.price);
      totalTimeframeEl.textContent = estimate.timeframeText;
      renderBreakdown(estimate);
    }

    function updateSubmitState() {
      leadSubmitBtn.disabled = !state.projectType || !state.timeline;
    }

    function updateResetVisibility() {
      if (!resetBtn) return;
      resetBtn.hidden = !(state.projectType || state.features.length || state.timeline);
    }

    function setBreakdownOpen(open) {
      if (!breakdownToggle || !breakdownPanel) return;
      isBreakdownOpen = open;
      breakdownPanel.hidden = !open;
      breakdownToggle.setAttribute('aria-expanded', open ? 'true' : 'false');
      if (breakdownToggleText) breakdownToggleText.textContent = open ? 'Hide breakdown' : 'View breakdown';
    }

    function addBreakdownRow(label, amount) {
      var row = document.createElement('div');
      row.className = 'breakdown-row';

      var labelSpan = document.createElement('span');
      labelSpan.textContent = label;

      var priceSpan = document.createElement('span');
      priceSpan.className = 'breakdown-row-price';
      priceSpan.textContent = amount;

      row.appendChild(labelSpan);
      row.appendChild(priceSpan);
      breakdownList.appendChild(row);
    }

    function renderBreakdown(estimate) {
      if (!breakdownToggle || !breakdownList) return;

      var project = selectedProject();
      if (!project || !estimate) {
        breakdownToggle.disabled = true;
        setBreakdownOpen(false);
        breakdownList.innerHTML = '';
        return;
      }

      breakdownToggle.disabled = false;
      breakdownList.innerHTML = '';

      addBreakdownRow(project.label, formatGBP(project.basePrice));
      selectedFeatures().forEach(function (feature) {
        addBreakdownRow(feature.label, '+' + formatGBP(feature.price));
      });

      var timeline = selectedTimeline();
      if (timeline && timeline.extraCharge > 0) {
        addBreakdownRow(timeline.label, '+' + formatGBP(timeline.extraCharge));
      }

      var totalRow = document.createElement('div');
      totalRow.className = 'breakdown-total';
      var totalLabel = document.createElement('span');
      totalLabel.textContent = 'Total estimate';
      var totalPrice = document.createElement('span');
      totalPrice.textContent = formatGBP(estimate.price);
      totalRow.appendChild(totalLabel);
      totalRow.appendChild(totalPrice);
      breakdownList.appendChild(totalRow);

      var depositAmount = Math.round(estimate.price * DEPOSIT_RATE);
      var balanceAmount = Math.round(estimate.price) - depositAmount;
      addBreakdownRow('25% deposit, due before work begins', formatGBP(depositAmount));
      addBreakdownRow('75% balance, due on completion', formatGBP(balanceAmount));

      var compare = document.createElement('p');
      compare.className = 'breakdown-compare';
      var savings = project.marketMin - estimate.price;
      if (savings > 0) {
        compare.innerHTML = 'Agencies typically charge <strong>' + formatGBPRange(project.marketMin, project.marketMax) +
          '</strong> for a similar project &mdash; this estimate could save you <strong>' + formatGBP(savings) + '+</strong>.';
      } else {
        compare.textContent = 'Typical agency price for a similar project: ' + formatGBPRange(project.marketMin, project.marketMax) + '.';
      }
      breakdownList.appendChild(compare);
    }

    function buildSummaryMessage() {
      var project = selectedProject();
      var timeline = selectedTimeline();
      var features = selectedFeatures();
      var estimate = calculateEstimate();

      var lines = ['Website cost estimator request'];
      lines.push('Project type: ' + (project ? project.label : 'Not selected'));
      lines.push('Additional features: ' + (features.length ? features.map(function (f) { return f.label; }).join(', ') : 'None selected'));
      lines.push('Timeline: ' + (timeline ? timeline.label : 'Not selected'));
      if (estimate) {
        var depositAmount = Math.round(estimate.price * DEPOSIT_RATE);
        var balanceAmount = Math.round(estimate.price) - depositAmount;
        lines.push('Estimated price: ' + formatGBP(estimate.price));
        lines.push('Estimated build timeframe: ' + estimate.timeframeText);
        lines.push('Payment schedule: 25% deposit (' + formatGBP(depositAmount) + ') before work begins, 75% balance (' + formatGBP(balanceAmount) + ') on completion');
      }
      return lines.join('\n');
    }

    function setLeadStatus(type, text) {
      if (!leadStatusEl) return;
      leadStatusEl.hidden = !text;
      leadStatusEl.textContent = text || '';
      leadStatusEl.className = 'simple-status' + (type ? ' ' + type : '');
    }

    function setSending(value) {
      isSending = value;
      leadSubmitBtn.disabled = value || !state.projectType || !state.timeline;
      leadSubmitBtn.textContent = value ? 'Sending...' : 'Submit Request';
    }

    if (leadForm) {
      leadForm.addEventListener('submit', function (e) {
        e.preventDefault();
        if (isSending) return;

        if (!state.projectType || !state.timeline) {
          setLeadStatus('error', 'Please choose a project type and timeline above first.');
          return;
        }

        var phoneValue = leadPhoneEl.value.trim();
        if (!phoneValue) {
          setLeadStatus('error', 'Please enter a phone number so I can reach you.');
          return;
        }

        var nameParts = leadNameEl.value.trim().split(/\s+/).filter(Boolean);
        var fields = {
          firstName: nameParts[0] || '',
          lastName: nameParts.length > 1 ? nameParts.slice(1).join(' ') : '',
          email: leadEmailEl.value.trim(),
          phone: phoneValue,
          message: buildSummaryMessage()
        };

        window.LeadSubmit.submitLead(fields, {
          onValidationError: function (missing) {
            setLeadStatus('error', 'Please fill in: ' + missing.join(', '));
          },
          onMissingVerification: function () {
            setLeadStatus('error', 'Please complete the verification challenge above.');
          },
          onSending: function () {
            setSending(true);
            setLeadStatus('system', 'Sending your request...');
          },
          onSuccess: function (message) {
            setLeadStatus('success', message);
            leadForm.reset();
          },
          onError: function (message) {
            setLeadStatus('error', message);
          },
          onSettled: function () {
            setSending(false);
          }
        });
      });
    }

    if (breakdownToggle) {
      breakdownToggle.addEventListener('click', function () {
        setBreakdownOpen(!isBreakdownOpen);
      });
    }

    if (resetBtn) {
      resetBtn.addEventListener('click', function () {
        state.projectType = '';
        state.features = [];
        state.timeline = '';
        saveState();
        renderAll();
        updateEstimate();
        updateSubmitState();
        updateResetVisibility();
      });
    }

    renderAll();
    updateEstimate();
    updateSubmitState();
    updateResetVisibility();
  });
})();
