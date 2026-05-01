
import { EventHandler } from './EventHandler.js';
export class CnController {
    constructor(model, view) {
        this.model = model
        this.view = view
        this.eventHandler = new EventHandler();
        this.init()
    }
    init() {
        this.view.generate_form();
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
        } else {
            console.error('Formulaire non disponible pour lier les événements');
        }
    }
    /**
     * Gestionnaire de réinitialisation du formulaire
     */
    handleFormReset = () => {
        this.model.reset();
        this.view.clearResults();
        this.eventHandler.resetIteration();
    }
    /**
     * Gestionnaire de soumission du formulaire
     * @param {NodeList} inputs - Liste des inputs du formulaire
     * @param {number} iteration - Numéro d'itération
     */
    handleFormSubmit = (inputs, iteration) => {
        this.model.loadParam(inputs, iteration);

        this.view.clearResults();

        const results = {
            agents: this.model.getOperationsAgents,
            comptes: this.model.getOperationsComptes,
            operations: this.model.getLesOperations,
            operationTypes: this.model.getLesTypes
        };

        this.view.displayResults(results);
    }
    /**
     * Nettoie les ressources
     */
    destroy() {
        this.eventHandler.clear();
    }
}

