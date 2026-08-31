document.addEventListener("DOMContentLoaded", async () => {
  const script = document.currentScript;
  const siteRoot = new URL("../", script.src);

  async function loadInclude(elementId, fileName) {
    const target = document.getElementById(elementId);

    if (!target) {
      console.error(`Could not find #${elementId}`);
      return;
    }

    try {
      const fileUrl = new URL(fileName, siteRoot);

      const response = await fetch(fileUrl);

      if (!response.ok) {
        throw new Error(
          `Could not load ${fileUrl.href} — HTTP ${response.status}`
        );
      }

      target.innerHTML = await response.text();
    } catch (error) {
      console.error(error);
      target.innerHTML = "";
    }
  }

  await Promise.all([
    loadInclude("site-header", "header.html"),
    loadInclude("site-footer", "footer.html")
  ]);
});
