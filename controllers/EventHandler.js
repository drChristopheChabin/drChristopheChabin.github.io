/**
 * Gestionnaire centralisé des événements de l'application
 */
export class EventHandler {
    constructor() {
        this._handlers = new Map();
        this._iteration = -1;
    }

    /**
     * Enregistre un gestionnaire d'événement
     * @param {string} eventName - Nom de l'événement
     * @param {Function} handler - Fonction de gestion
     */
    register(eventName, handler) {
        this._handlers.set(eventName, handler);
    }

    /**
     * Récupère un gestionnaire enregistré
     * @param {string} eventName - Nom de l'événement
     * @returns {Function|undefined}
     */
    get(eventName) {
        return this._handlers.get(eventName);
    }

    /**
     * Lie les événements du formulaire
     * @param {HTMLFormElement} form - Élément formulaire
     * @param {Function} submitHandler - Gestionnaire de soumission
     * @param {Function} resetHandler - Gestionnaire de réinitialisation
     */
    bindFormEvents(form, submitHandler, resetHandler) {
        if (!form) {
            console.error('Form element not found');
            return;
        }

        // Événement de soumission
        form.addEventListener('submit', (event) => {
            event.preventDefault();
            this._handleFormSubmit(event, submitHandler);
        });

        // Événement de réinitialisation
        form.addEventListener('reset', (event) => {
            this._handleFormReset(event, resetHandler);
        });
    }

    /**
     * Gère la soumission du formulaire
     * @param {Event} event - Événement de soumission
     * @param {Function} handler - Gestionnaire personnalisé
     * @private
     */
    _handleFormSubmit(event, handler) {
        const submitterId = event.submitter?.id ?? document.activeElement?.id ?? '';

        if (submitterId === 'envoyer') {
            this._iteration = -1;
        } else if (submitterId === 'pasApas') {
            this._iteration++;
        }

        const inputs = this._getFormData(event.target);

        if (handler && typeof handler === 'function') {
            handler(inputs, this._iteration);
        }
    }

    /**
     * Gère la réinitialisation du formulaire
     * @param {Event} event - Événement de réinitialisation
     * @param {Function} handler - Gestionnaire personnalisé
     * @private
     */
    _handleFormReset(event, handler) {
        if (handler && typeof handler === 'function') {
            handler();
        } else {
            // Comportement par défaut : recharge la page
            window.location.reload();
        }
    }

    /**
     * Récupère les données du formulaire
     * @param {HTMLFormElement} form - Formulaire
     * @returns {NodeList} Liste des inputs
     * @private
     */
    _getFormData(form) {
        return form.querySelectorAll('input');
    }

    /**
     * Lie un événement de clic à un élément
     * @param {HTMLElement} element - Élément DOM
     * @param {Function} handler - Gestionnaire de clic
     */
    bindClick(element, handler) {
        if (!element) return;

        element.addEventListener('click', (event) => {
            if (handler && typeof handler === 'function') {
                handler(event);
            }
        });
    }

    /**
     * Lie un événement de changement à un élément
     * @param {HTMLElement} element - Élément DOM
     * @param {Function} handler - Gestionnaire de changement
     */
    bindChange(element, handler) {
        if (!element) return;

        element.addEventListener('change', (event) => {
            if (handler && typeof handler === 'function') {
                handler(event);
            }
        });
    }

    /**
     * Lie un événement d'input à un élément
     * @param {HTMLElement} element - Élément DOM
     * @param {Function} handler - Gestionnaire d'input
     */
    bindInput(element, handler) {
        if (!element) return;

        element.addEventListener('input', (event) => {
            if (handler && typeof handler === 'function') {
                handler(event);
            }
        });
    }

    /**
     * Supprime tous les gestionnaires d'événements d'un élément
     * @param {HTMLElement} element - Élément DOM
     */
    unbindAll(element) {
        if (!element) return;

        const clone = element.cloneNode(true);
        element.parentNode.replaceChild(clone, element);
        return clone;
    }

    /**
     * Réinitialise l'itération
     */
    resetIteration() {
        this._iteration = -1;
    }

    /**
     * Obtient l'itération actuelle
     * @returns {number}
     */
    get iteration() {
        return this._iteration;
    }

    /**
     * Définit l'itération
     * @param {number} value - Nouvelle valeur d'itération
     */
    set iteration(value) {
        this._iteration = value;
    }

    /**
     * Nettoie tous les gestionnaires enregistrés
     */
    clear() {
        this._handlers.clear();
        this._iteration = -1;
    }
}

