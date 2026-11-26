/**
 * Contrôleur de base : cycle de vie commun utilisé par le routeur
 * (mount / destroy) et gestion standard du formulaire.
 */
export class BaseController {
    /**
     * Étape courante du mode « Pas à pas » (-1 = calcul complet)
     */
    iteration = -1;

    /**
     * Empreinte des paramètres du dernier envoi (détecte un changement de cycle ou de montants)
     */
    lastSignature = null;

    /**
     * @param {Model} model
     * @param {View} view
     */
    constructor(model, view) {
        this.model = model;
        this.view = view;
    }

    /**
     * Appelé par le routeur quand l'écran devient actif
     */
    mount() {
        this.render();
        this.view.bindForm(this.handleFormSubmit, this.handleFormReset);
    }

    /**
     * Génère le formulaire de l'écran — à implémenter dans les classes filles
     */
    render() {
        throw new Error(`${this.constructor.name} doit implémenter render()`);
    }

    /**
     * Gestionnaire de soumission du formulaire
     * @param {NodeList} inputs - Liste des inputs du formulaire
     * @param {string} action - Id du bouton cliqué ('envoyer' ou 'pasApas')
     */
    handleFormSubmit = (inputs, action) => {
        const signature = this.#signature(inputs);

        if (action === 'envoyer') {
            this.iteration = -1;
        } else if (action === 'pasApas') {
            // Paramètres (cycle, montants…) modifiés depuis l'étape précédente :
            // on recommence le pas à pas à zéro, sinon les opérations du nouveau
            // cycle s'empilent sur les soldes de l'ancien.
            this.iteration = signature === this.lastSignature ? this.iteration + 1 : 0;
        }
        this.lastSignature = signature;

        this.model.loadParam(inputs, this.iteration);

        // Fin du pas à pas atteinte : le modèle repasse en mode complet,
        // le prochain clic sur « Pas à pas » redémarrera à l'étape 0.
        if (this.model.getIteration === -1) {
            this.iteration = -1;
        }
        this.view.clearResults();
        this.view.displayResults(this.collectResults());
    }

    /**
     * Gestionnaire de réinitialisation du formulaire
     */
    handleFormReset = () => {
        this.model.reset();
        this.view.clearResults();
        this.iteration = -1;
        this.lastSignature = null;
    }

    /**
     * Empreinte des valeurs du formulaire, pour détecter un changement de paramètres
     * @param {NodeList} inputs
     * @returns {string}
     */
    #signature(inputs) {
        return Array.from(inputs)
            .map(i => `${i.name || i.id}=${i.type === 'checkbox' ? i.checked : i.value}`)
            .join('&');
    }

    /**
     * Rassemble les résultats du modèle pour la vue
     */
    collectResults() {
        return {
            agents: this.model.getOperationsAgents,
            comptes: this.model.getOperationsComptes,
            balancePaiements: this.model.getBalancePaiements,
            operations: this.model.getLesOperations,
            operationTypes: this.model.getLesTypes
        };
    }

    /**
     * Appelé par le routeur quand on quitte l'écran.
     * Les écouteurs du formulaire disparaissent avec le DOM vidé par le routeur.
     */
    destroy() {
        this.iteration = -1;
    }
}
