(function () {
  var CONTACT_ENDPOINT = 'https://mjhub-cloudflare-proxy.mjhubandservices.workers.dev/contact';
  var ORGANISATION_ID = '2c4d46bb-611b-463a-9cd4-1486a755850a';

  var COMMANDS = ['/name', '/email', '/phone', '/message', '/send', '/clear', '/help', '/matrix'];

  var INITIAL_MESSAGES = [
    { type: 'system', text: 'CONTACT TERMINAL v2.1.0' },
    { type: 'system', text: 'Type /help for available commands' },
    { type: 'system', text: 'Type "exit" and press Enter to close the terminal' },
    { type: 'system', text: '> Ready for input...' }
  ];

  function initialFormData() {
    return { firstName: '', lastName: '', email: '', phone: '', message: '' };
  }

  document.addEventListener('DOMContentLoaded', function () {
    var logEl = document.querySelector('[data-terminal-log]');
    var suggestionsEl = document.querySelector('[data-terminal-suggestions]');
    var inputEl = document.querySelector('[data-terminal-input]');
    var cursorEl = document.querySelector('[data-terminal-cursor]');
    var formEl = document.querySelector('[data-terminal-form]');
    var canvasEl = document.querySelector('[data-matrix-canvas]');
    var redDotEl = document.querySelector('[data-terminal-red-dot]');
    var yellowDotEl = document.querySelector('[data-terminal-yellow-dot]');

    if (!formEl) return;

    function goHome() {
      window.location.href = '../';
    }

    var messages = INITIAL_MESSAGES.slice();
    var formData = initialFormData();
    var isSending = false;
    var matrixAnimationFrame = null;
    var matrixTimeout = null;
    var matrixKeyHandler = null;

    function renderMessages() {
      logEl.innerHTML = '';
      messages.forEach(function (msg) {
        var line = document.createElement('div');
        line.className = 'line ' + msg.type;
        line.textContent = msg.text;
        logEl.appendChild(line);
      });
      // The log grows the page rather than scrolling in its own box, so keep
      // the input row (and whatever was just printed above it) in view.
      formEl.scrollIntoView({ block: 'end' });
    }

    function pushMessages(newOnes) {
      messages = messages.concat(newOnes);
      renderMessages();
    }

    function renderSuggestions(list) {
      suggestionsEl.innerHTML = '';
      if (!list.length) {
        suggestionsEl.hidden = true;
        return;
      }
      suggestionsEl.hidden = false;

      var box = document.createElement('div');
      box.className = 'box';

      var label = document.createElement('div');
      label.className = 'box-label';
      label.textContent = 'Suggestions:';
      box.appendChild(label);

      var chips = document.createElement('div');
      chips.className = 'chips';
      list.forEach(function (suggestion) {
        var chip = document.createElement('button');
        chip.type = 'button';
        chip.className = 'chip';
        chip.textContent = suggestion;
        chip.addEventListener('click', function () {
          inputEl.value = suggestion + ' ';
          renderSuggestions([]);
          inputEl.focus();
        });
        chips.appendChild(chip);
      });
      box.appendChild(chips);
      suggestionsEl.appendChild(box);
    }

    function updateCursorPosition() {
      cursorEl.style.transform = 'translateX(' + inputEl.value.length + 'ch)';
    }

    inputEl.addEventListener('input', function () {
      updateCursorPosition();
      var value = inputEl.value;
      if (value.startsWith('/')) {
        var lower = value.toLowerCase();
        renderSuggestions(COMMANDS.filter(function (cmd) { return cmd.startsWith(lower); }));
      } else {
        renderSuggestions([]);
      }
    });

    setInterval(function () {
      cursorEl.classList.toggle('hidden');
    }, 530);

    function setSending(value) {
      isSending = value;
      inputEl.disabled = value;
      inputEl.placeholder = value ? 'Sending...' : 'Type a command...';
    }

    function sendContactMessage() {
      var missingFields = [
        ['First name', formData.firstName],
        ['Last name', formData.lastName],
        ['Email', formData.email],
        ['Message', formData.message]
      ].filter(function (pair) { return !pair[1].trim(); });

      if (missingFields.length > 0) {
        pushMessages(
          [{ type: 'error', text: 'Error: Missing required fields' }].concat(
            missingFields.map(function (pair) { return { type: 'system', text: pair[0] + ': NOT SET' }; })
          )
        );
        return Promise.resolve();
      }

      var turnstileToken = window.turnstile && typeof window.turnstile.getResponse === 'function'
        ? window.turnstile.getResponse()
        : '';

      if (!turnstileToken) {
        pushMessages([{ type: 'error', text: 'Error: Please complete the verification challenge' }]);
        return Promise.resolve();
      }

      setSending(true);
      pushMessages([{ type: 'system', text: 'Sending message...' }]);

      var payload = {
        first_name: formData.firstName,
        last_name: formData.lastName,
        organisation_id: ORGANISATION_ID,
        email: formData.email,
        enquiry_type: 'general',
        message: formData.message,
        turnstile_token: turnstileToken
      };

      if (formData.phone.trim()) {
        payload.phone = formData.phone;
      }

      return fetch(CONTACT_ENDPOINT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      })
        .then(function (response) {
          return response.json().catch(function () { return {}; }).then(function (body) {
            return { response: response, body: body };
          });
        })
        .then(function (result) {
          var response = result.response;
          var body = result.body || {};

          if (!response.ok || !body.ok) {
            var errorMessage = body.message || ('Request failed with status ' + response.status);
            pushMessages([{ type: 'error', text: 'Error: ' + errorMessage }]);
            return;
          }

          pushMessages([
            { type: 'success', text: '✓ Message sent successfully!' },
            { type: 'system', text: body.message || 'Contact form submitted successfully.' }
          ]);
          formData = initialFormData();
        })
        .catch(function (error) {
          var errorMessage = (error && error.message) || 'Unexpected network error';
          pushMessages([{ type: 'error', text: 'Error: ' + errorMessage }]);
        })
        .finally(function () {
          setSending(false);
          if (window.turnstile && typeof window.turnstile.reset === 'function') {
            window.turnstile.reset();
          }
        });
    }

    function stopMatrix() {
      if (matrixAnimationFrame) cancelAnimationFrame(matrixAnimationFrame);
      if (matrixTimeout) clearTimeout(matrixTimeout);
      matrixAnimationFrame = null;
      matrixTimeout = null;
      canvasEl.hidden = true;

      if (matrixKeyHandler) {
        document.removeEventListener('keydown', matrixKeyHandler);
        matrixKeyHandler = null;
      }

      inputEl.focus();
    }

    function startMatrix() {
      canvasEl.hidden = false;
      var ctx = canvasEl.getContext('2d');
      canvasEl.width = window.innerWidth;
      canvasEl.height = window.innerHeight;

      matrixKeyHandler = function (e) {
        e.preventDefault();
        stopMatrix();
      };
      document.addEventListener('keydown', matrixKeyHandler);

      var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@#$%^&*()_+-=[]{}|;:,.<>?';
      var fontSize = 14;
      var columns = canvasEl.width / fontSize;
      var drops = [];
      for (var i = 0; i < columns; i++) {
        drops[i] = Math.random() * -100;
      }

      function draw() {
        ctx.fillStyle = 'rgba(0, 0, 0, 0.05)';
        ctx.fillRect(0, 0, canvasEl.width, canvasEl.height);

        ctx.fillStyle = '#0F0';
        ctx.font = fontSize + 'px monospace';

        for (var i = 0; i < drops.length; i++) {
          var text = characters.charAt(Math.floor(Math.random() * characters.length));
          ctx.fillText(text, i * fontSize, drops[i] * fontSize);

          if (drops[i] * fontSize > canvasEl.height && Math.random() > 0.975) {
            drops[i] = 0;
          }
          drops[i]++;
        }

        matrixAnimationFrame = requestAnimationFrame(draw);
      }

      draw();
      matrixTimeout = setTimeout(stopMatrix, 10000);
    }

    if (redDotEl) {
      redDotEl.addEventListener('click', goHome);
    }
    if (yellowDotEl) {
      yellowDotEl.addEventListener('click', goHome);
    }

    formEl.addEventListener('submit', function (e) {
      e.preventDefault();
      var input = inputEl.value;
      if (!input.trim() || isSending) return;

      pushMessages([{ type: 'user', text: '> ' + input }]);

      var trimmedInput = input.trim();
      var parts = trimmedInput.split(' ');
      var command = parts[0].toLowerCase();
      var value = parts.slice(1).join(' ');

      switch (command) {
        case '/help':
          pushMessages([
            { type: 'system', text: 'Available commands:' },
            { type: 'system', text: '  /name <full name> - Set first and last name' },
            { type: 'system', text: '  /email <your email> - Set your email' },
            { type: 'system', text: '  /phone <phone number> - Set your phone number' },
            { type: 'system', text: '  /message <your message> - Set your message' },
            { type: 'system', text: '  /send - Send message' },
            { type: 'system', text: '  /clear - Clear the terminal' },
            { type: 'system', text: '  /help - Show this help' },
            { type: 'system', text: '  /matrix - Enter the Matrix' },
            { type: 'system', text: '  exit - Close the terminal' }
          ]);
          break;

        case '/name':
          if (!value) {
            pushMessages([{ type: 'error', text: 'Error: Please provide a name' }]);
          } else {
            var nameParts = value.trim().split(/\s+/);
            var firstName = nameParts[0] || '';
            var lastName = nameParts.length > 1 ? nameParts[nameParts.length - 1] : 'not given';

            if (!firstName) {
              pushMessages([{ type: 'error', text: 'Error: Please provide at least a first name' }]);
            } else {
              formData.firstName = firstName;
              formData.lastName = lastName;
              pushMessages([{ type: 'success', text: '✓ Name set to: ' + firstName + ' ' + lastName }]);
            }
          }
          break;

        case '/email':
          if (!value) {
            pushMessages([{ type: 'error', text: 'Error: Please provide an email' }]);
          } else if (value.indexOf('@') === -1) {
            pushMessages([{ type: 'error', text: 'Error: Invalid email format' }]);
          } else {
            formData.email = value;
            pushMessages([{ type: 'success', text: '✓ Email set to: ' + value }]);
          }
          break;

        case '/phone':
          if (!value) {
            pushMessages([{ type: 'error', text: 'Error: Please provide a phone number' }]);
          } else {
            formData.phone = value;
            pushMessages([{ type: 'success', text: '✓ Phone set to: ' + value }]);
          }
          break;

        case '/message':
          if (!value) {
            pushMessages([{ type: 'error', text: 'Error: Please provide a message' }]);
          } else {
            formData.message = value;
            pushMessages([{ type: 'success', text: '✓ Message set: ' + value.substring(0, 50) + (value.length > 50 ? '...' : '') }]);
          }
          break;

        case '/send':
          if (isSending) {
            pushMessages([{ type: 'system', text: 'Request already in progress...' }]);
          } else {
            sendContactMessage();
          }
          break;

        case '/clear':
          messages = INITIAL_MESSAGES.slice();
          formData = initialFormData();
          renderMessages();
          break;

        case '/matrix':
          pushMessages([
            { type: 'success', text: '🕶️ Entering the Matrix...' },
            { type: 'system', text: 'Wake up, Neo...' }
          ]);
          startMatrix();
          break;

        case 'exit':
          pushMessages([{ type: 'system', text: 'Closing terminal...' }]);
          goHome();
          break;

        default:
          pushMessages([
            { type: 'error', text: 'Error: Unknown command "' + command + '"' },
            { type: 'system', text: 'Type /help for available commands' }
          ]);
      }

      inputEl.value = '';
      updateCursorPosition();
      renderSuggestions([]);
    });

    renderMessages();
    inputEl.focus();
  });
})();
