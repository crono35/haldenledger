window.initLedgerHeader = function () {
  function getStored(key) {
    try {
      return localStorage.getItem(key) || '';
    } catch (e) {
      return '';
    }
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

  function isArchivePage() {
    var path = window.location.pathname;

    return (
      path === '/archive.html' ||
      path === '/archive' ||
      path === '/archive/'
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
    return yearString === '2027'
      ? ''
      : '/' + yearString;
  }

  var pathEdition = editionFromPath();
  var unlockedEdition = getStored('haldenLedgerEdition');
  var readerEmail = getStored('haldenLedgerReaderEmail');

  var displayEdition =
    isArchivePage() && unlockedEdition
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

  var loginPanel =
    document.getElementById('ledger-login-panel');

  var readerPanel =
    document.getElementById('ledger-reader-panel');

  var emailEl =
    document.getElementById('ledger-reader-email');

  var yearEl =
    document.getElementById('ledger-reader-year');

  var shouldShowReaderStatus =
    readerEmail &&
    unlockedEdition &&
    (
      pathEdition !== '2027' ||
      isArchivePage()
    );

  if (shouldShowReaderStatus) {
    if (loginPanel) {
      loginPanel.style.display = 'none';
    }

    if (readerPanel) {
      readerPanel.style.display = 'flex';
    }

    if (emailEl) {
      emailEl.textContent = readerEmail;
    }

    if (yearEl) {
      yearEl.textContent = unlockedEdition;
    }
  } else {
    if (loginPanel) {
      loginPanel.style.display = 'block';
    }

    if (readerPanel) {
      readerPanel.style.display = 'none';
    }
  }

  var signout =
    document.getElementById('ledger-signout');

  if (signout) {
    signout.onclick = function () {
      clearStored('haldenLedgerEdition');
      clearStored('haldenLedgerBook1Unlocked');
      clearStored('haldenLedgerBook2Unlocked');
      clearStored('haldenLedgerBook3Unlocked');
      clearStored('haldenLedgerReaderEmail');

      window.location.href = '/index.html';
    };
  }
};