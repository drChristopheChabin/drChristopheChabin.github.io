import { ComptaNat } from './ComptaNat.js';
import { Entreprise } from './Entreprise.js';
import { Banque } from './Banque.js';
import { AGENTS, CATEGORIES, OperationType } from './Constants.js';

/**
 * Main coordinator for economic operations between agents.
 * Manages agents, operation types, and handles national accounting integration.
 */
export class Operation {
    #agentsList;
    #operationList;
    #CN;
    banque;

    constructor() {
        this.#agentsList = new Map();
        this.#InitialiseAgent();
        this.#operationList = new Set(Object.values(OperationType));
        this.#CN = new ComptaNat();
        this.banque = new Banque(AGENTS.B);
    }

    /**
     * Finds an agent by name.
     * @param {string} name 
     * @returns {Object|undefined}
     */
    find(name) {
        return this.#agentsList.get(name);
    }

    #InitialiseAgent() {
        const agents = [
            new Entreprise(AGENTS.E1, CATEGORIES.ENREPRISE),
            new Entreprise(AGENTS.E2, CATEGORIES.ENREPRISE),
            new Entreprise(AGENTS.E3, CATEGORIES.ENREPRISE),
            new Entreprise(AGENTS.M, CATEGORIES.MENAGE),
            new Entreprise(AGENTS.RDM, CATEGORIES.EXTERIEUR),
            new Banque(AGENTS.B),
            new Banque(AGENTS.BDM),
            new Banque(AGENTS.BC)
        ];
        agents.forEach(agent => this.#agentsList.set(agent.getNom, agent));
    }

    get getOperation() { return this.#operationList; }
    get getAgents() { return new Set(this.#agentsList.values()); } // Maintain backward compatibility
    get getCN() { return this.#CN; }

    // --- Economic Operations ---

    Production(ach, vdr, mt) {
        if (vdr.getNom !== AGENTS.M) return "Le vendeur doit être M";

        ach.Production(vdr, mt);
        this.#CN.TeeProduction(mt);
        this.#CN.TeeStock(mt);
        return true;
    }

    ConsommationIntermediaire(ach, vdr, mt, txPrf = 0) {
        console.log(`Operation: ConsommationIntermediaire(ach=${ach?.getNom}, vdr=${vdr?.getNom}, mt=${mt}, txPrf=${txPrf})`);
        if (vdr.getNom === AGENTS.M || ach.getNom === AGENTS.M) return "M ne peut pas figurer dans cette opération";

        ach.CI(vdr, mt, txPrf);

        if (ach.getNom === AGENTS.RDM) {
            this.#CN.TeeExport(mt * (1 - txPrf));
            this.#CN.TeeStock(-1 * mt * (1 - txPrf));
        } else if (vdr.getNom === AGENTS.RDM) {
            this.#CN.TeeImport(mt * (1 - txPrf));
            this.#CN.TeeStock(mt * (1 - txPrf));
        } else {
            this.#CN.TeeCInterm(mt);
            this.#CN.TeeProduction(mt);
        }
        return true;
    }

    FiCI(ach, vdr, mt) {
        const cond = (!(vdr.getNom !== AGENTS.M ^ ach.getNom !== AGENTS.M) && vdr.getNom !== AGENTS.B || vdr.getNom === AGENTS.M);
        if (!cond) return "M ne peut pas figurer comme acheteur ou B ne peut pas figurer comme vendeur";

        ach.CIPaid(vdr, mt);
        this.#CN.actif_TOF(ach.getColonneTOF, mt, -1);
        this.#CN.actif_TOF(vdr.getColonneTOF, mt, 1);
        return true;
    }

    FiCredit(ach, vdr, mt) {
        ach.CIPaid(vdr, mt);
        this.#CN.actif_TOF(ach.getColonneTOF, mt, 1);
        this.#CN.passif_TOF(vdr.getColonneTOF, mt, 1);
        return true;
    }

    RevenusSal(ach, vdr, mt) {
        if (vdr.getNom === AGENTS.M) return 'Le vendeur ne peut pas être M';

        ach.SalairesPayes(vdr, mt);
        this.#CN.TeeRsal(mt);
        this.#CN.TeeRsalEM(mt);
        return true;
    }

    Consommation(ach, vdr, mt, txPrf = 0) {
        if (ach.getNom !== AGENTS.M) return "L'acheteur doit être M";

        ach.Consommation(vdr, mt, txPrf);
        this.#CN.TeeCfinale(mt);
        this.#CN.TeeStock(-1 * mt * (1 - txPrf));
        return true;
    }

    AchatTitres(ach, vdr, mt) {
        if (vdr.getNom === AGENTS.B || ach.getNom === AGENTS.B) return "Le vendeur ni l'acheteur ne peuvent être B";

        ach.TitresAchat(vdr, mt);
        this.#CN.actif_TOF(ach.getColonneTOF, mt, 1);
        this.#CN.passif_TOF(vdr.getColonneTOF, mt, 1);
        return true;
    }

    RachatTitres(ach, vdr, mt) {
        if (vdr.getNom === AGENTS.B) return "B ne peut pas figurer comme vendeur";

        ach.TitresRemboursement(vdr, mt);
        this.#CN.passif_TOF(ach.getColonneTOF, mt, -1);
        this.#CN.actif_TOF(vdr.getColonneTOF, mt, -1);
        return true;
    }

    AchatImmob(ach, vdr, mt, txPrf = 0) {
        const cond = (!(vdr.getNom !== AGENTS.M ^ ach.getNom !== AGENTS.M) && vdr.getNom !== AGENTS.B || vdr.getNom === AGENTS.M);
        if (!cond) return "C'est une opération inter entreprises";

        ach.Capital(vdr, mt, txPrf);
        this.#CN.TeeFbcf(mt);
        this.#CN.TeeStock(-1 * mt * (1 - txPrf));
        return true;
    }

    Depreciation(ach, vdr, mt) {
        if (ach.getColonneTOF !== CATEGORIES.ENREPRISE || ach.getNom !== vdr.getNom) return "C'est une opération sur une seule entreprise";

        ach.Depreciation(vdr, mt);
        this.#CN.TeeFbcf(mt * -1);
        this.#CN.TeeStock(mt);
        return true;
    }

    RevenusNonSal(ach, vdr, mt) {
        ach.RevenusNonSal(vdr, mt);
        if (vdr.getNom !== AGENTS.M) {
            this.#CN.TeeRnsalEE(mt);
            if (ach.getNom !== AGENTS.M) this.#CN.TeeRnsalER(mt);
            else this.#CN.TeeRnsalMR(mt);
        } else {
            this.#CN.TeeRnsalME(mt);
            if (ach.getNom !== AGENTS.M) this.#CN.TeeRnsalER(mt);
            else this.#CN.TeeRnsalMR(mt);
        }
        return true;
    }

    RemboursementBq(ach, vdr, mt) {
        ach.RemboursementBq(vdr, mt);
        this.#CN.actif_TOF(ach.getColonneTOF, 0, -1);
        this.#CN.actif_TOF(vdr.getColonneTOF, 0, 1);
        return true;
    }

    Paiement(ach, vdr, mt) {
        let bqv = this.find(vdr.getBanque);
        let bqa = this.find(ach.getBanque);

        if (ach.getBanque === vdr.getBanque) {
            bqv.BanqueFinPassif(vdr.getNom, mt);
            bqa.BanqueFinPassif(ach.getNom, -1 * mt);
        } else if (vdr.getNom === AGENTS.RDM || ach.getNom === AGENTS.RDM) {
            bqa.BanqueFinPassif(AGENTS.BC, mt);
            bqa.BanqueFinPassif(ach.getNom, -1 * mt);
            bqv.BanqueFinPassif(vdr.getNom, mt);
            bqv.BanqueFinActif(AGENTS.BC, mt);
        }

        this.#CN.actif_TOF(ach.getColonneTOF, mt, -1);
        this.#CN.actif_TOF(vdr.getColonneTOF, mt, 1);
        return true;
    }

    Credit(ach, vdr, mt) {
        let bqv = this.find(vdr.getBanque);
        let bqa = this.find(ach.getBanque);
        let ptof, atof;

        if (ach.getBanque === vdr.getBanque) {
            bqa.BanqueFinActif(ach.getNom, mt);
            bqa.BanqueFinPassif(vdr.getNom, mt);
            ptof = ach.getColonneTOF;
            atof = vdr.getColonneTOF;
        } else if (vdr.getNom === AGENTS.RDM) {
            bqa.BanqueFinPassif(AGENTS.BC, mt);
            bqa.BanqueFinActif(ach.getNom, mt);
            bqv.BanqueFinPassif(AGENTS.RDM, mt);
            bqv.BanqueFinActif(AGENTS.BC, mt);
            ptof = ach.getColonneTOF;
            atof = AGENTS.BC;
        } else {
            bqv.BanqueFinPassif(vdr.getNom, mt);
            bqv.BanqueFinActif(AGENTS.BC, mt);
            bqa.BanqueFinPassif(AGENTS.BC, mt);
            bqa.BanqueFinActif(AGENTS.RDM, mt);
            ptof = AGENTS.BC;
            atof = vdr.getColonneTOF;
        }

        this.#CN.passif_TOF(ptof, mt, 1);
        this.#CN.actif_TOF(atof, mt, 1);
        return true;
    }

    ReEscompte(ach, vdr = AGENTS.BC, mt) {
        if (ach.getColonneTOF !== CATEGORIES.ENREPRISE) return "Acht = BC";

        let bqa = this.find(ach.getBanque);
        bqa.BanqueFinActif(ach.getNom, -mt);
        bqa.BanqueFinActif(AGENTS.BC, mt);

        this.#CN.passif_TOF(AGENTS.BC, mt, 1);
        this.#CN.passif_TOF(ach.getColonneTOF, mt, -1);
        return true;
    }
    /*
    *Echange inter bancaire entre BC et une autre banque Bq ou Bqm
    *Si BC est débiteur envers Bqm, il est acheteur de titres de Bqm
    *BC vend des titres à Bqm

    *Si BC est créditeur net, il affecte cette monnaie aux réserves
     */
    // FiReglementInt(ach=AGENTS.BDM, vdr, mt, txPrf)
    FiReglementInternational(ach, vdr, mt, txPrf = 0) {
        // vdr est E3, ach est Bdm (agent)
        // E3 : Actif T 100, Passif K 100
        vdr.VendreTitres(mt);

        // Mouvements bancaires corrigés
        const bqv = this.find(vdr.getBanque); // Banque du vendeur (B)
        const bqa = this.find(AGENTS.BDM);    // Banque de l'acheteur (Bdm)
        const bc = this.find(AGENTS.BC);      // Banque Centrale (BC)

        // B : Actif BC 100, Passif E3 100
        bqv.BanqueFinActif(AGENTS.BC, mt);
        bqv.BanqueFinPassif(vdr.getNom, mt);

        // Bdm : Actif Bfi 100, Passif BC 100
        bqa.BanqueFinActif('Bfi', mt);
        bqa.BanqueFinPassif(AGENTS.BC, mt);

        // BC : Actif Bdm 100, Passif B 100
        bc.BanqueFinActif(bqa.getNom, mt);
        bc.BanqueFinPassif(bqv.getNom, mt);

        // TOF (Strictly as requested)
        this.#CN.actif_TOF(AGENTS.BC, mt, 1);              // BC debiteur
        this.#CN.passif_TOF(AGENTS.BC, mt, 1);             // BC crediteur
        this.#CN.passif_TOF(CATEGORIES.EXTERIEUR, mt, 1);  // EXT crediteur
        this.#CN.actif_TOF(CATEGORIES.ENREPRISE, mt, 1);   // E debiteur

        return true;
    }
    /*
    *Situation de monnaie internationale
    *le rdm vends des titres et paie l'interbancaire pour le reglement
     */
    FIEscompteInternational(ach, vdr, mt, txPrf = 0) {
        const mtEscompte = mt * 0.1; // 100 -> 10 as per user example

        const bqv = this.find(vdr.getBanque); // Banque B
        const bqa = this.find(AGENTS.BDM);    // Banque Bdm
        const bc = this.find(AGENTS.BC);      // Banque Centrale

        // B : Actif E3 -100, Actif BC 100
        bqv.BanqueFinActif(vdr.getNom, -mt);
        bqv.BanqueFinActif(AGENTS.BC, mt);

        // Bdm : Actif bfi 10, Passif BC 10
        bqa.BanqueFinActif('Bfi', mtEscompte);
        bqa.BanqueFinPassif(AGENTS.BC, mtEscompte);

        // BC : Passif B 100, Actif Bdm 10
        bc.BanqueFinPassif(bqv.getNom, mt);
        bc.BanqueFinActif(bqa.getNom, mtEscompte);

        // TOF : Actif BC 10, Passif E 10
        this.#CN.actif_TOF(AGENTS.BC, mtEscompte, 1);
        this.#CN.passif_TOF(CATEGORIES.ENREPRISE, mtEscompte, 1);

        return true;
    }

    Exportation(ach, vdr, mt, txPrf = 0) {
        return this.ConsommationIntermediaire(ach, vdr, mt, txPrf);
    }
    Importation(ach, vdr, mt, txPrf = 0) {
        return this.ConsommationIntermediaire(ach, vdr, mt, txPrf);
    }
    FiX(ach, vdr, mt, txPrf = 0) {
        this.FiCI(vdr, ach, mt, txPrf)
        return this.Credit(ach, vdr, mt, txPrf);
    }

    FiM(ach, vdr, mt, txPrf = 0) {
        this.FiCI(vdr, ach, mt, txPrf)
        return this.Credit(ach, vdr, mt, txPrf);
    }
}
