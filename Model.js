import {Operation} from './metier/Operation.js'
import{ComptaNat} from './metier/ComptaNat.js'
import{Framework} from './metier/Framework.js'
class Model {

    model;
    _operation;
    _agentsList;
    _staticList;
    _lesOperations

    constructor() {

        this._operation = new Operation()
        this._agentsList = this._operation.getAgents
        this._staticList = new ComptaNat();
        /*this._operation.InitialiseAgent()
        console.log(this._operation.getOperation)
        console.log(this._agentsList)
        console.log(this._operation.find('E1'))*/

    }

    bindFormValidate(callback) {
        this._onFormValidate = callback;
    }

    loadParam(param, iteration) {
        this._iteration=iteration

        for (let i = 0; i < param.length; i++) {
            //console.log(`${param[i].name}:${param[i].value}`)

            switch (param[i].name) {
                case 'mtE1':
                    this._mtE1 = param[i].value | 0;
                    break;
                case 'mtE2':
                    this._mtE2 = param[i].value | 0;
                    break;
                case 'txProfit':
                    this._txProfit = param[i].value | 0;
                    break
                case 'mtAmortit':
                    this._mtAmortit = param[i].value | 0;
                    break;
            }
        }
        if (this._iteration === -1) {
            this._validerBilan()
        } else {
            this._validerBilanPasApas()
        }

        this._onFormValidate()
    }

    _loadFramework() {
        let choix = 'getListProfit'
        this.model = new Framework(this._mtE1, this._mtE2, this._txProfit, this._mtAmortit);
        // console.log(eval(`this.model.${choix}()`))
        return this._lesOperations = eval(`this.model.${choix}()`);

    }

    _validerOperation(operation, acheteur, vendeur, montant) {
        return eval(`this._operation.${operation}(acheteur, vendeur, montant)`)
    }

    _validerBilan() {
        let acheteur = ''
        let vendeur = ''
        const lesOperations = this._loadFramework()

        for (let uneOperation of lesOperations) {
            // console.log(uneOperation)
            acheteur = this._operation.find(uneOperation.acheteur)
            //console.log(acheteur)
            vendeur = this._operation.find(uneOperation.vendeur)
            //console.log(vendeur)
            //console.log(uneOperation.operation)
            this._validerOperation(uneOperation.operation, acheteur, vendeur, uneOperation.montant)

        }
        //console.log(this._operation.getInfos)
    }

    _validerBilanPasApas() {
        let acheteur = ''
        let vendeur = ''
        const lesOperations = this._loadFramework()

        if(this._iteration<lesOperations.length) {
            const uneOperation=lesOperations[this._iteration]
            acheteur = this._operation.find(uneOperation.acheteur)
            vendeur = this._operation.find(uneOperation.vendeur)
            this._validerOperation(uneOperation.operation, acheteur, vendeur, uneOperation.montant)
        }
        else{
            this._iteration = -1
        }
        //console.log(this._operation.getInfos)
    }
    _listOperationPasApas(){
        let lesOperationsPasApas=[]
        for(let i=0;i<this._iteration+1;i++){
            lesOperationsPasApas[i]=this._lesOperations[i]
        }
        return lesOperationsPasApas
    }

    get getOperationsAgents() {

        //this.validerBilan()
        return this._agentsList
    }

    get getOperationsComptes() {
        return this._operation.getCN
    }

    get getLesOperations() {
        if(this._iteration===-1){
            return this._lesOperations
        }else{
            return this._listOperationPasApas()
        }

    }

    get getLesTypes() {
        return this.model.getTypes
    }

    afficheroperation() {
        console.log(this._agentsList)
        for (let unagent of this._agentsList) {
            console.log(`Le nom : ${unagent.getNom}`)
            console.log('actif')
            for (const property in unagent.getactif) {
                console.log(`${property}: ${unagent.getactif[property]}`);
            }
            console.log('Passif')
            for (const property in unagent.getpassif) {
                console.log(`${property}: ${unagent.getpassif[property]}`);
            }

        }
    }

    updateAgentList(agent) {
        for (let unagent of this._agentsList) {
            if (agent.getNom === unagent.getNom) {
                for (const property in unagent.getBilan) {
                    console.log(`${property} : ${agent.getBilan[property]}`)
                    console.log(`${property} : ${agent.getBilan[property]}`)
                }
            }
        }
    }
}
export{Model}
