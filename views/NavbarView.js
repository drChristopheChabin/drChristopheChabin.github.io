export class NavbarView {
  constructor() {
    this.container = document.querySelector('.container');
  }

  render() {
    const navHTML = `
        <nav class="navbar navbar-expand-lg bg-dark navbar-dark mb-4">
          <div class="container-fluid">
            <a class="navbar-brand" href="#">
              <img src="./favicon.png" alt="favicon" width="32" height="32">
            </a>
            <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNavAltMarkup" aria-controls="navbarNavAltMarkup" aria-expanded="false" aria-label="Toggle navigation">
              <span class="navbar-toggler-icon"></span>
            </button>
            <div class="collapse navbar-collapse" id="navbarNavAltMarkup">
              <div class="navbar-nav">
                <a class="nav-link" href="readme.html" target="_blank" data-theme="readme">Documentation</a>
                <a class="nav-link active" href="#" data-theme="modelcn">Modélisation</a>
                <a class="nav-link" href="#" data-theme="sandbox">SandBox</a>
              </div>
            </div>
          </div>
        </nav>`;

    // Insérer au début du container
    this.container.insertAdjacentHTML('afterbegin', navHTML);
    this.nav = this.container.querySelector('nav');
  }

  bindThemeChange(handler) {
    this.nav.addEventListener('click', e => {
      const link = e.target.closest('.nav-link');
      if (!link || link.getAttribute('data-theme') === 'readme') return;

      e.preventDefault();

      // Masquer le menu collapse sur mobile après clic
      const navbarCollapse = this.nav.querySelector('.navbar-collapse');
      if (navbarCollapse.classList.contains('show')) {
        const bsCollapse = bootstrap.Collapse.getInstance(navbarCollapse);
        if (bsCollapse) bsCollapse.hide();
      }

      const theme = link.getAttribute('data-theme');
      this.#setActiveLink(link);
      handler(theme);
    });
  }

  bindBrandClick(handler) {
    const brand = this.nav.querySelector('.navbar-brand');
    if (brand) {
      brand.addEventListener('click', e => {
        e.preventDefault();
        handler();
      });
    }
  }

  #setActiveLink(activeLink) {
    this.nav.querySelectorAll('.nav-link').forEach(link => {
      link.classList.remove('active');
    });
    activeLink.classList.add('active');
  }
}
