import { NavbarView } from '../views/NavbarView.js';
import { Model } from '../Model.js';
import { View } from '../views/View.js';
import { CnView } from '../views/CnView.js';
import { CnController } from './CnController.js';
import { SandBoxController } from './SandBoxController.js';
import { SandBoxView } from '../views/SandBoxView.js';

export class NavbarController {
    constructor() {
        this.navbarView = new NavbarView();
        this.init();
    }

    init() {
        // Rendre la navbar
        this.navbarView.render();

        // Lier les événements de la navbar
        this.navbarView.bindThemeChange(this.handleThemeChange);
        this.navbarView.bindBrandClick(this.handleReset);

        // Initialisation par défaut (Modélisation)
        this.handleThemeChange('modelcn');
    }

    handleReset = () => {
        window.location.reload();
    }

    handleThemeChange = (theme) => {
        console.log(`Changement de thème/mode : ${theme}`);

        // Nettoyage systématique du root avant de changer de mode
        const root = document.querySelector('#root');
        if (root) root.innerHTML = '';

        if (theme === 'modelcn') {
            // Initialiser le MVC principal (Modélisation)
            this.model = new Model();
            this.view = new CnView(); // Utilisation de CnView
            this.mainController = new CnController(this.model, this.view);
        } else if (theme === 'sandbox') {
            // Initialiser le mode SandBox
            this.model = new Model();
            this.view = new SandBoxView(); // Utilisation de SandBoxView
            this.sandboxController = new SandBoxController(this.model, this.view);
            this.sandboxController.init();
        }
    }
}
