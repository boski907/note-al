(async function initSharedNotePage() {
  const titleEl = document.getElementById("share-title");
  const metaEl = document.getElementById("share-meta");
  const contentEl = document.getElementById("share-content");
  if (!contentEl) return;

  contentEl.style.whiteSpace = "pre-wrap";

  const id = new URLSearchParams(window.location.search).get("id");
  if (!id) {
    contentEl.textContent = "Missing share id.";
    return;
  }

  try {
    const res = await fetch(`/api/share/${encodeURIComponent(id)}`);
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || "Not found");

    if (titleEl) titleEl.textContent = data.title || "Shared note";
    if (metaEl) metaEl.textContent = `Shared ${new Date(data.createdAt || Date.now()).toLocaleString()}`;

    if (data.contentText) {
      contentEl.textContent = String(data.contentText || "");
      return;
    }

    // Fallback for legacy entries that may only have HTML.
    if (data.contentHtml) {
      const scratch = document.createElement("div");
      scratch.innerHTML = String(data.contentHtml || "");
      contentEl.textContent = scratch.textContent || "";
      return;
    }

    contentEl.textContent = "";
  } catch (e) {
    contentEl.textContent = `Error: ${e instanceof Error ? e.message : "Failed to load shared note."}`;
  }
})();
