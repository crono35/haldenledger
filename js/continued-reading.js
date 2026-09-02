(function () {
  var mount = document.getElementById('continued-reading');

  if (!mount) {
    return;
  }

  fetch('/continued-reading.html?v=1')
    .then(function (response) {
      if (!response.ok) {
        throw new Error('Continued reading failed to load: ' + response.status);
      }

      return response.text();
    })
    .then(function (html) {
      mount.innerHTML = html;

      var currentPath = window.location.pathname.replace(/\/+$/, '');
      var cards = Array.prototype.slice.call(
        mount.querySelectorAll('.essential-reading-card')
      );

      cards.forEach(function (card) {
        var cardPath = (card.getAttribute('data-article-path') || '')
          .replace(/\/+$/, '');

        if (cardPath && cardPath === currentPath) {
          card.remove();
        }
      });

      cards = Array.prototype.slice.call(
        mount.querySelectorAll('.essential-reading-card')
      );

      cards.slice(3).forEach(function (card) {
        card.remove();
      });
    })
    .catch(function (error) {
      console.error(error);
    });
})();
