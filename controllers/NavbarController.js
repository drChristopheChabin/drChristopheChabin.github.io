import { NavbarView } from '../views/NavbarView.js';

/**
 * Contrôleur de la barre de navigation.
 * Il ne choisit plus l'écran à afficher : c'est le rôle du routeur.
 */
export class NavbarController {
    /**
     * @param {Object} options
     * @param {Array} options.routes - Routes affichées dans le menu
     * @param {Function} options.onBrandClick - Action du clic sur le logo
     */
    constructor({ routes, onBrandClick }) {
        this.view = new NavbarView();
        this.view.render(routes);
        this.view.bindLinkClick();
        this.view.bindBrandClick(onBrandClick);
    }

    /**
     * Met en évidence le lien de la route active (appelé par le routeur)
     * @param {string} path
     */
    setActive(path) {
        this.view.setActiveLink(path);
    }
}
