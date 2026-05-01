import { AGENTS, ACCOUNTS } from './Constants.js';

/**
 * Represents a business entity (Entreprise) in the economic model.
 * Handles assets (actif) and liabilities (passif) and various economic operations.
 */
export class Entreprise {
    #achtr;
    #bqLoc;
    #colonneTof;
    #actif = {
        [ACCOUNTS.IMMO]: 0,
        [ACCOUNTS.STOCK]: 0,
        [ACCOUNTS.TRESORERIE]: 0
    };
    #passif = {
        [ACCOUNTS.CAPITAL]: 0,
        [ACCOUNTS.BANQUE]: 0,
        [ACCOUNTS.SALAIRE]: 0
    };

    /**
     * @param {string} achtr Name of the agent
     * @param {string} colonneTof Category for TOF (Tableau des Opérations Financières)
     */
    constructor(achtr, colonneTof) {
        this.#achtr = achtr;
        this.#colonneTof = colonneTof;
        // Bdm is the financial institution for Bqm (Rdm)
        this.#bqLoc = (this.#achtr === AGENTS.RDM) ? AGENTS.BDM : AGENTS.B;
    }

    // --- Getters ---

    get getNom() { return this.#achtr; }
    get getactif() { return this.#actif; }
    get getpassif() { return this.#passif; }
    get getBanque() { return this.#bqLoc; }
    get getColonneTOF() { return this.#colonneTof; }
    get getStocks() { return this.#actif[ACCOUNTS.STOCK]; }

    /**
     * Generates a structured view of the balance sheet.
     * @returns {Array} A 2D array representing the balance sheet (Actif vs Passif)
     */
    get getBilan() {
        const actifKeys = Object.keys(this.#actif);
        const passifKeys = Object.keys(this.#passif);
        const maxLength = Math.max(actifKeys.length, passifKeys.length);

        const bilan = [];
        for (let i = 0; i < maxLength; i++) {
            const row = new Array(2);
            if (i < actifKeys.length) {
                const key = actifKeys[i];
                row[0] = { [key]: this.#actif[key] };
            }
            if (i < passifKeys.length) {
                const key = passifKeys[i];
                row[1] = { [key]: this.#passif[key] };
            }
            bilan[i] = row;
        }
        return bilan;
    }

    // --- Private Update Methods ---

    #majBilan(v) {
        // Keeps empty if no side-effect logic is needed
    }

    #Immobilisation(mont, sign) {
        this.#actif[ACCOUNTS.IMMO] += sign * mont;
    }

    #Kapital(mont, sign) {
        this.#passif[ACCOUNTS.CAPITAL] += sign * mont;
    }

    #Stock(mont, sign) {
        const oldStock = this.#actif[ACCOUNTS.STOCK];
        this.#actif[ACCOUNTS.STOCK] += sign * mont;
        console.log(`Entreprise ${this.#achtr}: Stock ${oldStock} -> ${this.#actif[ACCOUNTS.STOCK]} (sign=${sign}, mont=${mont})`);
    }

    Banque(mont, sign) {
        this.#passif[ACCOUNTS.BANQUE] += sign * mont;
    }

    #ensureAccount(obj, account) {
        if (!(account in obj)) {
            obj[account] = 0;
        }
    }

    #Client(vd, mont, sign) {
        this.#ensureAccount(this.#actif, vd);
        this.#ensureAccount(this.#passif, vd.toLowerCase());
        this.#actif[vd] += sign * mont;
    }

    #Fournisseur(vd, mont, sign) {
        const vdLower = vd.toLowerCase();
        this.#ensureAccount(this.#actif, vd);
        this.#ensureAccount(this.#passif, vdLower);
        this.#passif[vdLower] += sign * mont;
    }

    #Tresorerie(mont, sign) {
        this.#actif[ACCOUNTS.TRESORERIE] += sign * mont;
    }

    #Salaire(mont, sign) {
        this.#passif[ACCOUNTS.SALAIRE] += sign * mont;
    }

    // --- Public Economic Operations ---

    Production(vd, mt) {
        if (this.#achtr !== AGENTS.M) {
            this.#Stock(mt, 1);
            this.#Salaire(mt, 1);
            if (vd instanceof Entreprise) {
                vd.#Salaire(mt, 1);
                vd.#Client(this.#achtr, mt, 1);
            }
            this.#majBilan(vd);
        }
    }

    CI(vd, mt, txPrf = 0) {
        this.#Stock(mt, 1);
        this.#Fournisseur(vd.getNom, mt, 1);
        if (vd instanceof Entreprise) {
            vd.#Stock(mt * (1 - txPrf), -1);
            vd.#Client(this.#achtr, mt, 1);
        }
        this.#majBilan(vd);
    }

    SalairesPayes(vd, mt) {
        this.#Tresorerie(mt, 1);
        this.#Client(vd.getNom, mt, -1);
        vd.#Tresorerie(mt, -1);
        if (vd instanceof Entreprise) {
            vd.#Salaire(mt, -1);
        }
        this.#majBilan(vd);
    }

    RevenusNonSal(vd, mt) {
        this.#Tresorerie(mt, 1);
        vd.#Tresorerie(mt, -1);
        this.#majBilan(vd);
    }

    Consommation(vd, mt, txPrf = 0) {
        this.#Tresorerie(mt, -1);
        this.#Salaire(mt, -1);
        vd.#Tresorerie(mt, 1);
        vd.#Stock(mt * (1 - txPrf), -1);
        this.#majBilan(vd);
    }

    Capital(vd, mt, txPrf = 0) {
        this.#Immobilisation(mt, 1);
        this.#Fournisseur(vd.getNom, mt, 1);
        if (vd instanceof Entreprise) {
            vd.#Stock(mt * (1 - txPrf), -1);
            vd.#Client(this.#achtr, mt, 1);
        }
        this.#majBilan(vd);
    }

    Depreciation(vd, mt) {
        this.#Immobilisation(mt, -1);
        this.#Stock(mt, 1);
        this.#majBilan(vd);
    }

    CIPaid(vd, mt) {
        if (this.#achtr !== vd.getNom) {
            this.#Client(vd.getNom, mt, -1);
            this.#Tresorerie(mt, 1);
            if (vd instanceof Entreprise) {
                vd.#Fournisseur(this.getNom, mt, -1);
            }
            vd.Banque(mt, 1);
        } else {
            this.#Tresorerie(mt, 1);
            this.Banque(mt, 1);
        }
        this.#majBilan(vd);
    }

    Escompte(vd, mt) {
        this.#majBilan(vd);
    }

    TitresAchat(vd, mt) {
        this.#Immobilisation(mt, 1);
        this.#Tresorerie(mt, -1);
        if (vd instanceof Entreprise) {
            vd.#Kapital(mt, 1);
            vd.#Tresorerie(mt, 1);
        }
        this.#majBilan(vd);
    }

    TitresRemboursement(vd, mt) {
        this.#Tresorerie(mt, -1);
        if (vd.getNom !== this.getNom) {
            if (vd instanceof Entreprise) {
                this.#Kapital(mt, -1);
                vd.#Immobilisation(mt, -1);
                vd.#Tresorerie(mt, 1);
            }
        } else {
            this.Banque(mt, -1);
        }
        this.#majBilan(vd);
    }

    VendreTitres(mt) {
        this.#Kapital(mt, 1);
        this.#Tresorerie(mt, 1);
    }

    RemboursementBq(vd, mt) {
        this.Banque(mt, -1);
        this.#Tresorerie(mt, -1);
        this.#majBilan(vd);
    }
}
