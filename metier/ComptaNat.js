class ComptaNat {
    #_achtr = 'Cn';
    #actif_TEE = {
        'E': {
            'prd': 0,
            'ci': 0,
            'va': 0,
            'sal': 0,
            'rns': 0,
            'rdb': 0,
            'c': 0,
            'e': 0,
            'st': 0,
            'fbcf': 0,
            'solde': 0
        },
        'M': {
            'prd': 0,
            'ci': 0,
            'va': 0,
            'sal': 0,
            'rns': 0,
            'rdb': 0,
            'c': 0,
            'e': 0,
            'st': 0,
            'fbcf': 0,
            'solde': 0
        },
        'Ext': {
            'prd': 0,
            'ci': 0,
            'va': 0,
            'sal': 0,
            'rns': 0,
            'rdb': 0,
            'c': 0,
            'e': 0,
            'st': 0,
            'fbcf': 0,
            'solde': 0
        }
    };
    #passif_TEE = {
        'e': {
            'prd': 0,
            'ci': 0,
            'va': 0,
            'sal': 0,
            'rns': 0,
            'rdb': 0,
            'c': 0,
            'e': 0,
            'st': 0,
            'fbcf': 0,
            'solde': 0
        },
        'm': {
            'prd': 0,
            'ci': 0,
            'va': 0,
            'sal': 0,
            'rns': 0,
            'rdb': 0,
            'c': 0,
            'e': 0,
            'st': 0,
            'fbcf': 0,
            'solde': 0
        },
        'ext': {
            'prd': 0,
            'ci': 0,
            'va': 0,
            'sal': 0,
            'rns': 0,
            'rdb': 0,
            'c': 0,
            'e': 0,
            'st': 0,
            'fbcf': 0,
            'solde': 0
        }
    };
    #actif_TOF = {
        'BC': 0,
        'E': 0,
        'M': 0,
        'Ext': 0
    };
    #passif_TOF = {
        'bC': 0,
        'e': 0,
        'm': 0,
        'ext': 0
    };
    #bilan_TEE;
    #bilan_TOF;


    get getNom() {
        return this.#_achtr;
    }

    get getactif_TEE() {
        return this.#actif_TEE;
    }
    get getTEE(){
        return this.#bilan_TEE;
    }
    get getTOF(){
        return this.#bilan_TOF;
    }
    getBilanTEE() {
        let objCopy
        let modifActif
        let modifActifExt
        let actiftee
        let modifActife
        let agregatT = []
        let agregat_TP = []
        let items_TEE = 11
        this.#bilan_TEE = [];
        let i = 0
        let j = 0
        let n = 0
        for (i = 0; i < items_TEE; i++) {
            this.#bilan_TEE[i] = new Array(6)
        }
        i = 0
        for (let agregat in this.#actif_TEE) {
            // console.log("agregat"+agregat)
            if (agregat === 'E') {
                agregatT[i] = Object.entries(this.#actif_TEE[agregat]).map(entry => [entry[0], entry[1]])
                // console.log(agregatT[i])
                i++

                // objCopy = Object.assign({}, this.#actif_TEE.E)
            } else {
                agregatT[i] = Object.entries(this.#actif_TEE[agregat]).map(entry => [entry[0] + agregat, entry[1]])
                // console.log(agregatT[i] )
                i++
                /*
                    modifActifExt = Object.fromEntries(
                        Object.entries(this.#actif_TEE['Ext']).map(entry => [entry[0] + 'Ext', entry[1]])
                    )
                    actiftee = Object.assign({}, objCopy, modifActif, modifActifExt)
                }*/
            }
        }

        for (j = 0; j < 3; j++) {
            for (i = 0; i < items_TEE; i++) {
                this.#bilan_TEE[i][j] = agregatT[j][i]
            }

        }
        i = 0
        for (let agregat_P in this.#passif_TEE) {
            // console.log("agregat"+agregat)
            if (agregat_P === 'e') {
                agregat_TP[i] = Object.entries(this.#passif_TEE[agregat_P]).map(entry => [entry[0], entry[1]])
                // console.log(agregatT[i])
                i++

            } else {
                agregat_TP[i] = Object.entries(this.#passif_TEE[agregat_P]).map(entry => [entry[0] + agregat_P, entry[1]])
                // console.log(agregatT[i] )
                i++
            }
        }
        //console.log(agregat_TP)
        for (j = 0; j < 3; j++) {
            for (i = 0; i < items_TEE; i++) {
                n = j + 3
                this.#bilan_TEE[i][n] = agregat_TP[j][i]
            }

        }
        //console.log(this.#bilan_TEE)
        return this.#bilan_TEE;
    }

    getBilanTOF() {
        let i=0
        let n=0
        let items_TOF = 8
        this.#bilan_TOF = new Array(8)
        const actif=Object.entries(this.#actif_TOF).map(entry => [entry[0], entry[1]])
        const passif=Object.entries(this.#passif_TOF).map(entry => [entry[0], entry[1]])
        //console.log(passif)
        for (i = 0; i < items_TOF; i++) {

            if(i<4){
                this.#bilan_TOF[i] = actif[i]
            }
            else {

                n = i - 4
                this.#bilan_TOF[i] = passif[n]
            }
        }
        return this.#bilan_TOF;

    }

    TeeProduction(mt) {
        let casse = 'E'
        casse = casse.toLowerCase()
        this.#passif_TEE[casse].prd += mt;
        this.getBilanTEE();
    }

    TeeStock(mt) {
        this.#actif_TEE.E.st += mt;
        if (this.#actif_TEE.E.st < 0) {
            this.#actif_TEE.E.st = 0;
        }
        this.getBilanTEE();
    }

    TeeExport(mt) {
        this.#actif_TEE.Ext.prd += mt;
        this.getBilanTEE();
    }

    TeeImport(mt) {
        let casse = 'Ext'
        casse = casse.toLowerCase()
        this.#passif_TEE[casse].prd += mt;
        this.getBilanTEE();
    }

    TeeCInterm(mt) {
        this.#actif_TEE.E.ci += mt;
        this.getBilanTEE();
    }

    TeeRsal(mt) {
        this.#actif_TEE.E.sal += mt;
        this.getBilanTEE();
    }

    TeeRsalEM(mt) {
        let casse = 'M'
        casse = casse.toLowerCase()
        this.#passif_TEE[casse].sal += mt;
        this.getBilanTEE();
    }

    TeeRnsalEE(mt) {
        this.#actif_TEE.E.rns += mt;
        this.getBilanTEE();
    }

    TeeRnsalER(mt) {
        let casse = 'E'
        casse = casse.toLowerCase()
        this.#passif_TEE[casse].rns += mt;
        this.getBilanTEE();
    }

    TeeRnsalME(mt) {
        this.#actif_TEE.M.rns += mt;
        this.getBilanTEE();
    }

    TeeRnsalMR(mt) {
        let casse = 'M'
        casse = casse.toLowerCase()
        this.#passif_TEE[casse].rns += mt;
        this.getBilanTEE();
    }

    TeeCfinale(mt) {
        this.#actif_TEE.M.c += mt;
        this.getBilanTEE();
    }

    TeeFbcf(mt) {
        this.#actif_TEE.E.fbcf += mt;
        this.getBilanTEE();
    }

    actif_TOF(agt, mt, sign) {
        this.#actif_TOF[agt] += sign * mt;
        this.getBilanTOF();
    }

    passif_TOF(agt, mt, sign) {
        let casse = agt
        casse = casse.toLowerCase()
        this.#passif_TOF[casse] += sign * mt;
        this.getBilanTOF();
    }
}
export {ComptaNat}
