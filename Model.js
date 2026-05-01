import { Operation } from './metier/Operation.js';
import { ComptaNat } from './metier/ComptaNat.js';
import { CnFramework } from './metier/CnFramework.js';
import { SandBoxFramework } from './metier/SandBoxFramework.js';
import { EventHandler } from './controllers/EventHandler.js';

/**
 * @property {Object} #operation
 * @property {Object} #staticList
 * @property {Object} #agentsList
 * @property {Object} model
 * @property {Object} #lesOperations
 */
export class Model {
    #operation;
    #agentsList;
    #staticList;
    #lesOperations;
    #params;
    #onFormValidate;

    constructor() {
        this.#operation = new Operation();
        this.#agentsList = this.#operation.getAgents;
        this.#staticList = new ComptaNat();
        this.#lesOperations = [];
        this.model = null;
        this.eventHandler = new EventHandler();

        // Paramètres par défaut
        this.#params = {
            mtE1: 0,
            mtE2: 0,
            txProfit: 0,
            mtAmortit: 0,
            xport: 0,
            mport: 0,
            mInter: false,
            mode: 'modelcn'
        };
        // Callbacks
        this.#onFormValidate = null;
    }

    /**
     * Réinitialise l'état du modèle
     */
    reset() {
        this.#operation = new Operation();
        this.#agentsList = this.#operation.getAgents;
        this.#staticList = new ComptaNat();
        this.#lesOperations = [];
        const currentMode = this.#params.mode;
        this.#params = {
            mtE1: 0,
            mtE2: 0,
            txProfit: 0,
            mtAmortit: 0,
            xport: 0,
            mport: 0,
            mInter: false,
            mode: currentMode
        };
        this.eventHandler.iteration = -1;
    }

    /**
     * Lie le callback de validation du formulaire
     * @param {Function} callback - Fonction à appeler après validation
     */
    bindFormValidate(callback) {
        this.#onFormValidate = callback;
    }

    /**
     * Charge les paramètres depuis le formulaire
     * @param {NodeList} param - Liste des inputs du formulaire
     * @param {number} iteration - Numéro d'itération
     * @param {string} mode - Mode de fonctionnement ('modelcn' ou 'sandbox')
     */
    loadParam(param, iteration, mode = 'modelcn') {
        console.log(`Model: loadParam (itération=${iteration}, mode=${mode})`, param);

        this.eventHandler.iteration = iteration;
        this.#params.mode = mode;

        // Extraction des valeurs
        if (param instanceof NodeList || Array.isArray(param)) {
            // Cas d'une liste d'inputs HTML
            for (let i = 0; i < param.length; i++) {
                const input = param[i];
                const { name, value, checked, type } = input;
                const key = name || input.id;

                if (type === 'checkbox') {
                    this.#params[key] = checked;
                } else if (key in this.#params) {
                    this.#params[key] = parseInt(value, 10) || 0;
                }
            }
        } else if (typeof param === 'object' && param !== null) {
            // Cas d'un objet de données (ex: Sandbox)
            for (const key in param) {
                const value = param[key];
                if (mode === 'sandbox') {
                    // En mode Sandbox, on accepte toutes les clés (pour les sélections d'opérations)
                    this.#params[key] = value;
                } else if (key in this.#params) {
                    this.#params[key] = value;
                }
            }
        }

        // Validation du bilan
        if (this.eventHandler.iteration === -1) {
            this.#validerBilan();
        } else {
            this.#validerBilanPasApas();
        }

        if (this.#params.mode !== 'sandbox') {
            this.#operationInterbancaireCentrale();
        }

        // Déclencher l'événement de validation
        this.#triggerFormValidate();
    }

    /**
     * Déclenche le callback de validation
     * @private
     */
    #triggerFormValidate() {
        if (this.#onFormValidate) {
            this.#onFormValidate();
        }

        const handler = this.eventHandler.get('formValidated');
        if (handler && handler !== this.#onFormValidate) {
            handler();
        }
    }

    /**
     * Charge le framework avec les paramètres actuels
     * @returns {Array} Liste des opérations
     */
    #loadFramework() {
        if (this.#params.mode === 'sandbox') {
            console.log("appel:Load Framework (Sandbox) avec params:", this.#params);
            this.model = new SandBoxFramework(this.#params, this.#operation);
        } else {
            const { mtE1, mtE2, txProfit, mtAmortit, xport, mport, mInter } = this.#params;
            this.model = new CnFramework(mtE1, mtE2, txProfit, mtAmortit, xport, mport, mInter);
        }

        this.#lesOperations = this.model.getListComplete();
        console.log("opérations générées:", this.#lesOperations);
        return this.#lesOperations;
    }

    /**
     * Exécute une opération
     * @param {string} operation - Nom de l'opération
     * @param {Object} acheteur - Agent acheteur
     * @param {Object} vendeur - Agent vendeur
     * @param {number} montant - Montant de l'opération
     */
    #validerOperation(operation, acheteur, vendeur, montant) {
        if (typeof this.#operation[operation] === 'function') {
            this.#operation[operation](acheteur, vendeur, montant);
        }
    }

    /**
     * Valide toutes les opérations du bilan
     */
    #validerBilan() {
        const lesOperations = this.#loadFramework();

        lesOperations.forEach(uneOperation => {
            const acheteur = this.#operation.find(uneOperation.acheteur);
            const vendeur = this.#operation.find(uneOperation.vendeur);

            this.#validerOperation(
                uneOperation.operation,
                acheteur,
                vendeur,
                uneOperation.montant
            );
        });

        if (this.#params.mode === 'sandbox') {
            this.model.logBalances(this.#operation);
        }
    }

    /**
     * Valide les opérations pas à pas
     */
    #validerBilanPasApas() {
        const lesOperations = this.#loadFramework();

        if (this.eventHandler.iteration < lesOperations.length) {
            const uneOperation = lesOperations[this.eventHandler.iteration];
            const acheteur = this.#operation.find(uneOperation.acheteur);
            const vendeur = this.#operation.find(uneOperation.vendeur);

            this.#validerOperation(
                uneOperation.operation,
                acheteur,
                vendeur,
                uneOperation.montant
            );

            if (this.#params.mode === 'sandbox') {
                this.model.logBalances(this.#operation);
            }
        } else {
            this.eventHandler.iteration = -1;
        }
    }

    /**
     * Retourne la liste des opérations jusqu'à l'itération actuelle
     * @returns {Array} Liste des opérations
     */
    #listOperationPasApas() {
        return this.#lesOperations.slice(0, this.eventHandler.iteration + 1);
    }

    /**
     * Gère les opérations interbancaires avec la banque centrale
     */
    #operationInterbancaireCentrale() {
        const banque = this.#operation.find('B');
        const montant = banque.getBCpassif - banque.getBCactif;

        if (montant <= 0) return;

        if (!this.#params.mInter) {
            const acheteur = this.#operation.find('Rdm');
            const vendeur = this.#operation.find('E3');
            this.#validerOperation('Paiement', acheteur, vendeur, montant);
        } else {
            const acheteur = this.#operation.find('E1');
            this.#validerOperation('ReEscompte', acheteur, 'BC', montant);
        }
    }

    /**
     * Affiche les opérations dans la console (debug)
     */
    afficherOperation() {
        this.#agentsList.forEach(agent => {
            console.log(`Le nom : ${agent.getNom}`);
            console.log('Actif:', agent.getactif);
            console.log('Passif:', agent.getpassif);
        });
    }

    get getOperationsAgents() {
        return this.#agentsList;
    }

    get getOperationsComptes() {
        return this.#operation.getCN;
    }

    get getLesOperations() {
        return this.eventHandler.iteration === -1
            ? this.#lesOperations
            : this.#listOperationPasApas();
    }

    get getLesTypes() {
        return this.model.getTypes;
    }
}
