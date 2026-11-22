export class CnRenderer {
    /**
     * @param {HTMLElement} tablesContainer - The container for TEE and TOF tables
     * @param {HTMLElement} operationsContainer - The container for the operations table
     */
    constructor(tablesContainer, operationsContainer) {
        this.tablesContainer = tablesContainer;
        this.operationsContainer = operationsContainer;
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
     * Crée une cellule de tableau avec texte
     */
    #createCell(tag, text, className = '') {
        const cell = this.#createElement(tag, className);
        if (text !== undefined && text !== null) {
            cell.textContent = text;
        }
        return cell;
    }

    /**
     * Génère le tableau TEE (Tableau des Entrées-Sorties)
     */
    generateTEE(tabTEE) {
        const table = this.#createElement('table', 'tableaux balise');
        const thead = this.#createElement('thead', 'bg-light');
        const tbody = this.#createElement('tbody');

        // En-têtes
        const headers = this.#createTEEHeaders();
        thead.append(...headers);

        // Lignes de données
        tabTEE.forEach(operation => {
            const row = this.#createElement('tr');

            for (let n = 0; n < 2; n++) {
                row.appendChild(this.#createCell('td', operation[0][0], 'key'));

                for (let j = 0; j < 3; j++) {
                    const index = j + (n * 3);
                    const value = operation[index][1];
                    row.appendChild(this.#createCell('td', value, value !== 0 ? 'value' : ''));
                }
            }

            tbody.appendChild(row);
        });

        table.append(tbody, thead);
        this.tablesContainer.appendChild(table);

        return table;
    }

    /**
     * Crée les en-têtes du tableau TEE
     */
    #createTEEHeaders() {
        const row1 = this.#createElement('tr', 'entreprise');
        const cell1 = this.#createCell('th', 'Cn TEE');
        cell1.setAttribute('colspan', '8');
        row1.appendChild(cell1);

        const row2 = this.#createElement('tr');
        ['Actif', 'Passif'].forEach(label => {
            const cell = this.#createCell('th', label, 'entreprise');
            cell.setAttribute('colspan', '4');
            row2.appendChild(cell);
        });

        const row3 = this.#createElement('tr');
        ['', 'E', 'M', 'Ext', '', 'E', 'M', 'Ext'].forEach(label => {
            row3.appendChild(this.#createCell('th', label));
        });

        return [row1, row2, row3];
    }

    /**
     * Génère le tableau TOF (Tableau des Opérations Financières)
     */
    generateTOF(tabTOF) {
        const table = this.#createElement('table', 'tableaux balise');
        const thead = this.#createElement('thead', 'bg-light');
        const tbody = this.#createElement('tbody');

        // En-têtes
        const row1 = this.#createElement('tr', 'entreprise');
        const cell1 = this.#createCell('th', 'Cn TOF');
        cell1.setAttribute('colspan', '8');
        row1.appendChild(cell1);

        const row2 = this.#createElement('tr');
        ['Actif', 'Passif'].forEach(label => {
            const cell = this.#createCell('th', label, 'entreprise');
            cell.setAttribute('colspan', '4');
            row2.appendChild(cell);
        });

        const row3 = this.#createElement('tr');
        for (let i = 0; i < 8; i++) {
            row3.appendChild(this.#createCell('th', tabTOF[i % 4][0]));
        }

        thead.append(row1, row2, row3);

        // Ligne de données
        const dataRow = this.#createElement('tr');
        tabTOF.forEach(item => {
            const value = item[1];
            dataRow.appendChild(this.#createCell('td', value, value !== 0 ? 'value' : ''));
        });

        tbody.appendChild(dataRow);
        table.append(tbody, thead);
        this.tablesContainer.appendChild(table);

        return table;
    }

    /**
     * Génère un tableau pour un agent
     */
    generateAgentTable(agent, columns = 4) {
        const table = this.#createElement('table', 'tableaux balise');
        const thead = this.#createElement('thead', 'bg-light');
        const tbody = this.#createElement('tbody');

        // En-tête avec nom de l'agent
        const headerRow1 = this.#createElement('tr', 'entreprise');
        const headerCell1 = this.#createCell('th', agent.getNom);
        headerCell1.setAttribute('scope', 'col');
        headerCell1.setAttribute('colspan', '4');
        headerRow1.appendChild(headerCell1);

        // En-tête Actif/Passif
        const headerRow2 = this.#createElement('tr');
        ['Actif', 'Passif'].forEach(label => {
            const cell = this.#createCell('th', label, 'entreprise');
            cell.setAttribute('scope', 'col');
            cell.setAttribute('colspan', '2');
            headerRow2.appendChild(cell);
        });

        thead.append(headerRow1, headerRow2);

        // Lignes de données
        const bilanLength = Object.keys(agent.getactif).length;
        console.table(agent.getBilan.map(row => {
            const actifKey = Object.keys(row[0])[0];
            const passifKey = Object.keys(row[1])[0];
            return { actif: actifKey, 'actif val': row[0][actifKey], passif: passifKey, 'passif val': row[1][passifKey] };
        }));
        for (let i = 0; i < bilanLength; i++) {
            const row = this.#createElement('tr');

            for (let j = 0; j < columns / 2; j++) {
                const key = Object.keys(agent.getBilan[i][j % 2])[0];
                const value = agent.getBilan[i][j % 2][key];

                row.appendChild(this.#createCell('td', key, 'key'));
                row.appendChild(this.#createCell('td', value, value !== 0 ? 'value' : ''));
            }

            tbody.appendChild(row);
        }

        table.append(tbody, thead);
        this.tablesContainer.appendChild(table);

        return table;
    }

    /**
     * Génère le tableau des opérations
     */
    generateOperations(operations, types) {
        const table = this.#createElement('table', 'table balise');
        const thead = this.#createElement('thead');
        const tbody = this.#createElement('tbody');

        // En-tête
        const headerRow = this.#createElement('tr');
        ['Operation', 'Acheteur', 'Vendeur', 'Montant'].forEach(label => {
            const cell = this.#createCell('th', label);
            cell.setAttribute('scope', 'col');
            headerRow.appendChild(cell);
        });
        thead.appendChild(headerRow);

        // Lignes d'opérations
        operations.forEach(operation => {
            // On masque les montants nuls, mais pas les négatifs (contrepassations)
            if (!operation.montant) return;

            const row = this.#createElement('tr');

            if (types?.[operation.operation] === 'R') {
                row.className = 'table-warning';
            }

            ['operation', 'acheteur', 'vendeur', 'montant'].forEach(key => {
                row.appendChild(this.#createCell('td', operation[key]));
            });

            tbody.appendChild(row);
        });

        table.append(tbody, thead);
        this.operationsContainer.appendChild(table);

        return table;
    }
}
