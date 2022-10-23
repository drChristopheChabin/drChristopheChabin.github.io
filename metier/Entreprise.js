// ECMAScript 2015 - Es6
class Entreprise {
//les opérations réelles d'une entreprise
    _achtr;
    #_bqLoc;//string Banque
    #_colonneTof;
    #bilan;
    #actif = {'Immo': 0, 'St': 0, 'T': 0, 'Rdm': 0}
    #passif = {'K': 0, 'B': 0, 'Sal': 0, 'rdm': 0}

    constructor(achtr, colonneTof) {
        this._achtr = achtr;
        this.#_colonneTof = colonneTof;
        //Bdm est l'établissement financier de Bqm
        if (this._achtr === 'Rdm') {
            this.#_bqLoc = 'Bdm';
        } else {
            this.#_bqLoc = 'B';
        }
    }

    get getNom() {
        return this._achtr;
    }

    get getactif() {
        return this.#actif;
    }

    get getpassif() {
        return this.#passif;
    }

    get getBanque() {
        return this.#_bqLoc;
    }

    get getColonneTOF() {
        return this.#_colonneTof;
    }

    get getBilan() {
        this.#bilan = [];
        let i = 0
        for(i=0; i<Object.keys(this.#actif).length;i++){
            this.#bilan[i]=new Array(2)
        }

        i=0
        for (let unCpt in this.#actif) {
            this.#bilan[i][0]={[unCpt]: this.#actif[unCpt]}
            i++
        }
        i = 0
        for (let unCpt in this.#passif) {
            this.#bilan[i][1]={[unCpt]: this.#passif[unCpt]}
            i++
        }
        //this.#bilan = Object.assign({}, this.#actif, this.#passif)
        //console.log(this.#bilan)
        return this.#bilan;
    }

    /****************Fonction privée************/
    _majBilan(v) {
        this.getBilan;
        v.getBilan;
    }

    _Immobilisation(mont, sign) {
        this.#actif.Immo += sign * mont;
    }

    _Kapital(mont, sign) {
        this.#passif.K += sign * mont;
    }

    _Stock(mont, sign) {
        this.#actif['St'] += sign * mont;
       //
    }

    Banque(mont, sign) {
        this.#passif.B += sign * mont;
    }

    _Client(vd, mont, sign) {
        // console.log(vd)
        if (!this.#actif.hasOwnProperty(vd)) {
            Object.defineProperty(this.#actif, vd, {
                value: 0,
                writable: true,
                enumerable: true,
                configurable: true,
            });
        }
        if (!this.#passif.hasOwnProperty(vd.toLowerCase())) {
            Object.defineProperty(this.#passif, vd.toLowerCase(), {
                value: 0,
                writable: true,
                enumerable: true,
                configurable: true,
            });
        }
        if (this.#actif.hasOwnProperty(vd)) {
            this.#actif[vd] += sign * mont
        }

    }

    _Fournisseur(vd, mont, sign) {
        if (!this.#actif.hasOwnProperty(vd)) {
            Object.defineProperty(this.#actif, vd, {
                value: 0,
                writable: true,
                enumerable: true,
                configurable: true,
            });
        }
        if (!this.#passif.hasOwnProperty(vd.toLowerCase())) {
            Object.defineProperty(this.#passif, vd.toLowerCase(), {
                value: 0,
                writable: true,
                enumerable: true,
                configurable: true,
            });
        }
        vd = vd.toLowerCase()

        this.#passif[vd] += sign * mont;
    }

    _Tresorerie(mont, sign) {
        this.#actif.T += sign * mont;
    }

    _Salaire(mont, sign) {
        this.#passif.Sal += sign * mont;
    }
    get getStocks(){
        return this.#actif.St;
    }

    /***************Fonctions public*****************************/
    Production(vd, mt, txPrf = 0) {

        if (this._achtr !== 'M') {

            this._Stock(mt, 1);
            if (this.getStocks < 0) {
                this.#actif.St = 0;
            }
            this._Salaire(mt, 1);

            vd._Salaire(mt, 1);
            vd._Client(this._achtr, mt, 1);

            this._majBilan(vd);
            //var_dump(this);
        }

    }

    CI(vd, mt, txPrf = 0) {
        //Il faut nécessairement (en raison de la prog) que les agents soient des entreprises
        this._Stock(mt, 1);

/*        if (stock < 0) {
            this.#actif.St = 0;
        }*/
        this._Fournisseur(vd._achtr, mt, 1);

        vd._Stock(mt * (1 - txPrf), -1);

/*        if (stockVd < 0) {
            vd.#actif.St = 0;
        }*/
        vd._Client(this._achtr, mt, 1);


        this._majBilan(vd);
    }

    SalairesPayes(vd, mt, txPrf = 0) {
        this._Tresorerie(mt, 1);
        this._Client(vd._achtr, mt, -1);

        vd._Tresorerie(mt, -1);
        vd._Salaire(mt, -1);

        this._majBilan(vd);
    }

    RevenusNonSal(vd, mt, txPrf = 0) {
        //Le vendeur est le payeur
        this._Tresorerie(mt, 1);
        vd._Tresorerie(mt, -1);

        this._majBilan(vd);
    }

    Consommation(vd, mt, txPrf = 0) {
        this._Tresorerie(mt, -1);
        this._Salaire(mt, -1);

        vd._Tresorerie(mt, 1);
        vd._Stock(mt * (1 - txPrf), -1);
        if (vd.getStocks < 0) {
            vd.#actif.St = 0;
        }

        this._majBilan(vd);
    }

    Capital(vd, mt, txPrf = 0) {
        this._Immobilisation(mt, 1);
        this._Fournisseur(vd._achtr, mt, 1);

        vd._Stock(mt * (1 - txPrf), -1);
        // if (stock<0){this.#actif.St=0;}
        vd._Client(this._achtr, mt, 1);

        this._majBilan(vd);
    }

    Depreciation(vd, mt, txPrf = 0) {
        this._Immobilisation(mt, -1);
        this._Stock(mt, 1);
        if (this.getStocks < 0) {
            this.#actif.St = 0;
        }
        this._majBilan(vd);
    }

    CIPaid(vd, mt, txPrf = 0) {
        if (this._achtr !== vd.getNom) {
            this._Client(vd.getNom, mt, -1);
            this._Tresorerie(mt, 1);
            vd._Fournisseur(this._achtr, mt, -1);
            vd.Banque(mt, 1);
        } else {
            this._Tresorerie(mt, 1);
            this.Banque(mt, 1);
        }

        this._majBilan(vd);
    }

    Escompte(vd, mt, txPrf = 0) {
        this._majBilan(vd);
    }

    TitresAchat(vd, mt, txPrf = 0) {
        this._Immobilisation(mt, 1);
        this._Tresorerie(mt, -1);

        vd._Kapital(mt, 1);
        vd._Tresorerie(mt, 1);

        this._majBilan(vd);
    }

    TitresRemboursement(vd, mt, txPrf = 0) {

        this._Tresorerie(mt, -1);
        if (vd.getNom !== this.getNom) {
            this._Kapital(mt, -1);
            vd._Immobilisation(mt, -1);
            vd._Tresorerie(mt, 1);
        } else {
            this.Banque(mt, -1);
        }


        this._majBilan(vd);
    }

    RemboursementBq(vd, mt, txPrf = 0) {
        this.Banque(mt, -1);
        this._Tresorerie(mt, -1);

        this._majBilan(vd);
    }

   /* FiReglement(vd, mt, txPrf = 0) {
        this._Kapital(mt, 1);
        this._Tresorerie(mt, 1);
        this._majBilan(vd);
    }

    fiEscpti(vd, mt, txPrf = 0) {
        this._majBilan(vd);
    }*/
}
export{Entreprise}
