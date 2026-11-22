import { View } from './View.js';
import { FormBuilder } from './components/FormBuilder.js';

/**
 * Cycles proposés par l'écran « Cycles » (valeur = clé du cycle côté modèle)
 */
export const CYCLE_OPTIONS = [
    { value: 'profit', text: 'Cycle du profit' },
    { value: 'invest', text: "Cycle de l'investissement" },
    { value: 'amort', text: "Cycle de l'amortissement" },
    { value: 'xstd', text: 'Exportations nettes' }
];

export class CnView extends View {
    /**
     * @param {Object} [options]
     * @param {boolean} [options.cycleChoice=false] - Ajoute la liste de choix du cycle
     */
    constructor({ cycleChoice = false } = {}) {
        super();
        this.cycleChoice = cycleChoice;
    }

    generate_form() {
        const builder = new FormBuilder().createForm();

        if (this.cycleChoice) {
            builder.addSelect({
                id: 'cycle',
                name: 'cycle',
                label: 'Cycle à afficher',
                options: CYCLE_OPTIONS,
                defaultValue: CYCLE_OPTIONS[0].value
            });
        }

        this.form = builder
            .addTextField({ id: 'mtE1', name: 'mtE1', label: 'Montant E1', placeholder: '90', defaultValue: 90 })
            .addTextField({
                id: 'mtE2',
                name: 'mtE2',
                label: 'Montant E2 (correspond au profit investi)',
                placeholder: '25',
                defaultValue: 25
            })
            .addTextField({
                id: 'txProfit',
                name: 'txProfit',
                label: 'Montant taux de profit',
                placeholder: '0',
                defaultValue: 0
            })
            .addTextField({
                id: 'mtAmortit',
                name: 'mtAmortit',
                label: "Montant de l'amortissement",
                placeholder: '5',
                defaultValue: 5
            })
            .addTextField({
                id: 'xport',
                name: 'xport',
                label: 'Montant des Exportations',
                placeholder: '0',
                defaultValue: 0
            })
            .addTextField({
                id: 'mport',
                name: 'mport',
                label: 'Montant des Importations',
                placeholder: '0',
                defaultValue: 0
            })
            .addCheckbox({ id: 'mInter', name: 'mInter', label: 'La monnaie du pays est monnaie internationale' })
            .addDivider()
            .addButtonGroup([
                { id: 'envoyer', text: 'Envoyer', type: 'submit', className: 'btn btn-primary', dismissOffcanvas: true },
                { id: 'raz', text: 'RAZ', type: 'reset', className: 'btn btn-warning', dismissOffcanvas: true },
                { id: 'pasApas', text: 'Pas à Pas', type: 'submit', className: 'btn btn-primary' }
            ])
            .build();

        this.formContainer.appendChild(this.form);
    }
}
