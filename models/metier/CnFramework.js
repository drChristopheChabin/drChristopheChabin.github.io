import {OperationClassifications} from './Constants.js';

export class CnFramework {
    mtE1;
    mtE2;
    txProfit;
    mtAmortit;
    #delta;
    #mInter;

    constructor(mtE1, mtE2, txProfit, mtAmortit = 0, mtXport, mtMport, mInter = false) {
        if ((txProfit >= 0 && txProfit <= 100) && (mtE1 >= mtE2)) {
            if (mtE2 === 0) {
                this.mtE1 = mtE1 - (3 * mtAmortit);
            } else {
                this.mtE1 = (mtE1 - (3 * mtAmortit) - mtE2) / 2;
            }
            this.mtE2 = mtE2;//25
            this.txProfit = txProfit / 100;
            this.prdAmortit = mtE1 - (3 * mtE2);
            this.mtAmortit = mtAmortit;//5
            this.xport = mtXport;
            this.mport = mtMport;
            this.#delta = this.mport - this.xport;
            this.#mInter = mInter;
        }
        //console.log(this.mtE1,this.mtE2,this.txProfit,this.mtAmortit)
    }

    getListComplete() {
        return [
            ...this.getListProfit(),
             ...this.getListInvest(),
            ...this.getListAmort(),
            ...this.getListInternat(),
           // ...(this.#mInter ? this.getListMint() : this.getListMstd())
        ]
    }

    getListProfit() {
        // console.log("profit" + this.mtE1);
        return [//!*****************cycle profit***********************!/
            {
                'operation': 'Production', 'acheteur': 'E1', 'vendeur': 'M', 'montant': this.mtE1
            }, {
                'operation': 'Production', 'acheteur': 'E2', 'vendeur': 'M', 'montant': this.mtE2
            }, {
                'operation': 'ConsommationIntermediaire',
                'acheteur': 'E1',
                'vendeur': 'E2',
                'montant': this.mtE2 * (1 - this.txProfit)
            }, {
                'operation': 'FiCI', 'acheteur': 'E2', 'vendeur': 'E1', 'montant': this.mtE2 * (1 - this.txProfit)
            }, {
                'operation': 'Credit', 'acheteur': 'E1', 'vendeur': 'E2', 'montant': this.mtE2 * (1 - this.txProfit)
            }, {
                'operation': 'RevenusSal', 'acheteur': 'M', 'vendeur': 'E2', 'montant': this.mtE2 * (1 - this.txProfit)
            }, {
                'operation': 'Paiement', 'acheteur': 'E2', 'vendeur': 'M', 'montant': this.mtE2 * (1 - this.txProfit)
            }, {
                'operation': 'AchatTitres', 'acheteur': 'M', 'vendeur': 'E2', 'montant': this.mtE2 * (1 - this.txProfit)
            }, {
                'operation': 'Paiement', 'acheteur': 'M', 'vendeur': 'E2', 'montant': this.mtE2 * (1 - this.txProfit)
            }, {
                'operation': 'RevenusSal', 'acheteur': 'M', 'vendeur': 'E1', 'montant': this.mtE1 * (1 - this.txProfit)
            }, {
                'operation': 'FiCI', 'acheteur': 'E1', 'vendeur': 'E1', 'montant': this.mtE1 * (1 - this.txProfit)
            }, {
                'operation': 'Credit', 'acheteur': 'E1', 'vendeur': 'M', 'montant': this.mtE1 * (1 - this.txProfit)
            }, {
                'operation': 'Consommation',
                'acheteur': 'M',
                'vendeur': 'E1',
                'montant': this.mtE1 * (1 - this.txProfit)
            }, {
                'operation': 'Paiement', 'acheteur': 'M', 'vendeur': 'E1', 'montant': this.mtE1 * (1 - this.txProfit)
            }, {
                'operation': 'FiCI',
                'acheteur': 'E1',
                'vendeur': 'E1',
                'montant': this.mtE1 * (1 - this.txProfit) * -1
            }, {
                'operation': 'Credit',
                'acheteur': 'E1',
                'vendeur': 'E1',
                'montant': this.mtE1 * (1 - this.txProfit) * -1
            },

        ]
    }

    getListInvest() {
        return [//!*****************cycle investisement***********************!/

            {
                'operation': 'Production', 'acheteur': 'E2', 'vendeur': 'M', 'montant': this.mtE2 * (1 - this.txProfit)
            }, {
                'operation': 'RevenusSal', 'acheteur': 'M', 'vendeur': 'E2', 'montant': this.mtE2 * (1 - this.txProfit)
            }, {
                'operation': 'Paiement', 'acheteur': 'E2', 'vendeur': 'M', 'montant': this.mtE2 * (1 - this.txProfit)
            }, {
                'operation': 'Consommation',
                'acheteur': 'M',
                'vendeur': 'E2',
                'montant': this.mtE2 * (1 - this.txProfit)
            }, {
                'operation': 'Paiement', 'acheteur': 'M', 'vendeur': 'E2', 'montant': this.mtE2 * (1 - this.txProfit)
            },

            {
                'operation': 'AchatImmob', 'acheteur': 'E2', 'vendeur': 'E1', 'montant': this.mtE2 * (1 - this.txProfit)
            }, {
                'operation': 'FiCI', 'acheteur': 'E1', 'vendeur': 'E2', 'montant': this.mtE2 * (1 - this.txProfit)
            }, {
                'operation': 'Paiement', 'acheteur': 'E2', 'vendeur': 'E1', 'montant': this.mtE2 * (1 - this.txProfit)
            }, {
                'operation': 'AchatTitres', 'acheteur': 'M', 'vendeur': 'E1', 'montant': this.mtE2 * (1 - this.txProfit)
            }, {
                'operation': 'Credit', 'acheteur': 'M', 'vendeur': 'E1', 'montant': this.mtE2 * (1 - this.txProfit)
            }, {
                'operation': 'RemboursementBq',
                'acheteur': 'E1',
                'vendeur': 'E1',
                'montant': this.mtE2 * (1 - this.txProfit)
            }, {
                'operation': 'Credit',
                'acheteur': 'E1',
                'vendeur': 'E1',
                'montant': this.mtE2 * (1 - this.txProfit) * -1
            }, {
                'operation': 'RemboursementBq',
                'acheteur': 'E2',
                'vendeur': 'E2',
                'montant': this.mtE2 * (1 - this.txProfit)
            }, {
                'operation': 'FiCI',
                'acheteur': 'M',
                'vendeur': 'M',
                'montant': this.mtE2 * (1 - this.txProfit)
            },
            /*       //!*****************ajustement temporaire***********************!/
               {
       'operation': 'Credit',
       'acheteur': 'M',
       'vendeur': 'E1',
       'montant': this.mtAmortit * (1 - this.txProfit)*2
   },  */

        ]
    }

    getListAmort() { //!*****************cycle AMORTISSEMENT***********************!/
        return [
            // Production E1 avec utilisation du capital
            {
                'operation': 'Production',
                'acheteur': 'E1',
                'vendeur': 'M',
                'montant': this.mtAmortit
            }, {
                'operation': 'RevenusSal',
                'acheteur': 'M',
                'vendeur': 'E1',
                'montant': this.mtAmortit
            }, {
                'operation': 'Paiement',
                'acheteur': 'E1',
                'vendeur': 'M',
                'montant': this.mtAmortit
            },// Production E2
            {
                'operation': 'Production', 'acheteur': 'E2', 'vendeur': 'M', 'montant': this.mtAmortit
            }, {
                'operation': 'Depreciation',
                'acheteur': 'E2',
                'vendeur': 'E2',
                'montant': this.mtAmortit * (1 - this.txProfit)
            }, {
                'operation': 'RevenusSal',
                'acheteur': 'M',
                'vendeur': 'E2',
                'montant': this.mtAmortit
            }, {
                'operation': 'FiCI', 'acheteur': 'E2', 'vendeur': 'E2', 'montant': this.mtAmortit * (1 - this.txProfit)
            }, {
                'operation': 'Credit',
                'acheteur': 'E2',
                'vendeur': 'E2',
                'montant': this.mtAmortit * (1 - this.txProfit)
            }, {
                'operation': 'Paiement',
                'acheteur': 'E2',
                'vendeur': 'M',
                'montant': this.mtAmortit
            },/*
            {
                'operation': 'ConsommationIntermediaire',
                'acheteur': 'E2',
                'vendeur': 'E1',
                'montant': this.mtAmortit * (1 - this.txProfit)
            },{
                'operation': 'FiCI', 'acheteur': 'E1', 'vendeur': 'E2', 'montant': this.mtAmortit * (1 - this.txProfit)
            },{
                'operation': 'Paiement',
                'acheteur': 'E2',
                'vendeur': 'E1',
                'montant':  this.mtAmortit
            },*///            Remboursement du crédit des ménages
            {
                'operation': 'RemboursementBq', 'acheteur': 'M', 'vendeur': 'M', 'montant': this.mtAmortit
            }, {
                'operation': 'Credit', 'acheteur': 'M', 'vendeur': 'M', 'montant': this.mtAmortit * -1
            },// Consommation
            {
                'operation': 'Consommation',
                'acheteur': 'M',
                'vendeur': 'E2',
                'montant': this.mtAmortit * 2
            }, {
                'operation': 'Paiement',
                'acheteur': 'M',
                'vendeur': 'E2',
                'montant': this.mtAmortit * 2
            },// E2 achète des immobilisations - amortissement réel
            {
                'operation': 'AchatImmob',
                'acheteur': 'E2',
                'vendeur': 'E1',
                'montant': this.mtAmortit * (1 - this.txProfit)
            }, {
                'operation': 'FiCI', 'acheteur': 'E1', 'vendeur': 'E2', 'montant': this.mtAmortit * (1 - this.txProfit)
            }, {
                'operation': 'Paiement',
                'acheteur': 'E2',
                'vendeur': 'E1',
                'montant': this.mtAmortit * (1 - this.txProfit)
            },/*
            {
                'operation': 'RemboursementBq', 'acheteur': 'E1', 'vendeur': 'E1', 'montant': this.mtAmortit
            },*/{
                'operation': 'RemboursementBq', 'acheteur': 'E2', 'vendeur': 'E2', 'montant': this.mtAmortit * 2
            }, {
                'operation': 'Credit',
                'acheteur': 'E2',
                'vendeur': 'E2',
                'montant': this.mtAmortit * (1 - this.txProfit) * -1
            }, {
                'operation': 'RemboursementBq', 'acheteur': 'M', 'vendeur': 'M', 'montant': this.mtAmortit * -1
            },// // Production duale E1
            {
                'operation': 'Production',
                'acheteur': 'E1',
                'vendeur': 'M',
                'montant': this.mtAmortit
            }, {
                'operation': 'RevenusSal',
                'acheteur': 'M',
                'vendeur': 'E1',
                'montant': this.mtAmortit
            }, {
                'operation': 'Paiement',
                'acheteur': 'E1',
                'vendeur': 'M',
                'montant': this.mtAmortit
            },//Expropriation des moyens de production par vente de titres (si oui → comptabiliser dans CN)
            {
                'operation': 'AchatTitres', 'acheteur': 'M', 'vendeur': 'E2', 'montant': this.mtAmortit
            }, {
                'operation': 'Paiement', 'acheteur': 'M', 'vendeur': 'E2', 'montant': this.mtAmortit
            },// E2 achète des immobilisations - amortissement réel
            {
                'operation': 'AchatImmob',
                'acheteur': 'E2',
                'vendeur': 'E1',
                'montant': this.mtAmortit * (1 - this.txProfit)
            }, {
                'operation': 'FiCI', 'acheteur': 'E1', 'vendeur': 'E2', 'montant': this.mtAmortit * (1 - this.txProfit)
            }, {
                'operation': 'Paiement',
                'acheteur': 'E2',
                'vendeur': 'E1',
                'montant': this.mtAmortit * (1 - this.txProfit)
            }, {
                'operation': 'RemboursementBq', 'acheteur': 'E2', 'vendeur': 'E2', 'montant': this.mtAmortit
            }, {
                'operation': 'Credit', 'acheteur': 'M', 'vendeur': 'M', 'montant': this.mtAmortit
            },
        ]
    }

    getListInternat() {
        return [
            ...this.getListXstd(),
            ...this.getListMstd(),
            ...this.getListSoldeInt(),
        ]
    }

    /*
    * Exportations nettes
     */
    getListXstd() {
        if (this.xport <= 0) return [];

        const list = [
            {
                'operation': 'Exportation',
                'acheteur': 'Rdm',
                'vendeur': 'E3',
                'montant': this.xport * (1 - this.txProfit)
            }, {
                'operation': 'FiX', 'acheteur': 'Rdm', 'vendeur': 'E3', 'montant': this.xport * (1 - this.txProfit)
            }

        ];
        return list;
    }

    /*
    * Importation nette hors monnaie internationale
    */
    getListMstd() {
        if (this.mport <= 0) return [];
        const list = [{
            'operation': 'Importation',
            'acheteur': 'E3',
            'vendeur': 'Rdm',
            'montant': this.mport * (1 - this.txProfit)
        }, {
            'operation': 'FiM', 'acheteur': 'E3', 'vendeur': 'Rdm', 'montant': this.mport * (1 - this.txProfit)
        },
        ]
        return list;
    }

    getListSoldeInt() {
        const list = [];
        if (this.#delta < 0 && this.#mInter === true) {
            list.push({
                'operation': 'AchatTitres', 'acheteur': 'E3', 'vendeur': 'Rdm', 'montant': Math.abs(this.#delta)
                },
                {
                    'operation': 'FiReglementInternationalExcedent', 'acheteur': 'E3', 'vendeur': 'BCdm', 'montant': Math.abs(this.#delta)
                },{
                    'operation': 'RemboursementBq', 'acheteur': 'Rdm', 'vendeur': 'Rdm', 'montant': this.#delta*-1
                },{
                'operation': 'RembCredit', 'acheteur': 'BC', 'vendeur': 'E3', 'montant': this.#delta*-1
                },{
                    'operation': 'RembCreditBCdm', 'acheteur': 'BC', 'vendeur': 'BC', 'montant': this.#delta*-1
                },

            );
        }
        if (this.#delta > 0 && this.#mInter===false) {
            list.push(
                {
                    'operation': 'AchatTitres', 'acheteur': 'Rdm', 'vendeur': 'E3', 'montant': this.#delta
                },
                {
                    'operation': 'FiReglementInternational', 'acheteur': 'BCdm', 'vendeur': 'E3', 'montant': this.#delta
                }, {
                    'operation': 'RemboursementBq', 'acheteur': 'E3', 'vendeur': 'E3', 'montant': this.#delta
                },{
                    'operation': 'RembCredit', 'acheteur': 'E3', 'vendeur': 'BC', 'montant': this.#delta
                },{
                    'operation': 'RembCreditBCdm', 'acheteur': 'BC', 'vendeur': 'BC', 'montant': this.#delta
                }
            );
        }
        if (this.#delta > 0 && this.#mInter === true) {
            list.push({
                'operation': 'FIEscompteInternational', 'acheteur': 'BCdm', 'vendeur': 'E3', 'montant': this.#delta
            });
        }
        return list;
    }

    /*
    * Importation nette monnaie internationale
    */
    getListMint() {
        if (this.mport <= 0) return [];
        const list = [{
            'operation': 'ConsommationIntermediaire',
            'acheteur': 'E3',
            'vendeur': 'Rdm',
            'montant': this.mport * (1 - this.txProfit)
        }, {
            'operation': 'FiCI', 'acheteur': 'Rdm', 'vendeur': 'E3', 'montant': this.mport * (1 - this.txProfit)
        }, {
            'operation': 'Credit', 'acheteur': 'E3', 'vendeur': 'Rdm', 'montant': this.mport
        },
        ]
        if (this.#delta > 0) {
            list.push(
                {
                    'operation': 'FIEscompteInternational', 'acheteur': 'BCdm', 'vendeur': 'E3', 'montant': this.#delta
                },
            )
        }
        return list;
    }


    /**
     * Solde extérieur : importations - exportations (M - X)
     * @returns {number}
     */
    get getDelta() {
        return this.#delta ?? 0;
    }

    get getTypes() {
        return OperationClassifications;
    }
}
