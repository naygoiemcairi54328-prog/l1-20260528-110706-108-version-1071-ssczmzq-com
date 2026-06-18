(function () {
  function escapeHtml(value) {
    return String(value || "")
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#39;");
  }

  function card(movie) {
    var tags = (movie.tags || []).slice(0, 3).map(function (tag) {
      return "<span>" + escapeHtml(tag) + "</span>";
    }).join("");
    return [
      "<a class=\"movie-card\" href=\"" + escapeHtml(movie.url) + "\">",
      "<div class=\"poster-wrap\">",
      "<img src=\"" + escapeHtml(movie.cover) + "\" alt=\"" + escapeHtml(movie.title) + "\" loading=\"lazy\">",
      "<span class=\"card-badge\">" + escapeHtml(movie.type) + "</span>",
      "<span class=\"play-float\">▶</span>",
      "</div>",
      "<div class=\"movie-card-body\">",
      "<div class=\"meta-line\"><span>" + escapeHtml(movie.year) + "</span><span>" + escapeHtml(movie.region) + "</span><span>" + escapeHtml(movie.genre) + "</span></div>",
      "<h3>" + escapeHtml(movie.title) + "</h3>",
      "<p>" + escapeHtml(movie.oneLine) + "</p>",
      "<div class=\"tag-row\">" + tags + "</div>",
      "</div>",
      "</a>"
    ].join("");
  }

  function matches(movie, query) {
    if (!query) {
      return true;
    }
    var text = [
      movie.title,
      movie.region,
      movie.type,
      movie.year,
      movie.genre,
      movie.oneLine,
      (movie.tags || []).join(" "),
      movie.category
    ].join(" ").toLowerCase();
    return text.indexOf(query) !== -1;
  }

  function render() {
    var params = new URLSearchParams(window.location.search);
    var input = document.querySelector("[data-search-input]");
    var grid = document.querySelector("[data-search-results]");
    var empty = document.querySelector("[data-search-empty]");
    if (!grid || !window.catalogItems) {
      return;
    }
    var query = (input && input.value.trim() ? input.value.trim() : params.get("q") || "").toLowerCase();
    if (input && !input.value && params.get("q")) {
      input.value = params.get("q");
    }
    var results = window.catalogItems.filter(function (movie) {
      return matches(movie, query);
    }).slice(0, 240);
    grid.innerHTML = results.map(card).join("");
    if (empty) {
      empty.style.display = results.length ? "none" : "block";
    }
  }

  document.addEventListener("DOMContentLoaded", function () {
    var input = document.querySelector("[data-search-input]");
    var form = document.querySelector("[data-catalog-search]");
    if (form) {
      form.addEventListener("submit", function (event) {
        event.preventDefault();
        render();
      });
    }
    if (input) {
      input.addEventListener("input", render);
    }
    render();
  });
})();
