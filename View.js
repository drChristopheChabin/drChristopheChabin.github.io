class View {
    constructor() {
        this._iteration = -1
        // The root element
        this.app = this.getElement('#root')
        this.app.setAttribute('class','row')

        this.offcanvas=this.createElement('button')
        this.offcanvas.setAttribute('class','btn btn-primary')
        this.offcanvas.setAttribute('type','button')
        this.offcanvas.setAttribute('data-bs-toggle','offcanvas')
        this.offcanvas.setAttribute('data-bs-target','#offcanvasRight')
        this.offcanvas.setAttribute('aria-controls','offcanvasRight')
        this.offcanvas.textContent='Choisir un paramétrage'

        this.col0=this.createElement('div')
        this.col0.setAttribute('class','offcanvas offcanvas-end')
        this.col0.setAttribute('tabindex','-1')
        this.col0.setAttribute('id','offcanvasRight')
        this.col0.setAttribute('aria-labelledby','offcanvasRightLabel')

        this.col00=this.createElement('div','offcanvas-body')

        this.closeButton = this.createElement('button')
        this.closeButton.setAttribute('class', 'btn-close')
        this.closeButton.setAttribute('data-bs-dismiss', 'offcanvas')
        this.closeButton.type = 'button'
        this.col00.appendChild(this.closeButton)


        this.col0.appendChild(this.col00)

        this.col1=this.createElement('div')
        this.col1.setAttribute('class','col')

        this.col2=this.createElement('div')
        this.col2.setAttribute('class','col display')
        // The title of the app
        this.title = this.createElement('h1')
        this.title.textContent = 'Modèle de Comptabilité Nationale'

        // Append the title, form to the app
        this.app.append(this.title,this.offcanvas,this.col0,this.col1,this.col2)
    }

    // Create an element with an optional CSS class
    createElement(tag, className) {
        const element = document.createElement(tag)
        if (className) element.classList.add(className)

        return element
    }

    // Retrieve an element from the DOM
    getElement(selector) {
        return document.querySelector(selector)
    }

    _generate_table(unagent, col = 4) {
        // creates a <table> element and a <tbody> element
        this.tbl = this.createElement("table");
        this.tbl.setAttribute('class', 'tableaux balise')
        this.tblThead = this.createElement('thead','bg-light');
        this.tblBody = this.createElement("tbody");

        //parameter header table
        const rowh1 = document.createElement("tr");
        rowh1.setAttribute('class','entreprise')
        const cellh1 = document.createElement("th");
        cellh1.setAttribute('scope', 'col')
        cellh1.setAttribute('colspan', '4')
        const cellTexth1 = document.createTextNode(unagent.getNom);
        cellh1.appendChild(cellTexth1);
        rowh1.appendChild(cellh1);

        const rowh = document.createElement("tr");
        const cellh21 = document.createElement("th");
        cellh21.setAttribute('class','entreprise')
        cellh21.setAttribute('scope', 'col')
        cellh21.setAttribute('colspan', '2')
        const cellTexth21 = document.createTextNode(`Actif`);
        cellh21.appendChild(cellTexth21);
        rowh.appendChild(cellh21);

        const cellh22 = document.createElement("th");
        cellh22.setAttribute('class','entreprise')
        cellh22.setAttribute('scope', 'col')
        cellh22.setAttribute('colspan', '2')
        const cellTexth22 = document.createTextNode(`Passif`);
        cellh22.appendChild(cellTexth22);
        rowh.appendChild(cellh22);

        this.tblThead.append(rowh1, rowh)

        // creating all cells
        for (let i = 0; i < Object.keys(unagent.getactif).length; i++) {
            // creates a table row
            const row = document.createElement("tr");

            for (let j = 0; j < col / 2; j++) {
                // Create a <td> element and a text node, make the text
                // node the contents of the <td>, and put the <td> at
                // the end of the table row2)
                const lgn = Object.keys(unagent.getBilan[i][j % 2])

                this.cell0 = this.createElement("td", 'key');
                this.insertText = lgn
                const cellText0 = document.createTextNode(this.insertText);

                const value = unagent.getBilan[i][j % 2][lgn]
                this.cell1 = (value === 0) ? this.createElement("td") : this.createElement("td", "value");
                this.insertText = (value === 0) ? "" : value
                const cellText1 = document.createTextNode(this.insertText);

                this.cell0.appendChild(cellText0);
                row.appendChild(this.cell0);
                this.cell1.appendChild(cellText1);
                row.appendChild(this.cell1);
            }
            // add the row to the end of the table body
            this.tblBody.appendChild(row);
        }

        // put the <tbody> in the <table>
        this.tbl.append(this.tblBody, this.tblThead);
        // appends <table> into <body>
        this.col1.appendChild(this.tbl);


        return this.tbl
    }

    _generate_TEE(tab_TEE) {
        // creates a <table> element and a <tbody> element
        this.tbl = this.createElement("table");
        this.tbl.setAttribute('class', 'tableaux balise')
        this.tblThead = this.createElement('thead','bg-light');
        this.tblBody = this.createElement("tbody");

        //parameter header table
        const rowh1 = document.createElement("tr");
        rowh1.setAttribute('class','entreprise')
        const cellh1 = document.createElement("th");
        cellh1.setAttribute('scope', 'col')
        cellh1.setAttribute('colspan', '8')
        const cellTexth1 = document.createTextNode(`Cn TEE`);
        cellh1.appendChild(cellTexth1);
        rowh1.appendChild(cellh1);

        const rowh2 = document.createElement("tr");
        const cellh21 = document.createElement("th");
        cellh21.setAttribute('class','entreprise')
        cellh21.setAttribute('scope', 'col')
        cellh21.setAttribute('colspan', '4')
        const cellTexth21 = document.createTextNode(`Actif`);
        cellh21.appendChild(cellTexth21);
        rowh2.appendChild(cellh21);

        const cellh22 = document.createElement("th");
        cellh22.setAttribute('class','entreprise')
        cellh22.setAttribute('scope', 'col')
        cellh22.setAttribute('colspan', '4')
        const cellTexth22 = document.createTextNode(`Passif`);
        cellh22.appendChild(cellTexth22);
        rowh2.appendChild(cellh22);

        const rowh3 = document.createElement("tr");

        for (let n = 0; n < 2; n++) {
            const cellh31 = document.createElement("th");
            cellh31.setAttribute('scope', 'col')
            rowh3.appendChild(cellh31);

            const cellh32 = document.createElement("th");
            cellh32.setAttribute('scope', 'col')
            const cellTexth32 = document.createTextNode(`E`);
            cellh32.appendChild(cellTexth32);
            rowh3.appendChild(cellh32);

            const cellh33 = document.createElement("th");
            cellh33.setAttribute('scope', 'col')
            const cellTexth33 = document.createTextNode(`M`);
            cellh33.appendChild(cellTexth33);
            rowh3.appendChild(cellh33);

            const cellh34 = document.createElement("th");
            cellh34.setAttribute('scope', 'col')
            const cellTexth34 = document.createTextNode(`Ext`);
            cellh34.appendChild(cellTexth34);
            rowh3.appendChild(cellh34);
        }

        this.tblThead.append(rowh1, rowh2, rowh3)

        // creating all cells
        for (let i = 0; i < tab_TEE.length; i++) {
            // creates a table row
            const row = document.createElement("tr");
            for (let n = 0; n < 2; n++) {
                this.cell0 = this.createElement("td", 'key');
                this.insertText = tab_TEE[i][0][0]
                const cellText0 = document.createTextNode(this.insertText);
                this.cell0.appendChild(cellText0);
                row.appendChild(this.cell0);

                for (let j = 0; j < 3; j++) {
                    // Create a <td> element and a text node, make the text
                    // node the contents of the <td>, and put the <td> at
                    // the end of the table row2)
                    let m = j + (n * 3)

                    const value = tab_TEE[i][m][1]
                    this.cell1 = (value === 0) ? this.createElement("td") : this.createElement("td", "value");
                    this.insertText = (value === 0) ? "" : value
                    const cellText1 = document.createTextNode(this.insertText);

                    this.cell1.appendChild(cellText1);
                    row.appendChild(this.cell1);

                }
            }
            // add the row to the end of the table body
            this.tblBody.appendChild(row);
        }

        // put the <tbody> in the <table>
        this.tbl.append(this.tblBody, this.tblThead);
        // appends <table> into <body>
        this.col1.appendChild(this.tbl);

        return this.tbl
    }

    _generate_TOF(tab_TOF) {
        // creates a <table> element and a <tbody> element
        this.tbl = this.createElement("table");
        this.tbl.setAttribute('class', 'tableaux balise')
        this.tblThead = this.createElement('thead','bg-light');
        this.tblBody = this.createElement("tbody");

        //parameter header table
        const rowh1 = document.createElement("tr");
        rowh1.setAttribute('class','entreprise')
        const cellh1 = document.createElement("th");
        cellh1.setAttribute('scope', 'col')
        cellh1.setAttribute('colspan', '8')
        const cellTexth1 = document.createTextNode(`Cn TOF`);
        cellh1.appendChild(cellTexth1);
        rowh1.appendChild(cellh1);

        const rowh2 = document.createElement("tr");
        const cellh21 = document.createElement("th");
        cellh21.setAttribute('class','entreprise')
        cellh21.setAttribute('scope', 'col')
        cellh21.setAttribute('colspan', '4')
        const cellTexth21 = document.createTextNode(`Actif`);
        cellh21.appendChild(cellTexth21);
        rowh2.appendChild(cellh21);

        const cellh22 = document.createElement("th");
        cellh22.setAttribute('class','entreprise')
        cellh22.setAttribute('scope', 'col')
        cellh22.setAttribute('colspan', '4')
        const cellTexth22 = document.createTextNode(`Passif`);
        cellh22.appendChild(cellTexth22);
        rowh2.appendChild(cellh22);

        const rowh3 = document.createElement("tr");
        for (let n = 0; n < 8; n++) {
            const cellh32 = document.createElement("th");
            cellh32.setAttribute('scope', 'col')
            const cellTexth32 = document.createTextNode(tab_TOF[n % 4][0]);
            cellh32.appendChild(cellTexth32);
            rowh3.appendChild(cellh32);
        }
        this.tblThead.append(rowh1, rowh2, rowh3)

        // creating all cells
        const row = document.createElement("tr");
        for (let i = 0; i < 8; i++) {
            const value = tab_TOF[i][1]
            this.cell = (value === 0) ? this.createElement("td") : this.createElement("td", "value");
            this.insertText = value
            const cellText = document.createTextNode(this.insertText);
            this.cell.appendChild(cellText);
            row.appendChild(this.cell);
        }
        this.tblBody.appendChild(row);
        // put the <tbody> in the <table>
        this.tbl.append(this.tblBody, this.tblThead);
        // appends <table> into <body>
        this.col1.appendChild(this.tbl);

        return this.tbl
    }

    _generate_Operations(lesOperations, lesTypes) {
        //console.log(lesOperations.length)
        // creates a <table> element and a <tbody> element
        this.tbl = this.createElement("table");
        this.tbl.setAttribute('class', 'table balise')
        this.tblThead = this.createElement('thead');
        this.tblBody = this.createElement("tbody");

        //parameter header table
        const rowh1 = document.createElement("tr");
        const cellh11 = document.createElement("th");
        cellh11.setAttribute('scope', 'col')
        const cellTexth11 = document.createTextNode('Operation');
        cellh11.appendChild(cellTexth11);
        rowh1.appendChild(cellh11);

        const cellh12 = document.createElement("th");
        cellh12.setAttribute('scope', 'col')
        const cellTexth12 = document.createTextNode('Acheteur');
        cellh12.appendChild(cellTexth12);
        rowh1.appendChild(cellh12);

        const cellh13 = document.createElement("th");
        cellh13.setAttribute('scope', 'col')
        const cellTexth13 = document.createTextNode('Vendeur');
        cellh13.appendChild(cellTexth13);
        rowh1.appendChild(cellh13);

        const cellh14 = document.createElement("th");
        cellh14.setAttribute('scope', 'col')
        const cellTexth14 = document.createTextNode('Montant');
        cellh14.appendChild(cellTexth14);
        rowh1.appendChild(cellh14);

        this.tblThead.append(rowh1)
        let flag = true
        for (let uneOperation of lesOperations) {
            // creating all cells
            const row = document.createElement("tr");
            if (eval(`lesTypes.${uneOperation.operation}`) === 'R') {
                row.setAttribute('class', 'table-warning')
            }
            const cell01 = this.createElement("td")
            const cellText01 = document.createTextNode(uneOperation.operation);
            cell01.appendChild(cellText01);
            row.appendChild(cell01);

            const cell02 = this.createElement("td")
            const cellText02 = document.createTextNode(uneOperation.acheteur);
            cell02.appendChild(cellText02);
            row.appendChild(cell02);

            const cell03 = this.createElement("td")
            const cellText03 = document.createTextNode(uneOperation.vendeur);
            cell03.appendChild(cellText03);
            row.appendChild(cell03);

            const cell04 = this.createElement("td")
            const cellText04 = document.createTextNode(uneOperation.montant);
            cell04.appendChild(cellText04);
            row.appendChild(cell04);

            this.tblBody.appendChild(row);
        }

        // put the <tbody> in the <table>
        this.tbl.append(this.tblBody, this.tblThead);
        // appends <table> into <body>
        this.col2.appendChild(this.tbl);

        return this.tbl
    }

    generate_form() {
        this.form = this.createElement('form')
        const div = document.createElement("div")

        this.label1 = this.createElement('label', 'form-label')
        this.label1.setAttribute('for', 'mtE1')
        this.label1.textContent = 'Montant E1'

        this.input1 = this.createElement('input', 'form-control')
        this.input1.type = 'text'
        this.input1.placeholder = '60'
        this.input1.defaultValue = 60
        this.input1.name = 'mtE1'
        this.input1.id = 'mtE1'

        this.label2 = this.createElement('label', 'form-label')
        this.label2.setAttribute('for', 'mtE2')
        this.label2.textContent = 'Montant E2 (correspond au profit investi)'

        this.input2 = this.createElement('input', 'form-control')
        this.input2.type = 'text'
        this.input2.placeholder = '25'
        this.input2.defaultValue = 25
        this.input2.name = 'mtE2'
        this.input2.id = 'mtE2'

        this.label3 = this.createElement('label', 'form-label')
        this.label3.setAttribute('for', 'txProfit')
        this.label3.textContent = 'Montant taux de profit'

        this.input3 = this.createElement('input', 'form-control')
        this.input3.type = 'text'
        this.input3.placeholder = '0'
        this.input3.defaultValue = 0
        this.input3.name = 'txProfit'
        this.input3.id = 'txProfit'

        this.label4 = this.createElement('label', 'form-label')
        this.label4.setAttribute('for', 'mtAmortit')
        this.label4.textContent = 'Montant de l\'amortissement'

        this.input4 = this.createElement('input', 'form-control')
        this.input4.type = 'text'
        this.input4.placeholder = '5'
        this.input4.defaultValue = 5
        this.input4.name = 'mtAmortit'
        this.input4.id = 'mtAmortit'

        this.submitButton = this.createElement('button')
        this.submitButton.setAttribute('class', 'btn btn-primary')
        this.submitButton.setAttribute('data-bs-dismiss', 'offcanvas')
        this.submitButton.type = 'submit'
        this.submitButton.textContent = 'Envoyer'
        this.submitButton.id = 'envoyer'

        this.razButton = this.createElement('button')
        this.razButton.setAttribute('class', 'btn btn-warning')
        this.razButton.setAttribute('data-bs-dismiss', 'offcanvas')
        this.razButton.type = 'reset'
        this.razButton.textContent = 'RAZ'
        this.razButton.id = 'raz'

        this.pasApasButton = this.createElement('button')
        this.pasApasButton.setAttribute('class', 'btn btn-primary')
        //this.pasApasButton.setAttribute('data-bs-dismiss', 'offcanvas')
        this.pasApasButton.type = 'submit'
        this.pasApasButton.textContent = 'Pas à Pas'
        this.pasApasButton.id = 'pasApas'

        this.form.append(div, this.label1, this.input1, this.label2, this.input2, this.label3, this.input3, this.label4,
            this.input4, this.submitButton, this.razButton, this.pasApasButton)
        this.col00.appendChild(this.form);
    }

    get _agregatData() {
        return document.querySelectorAll("input")
    }

    bindAgregats(handler) {
        ['submit', 'reset'].forEach(type => {
            if (type === 'submit') {
                this.form.addEventListener('submit', event => {
                    event.preventDefault()
                    if (document.activeElement.id === 'envoyer') {
                        this._iteration = -1
                        //console.log(document.activeElement.id)
                        handler(this._agregatData, this._iteration)
                    } else {
                        this._iteration++
                        handler(this._agregatData, this._iteration)
                        // console.log(this._iteration)
                    }
                })
            } else {
                this.form.addEventListener('reset', event => {
                    event.preventDefault()
                    // console.log(document.activeElement)
                    window.location.reload();
                })
            }
        })


    }

    displayMicro(lesAgents) {
        //console.log(lesAgents)

        for (let unagent of lesAgents) {
            this._generate_table(unagent)
        }
    }

    displayTEE(lesComptes) {
        // console.log(lesComptes.getTEE)
        this._generate_TEE(lesComptes.getTEE)
    }

    displayTOF(lesComptes) {
        //console.log(lesComptes.getTOF)
        if (lesComptes.getTOF !== undefined) {
            this._generate_TOF(lesComptes.getTOF)
        }

    }

    displayOperations(lesOperations, lesTypes) {
        this._generate_Operations(lesOperations, lesTypes)
    }

}
export{View}
