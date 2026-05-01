import { AGENTS, CATEGORIES } from './Constants.js';

/**
 * Represents a logical Bank (Banque) in the economic model.
 * Manages accounts (actif/passif) for different agents.
 */
export class Banque {
    #achtr;
    #colonneT = CATEGORIES.BANQUE;
    #actif = {};
    #passif = {};

    /**
     * @param {string} achtr Name of the agent
     */
    constructor(achtr) {
        this.#achtr = achtr;
    }

    // --- Getters ---

    get getNom() { return this.#achtr; }
    get getColonneT() { return this.#colonneT; }
    get getactif() { return this.#actif; }
    get getpassif() { return this.#passif; }
    get getBCactif() { return this.#actif[AGENTS.BC] || 0; }
    get getBCpassif() { return this.#passif[AGENTS.BC] || 0; }

    /**
     * Generates a structured view of the bank's balance sheet.
     * @returns {Array} A 2D array where each element is [ {ActifAccount: Value}, {PassifAccount: Value} ]
     */
    get getBilan() {
        const actifKeys = Object.keys(this.#actif);
        const passifKeys = Object.keys(this.#passif);
        const maxLength = Math.max(actifKeys.length, passifKeys.length);

        const bilan = [];
        for (let i = 0; i < maxLength; i++) {
            const entry = [];
            if (i < actifKeys.length) {
                const key = actifKeys[i];
                entry.push({ [key]: this.#actif[key] });
            }
            if (i < passifKeys.length) {
                const key = passifKeys[i];
                entry.push({ [key]: this.#passif[key] });
            }
            bilan[i] = entry;
        }
        return bilan;
    }

    // --- Account Management ---

    #ensureAccount(obj, ent) {
        if (!(ent in obj)) {
            obj[ent] = 0;
        }
    }

    /**
     * Updates an asset account.
     * @param {string} ent Agent name
     * @param {number} montant Amount to add
     */
    BanqueFinActif(ent, montant) {
        this.#ensureAccount(this.#actif, ent);
        this.#ensureAccount(this.#passif, ent);
        this.#actif[ent] += montant;
    }

    /**
     * Updates a liability account.
     * @param {string} ent Agent name
     * @param {number} montant Amount to add
     */
    BanqueFinPassif(ent, montant) {
        this.#ensureAccount(this.#passif, ent);
        this.#ensureAccount(this.#actif, ent);
        this.#passif[ent] += montant;
    }
}
