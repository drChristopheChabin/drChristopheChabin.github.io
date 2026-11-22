/**
 * Routeur basé sur le hash de l'URL (#/modelcn, #/sandbox...).
 * Compatible GitHub Pages : aucune configuration serveur nécessaire.
 *
 * Chaque route fournit une fonction `create()` qui renvoie un contrôleur
 * exposant `mount()` et, optionnellement, `destroy()`.
 */
export class Router {
    #routes;
    #defaultPath;
    #outletSelector;
    #onRouteChange;
    #currentController = null;
    #currentRoute = null;

    /**
     * @param {Object} options
     * @param {Array<{path: string, title?: string, create: Function}>} options.routes
     * @param {string} options.defaultPath - Route utilisée si le hash est vide ou inconnu
     * @param {string} [options.outlet='#root'] - Conteneur vidé à chaque changement de route
     * @param {Function} [options.onRouteChange] - Appelé avec la route active
     */
    constructor({ routes, defaultPath, outlet = '#root', onRouteChange }) {
        this.#routes = routes;
        this.#defaultPath = defaultPath;
        this.#outletSelector = outlet;
        this.#onRouteChange = onRouteChange;
    }

    /**
     * Démarre l'écoute des changements d'URL et affiche la route courante
     */
    start() {
        window.addEventListener('hashchange', this.#resolve);
        this.#resolve();
    }

    /**
     * Navigue vers une route. Si c'est déjà la route courante, elle est rechargée.
     * @param {string} path - ex. '/sandbox'
     */
    navigate(path) {
        if (this.#currentPathFromHash() === path) {
            this.#resolve();
        } else {
            window.location.hash = path;
        }
    }

    get currentRoute() {
        return this.#currentRoute;
    }

    /**
     * Lit le chemin dans le hash, sans le '#' ni les éventuels paramètres '?...'
     */
    #currentPathFromHash() {
        return window.location.hash.slice(1).split('?')[0];
    }

    #resolve = () => {
        const path = this.#currentPathFromHash();
        const route = this.#routes.find(r => r.path === path);

        if (!route) {
            // Hash vide ou inconnu : redirection sans créer d'entrée dans l'historique
            // (déclenche un nouvel événement hashchange)
            window.location.replace(`#${this.#defaultPath}`);
            return;
        }

        // Arrêt propre de l'écran précédent
        this.#currentController?.destroy?.();

        const outlet = document.querySelector(this.#outletSelector);
        if (outlet) outlet.innerHTML = '';

        // Création et démarrage du nouvel écran
        this.#currentRoute = route;
        this.#currentController = route.create();
        this.#currentController.mount();

        if (route.title) document.title = `Site CN - ${route.title}`;
        this.#onRouteChange?.(route);
    }
}
