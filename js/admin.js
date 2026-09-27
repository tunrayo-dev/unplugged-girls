/* =========================================================
   GIRLS UNPLUGGED
   ADMIN / CONTENT MANAGEMENT JAVASCRIPT
   ========================================================= */

document.addEventListener("DOMContentLoaded", () => {
  initAdminPage();
});


/* =========================================================
   INITIALISE ADMIN PAGE
   ========================================================= */

function initAdminPage() {
  const data = window.GirlsUnpluggedData;

  if (!data) {
    return;
  }

  renderAdminOverview(data);
  renderCommunityData(data);
  renderTeamData(data);
  renderSpeakerData(data);
  renderResourceData(data);
  initExportData(data);
  initResetNotice();
}


/* =========================================================
   OVERVIEW
   ========================================================= */

function renderAdminOverview(data) {
  const container = document.querySelector("[data-admin-overview]");

  if (!container || !data.statistics) {
    return;
  }

  const statistics = Object.values(data.statistics);

  container.innerHTML = statistics
    .map((statistic) => {
      return `
        <article class="admin-stat-card">
          <span class="admin-stat-value">
            ${escapeAdminHtml(statistic.value)}${escapeAdminHtml(
              statistic.suffix || ""
            )}
          </span>

          <span class="admin-stat-label">
            ${escapeAdminHtml(statistic.label)}
          </span>
        </article>
      `;
    })
    .join("");
}


/* =========================================================
   COMMUNITY DATA
   ========================================================= */

function renderCommunityData(data) {
  const container = document.querySelector("[data-admin-community]");

  if (!container || !data.community) {
    return;
  }

  const countries = data.community.countries || [];

  container.innerHTML = `
    <div class="admin-field">
      <label for="admin-bloomies">Current Bloomies</label>
      <input
        id="admin-bloomies"
        type="number"
        value="${escapeAdminHtml(data.community.bloomies)}"
        readonly
      />
      <small>
        Update this value in <strong>js/data.js</strong>.
      </small>
    </div>

    <div class="admin-field">
      <label>Countries represented</label>

      <div class="admin-tag-list">
        ${countries
          .map(
            (country) => `
              <span class="admin-tag">
                ${escapeAdminHtml(country)}
              </span>
            `
          )
          .join("")}
      </div>

      <small>
        Update countries in <strong>js/data.js</strong>.
      </small>
    </div>
  `;
}


/* =========================================================
   TEAM
   ========================================================= */

function renderTeamData(data) {
  const container = document.querySelector("[data-admin-team]");

  if (!container || !Array.isArray(data.team)) {
    return;
  }

  container.innerHTML = data.team
    .map((member) => {
      const isOpen = member.status === "open";

      return `
        <article class="admin-list-item">
          <div>
            <strong>
              ${
                member.name
                  ? escapeAdminHtml(member.name)
                  : "Position currently open"
              }
            </strong>

            <span>
              ${escapeAdminHtml(member.role)}
            </span>
          </div>

          <span class="admin-status ${
            isOpen ? "is-open" : "is-filled"
          }">
            ${isOpen ? "Open" : "Filled"}
          </span>
        </article>
      `;
    })
    .join("");
}


/* =========================================================
   SPEAKERS
   ========================================================= */

function renderSpeakerData(data) {
  const container = document.querySelector("[data-admin-speakers]");

  if (!container || !Array.isArray(data.speakerSessions)) {
    return;
  }

  container.innerHTML = data.speakerSessions
    .map((session) => {
      return `
        <article class="admin-list-item admin-speaker-item">
          <div>
            <strong>
              ${escapeAdminHtml(session.month)}
            </strong>

            <span>
              ${session.speakers
                .map((speaker) => escapeAdminHtml(speaker))
                .join(", ")}
            </span>
          </div>

          <span class="admin-status is-filled">
            ${session.speakers.length}
            ${
              session.speakers.length === 1
                ? "speaker"
                : "speakers"
            }
          </span>
        </article>
      `;
    })
    .join("");
}


/* =========================================================
   RESOURCES
   ========================================================= */

function renderResourceData(data) {
  const container = document.querySelector("[data-admin-resources]");

  if (!container || !Array.isArray(data.trustedResources)) {
    return;
  }

  container.innerHTML = data.trustedResources
    .map((resource) => {
      return `
        <article class="admin-list-item">
          <div>
            <strong>
              ${escapeAdminHtml(resource.name)}
            </strong>

            <span>
              ${escapeAdminHtml(resource.category)}
            </span>
          </div>

          <a
            href="${escapeAdminHtml(resource.url)}"
            target="_blank"
            rel="noopener noreferrer"
          >
            Visit
          </a>
        </article>
      `;
    })
    .join("");
}


/* =========================================================
   EXPORT CURRENT DATA
   ========================================================= */

function initExportData(data) {
  const exportButton = document.querySelector(
    "[data-admin-export]"
  );

  if (!exportButton) {
    return;
  }

  exportButton.addEventListener("click", () => {
    const dataCopy = JSON.parse(JSON.stringify(data));

    const fileContents =
      "const GirlsUnpluggedData = " +
      JSON.stringify(dataCopy, null, 2) +
      ";\n\nwindow.GirlsUnpluggedData = GirlsUnpluggedData;\n";

    const blob = new Blob(
      [fileContents],
      {
        type: "application/javascript"
      }
    );

    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");

    link.href = url;
    link.download = "data.js";

    document.body.appendChild(link);
    link.click();
    link.remove();

    URL.revokeObjectURL(url);
  });
}


/* =========================================================
   STATIC SITE NOTICE
   ========================================================= */

function initResetNotice() {
  const buttons = document.querySelectorAll(
    "[data-admin-save]"
  );

  buttons.forEach((button) => {
    button.addEventListener("click", () => {
      showAdminNotice(
        "This website is currently a static site. Changes cannot be securely saved to GitHub from the browser. Update js/data.js and upload the revised file to your repository."
      );
    });
  });
}


/* =========================================================
   ADMIN NOTICE
   ========================================================= */

function showAdminNotice(message) {
  let notice = document.querySelector(
    "[data-admin-notice]"
  );

  if (!notice) {
    notice = document.createElement("div");

    notice.className = "admin-notice";
    notice.setAttribute("data-admin-notice", "");

    document.body.appendChild(notice);
  }

  notice.textContent = message;
  notice.classList.add("is-visible");

  window.clearTimeout(
    showAdminNotice.timeout
  );

  showAdminNotice.timeout = window.setTimeout(() => {
    notice.classList.remove("is-visible");
  }, 7000);
}


/* =========================================================
   HTML ESCAPING
   ========================================================= */

function escapeAdminHtml(value) {
  if (value === null || value === undefined) {
    return "";
  }

  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}