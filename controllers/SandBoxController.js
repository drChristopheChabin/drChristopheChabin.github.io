import { OperationType } from '../metier/Constants.js';
import { EventHandler } from './EventHandler.js';

export class SandBoxController {

    /**
     * @param {Model} model - L'instance du modèle de données.
     * @param {SandBoxView} view - L'instance de la vue sandbox.
     */
    constructor(model, view) {
        this.model = model;
        this.view = view;
        this.eventHandler = new EventHandler();
    }

    /**
     * Initialise le contrôleur Sandbox
     */
    init() {
        this.view.generateForm(OperationType);
        this.setupFormListeners();
    }

    /**
     * Configure les écouteurs d'événements du formulaire
     */
    setupFormListeners() {
        if (this.view.form) {
            this.eventHandler.bindFormEvents(
                this.view.form,
                this.handleFormSubmit,
                this.handleFormReset
            );
        }
    }

    /**
     * Gestionnaire de soumission du formulaire
     * @param {NodeList} inputs - Liste des inputs du formulaire
     * @param {number} iteration - Numéro d'itération
     */
    handleFormSubmit = (inputs, iteration) => {
        this.model.loadParam(inputs, iteration, 'sandbox');

        // Nettoyage des anciennes tables avant l'affichage
        this.view.clearResults();

        // Récupération des résultats via les getters du modèle
        const results = {
            agents: this.model.getOperationsAgents,
            comptes: this.model.getOperationsComptes,
            operations: this.model.getLesOperations,
            operationTypes: this.model.getLesTypes
        };

        // Mise à jour de la vue
        this.view.displayResults(results);
    }

    /**
     * Gestionnaire de réinitialisation du formulaire
     */
    handleFormReset = () => {
        this.handleReset();
    }

    /**
     * Réinitialise les données et l'affichage pour le mode Sandbox.
     */
    handleReset() {
        console.log("SandboxController: Réinitialisation");
        this.model.reset();
        this.view.clearResults();
        this.view.displayResults({}); // Vide les tableaux de résultats
        if (this.view.form) {
            this.view.form.reset();
        }
    }
}
