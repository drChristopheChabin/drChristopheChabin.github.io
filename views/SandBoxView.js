import { View } from './View.js';
import { FormBuilder } from './FormBuilder.js';

export class SandBoxView extends View {
    constructor() {
        super();
        this.formBuilder = new FormBuilder();
    }

    /**
     * Génère le formulaire spécifique au mode Sandbox
     * @param {Object} OperationType - Les types d'opérations servis par le modèle ou les constantes
     */
    generateForm(OperationType) {
        console.log("SandBoxView: Génération du formulaire Sandbox");
        const builder = this.formBuilder;
        const operationValues = Object.keys(OperationType);

        this.form = builder.createForm();

        operationValues.forEach(opKey => {
            const opValue = OperationType[opKey];
            builder.addCheckbox({
                id: opValue,
                name: opValue,
                label: opValue
            });
        });

        this.form = builder
            .addDivider()
            .addButtonGroup([
                { id: 'envoyer', text: 'Envoyer', type: 'submit', className: 'btn btn-primary', dismissOffcanvas: true },
                { id: 'raz', text: 'RAZ', type: 'reset', className: 'btn btn-warning', dismissOffcanvas: true },
            ])
            .build();

        this.formContainer.innerHTML = '';
        this.formContainer.appendChild(this.form);
    }
}
