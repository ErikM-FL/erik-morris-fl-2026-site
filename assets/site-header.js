/* ===== Global Two-Line Header Injector =====
   Adds a consistent two-line header to every static page.
   - Top line: tagline (left) + two images (center) + Languages dropdown (right)
   - Bottom line: navigation links
*/

(function () {
  const containerId = "site-header";

  // ====== EDIT HERE: Your two-line header text (top line, left) ======
  // Paste the exact text you want displayed in the header bar:
  // Example from your request:
  // "Write‑in • Floridians First • For Florida Families & Future • Fix the Incentives"
  const TAGLINE_TEXT = "Write\u2011in \u2022 Floridians First \u2022 For Florida Families & Future \u2022 Fix the Incentives";

  // ====== EDIT HERE: Your navigation links (second line) ======
  // If you want me to fill these to match /pages/platform.html exactly, just reply
  // with the list and I’ll update this for you. For now, starting with two safe links:
  const NAV_LINKS = [
    { label: "Home", href: "/index.html" },
    { label: "Platform", href: "/pages/platform.html" }
    { label: "Voting a Write-In Candidate", href: "pages/how-to-write-in.html" }  
     // Add more links here (e.g., { label: "Contact", href: "/pages/contact.html" })
  ];

  // Languages dropdown -> to localized write-in pages (per your README pattern):
  // pages/how-to-write-in-<lang>.html for EN/ES/HT/ZH/VI/KO.
  // (If a file is missing, the browser 404 page will appear—tell me and I’ll adjust.) /* [1](https://github.com/ErikM-FL/erik-morris-fl-2026-site/blob/main/README.md) */
  const LANG_MAP = [
    { code: "label", label: "Translate this page" }, // first item (non-selectable)
    { code: "",     label: "Select Language", placeholder: true }, // keeps white label visible
    { code: "en",   label: "English", path: "/pages/how-to-write-in-en.html" },
    { code: "es",   label: "Español", path: "/pages/how-to-write-in-es.html" },
    { code: "ht",   label: "Kreyòl Ayisyen", path: "/pages/how-to-write-in-ht.html" },
    { code: "zh",   label: "中文", path: "/pages/how-to-write-in-zh.html" },
    { code: "vi",   label: "Tiếng Việt", path: "/pages/how-to-write-in-vi.html" },
    { code: "ko",   label: "한국어", path: "/pages/how-to-write-in-ko.html" }
  ];

  function buildLanguagesSelect() {
    const select = document.createElement("select");
    select.className = "site-header__lang-select";
    select.setAttribute("aria-label", "Languages");

    LANG_MAP.forEach(item => {
      const opt = document.createElement("option");
      opt.textContent = item.label;
      if (item.code === "label") {
        opt.disabled = true;
      } else if (item.placeholder) {
        opt.value = "";
        opt.selected = true;
        opt.hidden = true; // keeps “Select Language” showing when closed
      } else {
        opt.value = item.path || "";
      }
      select.appendChild(opt);
    });

    select.addEventListener("change", (e) => {
      const url = e.target.value;
      if (url) window.location.href = url;
    });

    return select;
  }

  function buildHeader() {
    const host = document.getElementById(containerId);
    if (!host) return;

    const wrapper = document.createElement("header");
    wrapper.className = "site-header";
    wrapper.innerHTML = `
      <div class="site-header__inner" role="navigation" aria-label="Site">
        <div class="site-header__top">
          <div class="site-header__tagline" id="site-tagline"></div>

          <div class="site-header__images" aria-hidden="false">
            <!-- Img 1: EMtest.png — placeholder you will replace later -->
            <img src="/assets/EMtest.png"
                 alt="Campaign image placeholder"
                 class="site-header__img"
                 onerror="this.style.display='none'">
            <!-- Img 2: write-in-ballot.gif — auto-scaled to be legible -->
            <img src="/assets/write-in-ballot.gif"
                 alt="Write-in ballot example"
                 class="site-header__img"
                 onerror="this.style.display='none'">
          </div>

          <div id="lang-slot"></div>
        </div>

        <div class="site-header__bottom site-header__nav" id="site-nav"></div>
      </div>
    `;

    host.replaceWith(wrapper);

    // Tagline text (kept separate to avoid HTML escaping issues)
    const tg = wrapper.querySelector("#site-tagline");
    tg.textContent = TAGLINE_TEXT;

    // Languages dropdown (top line, right)
    const langSlot = wrapper.querySelector("#lang-slot");
    langSlot.appendChild(buildLanguagesSelect());

    // Navigation links (second line)
    const nav = wrapper.querySelector("#site-nav");
    NAV_LINKS.forEach(({ label, href }) => {
      const a = document.createElement("a");
      a.href = href;
      a.textContent = label;
      nav.appendChild(a);
    });
  }

  // Run after DOM is ready
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", buildHeader);
  } else {
    buildHeader();
  }
})();
