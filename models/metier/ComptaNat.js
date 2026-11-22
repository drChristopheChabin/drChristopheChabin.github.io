import { AGENTS, CATEGORIES, ACCOUNTS } from './Constants.js';

/**
 * Represents the National Accounting system (ComptaNat).
 * Manages the TEE (Tableau Économique d'Ensemble) and TOF (Tableau des Opérations Financières).
 */
export class ComptaNat {
    #name = 'Cn';

    // Initial structures for TEE and TOF using constants
    #initialState = {
        [ACCOUNTS.PRD]: 0,
        [ACCOUNTS.CI]: 0,
        [ACCOUNTS.VA]: 0,
        [ACCOUNTS.SAL]: 0,
        [ACCOUNTS.RNS]: 0,
        [ACCOUNTS.RDB]: 0,
        [ACCOUNTS.C]: 0,
        [ACCOUNTS.E]: 0,
        [ACCOUNTS.ST]: 0,
        [ACCOUNTS.FBCF]: 0,
        [ACCOUNTS.SOLDE]: 0
    };

    #actif_TEE = {
        [CATEGORIES.ENREPRISE]: { ...this.#initialState },
        [CATEGORIES.MENAGE]: { ...this.#initialState },
        [CATEGORIES.EXTERIEUR]: { ...this.#initialState }
    };

    #passif_TEE = {
        [CATEGORIES.ENREPRISE.toLowerCase()]: { ...this.#initialState },
        [CATEGORIES.MENAGE.toLowerCase()]: { ...this.#initialState },
        [CATEGORIES.EXTERIEUR.toLowerCase()]: { ...this.#initialState }
    };

    #actif_TOF = {
        [AGENTS.BC]: 0,
        [CATEGORIES.ENREPRISE]: 0,
        [CATEGORIES.MENAGE]: 0,
        [CATEGORIES.EXTERIEUR]: 0
    };
    #passif_TOF = {
        [AGENTS.BC.toLowerCase()]: 0,
        [CATEGORIES.ENREPRISE.toLowerCase()]: 0,
        [CATEGORIES.MENAGE.toLowerCase()]: 0,
        [CATEGORIES.EXTERIEUR.toLowerCase()]: 0
    };

    #bilan_TEE = [];
    #bilan_TOF = [];

    // --- Getters ---

    get getNom() { return this.#name; }
    get getactif_TEE() { return this.#actif_TEE; }
    get getTEE() { return this.getBilanTEE(); } // Refresh and return
    get getTOF() { return this.getBilanTOF(); } // Refresh and return

    /**
     * Builds the TEE balance sheet.
     * Returns a 2D array with 11 rows and 6 columns.
     */
    getBilanTEE() {
        const items = Object.keys(this.#initialState);
        const agents = [CATEGORIES.ENREPRISE, CATEGORIES.MENAGE, CATEGORIES.EXTERIEUR];
        const passifAgents = [
            CATEGORIES.ENREPRISE.toLowerCase(),
            CATEGORIES.MENAGE.toLowerCase(),
            CATEGORIES.EXTERIEUR.toLowerCase()
        ];

        this.#bilan_TEE = items.map((item) => {
            const row = new Array(6);

            // Assets (Actif) - Columns 0, 1, 2
            agents.forEach((agent, idx) => {
                const label = agent === CATEGORIES.ENREPRISE ? item : item + agent;
                row[idx] = [label, this.#actif_TEE[agent][item]];
            });

            // Liabilities (Passif) - Columns 3, 4, 5
            passifAgents.forEach((agent, idx) => {
                const label = agent === CATEGORIES.ENREPRISE.toLowerCase() ? item : item + agent;
                row[idx + 3] = [label, this.#passif_TEE[agent][item]];
            });

            return row;
        });

        return this.#bilan_TEE;
    }

    /**
     * Builds the TOF balance sheet.
     * Returns a 1D array of entries.
     */
    getBilanTOF() {
        const actif = Object.entries(this.#actif_TOF);
        const passif = Object.entries(this.#passif_TOF);
        this.#bilan_TOF = [...actif, ...passif];
        return this.#bilan_TOF;
    }

    // --- TEE Update Methods ---

    TeeProduction(mt) {
        this.#passif_TEE[CATEGORIES.ENREPRISE.toLowerCase()].prd += mt;
    }

    TeeStock(mt) {
        this.#actif_TEE[CATEGORIES.ENREPRISE].st += mt;
        // if (this.#actif_TEE[CATEGORIES.ENREPRISE].st < 0) this.#actif_TEE[CATEGORIES.ENREPRISE].st = 0;
    }

    TeeExport(mt) {
        this.#actif_TEE[CATEGORIES.EXTERIEUR].prd += mt;
    }

    TeeImport(mt) {
        this.#passif_TEE[CATEGORIES.EXTERIEUR.toLowerCase()].prd += mt;
    }

    TeeCInterm(mt) {
        this.#actif_TEE[CATEGORIES.ENREPRISE].ci += mt;
    }

    TeeRsal(mt) {
        this.#actif_TEE[CATEGORIES.ENREPRISE].sal += mt;
        this.#actif_TEE[CATEGORIES.MENAGE].solde += mt;
    }

    TeeRsalEM(mt) {
        this.#passif_TEE[CATEGORIES.MENAGE.toLowerCase()].sal += mt;
    }

    TeeRnsalEE(mt) {
        this.#actif_TEE[CATEGORIES.ENREPRISE].rns += mt;
    }

    TeeRnsalER(mt) {
        this.#passif_TEE[CATEGORIES.ENREPRISE.toLowerCase()].rns += mt;
    }

    TeeRnsalME(mt) {
        this.#actif_TEE[CATEGORIES.MENAGE].rns += mt;
    }

    TeeRnsalMR(mt) {
        this.#passif_TEE[CATEGORIES.MENAGE.toLowerCase()].rns += mt;
    }

    TeeCfinale(mt) {
        this.#actif_TEE[CATEGORIES.MENAGE].c += mt;
        this.#actif_TEE[CATEGORIES.MENAGE].solde -= mt;
    }

    TeeFbcf(mt) {
        this.#actif_TEE[CATEGORIES.ENREPRISE].fbcf += mt;
    }

    // --- TOF Update Methods ---

    actif_TOF(agt, mt, sign) {
        if (agt in this.#actif_TOF) {
            this.#actif_TOF[agt] += sign * (mt || 0);
        }
    }

    passif_TOF(agt, mt, sign) {
        if (typeof agt === 'string') {
            const key = agt.toLowerCase();
            if (key in this.#passif_TOF) {
                this.#passif_TOF[key] += sign * (mt || 0);
            }
        }
    }
}
