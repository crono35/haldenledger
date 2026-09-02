window.HALDEN_FEATURES = [
  {
    src: "/images/1/avelor.webp",
    alt: "Avelor Astronautics"
  },
  {
    src: "/images/1/lat9.webp",
    alt: "Nyvolis LAT-9"
  },
  {
    src: "/images/1/avelor2.webp",
    alt: "Avelor Commercial"
  },
  {
    src: "/images/1/themelion.webp",
    alt: "Themelion Base"
  },
  {
    src: "/images/1/ailabor.webp",
    alt: "AI Labor"
  }
];

window.pickHaldenFeatures = function(count) {
  var items = window.HALDEN_FEATURES.slice();

  for (var i = items.length - 1; i > 0; i--) {
    var j = Math.floor(Math.random() * (i + 1));
    var temp = items[i];
    items[i] = items[j];
    items[j] = temp;
  }

  return items.slice(0, Math.min(count, items.length));
};