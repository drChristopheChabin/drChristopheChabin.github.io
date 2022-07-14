
class Controller {
    constructor(model, view) {
        this.model = model
        this.view = view
        this.OnParamChanged()
    }
    OnParamChanged=()=>{
        //this.model.validerBilan()
        //console.log(this.model.getOperationsComptes())
        this.model.bindFormValidate(this.onFormValidate)
        this.view.generate_form()
        this.view.bindAgregats(this.handelLoadParam)
    }

    empty=(balise)=> {
       // console.log( balise)
        //if(balise!==null)
        if(balise.length>0){
           // console.log('pass')
            //document.body.removeChild(balise)
            //balise.remove()
            for (const elem of balise) {
                elem.remove();
            }
        }
    }
    handelLoadParam=(textinput,iteration)=>{
        this.model.loadParam(textinput,iteration)
    }
    onFormValidate=()=>{
        this.empty(document.querySelectorAll(".balise"))
        this.view.displayMicro(this.model.getOperationsAgents)
        this.view.displayTEE(this.model.getOperationsComptes)
        this.view.displayTOF(this.model.getOperationsComptes)
        this.view.displayOperations(this.model.getLesOperations,this.model.getLesTypes)
    }

}
export{Controller}
