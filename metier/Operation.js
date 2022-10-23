import {ComptaNat} from './ComptaNat.js'
import {Entreprise} from './Entreprise.js'
import {Banque} from './Banque.js'

class Operation {

    _agentsList;
    _operationList;
    _CN;
    lesAgents

    constructor() {
        this._agentsList = new Set();
        this._InitialiseAgent();
        this._operationList = new Set();
        this._InitialiseOperation();
        this._CN = new ComptaNat();
        this.banque = new Banque();
        this.getAgents;
    }

    find(name) {
        let recherche

        for (let unagent of this._agentsList) {
            if (unagent.getNom === name) {
                recherche = unagent
            }
        }
        return recherche
    }

    update(agent) {

    }

    _InitialiseAgent() {
        this._agentsList.add(new Entreprise('E1', 'E'));
        this._agentsList.add(new Entreprise('E2', 'E'));
        this._agentsList.add(new Entreprise('E3', 'E')); // Stat
        this._agentsList.add(new Entreprise('M', 'M'));
        this._agentsList.add(new Entreprise('Rdm', 'Ext'));
        this._agentsList.add(new Banque('B'));
        this._agentsList.add(new Banque('Bdm'));
    }

    _InitialiseOperation() {
        this._operationList.add('Production');
        this._operationList.add('ConsommationIntermediaire');
        this._operationList.add('FiCI');
        this._operationList.add('RevenusSal');
        this._operationList.add('Consommation');
        this._operationList.add('AchatTitres');
        this._operationList.add('RachatTitres');
        this._operationList.add('AchatImmob');
        this._operationList.add('Depreciation');
        this._operationList.add('RevenusNonSal');
        this._operationList.add('RemboursementBq');
        this._operationList.add('Paiement');
        this._operationList.add('Credit');
        this._operationList.add('ReEscompte');
    }

    get getOperation() {
        return this._operationList;
    }

    get getAgents() {
        return this._agentsList;
    }

    get getCN() {
        return this._CN;
    }

    get getInfos() {
        for (let [key, value] of this._agentsList.entries()) console.log(value);

    }

    get getTest() {
        let acheteur = ''
        let vendeur = ''

        acheteur = this.find('E1')

        vendeur = this.find('M')

        this.Production(acheteur, vendeur, 10)
    }

    Production(ach, vdr, mt) {
        let validation = "Le vendeur doit être M";
        if (vdr.getNom === 'M') {
            ach.Production(vdr, mt);
            //console.log(ach.getBilan)
            //console.log(vdr.getBilan)
            //  CHARGEMENT DE LA SESSION
            this.getCN;
            this._CN.TeeProduction(mt);
            this._CN.TeeStock(mt);
            this._CN.getBilanTEE();
            // SAUVEGARDE DE LA SESSION
            //this.Session.setAttribut('cn', this._CN);
            validation = true;
        }
        return validation;
    }

    ConsommationIntermediaire(ach, vdr, mt, txPrf = 0) {
        let validation = "M ne peut pas figurer dans cette opération";
        if (vdr.getNom !== 'M' && ach.getNom !== 'M') {
            ach.CI(vdr, mt);
            this.getCN;
            if (ach.getNom === "Rdm") {
                this.getCN;
                this._CN.TeeExport(mt * (1 - txPrf));
                this._CN.TeeStock(-1 * mt * (1 - txPrf));
                this._CN.getBilanTEE();
                //this.Session.setAttribut('cn', this._CN);
                validation = true;
            }
            if (vdr.getNom === "Rdm") {
                this._CN.TeeImport(mt * (1 - txPrf));
                this._CN.TeeStock(mt * (1 - txPrf));
                validation = true;
            } else if (ach.getNom !== "Rdm") {
                this._CN.TeeCInterm(mt);
                this._CN.TeeProduction(mt);
                validation = true;
            }

            this._CN.getBilanTEE();
            // SAUVEGARDE DE LA SESSION
            //this.Session.setAttribut('cn', this._CN);
        }
        return validation;
    }

    FiCI(ach, vdr, mt) {
        let validation = "M ne peut pas figurer comme acheteur ou B ne peut pas figurer comme vendeur";
        if (!(vdr.getNom !== 'M' ^ ach.getNom !== 'M') && vdr.getNom !== 'B' || vdr.getNom === 'M') {
            ach.CIPaid(vdr, mt);
            validation = true;
        }
        this.getCN;
        this._CN.actif_TOF(ach.getColonneTOF, 0, -1);
        this._CN.actif_TOF(vdr.getColonneTOF, 0, 1);
        this._CN.getBilanTOF();
        //this.Session.setAttribut('cn', this._CN);
        return validation;
    }

    FiCredit(ach, vdr, mt) {
        //validation = "les acheteurs sont les vendeurs";
        //if (vdr.getNom == ach.getNom) {
        ach.CIPaid(vdr, mt);
        let validation = true;
        //}
        this.getCN;
        this._CN.actif_TOF(ach.getColonneTOF, 0, 1);
        this._CN.passif_TOF(vdr.getColonneTOF, 0, 1);
        this._CN.getBilanTOF();
        //this.Session.setAttribut('cn', this._CN);
        return validation;
    }

    RevenusSal(ach, vdr, mt) {
        let validation = 'Le vendeur ne peut pas être M';
        if (vdr.getNom !== 'M') {
            ach.SalairesPayes(vdr, mt);

            this.getCN;
            this._CN.TeeRsal(mt);
            this._CN.TeeRsalEM(mt);
            this._CN.getBilanTEE();
            //this.Session.setAttribut('cn', this._CN);
            validation = true;
        }
        return validation;
    }

    Consommation(ach, vdr, mt, txPrf = 0) {
        let validation = "L'acheteur doit être M";
        if (ach.getNom === 'M') {
            ach.Consommation(vdr, mt);
            // var_dump(vdr);

            this.getCN;
            this._CN.TeeCfinale(mt);
            this._CN.TeeStock(-1 * mt * (1 - txPrf));
            this._CN.getBilanTEE();
            //this.Session.setAttribut('cn', this._CN);
            validation = true;
        }
        return validation;
    }

    AchatTitres(ach, vdr, mt) {
        let validation = "Le vendeur ni l'acheteur ne peuvent être B";
        if (vdr.getNom !== 'B' && ach.getNom !== 'B') {
            ach.TitresAchat(vdr, mt);
            validation = true;

            this.getCN;
            this._CN.actif_TOF(ach.getColonneTOF, mt, 1);
            this._CN.passif_TOF(vdr.getColonneTOF, mt, 1);
            this._CN.getBilanTOF();
            //this.Session.setAttribut('cn', this._CN);
        }
        return validation;
    }

    RachatTitres(ach, vdr, mt) {
        let validation = "B ne peut pas figurer comme acheteur ou vendeur";
        if (vdr.getNom !== 'B') {
            ach.TitresRemboursement(vdr, mt);

            validation = true;

            this.getCN;
            this._CN.passif_TOF(ach.getColonneTOF, mt, -1);
            this._CN.actif_TOF(vdr.getColonneTOF, mt, -1);
            this._CN.getBilanTOF();
            //this.Session.setAttribut('cn', this._CN);
        }
        return validation;
    }

    AchatImmob(ach, vdr, mt, txPrf = 0) {
        let validation = "C'est une opération inter entreprises";
        if (!(vdr.getNom !== 'M' ^ ach.getNom !== 'M') && vdr.getNom !== 'B' || vdr.getNom === 'M') {


            ach.Capital(vdr, mt);

            this.getCN;
            this._CN.TeeFbcf(mt);
            this._CN.TeeStock(-1 * mt * (1 - txPrf));
            this._CN.getBilanTEE();
            //this.Session.setAttribut('cn', this._CN);

            validation = true;
        }
        return validation;
    }

    Depreciation(ach, vdr, mt) {
        let validation = "C'et une opération sur une seule entreprise";
        if (ach.getColonneTOF === 'E' && ach.getNom === vdr.getNom) {
            ach.Depreciation(vdr, mt);

            this.getCN;
            this._CN.TeeProduction(mt);
            this._CN.TeeStock(mt);
            this._CN.getBilanTEE();
            // this.Session.setAttribut('cn', this._CN);
            validation = true;
        }
        return validation;
    }

    RevenusNonSal(ach, vdr, mt) {
        let validation;
        ach.RevenusNonSal(vdr, mt);
        this.getCN;
        if (vdr.getNom !== 'M') {
            this._CN.TeeRnsalEE(mt);
            if (ach.getNom !== 'M') {
                this._CN.TeeRnsalER(mt);
            } else {
                this._CN.TeeRnsalME(mt);
            }
        } else {
            this._CN.TeeRnsalME(mt);
            if (ach.getNom !== 'M') {
                this._CN.TeeRnsalER(mt);
            } else {
                this._CN.TeeRnsalMR(mt);
            }
        }
        this._CN.getBilanTEE();
        //this.Session.setAttribut('cn', this._CN);
        validation = true;

        return validation;
    }

    RemboursementBq(ach, vdr, mt) {
        let validation;
        ach.RemboursementBq(vdr, mt);
        validation = true;

        this.getCN;
        this._CN.actif_TOF(ach.getColonneTOF, 0, -1);
        this._CN.actif_TOF(vdr.getColonneTOF, 0, 1);
        this._CN.getBilanTOF();
        //this.Session.setAttribut('cn', this._CN);

        return validation;


    }

    Paiement(ach, vdr, mt) {
        let validation, bqv, bqa;
        bqv = this.find(vdr.getBanque);
        bqa = this.find(ach.getBanque);
        if (ach.getBanque === vdr.getBanque) {
            // console.log(ach.getBanque)
            bqa = this.find(ach.getBanque)
            bqv.BanqueFinPassif(vdr.getNom, mt);
            bqa.BanqueFinPassif(ach.getNom, -1 * mt);
        } else if (vdr.getNom === 'Rdm' || ach.getNom === 'Rdm') {
            bqa.BanqueFinPassif('BC', mt);
            bqa.BanqueFinPassif(ach.getNom, -1 * mt);
            bqv.BanqueFinPassif(vdr.getNom, mt);
            bqv.BanqueFinActif('BC', mt);
        }

        this.getCN;
        this._CN.actif_TOF(ach.getColonneTOF, mt, -1);
        this._CN.actif_TOF(vdr.getColonneTOF, mt, 1);
        this._CN.getBilanTOF();


        validation = true;

        return validation;
    }

    Credit(ach, vdr, mt) {
        let validation, bqv, bqa, ptof, atof;
        bqv = this.find(vdr.getBanque);
        bqa = this.find(ach.getBanque);
        if (ach.getBanque === vdr.getBanque) {
            bqa.BanqueFinActif(ach.getNom, mt);
            bqa.BanqueFinPassif(vdr.getNom, mt);

            ptof = ach.getColonneTOF
            atof = vdr.getColonneTOF
        } else if (vdr.getNom === 'Rdm') {

            bqa.BanqueFinPassif('BC', mt);
            bqa.BanqueFinActif(ach.getNom, mt);

            bqv.BanqueFinPassif('Rdm', mt);
            bqv.BanqueFinActif('BC', mt);

            ptof = ach.getColonneTOF
            atof = 'BC'
        } else {

            bqv.BanqueFinPassif(vdr.getNom, mt);
            bqv.BanqueFinActif('BC', mt);

            bqa.BanqueFinPassif('BC', mt);
            bqa.BanqueFinActif('Rdm', mt);

            ptof = 'BC'
            atof = vdr.getColonneTOF
        }

        this.getCN;
        this._CN.passif_TOF(ptof, mt, 1);
        this._CN.actif_TOF(atof, mt, 1);
        this._CN.getBilanTOF();
        validation = true;

        return validation;
    }

    ReEscompte(ach, vdr = 'BC', mt) {
        let validation, bqa;
        validation = "Acht = BC";
        bqa = this.find(ach.getBanque);
        if (ach.getColonneTOF === 'E') {
            bqa.BanqueFinActif(ach.getNom, -mt);
            bqa.BanqueFinActif('BC', mt);

            this.getCN;
            this._CN.passif_TOF('BC', mt, 1);
            this._CN.passif_TOF(ach.getColonneTOF, mt, -1);
            this._CN.getBilanTOF();

            validation = true;
        }
        return validation;
    }

    /* EscompteInternational(ach, vdr, mt) {
         let validation, bqv, bqi;
         validation = "Acht = B";
         if (ach.getNom === 'B') {
             bqv = this.find(vdr.getBanque);
             bqi = this.find('Brm');
             bqv.BanqueFinActif(vdr.getNom, -1 * mt);
             bqv.BanqueFinActif('BC', mt);

             bqi.BanqueFinActif(ach.getNom, mt);
             bqi.BanqueFinPassif('BC', mt);

             this.getCN;
             this._CN.actif_TOF('BC', mt, 1);
             this._CN.passif_TOF(vdr.getColonneTOF, mt, 1);
             this._CN.getBilanTOF();
             //this.Session.setAttribut('cn', this._CN);

             validation = true;
         }

         return validation;
     }*/


}

export {Operation}
