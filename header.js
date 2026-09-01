(function () {
  function getStored(key) {
    try {
      return localStorage.getItem(key) || '';
    } catch (e) {
      return '';
    }
  }

  function setStored(key, value) {
    try {
      localStorage.setItem(key, value);
    } catch (e) {}
  }

  function clearStored(key) {
    try {
      localStorage.removeItem(key);
    } catch (e) {}
  }

  function editionFromPath() {
    var match = window.location.pathname.match(/^\/(20\d{2})(?:\/|$)/);
    return match ? match[1] : '2027';
  }

  function displayEdition() {
    var path = window.location.pathname;
    var pathEdition = editionFromPath();
    var unlocked = getStored('haldenLedgerEdition');

    if (
      path === '/archive.html' ||
      path === '/archive' ||
      path === '/archive/'
    ) {
      return unlocked || '2027';
    }

    return pathEdition;
  }

  function formatEditionDate(yearString) {
    var year = parseInt(yearString, 10);

    if (!year) {
      year = 2027;
    }

    var d = new Date(year, 2, 8);

    return d.toLocaleDateString('en-US', {
      weekday: 'long',
      month: 'long',
      day: 'numeric',
      year: 'numeric'
    });
  }

  function editionPrefix(yearString) {
    return yearString === '2027' ? '' : '/' + yearString;
  }

  function setEditionAwareLinks(yearString) {
    var prefix = editionPrefix(yearString);

    var home = document.getElementById('ledger-home-link');
    var science = document.getElementById('ledger-nav-science');
    var industry = document.getElementById('ledger-nav-industry');
    var policy = document.getElementById('ledger-nav-policy');
    var world = document.getElementById('ledger-nav-world');

    if (home) {
      home.href = prefix ? prefix + '/index.html' : '/index.html';
    }

    if (science) {
      science.href = prefix ? prefix + '/science.html' : '/science.html';
    }

    if (industry) {
      industry.href = prefix ? prefix + '/industry.html' : '/industry.html';
    }

    if (policy) {
      policy.href = prefix ? prefix + '/policy.html' : '/policy.html';
    }

    if (world) {
      world.href = prefix ? prefix + '/world.html' : '/world.html';
    }
  }

  function renderReaderState() {
    var path = window.location.pathname;

    var onBaseEdition =
      editionFromPath() === '2027' &&
      path !== '/archive.html' &&
      path !== '/archive' &&
      path !== '/archive/';

    var loginPanel = document.getElementById('ledger-login-panel');
    var readerPanel = document.getElementById('ledger-reader-panel');
    var emailEl = document.getElementById('ledger-reader-email');
    var yearEl = document.getElementById('ledger-reader-year');

    var email = getStored('haldenLedgerReaderEmail');
    var unlocked = getStored('haldenLedgerEdition');

    if (!loginPanel || !readerPanel) {
      return;
    }

    if (!onBaseEdition && email && unlocked) {
      loginPanel.style.display = 'none';
      readerPanel.style.display = 'flex';

      if (emailEl) {
        emailEl.textContent = email;
      }

      if (yearEl) {
        yearEl.textContent = unlocked;
      }
    } else {
      loginPanel.style.display = 'block';
      readerPanel.style.display = 'none';
    }
  }

  var currentEdition = displayEdition();

  var dateEl = document.getElementById('ledger-edition-date');

  if (dateEl) {
    dateEl.textContent = formatEditionDate(currentEdition);
  }

  setEditionAwareLinks(currentEdition);
  renderReaderState();

  var loginForm = document.querySelector('.header-login');
  var status = document.getElementById('ledger-login-status');

  if (loginForm) {
    loginForm.addEventListener('submit', function (event) {
      event.preventDefault();

      var emailInput = loginForm.querySelector('[name=email]');
      var codeInput = loginForm.querySelector('[name=password]');

      var email = emailInput ? emailInput.value.trim() : '';
      var code = codeInput ? codeInput.value.trim() : '';

      if (!email) {
        if (status) {
          status.textContent = 'Enter your email address.';
          status.style.color = '#7a1111';
        }

        return;
      }

      if (code !== 'MIDNIGHT31') {
        if (status) {
          status.textContent = 'Incorrect access code.';
          status.style.color = '#7a1111';
        }

        return;
      }

      if (status) {
        status.textContent = '';
      }

      var unlockEmail = document.getElementById('ledger-unlock-email');

      if (unlockEmail) {
        unlockEmail.textContent = email;
      }

      var modal = document.getElementById('ledger-unlock-modal');

      if (modal) {
        modal.style.display = 'flex';
      }
    });
  }

  var stayButton = document.getElementById('ledger-stay-current');

  if (stayButton) {
    stayButton.addEventListener('click', function () {
      var modal = document.getElementById('ledger-unlock-modal');

      if (modal) {
        modal.style.display = 'none';
      }
    });
  }

  var unlockButton = document.getElementById('ledger-confirm-unlock');

  if (unlockButton) {
    unlockButton.addEventListener('click', function () {
      var unlockEmail = document.getElementById('ledger-unlock-email');
      var email = unlockEmail ? unlockEmail.textContent.trim() : '';

      setStored('haldenLedgerEdition', '2031');
      setStored('haldenLedgerBook1Unlocked', 'true');
      setStored('haldenLedgerReaderEmail', email);

      window.location.href = '/2031/index.html';
    });
  }

  var signout = document.getElementById('ledger-signout');

  if (signout) {
    signout.addEventListener('click', function () {
      clearStored('haldenLedgerEdition');
      clearStored('haldenLedgerBook1Unlocked');
      clearStored('haldenLedgerReaderEmail');

      window.location.href = '/index.html';
    });
  }
})();