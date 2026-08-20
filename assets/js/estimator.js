(function () {
  var PROJECT_TYPES = [
    { value: 'info', label: 'Info Website', basePrice: 300 },
    { value: 'business', label: 'Business Website', basePrice: 1500 },
    { value: 'ecommerce', label: 'E-Commerce', basePrice: 3000 },
    { value: 'webapp', label: 'Web Application (SPA)', basePrice: 10000 }
  ];

  var AVAILABLE_FEATURES = [
    { value: 'seo', label: 'SEO', price: 100 },
    { value: 'cms', label: 'Content Management', price: 1000 },
    { value: 'analytics', label: 'Analytics Integration', price: 250 },
    { value: 'auth', label: 'Authentication', price: 750 }
  ];

  var TIMELINES = [
    { value: 'immediate', label: 'Immediate Start', extraCharge: 250 },
    { value: 'flexible', label: 'Flexible', extraCharge: 0 }
  ];

  function formatGBP(n) {
    return '£' + n.toLocaleString();
  }

  document.addEventListener('DOMContentLoaded', function () {
    var projectTypeGrid = document.querySelector('[data-project-type-grid]');
    var featuresGrid = document.querySelector('[data-features-grid]');
    var timelineGrid = document.querySelector('[data-timeline-grid]');
    var calculateBtn = document.querySelector('[data-calculate-btn]');
    var resultBox = document.querySelector('[data-result-box]');
    var resultValue = document.querySelector('[data-result-value]');

    if (!projectTypeGrid) return;

    var state = { projectType: '', features: [], timeline: '' };

    function renderOptions(grid, items, selectedCheck, onClick, extra) {
      grid.innerHTML = '';
      items.forEach(function (item) {
        var btn = document.createElement('button');
        btn.type = 'button';
        btn.className = 'option-btn' + (selectedCheck(item) ? ' selected' : '');

        var labelDiv = document.createElement('div');
        labelDiv.className = 'option-label';
        labelDiv.textContent = item.label;
        btn.appendChild(labelDiv);

        var priceText = extra(item);
        if (priceText) {
          var priceDiv = document.createElement('div');
          priceDiv.className = 'option-price';
          priceDiv.textContent = priceText;
          btn.appendChild(priceDiv);
        }

        btn.addEventListener('click', function () {
          onClick(item.value);
          updateCalculateState();
          renderAll();
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
        function (item) { return 'From ' + formatGBP(item.basePrice); }
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
        function (item) { return item.extraCharge > 0 ? '+' + formatGBP(item.extraCharge) : ''; }
      );
    }

    function updateCalculateState() {
      calculateBtn.disabled = !state.projectType || !state.timeline;
    }

    function calculatePrice() {
      var selectedProject = PROJECT_TYPES.filter(function (p) { return p.value === state.projectType; })[0];
      if (!selectedProject) return;

      var total = selectedProject.basePrice;

      state.features.forEach(function (featureValue) {
        var feat = AVAILABLE_FEATURES.filter(function (f) { return f.value === featureValue; })[0];
        if (feat) total += feat.price;
      });

      var selectedTimeline = TIMELINES.filter(function (t) { return t.value === state.timeline; })[0];
      if (selectedTimeline) {
        total += selectedTimeline.extraCharge;
      }

      resultValue.textContent = formatGBP(Math.round(total));
      resultBox.hidden = false;
    }

    calculateBtn.addEventListener('click', calculatePrice);

    renderAll();
    updateCalculateState();
  });
})();
