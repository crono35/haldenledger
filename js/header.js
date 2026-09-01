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

    var sharedPages = [
      '/archive.html',
      '/archive',
      '/archive/',

      '/about.html',
      '/about',
      '/about/',

      '/journalists.html',
      '/journalists',
      '/journalists/',

      '/contact.html',
      '/contact',
      '/contact/',

      '/corrections.html',
      '/corrections',
      '/corrections/',

      '/privacy.html',
      '/privacy',
      '/privacy/'
    ];

    if (sharedPages.indexOf(path) !== -1) {
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
    return yearString === '2027'
      ? ''
      : '/' + yearString;
  }

  function setEditionAwareLinks(yearString) {
    var prefix = editionPrefix(yearString);

    var home =
      document.getElementById('ledger-home-link');

    var science =
      document.getElementById('ledger-nav-science');

    var industry =
      document.getElementById('ledger-nav-industry');

    var policy =
      document.getElementById('ledger-nav-policy');

    var world =
      document.getElementById('ledger-nav-world');

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
  }

  function renderReaderState() {
    var loginPanel =
      document.getElementById('ledger-login-panel');

    var readerPanel =
      document.getElementById('ledger-reader-panel');

    var emailEl =
      document.getElementById('ledger-reader-email');

    var yearEl =
      document.getElementById('ledger-reader-year');

    var email =
      getStored('haldenLedgerReaderEmail');

    var unlocked =
      getStored('haldenLedgerEdition');

    if (!loginPanel || !readerPanel) {
      return;
    }

    if (email && unlocked) {
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

  function updateFooterEdition(yearString) {
    var footerMount =
      document.getElementById('site-footer');

    if (
      !footerMount ||
      !footerMount.textContent.trim()
    ) {
      return false;
    }

    var walker = document.createTreeWalker(
      footerMount,
      NodeFilter.SHOW_TEXT,
      null
    );

    var node;
    var changed = false;

    var copyrightPattern =
      /(©\s*)20\d{2}(\s+The Halden Ledger)/;

    while ((node = walker.nextNode())) {
      if (
        copyrightPattern.test(
          node.nodeValue
        )
      ) {
        node.nodeValue =
          node.nodeValue.replace(
            copyrightPattern,
            '$1' + yearString + '$2'
          );

        changed = true;
      }
    }

    return changed;
  }

  function watchFooterEdition(yearString) {
    var footerMount =
      document.getElementById('site-footer');

    if (!footerMount) {
      return;
    }

    updateFooterEdition(yearString);

    if (
      footerMount.dataset
        .ledgerFooterWatch === 'true'
    ) {
      return;
    }

    footerMount.dataset
      .ledgerFooterWatch = 'true';

    var observer =
      new MutationObserver(function () {
        updateFooterEdition(yearString);
      });

    observer.observe(footerMount, {
      childList: true,
      subtree: true
    });
  }

  function unlockEdition(email, edition) {
    setStored(
      'haldenLedgerEdition',
      edition
    );

    setStored(
      'haldenLedgerReaderEmail',
      email
    );

    if (edition === '2031') {
      setStored(
        'haldenLedgerBook1Unlocked',
        'true'
      );
    }

    if (edition === '2036') {
      setStored(
        'haldenLedgerBook3Unlocked',
        'true'
      );
    }

    window.location.href =
      '/' + edition + '/index.html';
  }

  function initLedgerHeader() {
    var headerMount =
      document.getElementById('site-header');

    if (
      headerMount &&
      headerMount.dataset
        .ledgerHeaderInitialized === 'true'
    ) {
      watchFooterEdition(
        displayEdition()
      );

      return;
    }

    if (headerMount) {
      headerMount.dataset
        .ledgerHeaderInitialized = 'true';
    }

    var currentEdition =
      displayEdition();

    var dateEl =
      document.getElementById(
        'ledger-edition-date'
      );

    if (dateEl) {
      dateEl.textContent =
        formatEditionDate(
          currentEdition
        );
    }

    setEditionAwareLinks(
      currentEdition
    );

    renderReaderState();

    watchFooterEdition(
      currentEdition
    );

    var loginForm =
      document.querySelector(
        '.header-login'
      );

    var status =
      document.getElementById(
        'ledger-login-status'
      );

    if (loginForm) {
      loginForm.addEventListener(
        'submit',
        function (event) {
          event.preventDefault();

          var emailInput =
            loginForm.querySelector(
              '[name=email]'
            );

          var codeInput =
            loginForm.querySelector(
              '[name=password]'
            );

          var email = emailInput
            ? emailInput.value.trim()
            : '';

          var code = codeInput
            ? codeInput.value.trim()
            : '';

          if (!email) {
            if (status) {
              status.textContent =
                'Enter your email address.';

              status.style.color =
                '#7a1111';
            }

            return;
          }

          if (code === 'MIDNIGHT31') {
            unlockEdition(
              email,
              '2031'
            );

            return;
          }

          if (code === 'VALLUM36') {
            unlockEdition(
              email,
              '2036'
            );

            return;
          }

          if (status) {
            status.textContent =
              'Incorrect access code.';

            status.style.color =
              '#7a1111';
          }
        }
      );
    }

    var stayButton =
      document.getElementById(
        'ledger-stay-current'
      );

    if (stayButton) {
      stayButton.addEventListener(
        'click',
        function () {
          var modal =
            document.getElementById(
              'ledger-unlock-modal'
            );

          if (modal) {
            modal.style.display =
              'none';
          }
        }
      );
    }

    var unlockButton =
      document.getElementById(
        'ledger-confirm-unlock'
      );

    if (unlockButton) {
      unlockButton.addEventListener(
        'click',
        function () {
          var unlockEmail =
            document.getElementById(
              'ledger-unlock-email'
            );

          var email = unlockEmail
            ? unlockEmail.textContent.trim()
            : '';

          unlockEdition(
            email,
            '2031'
          );
        }
      );
    }

    var signout =
      document.getElementById(
        'ledger-signout'
      );

    if (signout) {
      signout.addEventListener(
        'click',
        function () {
          clearStored(
            'haldenLedgerEdition'
          );

          clearStored(
            'haldenLedgerBook1Unlocked'
          );

          clearStored(
            'haldenLedgerBook3Unlocked'
          );

          clearStored(
            'haldenLedgerReaderEmail'
          );

          window.location.href =
            '/index.html';
        }
      );
    }
  }

  window.initLedgerHeader =
    initLedgerHeader;

  if (
    document.readyState === 'loading'
  ) {
    document.addEventListener(
      'DOMContentLoaded',
      function () {
        if (
          document.getElementById(
            'site-header'
          )
        ) {
          initLedgerHeader();
        }
      }
    );
  } else if (
    document.getElementById(
      'site-header'
    )
  ) {
    initLedgerHeader();
  }
})();