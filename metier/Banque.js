class Banque {
    _achtr;
    #_colonneT = 'B';
    #actif = {
        'BC': 0,
        'M': 0,
        'Bfi': 0,
        'Rdm': 0
    };
    #passif = {
        'BC': 0,
        'M': 0,
        'Bfi': 0,
        'Rdm': 0
    };
    #bilan;

    constructor(achtr) {
        this._achtr = achtr;

    }

    get getNom() {
        return this._achtr;
    }

    /**
     * @return string
     */
    get getColonneT() {
        return this.#_colonneT;
    }
    get getactif() {
        return this.#actif;
    }

    get getpassif() {
        return this.#passif;
    }

   /* get getBilan() {
        let obj1
        let modifActif
        obj1 = Object.assign({}, this.#actif)

        modifActif = Object.fromEntries(
            Object.entries(this.#passif).map(entry => [entry[0].toLowerCase(), entry[1]])
        )

        this.#bilan = Object.assign({}, obj1, modifActif)
        //console.log(this.#bilan)
        return this.#bilan;
    }*/
    get getBilan() {
        this.#bilan = [];
        let i = 0
        for (let unCpt in this.#actif) {
            this.#bilan[i] = [{[unCpt]: this.#actif[unCpt]}]
            i++
        }
        i = 0
        for (let unCpt in this.#passif) {
            this.#bilan[i].push({[unCpt]: this.#passif[unCpt]})
            i++
        }
        //this.#bilan = Object.assign({}, this.#actif, this.#passif)
        //console.log(this.#bilan)
        return this.#bilan;
    }

    BanqueFinActif(ent, montant) {
        if (!this.#actif.hasOwnProperty(ent)) {
            Object.defineProperty(this.#actif, ent, {
                value: 0,
                writable: true,
                enumerable: true,
                configurable: true,
            });
        }
        if (!this.#passif.hasOwnProperty(ent)) {
            Object.defineProperty(this.#passif, ent, {
                value: 0,
                writable: true,
                enumerable: true,
                configurable: true,
            });
        }

        this.#actif[ent] += montant;
        this.getBilan;
    }

    BanqueFinPassif(ent,montant){
        if (!this.#passif.hasOwnProperty(ent)) {
            Object.defineProperty(this.#passif, ent, {
                value: 0,
                writable: true,
                enumerable: true,
                configurable: true,
            });
        }
        if (!this.#actif.hasOwnProperty(ent)) {
            Object.defineProperty(this.#actif, ent, {
                value: 0,
                writable: true,
                enumerable: true,
                configurable: true,
            });
        }

        this.#passif[ent] += montant;
        this.getBilan;

    }


}
export {Banque}
