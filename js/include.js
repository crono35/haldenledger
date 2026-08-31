async function loadInclude(id, path) {
try {
const response = await fetch(path);

```
if (!response.ok) {
  throw new Error(`Failed to load ${path}: ${response.status}`);
}

const html = await response.text();
const target = document.getElementById(id);

if (target) {
  target.innerHTML = html;
}
```

} catch (error) {
console.error(error);
}
}

const path = window.location.pathname;
const isArticlePage = path.includes("/articles/");

const rootPrefix = isArticlePage ? "../" : "";

loadInclude("site-header", `${rootPrefix}header.html`);
loadInclude("site-footer", `${rootPrefix}footer.html`);
