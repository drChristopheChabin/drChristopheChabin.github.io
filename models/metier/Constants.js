/**
 * Economic model constants.
 * Uses Object.freeze to ensure the objects cannot be modified.
 */

export const AGENTS = Object.freeze({
    E1: 'E1',
    E2: 'E2',
    E3: 'E3',
    M: 'M',
    RDM: 'Rdm',
    B: 'B',
    BDM: 'Bdm',
    BC: 'BC',
    B_CENTRAL: 'B_Central'
});

export const CATEGORIES = Object.freeze({
    ENREPRISE: 'E',
    MENAGE: 'M',
    EXTERIEUR: 'Ext',
    BANQUE: 'B'
});

export const OperationType = Object.freeze({
    PRODUCTION: 'Production',
    INTERMEDIATE_CONSUMPTION: 'ConsommationIntermediaire',
    CI_FINANCING: 'FiCI',
    WAGES: 'RevenusSal',
    CONSUMPTION: 'Consommation',
    SECURITIES_PURCHASE: 'AchatTitres',
    SECURITIES_BUYBACK: 'RachatTitres',
    INVESTMENT: 'AchatImmob',
    DEPRECIATION: 'Depreciation',
    NON_WAGE_INCOME: 'RevenusNonSal',
    BANK_REPAYMENT: 'RemboursementBq',
    PAYMENT: 'Paiement',
    CREDIT: 'Credit',
    REDISCOUNT: 'ReEscompte',
    EXPORTATION: 'Exportation',
    X_FINANCING: 'FiX',
    IMPORTATION: 'Importation',
    M_FINANCING: 'FiM',
    INTERNATIONAL_SETTLEMENT: 'FiReglementInternational',
    INTERNATIONAL_DISCOUNT: 'FIEscompteInternational',
});
/**
 * Classification des opérations : Réelle (R) ou Monétaire (M).
 */
export const OperationClassifications = Object.freeze({
    [OperationType.PRODUCTION]: 'R',
    [OperationType.INTERMEDIATE_CONSUMPTION]: 'R',
    [OperationType.CI_FINANCING]: 'R',
    [OperationType.WAGES]: 'R',
    [OperationType.CONSUMPTION]: 'R',
    [OperationType.SECURITIES_PURCHASE]: 'M', // Modifié de R à M
    [OperationType.SECURITIES_BUYBACK]: 'M', // Modifié de R à M
    [OperationType.INVESTMENT]: 'R',
    [OperationType.DEPRECIATION]: 'R',
    [OperationType.NON_WAGE_INCOME]: 'R',
    [OperationType.PAYMENT]: 'M',
    [OperationType.CREDIT]: 'M',
    [OperationType.REDISCOUNT]: 'M', // Ajouté
    [OperationType.BANK_REPAYMENT]: 'R',
    [OperationType.INTERNATIONAL_SETTLEMENT]: 'M',
    [OperationType.INTERNATIONAL_DISCOUNT]: 'M',
    [OperationType.EXPORTATION]: 'R',
    [OperationType.IMPORTATION]: 'R',
    [OperationType.X_FINANCING]: 'M',
    [OperationType.M_FINANCING]: 'M',
});

/**
 * Paramètres par défaut suggérés pour le mode Sandbox.
 */
export const SandBoxType = Object.freeze({
    [OperationType.PRODUCTION]: { buyer: 'E1', seller: 'M', amount: 100 },
    [OperationType.INTERMEDIATE_CONSUMPTION]: { buyer: 'E1', seller: 'E2', amount: 100 },
    [OperationType.CI_FINANCING]: { buyer: 'E1', seller: 'E2', amount: 100 },
    [OperationType.WAGES]: { buyer: 'M', seller: 'E1', amount: 100 },
    [OperationType.CONSUMPTION]: { buyer: 'M', seller: 'E1', amount: 100 },
    [OperationType.SECURITIES_PURCHASE]: { buyer: 'E1', seller: 'E2', amount: 100 },
    [OperationType.SECURITIES_BUYBACK]: { buyer: 'M', seller: 'E1', amount: 100 },
    [OperationType.INVESTMENT]: { buyer: 'E1', seller: 'E2', amount: 100 },
    [OperationType.DEPRECIATION]: { buyer: 'E1', seller: 'E1', amount: 100 },
    [OperationType.NON_WAGE_INCOME]: { buyer: 'M', seller: 'E2', amount: 100 },
    [OperationType.PAYMENT]: { buyer: 'E1', seller: 'E2', amount: 100 },
    [OperationType.CREDIT]: { buyer: 'E1', seller: 'E1', amount: 100 },
    [OperationType.REDISCOUNT]: { buyer: 'Bdm', seller: 'E3', amount: 100 },
    [OperationType.BANK_REPAYMENT]: { buyer: 'E1', seller: 'E2', amount: 100 }, // Modifié de R à M
    [OperationType.INTERNATIONAL_SETTLEMENT]: { buyer: 'Bdm', seller: 'E3', amount: 100 },
    [OperationType.INTERNATIONAL_DISCOUNT]: { buyer: 'Bdm', seller: 'E3', amount: 100 },
    [OperationType.EXPORTATION]: { buyer: 'Rdm', seller: 'E3', amount: 100 },
    [OperationType.IMPORTATION]: { buyer: 'E3', seller: 'Rdm', amount: 100 },
    [OperationType.X_FINANCING]: { buyer: 'Rdm', seller: 'E3', amount: 100 },
    [OperationType.M_FINANCING]: { buyer: 'E3', seller: 'Rdm', amount: 100 },
});

export const ACCOUNTS = Object.freeze({
    // Assets (Actif)
    IMMO: 'Immo',
    STOCK: 'St',
    TRESORERIE: 'T',

    // Liabilities (Passif)
    CAPITAL: 'K',
    BANQUE: 'B',
    SALAIRE: 'Sal',

    // TEE specific
    PRD: 'prd',
    CI: 'ci',
    VA: 'va',
    SAL: 'sal',
    RNS: 'rns',
    RDB: 'rdb',
    C: 'c',
    E: 'e',
    ST: 'st',
    FBCF: 'fbcf',
    SOLDE: 'solde'
});

/**
 * Recensement des agents avec leurs comptes affectés par défaut (Actif / Passif)
 */
export const AGENT_ACCOUNTS = Object.freeze({
    [AGENTS.E1]: {
        actif: [ACCOUNTS.IMMO, ACCOUNTS.STOCK, ACCOUNTS.TRESORERIE],
        passif: [ACCOUNTS.CAPITAL, ACCOUNTS.BANQUE, ACCOUNTS.SALAIRE]
    },
    [AGENTS.E2]: {
        actif: [ACCOUNTS.IMMO, ACCOUNTS.STOCK, ACCOUNTS.TRESORERIE],
        passif: [ACCOUNTS.CAPITAL, ACCOUNTS.BANQUE, ACCOUNTS.SALAIRE]
    },
    [AGENTS.E3]: {
        actif: [ACCOUNTS.IMMO, ACCOUNTS.STOCK, ACCOUNTS.TRESORERIE],
        passif: [ACCOUNTS.CAPITAL, ACCOUNTS.BANQUE, ACCOUNTS.SALAIRE]
    },
    [AGENTS.M]: {
        actif: [ACCOUNTS.IMMO, ACCOUNTS.STOCK, ACCOUNTS.TRESORERIE],
        passif: [ACCOUNTS.CAPITAL, ACCOUNTS.BANQUE, ACCOUNTS.SALAIRE]
    },
    [AGENTS.RDM]: {
        actif: [ACCOUNTS.TRESORERIE],
        passif: [ACCOUNTS.CAPITAL]
    },
    [AGENTS.B]: {
        actif: [], // Comptes dynamiques (créances sur agents)
        passif: [] // Comptes dynamiques (dettes envers agents)
    },
    [AGENTS.BDM]: {
        actif: [],
        passif: []
    },
    [AGENTS.BC]: {
        actif: [],
        passif: []
    }
});
