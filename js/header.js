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
    return match ? match[1] : '';
  }

  function editionFromQuery() {
    try {
      var params = new URLSearchParams(window.location.search);
      var edition = params.get('edition') || '';
      return /^20\d{2}$/.test(edition) ? edition : '';
    } catch (e) {
      return '';
    }
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
    return yearString === '2027' ? '' : '/' + yearString;
  }

  function utilityHref(path, yearString) {
    return yearString === '2027'
      ? path
      : path + '?edition=' + encodeURIComponent(yearString);
  }

  var pathEdition = editionFromPath();
  var queryEdition = editionFromQuery();
  var unlockedEdition = getStored('haldenLedgerEdition');
  var readerEmail = getStored('haldenLedgerReaderEmail');

  /*
    Edition context rules:
    - A dated path such as /2031/ always controls.
    - Utility pages can carry ?edition=2031 so they stay in that edition.
    - Archive follows the reader's highest unlocked edition.
    - Otherwise the site defaults to 2027.
  */
  var displayEdition =
    pathEdition ||
    queryEdition ||
    (isArchivePage() && unlockedEdition) ||
    '2027';

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

  var loginPanel = document.getElementById('ledger-login-panel');
  var readerPanel = document.getElementById('ledger-reader-panel');
  var emailEl = document.getElementById('ledger-reader-email');
  var yearEl = document.getElementById('ledger-reader-year');

  var isLoggedIn = readerEmail && unlockedEdition;

  if (isLoggedIn) {
    if (loginPanel) loginPanel.style.display = 'none';
    if (readerPanel) readerPanel.style.display = 'flex';
    if (emailEl) emailEl.textContent = readerEmail;
    if (yearEl) yearEl.textContent = unlockedEdition;
  } else {
    if (loginPanel) loginPanel.style.display = 'block';
    if (readerPanel) readerPanel.style.display = 'none';
  }

  function updateFooter() {
    var footerYear = document.getElementById('ledger-footer-year');
    var about = document.getElementById('ledger-footer-about');
    var contact = document.getElementById('ledger-footer-contact');
    var corrections = document.getElementById('ledger-footer-corrections');
    var privacy = document.getElementById('ledger-footer-privacy');
    var archive = document.getElementById('ledger-footer-archive');

    if (!footerYear) return false;

    footerYear.textContent = displayEdition;

    if (about) about.href = utilityHref('/about.html', displayEdition);
    if (contact) contact.href = utilityHref('/contact.html', displayEdition);
    if (corrections) corrections.href = utilityHref('/corrections.html', displayEdition);
    if (privacy) privacy.href = utilityHref('/privacy.html', displayEdition);
    if (archive) archive.href = '/archive.html';

    return true;
  }

  if (!updateFooter()) {
    var observer = new MutationObserver(function() {
      if (updateFooter()) {
        observer.disconnect();
      }
    });

    observer.observe(document.body, {
      childList: true,
      subtree: true
    });
  }

  var signout = document.getElementById('ledger-signout');

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
