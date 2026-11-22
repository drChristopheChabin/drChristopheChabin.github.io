import { Router } from './router/Router.js';
import { routes, DEFAULT_PATH } from './router/routes.js';
import { NavbarController } from './controllers/NavbarController.js';

let router;

const navbar = new NavbarController({
    routes,
    // Le logo recharge l'écran par défaut (nouveau modèle, formulaire vierge)
    onBrandClick: () => router.navigate(DEFAULT_PATH)
});

router = new Router({
    routes,
    defaultPath: DEFAULT_PATH,
    outlet: '#root',
    onRouteChange: route => navbar.setActive(route.path)
});

router.start();
