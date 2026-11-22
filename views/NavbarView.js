export class NavbarView {
  constructor() {
    this.container = document.querySelector('.container');
  }

  /**
   * Affiche la navbar ; les liens sont générés à partir des routes
   * @param {Array<{path: string, title: string}>} routes
   */
  render(routes) {
    const links = routes
      .map(r => `<a class="nav-link" href="#${r.path}" data-path="${r.path}">${r.title}</a>`)
      .join('\n                ');

    const navHTML = `
        <nav class="navbar navbar-expand-lg bg-dark navbar-dark mb-4">
          <div class="container-fluid">
            <a class="navbar-brand" href="#${routes[0]?.path ?? ''}">
              <img src="./assets/favicon.png" alt="favicon" width="32" height="32">
            </a>
            <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNavAltMarkup" aria-controls="navbarNavAltMarkup" aria-expanded="false" aria-label="Toggle navigation">
              <span class="navbar-toggler-icon"></span>
            </button>
            <div class="collapse navbar-collapse" id="navbarNavAltMarkup">
              <div class="navbar-nav">
                <a class="nav-link" href="docs/readme.html" target="_blank">Documentation</a>
                ${links}
              </div>
            </div>
          </div>
        </nav>`;

    // Insérer au début du container
    this.container.insertAdjacentHTML('afterbegin', navHTML);
    this.nav = this.container.querySelector('nav');
  }

  /**
   * Ferme le menu replié (mobile) après un clic sur un lien.
   * La navigation elle-même est faite par le navigateur (changement de hash).
   */
  bindLinkClick() {
    this.nav.addEventListener('click', e => {
      if (!e.target.closest('.nav-link')) return;
      this.#closeCollapse();
    });
  }

  bindBrandClick(handler) {
    const brand = this.nav.querySelector('.navbar-brand');
    if (brand && handler) {
      brand.addEventListener('click', e => {
        e.preventDefault();
        this.#closeCollapse();
        handler();
      });
    }
  }

  /**
   * @param {string} path - Chemin de la route active
   */
  setActiveLink(path) {
    this.nav.querySelectorAll('.nav-link[data-path]').forEach(link => {
      const isActive = link.dataset.path === path;
      link.classList.toggle('active', isActive);
      if (isActive) link.setAttribute('aria-current', 'page');
      else link.removeAttribute('aria-current');
    });
  }

  #closeCollapse() {
    const navbarCollapse = this.nav.querySelector('.navbar-collapse');
    if (navbarCollapse?.classList.contains('show') && window.bootstrap) {
      window.bootstrap.Collapse.getInstance(navbarCollapse)?.hide();
    }
  }
}
