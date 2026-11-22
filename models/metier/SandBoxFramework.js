import { SandBoxType, OperationClassifications, AGENT_ACCOUNTS } from "./Constants.js";

export class SandBoxFramework {
    #parameters;

    constructor(parameters, operation = null) {
        this.#parameters = parameters;
    }

    /**
     * Affiche l'état des agents avec leurs montants réels basés sur la structure AGENT_ACCOUNTS
     */
    logBalances(operation) {
        if (!operation) {
            console.log("Recensement des comptes par agent (Structure) :", AGENT_ACCOUNTS);
            return;
        }

        const fullState = {};
        for (const agentName in AGENT_ACCOUNTS) {
            const agent = operation.find(agentName);
            if (!agent) continue;

            const structure = AGENT_ACCOUNTS[agentName];
            const balances = { actif: {}, passif: {} };

            // Récupération des données brutes de l'agent
            const actifData = agent.getactif || {};
            const passifData = agent.getpassif || {};

            // Si la structure définit des comptes spécifiques, on ne prend que ceux-là
            if (structure.actif.length > 0) {
                structure.actif.forEach(acc => balances.actif[acc] = actifData[acc] || 0);
            } else {
                balances.actif = { ...actifData };
            }

            if (structure.passif.length > 0) {
                structure.passif.forEach(acc => balances.passif[acc] = passifData[acc] || 0);
            } else {
                balances.passif = { ...passifData };
            }

            fullState[agentName] = balances;
        }

        console.log("État financier détaillé des agents (Sandbox) :", fullState);
    }

    /**
     * Calcule les opérations basées sur les paramètres cochés et les métadonnées SandBoxType.
     * @returns {Array} Liste des opérations calculées.
     */
    getListComplete = () => {
        const operations = [];

        // Parcourir tous les paramètres pour trouver ceux qui sont actifs (true)
        for (const key in this.#parameters) {
            if (this.#parameters[key]) {
                const config = SandBoxType[key];
                if (config && typeof config === 'object') {
                    operations.push(this.#createOperation(
                        key,
                        config.buyer,
                        config.seller,
                        config.amount
                    ));
                } else {
                    console.warn(`SandBoxFramework: Pas de configuration trouvée dans SandBoxType pour la clé "${key}"`);
                }
            }
        }

        console.log("SandBoxFramework: Opérations générées =", operations);
        return operations;
    }

    /**
     * Creates an operation object with keys matching CnFramework interface (acheteur, vendeur, montant)
     */
    #createOperation(operation, buyer, seller, amount) {
        return {
            operation,
            acheteur: buyer,
            vendeur: seller,
            montant: parseFloat(amount.toFixed(2))
        };
    }

    get getTypes() {
        return OperationClassifications;
    }

}