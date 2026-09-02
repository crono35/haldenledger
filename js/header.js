window.initLedgerHeader = function () {
  var headerMount = document.getElementById('site-header');

  if (
    headerMount &&
    headerMount.dataset.ledgerHeaderInitialized === 'true'
  ) {
    return;
  }

  if (headerMount) {
    headerMount.dataset.ledgerHeaderInitialized = 'true';
  }

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

  function isInstitutionalPage() {
    var path = window.location.pathname;

    return (
      path === '/archive.html' ||
      path === '/archive' ||
      path === '/archive/' ||
      path === '/about.html' ||
      path === '/about' ||
      path === '/about/' ||
      path === '/journalists.html' ||
      path === '/journalists' ||
      path === '/journalists/' ||
      path === '/contact.html' ||
      path === '/contact' ||
      path === '/contact/' ||
      path === '/corrections.html' ||
      path === '/corrections' ||
      path === '/corrections/' ||
      path === '/privacy.html' ||
      path === '/privacy' ||
      path === '/privacy/'
    );
  }

  function formatEditionDate(yearString) {
    var year = parseInt(yearString, 10) || 2027;
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

  var pathEdition = editionFromPath();
  var unlockedEdition = getStored('haldenLedgerEdition');
  var readerEmail = getStored('haldenLedgerReaderEmail');

  var displayEdition =
    isInstitutionalPage() && unlockedEdition
      ? unlockedEdition
      : pathEdition;

  var dateEl = document.getElementById('ledger-edition-date');

  if (dateEl) {
    dateEl.textContent = formatEditionDate(displayEdition);
  }

  var prefix = editionPrefix(displayEdition);

  var home = document.getElementById('ledger-home-link');
  var science = document.getElementById('ledger-nav-science');
  var industry = document.getElementById('ledger-nav-industry');
  var policy = document.getElementById('ledger-nav-policy');
  var world = document.getElementById('ledger-nav-world');

  if (home) {
    home.href = prefix
      ? prefix + '/index.html'
      : '/index.html';
  }

  if (science) {
    science.href = prefix
      ? prefix + '/science.html'
      : '/science.html';
  }

  if (industry) {
    industry.href = prefix
      ? prefix + '/industry.html'
      : '/industry.html';
  }

  if (policy) {
    policy.href = prefix
      ? prefix + '/policy.html'
      : '/policy.html';
  }

  if (world) {
    world.href = prefix
      ? prefix + '/world.html'
      : '/world.html';
  }

  var loginPanel = document.getElementById('ledger-login-panel');
  var readerPanel = document.getElementById('ledger-reader-panel');
  var readerEmailEl = document.getElementById('ledger-reader-email');
  var readerYearEl = document.getElementById('ledger-reader-year');

  if (readerEmail && unlockedEdition) {
    if (loginPanel) {
      loginPanel.style.display = 'none';
    }

    if (readerPanel) {
      readerPanel.style.display = 'flex';
    }

    if (readerEmailEl) {
      readerEmailEl.textContent = readerEmail;
    }

    if (readerYearEl) {
      readerYearEl.textContent = unlockedEdition;
    }
  } else {
    if (loginPanel) {
      loginPanel.style.display = 'block';
    }

    if (readerPanel) {
      readerPanel.style.display = 'none';
    }
  }

  var loginForm = document.querySelector('.header-login');
  var status = document.getElementById('ledger-login-status');
  var modal = document.getElementById('ledger-unlock-modal');
  var unlockEmail = document.getElementById('ledger-unlock-email');

  if (loginForm) {
    loginForm.addEventListener('submit', function (event) {
      event.preventDefault();
      event.stopPropagation();

      var emailInput = loginForm.querySelector('[name=email]');
      var codeInput = loginForm.querySelector('[name=password]');

      var email = emailInput
        ? emailInput.value.trim()
        : '';

      var code = codeInput
        ? codeInput.value.trim()
        : '';

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

      if (unlockEmail) {
        unlockEmail.textContent = email;
      }

      if (modal) {
        modal.style.display = 'flex';
      }
    });
  }

  var stayButton = document.getElementById('ledger-stay-current');

  if (stayButton) {
    stayButton.addEventListener('click', function (event) {
      event.preventDefault();
      event.stopPropagation();

      if (modal) {
        modal.style.display = 'none';
      }
    });
  }

  var unlockButton = document.getElementById('ledger-confirm-unlock');

  if (unlockButton) {
    unlockButton.addEventListener('click', function (event) {
      event.preventDefault();
      event.stopPropagation();

      var email = unlockEmail
        ? unlockEmail.textContent.trim()
        : '';

      if (!email) {
        return;
      }

      setStored('haldenLedgerEdition', '2031');
      setStored('haldenLedgerBook1Unlocked', 'true');
      setStored('haldenLedgerReaderEmail', email);

      window.location.href = '/2031/index.html';
    });
  }

  var signout = document.getElementById('ledger-signout');

  if (signout) {
    signout.addEventListener('click', function (event) {
      event.preventDefault();

      clearStored('haldenLedgerEdition');
      clearStored('haldenLedgerBook1Unlocked');
      clearStored('haldenLedgerBook2Unlocked');
      clearStored('haldenLedgerBook3Unlocked');
      clearStored('haldenLedgerReaderEmail');

      window.location.href = '/index.html';
    });
  }
};