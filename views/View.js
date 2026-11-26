import { CnRenderer } from './components/CnRenderer.js';

export class View {
    constructor() {
        this._iteration = -1
        this.#initializeDOM();
        this.cnRenderer = new CnRenderer(this.col1, this.col2);
    }

    /**
     * Initialise la structure DOM de base
     */
    #initializeDOM() {
        this.app = this.#getElement('#root');
        this.app.className = 'row';

        // Créer l'offcanvas et son bouton (Le panneau et le bouton sont universels)
        this.offcanvas = this.#createElement('button', 'btn btn-primary');
        this.offcanvas.type = 'button';
        this.offcanvas.setAttribute('data-bs-toggle', 'offcanvas');
        this.offcanvas.setAttribute('data-bs-target', '#offcanvasRight');
        this.offcanvas.textContent = 'Choisir un paramétrage';

        this.col0 = this.#createElement('div', 'offcanvas offcanvas-end');
        this.col0.id = 'offcanvasRight';
        this.col0.tabIndex = -1;

        const header = this.#createElement('div', 'offcanvas-header');
        const titleH5 = this.#createElement('h5', 'offcanvas-title');
        titleH5.textContent = 'Choisir un paramétrage';
        const closeBtn = this.#createElement('button', 'btn-close');
        closeBtn.setAttribute('data-bs-dismiss', 'offcanvas');
        header.append(titleH5, closeBtn);

        this.col00 = this.#createElement('div', 'offcanvas-body');
        this.col0.append(header, this.col00);

        // Colonnes principales
        this.col1 = this.#createElement('div', 'col');
        this.col2 = this.#createElement('div', 'col display');

        // Titre
        this.title = this.#createElement('h1');
        this.title.textContent = 'Modèle de Comptabilité Nationale';

        this.app.append(this.title, this.offcanvas, this.col0, this.col1, this.col2);

    }

    /**
     * Crée un élément avec une classe CSS optionnelle
     */
    #createElement(tag, className) {
        const element = document.createElement(tag);
        if (className) {
            className.split(' ').forEach(cls => element.classList.add(cls));
        }
        return element;
    }

    /**
     * Récupère un élément du DOM
     */
    #getElement(selector) {
        return document.querySelector(selector)
    }

    generate_form() {
        // Cette méthode doit être implémentée par les classes filles
        console.warn('generate_form non implémenté dans la classe de base View');
    }

    /**
     * Branche les événements du formulaire sur les gestionnaires du contrôleur.
     * La vue écoute le DOM ; le contrôleur décide quoi faire.
     * @param {Function} onSubmit - Appelé avec (inputs, action) ; action = id du bouton cliqué ('envoyer', 'pasApas')
     * @param {Function} onReset - Appelé lors de la réinitialisation du formulaire
     */
    bindForm(onSubmit, onReset) {
        if (!this.form) {
            console.error('Formulaire non disponible pour lier les événements');
            return;
        }

        this.form.addEventListener('submit', event => {
            event.preventDefault();
            const action = event.submitter?.id ?? document.activeElement?.id ?? '';
            onSubmit(this.form.querySelectorAll('input, select'), action);
        });

        this.form.addEventListener('reset', () => onReset());
    }

    /**
     * Retourne le conteneur du formulaire
     */
    get formContainer() {
        return this.col00;
    }

    // Méthodes d'affichage publiques
    displayMicro(agents) {
        agents.forEach(agent => {
            // Toujours afficher les agents principaux (E1-E3, M, B)
            // Pour les autres (Rdm, BCdm, BC), n'afficher que s'ils ont une activité (bilan non nul)
            const primaryAgents = ['E1', 'E2', 'E3', 'M', 'B'];
            const isPrimary = primaryAgents.includes(agent.getNom);

            const bilan = agent.getBilan;
            const hasActivity = bilan.some(row =>
                row.some(acc => {
                    const key = Object.keys(acc)[0];
                    return acc[key] !== 0;
                })
            );

            if (isPrimary || hasActivity) {
                this.cnRenderer.generateAgentTable(agent);
            }
        });
    }

    displayTEE(comptes) {
        if (comptes?.getTEE) {
            this.cnRenderer.generateTEE(comptes.getTEE);
        }
    }

    displayTOF(comptes) {
        if (comptes?.getTOF) {
            this.cnRenderer.generateTOF(comptes.getTOF);
        }
    }

    displayOperations(operations, types) {
        this.cnRenderer.generateOperations(operations, types);
    }

    /**
     * Nettoie les résultats affichés dans le DOM
     */
    clearResults() {
        const elements = document.querySelectorAll('.balise');
        elements.forEach(element => element.remove());
    }

    /**
     * Affiche l'ensemble des résultats
     * @param {Object} results
     */
    displayResults(results) {
        if (!results || Object.keys(results).length === 0) return;

        if (results.agents) this.displayMicro(results.agents);
        if (results.comptes) {
            this.displayTEE(results.comptes);
            this.displayTOF(results.comptes);
        }
        if (results.balancePaiements) {
            this.cnRenderer.generateBalancePaiements(results.balancePaiements);
        }
        if (results.operations) {
            this.displayOperations(results.operations, results.operationTypes);
        }
    }
}
