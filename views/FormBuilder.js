export class FormBuilder {
    constructor() {
        this.form = null;
        this.fields = [];
    }

    createElement(tag, className = '') {
        const element = document.createElement(tag);
        if (className) {
            className.split(' ').forEach(cls => element.classList.add(cls));
        }
        return element;
    }

    createForm() {
        this.form = this.createElement('form');
        this.fields = [];
        return this;
    }

    addTextField(config) {
        const {
            id, name, label, placeholder = '',
            defaultValue = '', type = 'text', required = false
        } = config;

        const labelEl = this.createElement('label', 'form-label');
        labelEl.setAttribute('for', id);
        labelEl.textContent = label;

        const inputEl = this.createElement('input', 'form-control');
        inputEl.type = type;
        inputEl.placeholder = placeholder;
        inputEl.defaultValue = defaultValue;
        inputEl.name = name;
        inputEl.id = id;

        if (required) inputEl.required = true;

        this.fields.push({ type: 'text', label: labelEl, input: inputEl });
        return this;
    }

    addCheckbox(config) {
        const { id, name, label, defaultChecked = false } = config;

        const divCheck = this.createElement('div', 'form-check');
        const inputEl = this.createElement('input', 'form-check-input');
        inputEl.type = 'checkbox';
        inputEl.name = name;
        inputEl.id = id;
        inputEl.checked = defaultChecked;

        const labelEl = this.createElement('label', 'form-check-label');
        labelEl.setAttribute('for', id);
        labelEl.textContent = label;

        divCheck.append(inputEl, labelEl);
        this.fields.push({ type: 'checkbox', container: divCheck });
        return this;
    }

    addButtonGroup(buttons) {
        const group = this.createElement('div', 'btn-group mt-3');
        group.setAttribute('role', 'group');

        buttons.forEach(btnConfig => {
            const button = this.createElement('button', btnConfig.className || 'btn btn-primary');
            button.type = btnConfig.type || 'button';
            button.textContent = btnConfig.text;
            button.id = btnConfig.id;

            if (btnConfig.dismissOffcanvas) {
                button.setAttribute('data-bs-dismiss', 'offcanvas');
            }

            group.appendChild(button);
        });

        this.fields.push({ type: 'buttonGroup', element: group });
        return this;
    }

    addDivider() {
        const hr = this.createElement('hr');
        this.fields.push({ type: 'divider', element: hr });
        return this;
    }

    build() {
        if (!this.form) {
            throw new Error('Form not initialized. Call createForm() first.');
        }

        const div = this.createElement('div');
        const elements = [div];

        this.fields.forEach(field => {
            switch (field.type) {
                case 'text':
                    elements.push(field.label, field.input);
                    break;
                case 'checkbox':
                    elements.push(field.container);
                    break;
                case 'buttonGroup':
                case 'divider':
                    elements.push(field.element);
                    break;
            }
        });

        this.form.append(...elements);
        return this.form;
    }

    reset() {
        this.form = null;
        this.fields = [];
        return this;
    }

    /**
     * Crée un offcanvas complet avec bouton déclencheur et panneau
     * @param {string} offcanvasId - ID de l'offcanvas (ex: 'offcanvasRight')
     * @param {string} buttonText - Texte du bouton déclencheur
     * @param {string} position - Position de l'offcanvas ('start', 'end', 'top', 'bottom')
     * @returns {Object} { button, panel, body } - Les éléments créés
     */
    createOffcanvas(offcanvasId = 'offcanvasRight', buttonText = 'Ouvrir', position = 'end') {
        // Création du bouton déclencheur
        const button = this.createElement('button', 'btn btn-primary');
        button.type = 'button';
        button.setAttribute('data-bs-toggle', 'offcanvas');
        button.setAttribute('data-bs-target', `#${offcanvasId}`);
        button.setAttribute('aria-controls', offcanvasId);
        button.textContent = buttonText;

        // Création du panneau offcanvas
        const panel = this.createElement('div', `offcanvas offcanvas-${position}`);
        panel.tabIndex = -1;
        panel.id = offcanvasId;
        panel.setAttribute('aria-labelledby', `${offcanvasId}Label`);

        // Création de l'en-tête
        const header = this.createElement('div', 'offcanvas-header');
        const title = this.createElement('h5', 'offcanvas-title');
        title.id = `${offcanvasId}Label`;
        title.textContent = buttonText;

        const closeButton = this.createElement('button', 'btn-close');
        closeButton.type = 'button';
        closeButton.setAttribute('data-bs-dismiss', 'offcanvas');
        closeButton.setAttribute('aria-label', 'Close');

        header.append(title, closeButton);

        // Création du corps
        const body = this.createElement('div', 'offcanvas-body');

        // Assemblage
        panel.append(header, body);

        return { button, panel, body };
    }

    /**
     * Crée un offcanvas avec le formulaire déjà construit
     * @param {string} offcanvasId - ID de l'offcanvas
     * @param {string} buttonText - Texte du bouton
     * @param {string} position - Position ('start', 'end', 'top', 'bottom')
     * @returns {Object} { button, panel, form } - Le bouton, le panneau et le formulaire
     */
    buildOffcanvasWithForm(offcanvasId = 'offcanvasRight', buttonText = 'Choisir un paramétrage', position = 'end') {
        if (!this.form) {
            throw new Error('Form not initialized. Call createForm() first before calling buildOffcanvasWithForm()');
        }

        const { button, panel, body } = this.createOffcanvas(offcanvasId, buttonText, position);
        body.appendChild(this.build());

        return { button, panel, form: this.form };
    }
}