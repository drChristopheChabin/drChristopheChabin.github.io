import { Operation } from './metier/Operation.js';
import { ComptaNat } from './metier/ComptaNat.js';
import { CnFramework } from './metier/CnFramework.js';
import { SandBoxFramework } from './metier/SandBoxFramework.js';

/**
 * Cycles affichables seuls (mode 'cycles') : clé du formulaire → méthode de CnFramework
 */
const CYCLE_METHODS = {
    profit: 'getListProfit',
    invest: 'getListInvest',
    amort: 'getListAmort',
    xstd: 'getListInternat'
};

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
    #iteration;
    /** Mode 'cycles' : opérations des cycles précédents, conservées jusqu'au RAZ */
    #historique = [];
    /** Mode 'cycles' : cycle actuellement affiché */
    #cycleCourant = null;

    /**
     * @param {string} mode - Mode de fonctionnement fourni par la route ('modelcn' ou 'sandbox')
     */
    constructor(mode = 'modelcn') {
        this.#operation = new Operation();
        this.#agentsList = this.#operation.getAgents;
        this.#staticList = new ComptaNat();
        this.#lesOperations = [];
        this.model = null;
        this.#iteration = -1;

        // Paramètres par défaut
        this.#params = {
            mtE1: 0,
            mtE2: 0,
            txProfit: 0,
            mtAmortit: 0,
            xport: 0,
            mport: 0,
            mInter: false,
            cycle: 'profit',
            mode
        };
        // Callbacks
        this.#onFormValidate = null;
    }

    /**
     * Réinitialise l'état du modèle
     */
    reset() {
        this.#resetState();
        const currentMode = this.#params.mode;
        this.#params = {
            mtE1: 0,
            mtE2: 0,
            txProfit: 0,
            mtAmortit: 0,
            xport: 0,
            mport: 0,
            mInter: false,
            cycle: 'profit',
            mode: currentMode
        };
        this.#iteration = -1;
        this.#historique = [];
        this.#cycleCourant = null;
    }

    /**
     * Repart de bilans vierges (agents, TEE, TOF) sans toucher aux paramètres.
     * Indispensable avant un recalcul complet : sinon les opérations sont
     * rejouées par-dessus les soldes du calcul précédent.
     * @private
     */
    #resetState() {
        this.#operation = new Operation();
        this.#agentsList = this.#operation.getAgents;
        this.#staticList = new ComptaNat();
        this.#lesOperations = [];
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
     * @param {number} iteration - Numéro d'itération (-1 = calcul complet)
     */
    loadParam(param, iteration = -1) {
        const mode = this.#params.mode;
        // Opérations du cycle affiché jusqu'ici (avant prise en compte du nouvel envoi)
        const operationsPrecedentes = this.#operationsCourantes();
        this.#iteration = iteration;

        // Calcul complet ou 1re étape du pas à pas : on repart de zéro
        // (en mode 'cycles', tout est rejoué à chaque envoi, cf. #validerCycles)
        if (iteration <= 0 || mode === 'cycles') {
            this.#resetState();
        }

        // Extraction des valeurs
        if (param instanceof NodeList || Array.isArray(param)) {
            // Cas d'une liste d'inputs HTML
            for (let i = 0; i < param.length; i++) {
                const input = param[i];
                const { name, value, checked, type } = input;
                const key = name || input.id;

                if (type === 'checkbox') {
                    this.#params[key] = checked;
                } else if (type === 'select-one') {
                    this.#params[key] = value;
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
        if (mode === 'cycles') {
            // Changement de cycle : le cycle précédent passe dans l'historique
            if (this.#cycleCourant !== null && this.#params.cycle !== this.#cycleCourant) {
                this.#historique.push(...operationsPrecedentes);
            }
            this.#cycleCourant = this.#params.cycle;
            this.#validerCycles();
        } else if (this.#iteration === -1) {
            this.#validerBilan();
        } else {
            this.#validerBilanPasApas();
        }

        // Règlement interbancaire automatique : uniquement en mode 'modelcn'.
        // En 'sandbox' et 'cycles', les opérations affichées sont les seules jouées
        // (sinon un Paiement Rdm → E3 caché fausse les bilans du cycle international).
        if (this.#params.mode === 'modelcn') {
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

        if (this.#params.mode === 'cycles') {
            const method = CYCLE_METHODS[this.#params.cycle] ?? CYCLE_METHODS.profit;
            this.#lesOperations = this.model[method]();
        } else {
            this.#lesOperations = this.model.getListComplete();
        }
        //console.log("opérations générées:", this.#lesOperations);
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
     * Mode 'cycles' : rejoue sur des bilans vierges les cycles précédents
     * puis le cycle courant (en entier, ou jusqu'à l'étape du pas à pas).
     * @private
     */
    #validerCycles() {
        const lesOperations = this.#loadFramework();

        if (this.#iteration >= lesOperations.length) {
            this.#iteration = -1;
        }

        [...this.#historique, ...this.#operationsCourantes()].forEach(uneOperation => {
            this.#validerOperation(
                uneOperation.operation,
                this.#operation.find(uneOperation.acheteur),
                this.#operation.find(uneOperation.vendeur),
                uneOperation.montant
            );
        });
    }

    /**
     * Opérations du cycle courant déjà jouées (toutes, ou jusqu'à l'étape du pas à pas)
     * @private
     */
    #operationsCourantes() {
        return this.#iteration === -1
            ? this.#lesOperations
            : this.#listOperationPasApas();
    }

    /**
     * Valide les opérations pas à pas
     */
    #validerBilanPasApas() {
        const lesOperations = this.#loadFramework();

        if (this.#iteration < lesOperations.length) {
            const uneOperation = lesOperations[this.#iteration];
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
            this.#iteration = -1;
        }
    }

    /**
     * Retourne la liste des opérations jusqu'à l'itération actuelle
     * @returns {Array} Liste des opérations
     */
    #listOperationPasApas() {
        return this.#lesOperations.slice(0, this.#iteration + 1);
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

    get getIteration() {
        return this.#iteration;
    }

    /**
     * Opérations affichées : uniquement celles du cycle courant
     * (les cycles précédents restent pris en compte dans les calculs).
     * En mode 'cycles', affichées dans l'ordre inverse (la plus récente en haut).
     */
    get getLesOperations() {
        const operations = this.#operationsCourantes();
        return this.#params.mode === 'cycles' ? [...operations].reverse() : operations;
    }

    /**
     * Balance des paiements, calculée à partir du solde extérieur (delta = M - X)
     * et du compte Bdm à l'actif de la BCdm.
     * Indisponible (null) en mode 'sandbox' (pas de solde extérieur).
     * @returns {Array<[string, number]>|null} Lignes [libellé, valeur]
     */
    get getBalancePaiements() {
        if (typeof this.model?.getDelta !== 'number') return null;

        const delta = this.model.getDelta;
        const bdmActif = this.#operation.find('BCdm')?.getactif?.Bdm ?? 0;

        const balanceCommerciale = delta * -1;
        const soldeServices = 0;
        const soldeBiensServices = delta * -1;
        const transferts = 0;
        const balanceCourante = delta * -1;
        const mouvementsCapitaux = delta - bdmActif;
        // Une baisse des réserves est une ressource (+) : la balance est équilibrée
        const variationReserves = (balanceCourante + mouvementsCapitaux) * -1;
        const erreursOmissions = (balanceCourante + mouvementsCapitaux + variationReserves) * -1;

        return [
            ['Balance commerciale', balanceCommerciale],
            ['+ Solde des services', soldeServices],
            ['= Solde des biens et services', soldeBiensServices],
            ['+ Transferts', transferts],
            ['= Balance courante X-M', balanceCourante],
            ['+ Mouvements de capitaux', mouvementsCapitaux],
            ['= Variation des réserves M-X', variationReserves],
            ['Erreurs et omissions', erreursOmissions]
        ];
    }

    get getLesTypes() {
        return this.model.getTypes;
    }
}
