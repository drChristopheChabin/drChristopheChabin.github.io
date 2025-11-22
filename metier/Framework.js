class Framework {
    mtE1;
    mtE2;
    txProfit;
    mtAmortit;

    constructor(mtE1, mtE2, txProfit, mtAmortit = 0,mtXport,mtMport) {
        if ((txProfit >= 0 && txProfit <= 100) && (mtE1 >= mtE2)) {
            this.mtE1 = (mtE1-(3*mtAmortit)-mtE2)/2;//90
            this.mtE2 = mtE2;//25
            this.txProfit = txProfit / 100;
			this.prdAmortit=mtE1-(3*mtE2);
            this.mtAmortit = mtAmortit;//5
            this.xport=mtXport;
            this.mport=mtMport;
        }
        //console.log(this.mtE1,this.mtE2,this.txProfit,this.mtAmortit)
    }


    getListProfit() {
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
            'operation': 'FiCredit', 'acheteur': 'E1', 'vendeur': 'E1', 'montant': this.mtE1 * (1 - this.txProfit)
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
                'operation': 'FiCredit',
                'acheteur': 'E1',
                'vendeur': 'E1',
                'montant': this.mtE1 * (1 - this.txProfit) * -1
        }, {
                'operation': 'Credit',
                'acheteur': 'E1',
                'vendeur': 'E1',
                'montant': this.mtE1 * (1 - this.txProfit) * -1
        },//!*****************cycle investisement***********************!/
        
            {
                'operation': 'Production', 'acheteur': 'E2', 'vendeur': 'M', 'montant': this.mtE2 * (1 - this.txProfit)
            }, {
                'operation': 'Paiement', 'acheteur': 'E2', 'vendeur': 'M', 'montant': this.mtE2 * (1 - this.txProfit)
            }, {
                'operation': 'RevenusSal', 'acheteur': 'M', 'vendeur': 'E2', 'montant': this.mtE2 * (1 - this.txProfit)
            },

            {
                'operation': 'AchatImmob', 'acheteur': 'E2', 'vendeur': 'E1', 'montant': this.mtE2 * (1 - this.txProfit)
            }, {
                'operation': 'FiCI', 'acheteur': 'E1', 'vendeur': 'E2', 'montant': this.mtE2 * (1 - this.txProfit)
            }, {
                'operation': 'Consommation',
                'acheteur': 'M',
                'vendeur': 'E2',
                'montant': this.mtE2 * (1 - this.txProfit)
            }, {
                'operation': 'Paiement', 'acheteur': 'M', 'vendeur': 'E2', 'montant': this.mtE2 * (1 - this.txProfit)
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
                'operation': 'FiCredit',
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
            //!*****************cycle AMORTISSEMENT***********************!/
          
              // Production E1 avec utilisation du capital
            {
                'operation': 'Production',
                'acheteur': 'E1',
                'vendeur': 'M',
                'montant': this.mtAmortit
            },{
                'operation': 'RevenusSal',
                'acheteur': 'M',
                'vendeur': 'E1',
                'montant': this.mtAmortit
            },{
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
            },{
                'operation': 'RevenusSal',
                'acheteur': 'M',
                'vendeur': 'E2',
                'montant': this.mtAmortit
            },{
                'operation': 'FiCI', 'acheteur': 'E2', 'vendeur': 'E2', 'montant': this.mtAmortit * (1 - this.txProfit)
            },{
                'operation': 'Credit',
                'acheteur': 'E2',
                'vendeur': 'E2',
                'montant': this.mtAmortit * (1 - this.txProfit)
            },{
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
            },{
                'operation': 'Credit', 'acheteur': 'M', 'vendeur': 'M', 'montant': this.mtAmortit * -1
            },// Consommation
            {
                'operation': 'Consommation',
                'acheteur': 'M',
                'vendeur': 'E2',
                'montant': this.mtAmortit*2
            },{
                'operation': 'Paiement',
                'acheteur': 'M',
                'vendeur': 'E2',
                'montant':  this.mtAmortit*2
            },// E2 achète des immobilisation - amortissement réel
            {
                'operation': 'AchatImmob',
                'acheteur': 'E2',
                'vendeur': 'E1',
                'montant': this.mtAmortit * (1 - this.txProfit)
            },{
                'operation': 'FiCI', 'acheteur': 'E1', 'vendeur': 'E2', 'montant': this.mtAmortit * (1 - this.txProfit)
            },{
                'operation': 'Paiement',
                'acheteur': 'E2',
                'vendeur': 'E1',
                'montant': this.mtAmortit * (1 - this.txProfit)
            },/*
            {
                'operation': 'RemboursementBq', 'acheteur': 'E1', 'vendeur': 'E1', 'montant': this.mtAmortit
            },*/{
                'operation': 'RemboursementBq', 'acheteur': 'E2', 'vendeur': 'E2', 'montant': this.mtAmortit*2
            },{
                'operation': 'RemboursementBq', 'acheteur': 'M', 'vendeur': 'M', 'montant': this.mtAmortit*-1
            },{
                'operation': 'Credit',
                'acheteur': 'E2',
                'vendeur': 'E2',
                'montant': this.mtAmortit * (1 - this.txProfit)*-1
            },// // Production duale E1 
            {
                'operation': 'Production',
                'acheteur': 'E1',
                'vendeur': 'M',
                'montant': this.mtAmortit
            },{
                'operation': 'RevenusSal',
                'acheteur': 'M',
                'vendeur': 'E1',
                'montant': this.mtAmortit
            },{
                'operation': 'Paiement',
                'acheteur': 'E1',
                'vendeur': 'M',
                'montant': this.mtAmortit
            },//Expropriation des moyens de production par vente de titres (si oui → comptabiliser dans CN)
            {
                'operation': 'AchatTitres', 'acheteur': 'M', 'vendeur': 'E2', 'montant': this.mtAmortit
            }, {
                'operation': 'Paiement', 'acheteur': 'M', 'vendeur': 'E2', 'montant': this.mtAmortit
            },// E2 achète des immobilisation - amortissement réel
            {
                'operation': 'AchatImmob',
                'acheteur': 'E2',
                'vendeur': 'E1',
                'montant': this.mtAmortit * (1 - this.txProfit)
            },{
                'operation': 'FiCI', 'acheteur': 'E1', 'vendeur': 'E2', 'montant': this.mtAmortit * (1 - this.txProfit)
            },{
                'operation': 'Paiement',
                'acheteur': 'E2',
                'vendeur': 'E1',
                'montant': this.mtAmortit * (1 - this.txProfit)
            },{
                'operation': 'RemboursementBq', 'acheteur': 'E2', 'vendeur': 'E2', 'montant': this.mtAmortit
            },{
                'operation': 'Credit', 'acheteur': 'M', 'vendeur': 'M', 'montant': this.mtAmortit
            },
            
            ]
    }

    getListInvest() {
    }

    getListAmort() {
    }

    get getTypes() {
        return {
            'Production': 'R'
            , 'ConsommationIntermediaire': 'R'
            , 'FiCI': 'R'
            , 'FiCredit': 'R'
            , 'RevenusSal': 'R'
            , 'Consommation': 'R'
            , 'AchatTitres': 'R'
            , 'RachatTitres': 'R'
            , 'AchatImmob': 'R'
            , 'Depreciation': 'R'
            , 'RevenusNonSal': 'R'
            , 'Paiement': 'M'
            , 'Credit': 'M'
            , 'RemboursementBq': 'R'
            , 'FiReglementInt': 'M'
            , 'EscompteInternational': 'M'

        }
    }

}
export {Framework}
