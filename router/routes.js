import { Model } from '../models/Model.js';
import { CnView } from '../views/CnView.js';
import { SandBoxView } from '../views/SandBoxView.js';
import { CnController } from '../controllers/CnController.js';
import { SandBoxController } from '../controllers/SandBoxController.js';

/**
 * Table des routes de l'application.
 * Pour ajouter un écran : ajouter une entrée ici, le menu et le routeur suivent.
 */
export const routes = [
    {
        path: '/modelcn',
        title: 'Modélisation',
        create: () => new CnController(new Model('modelcn'), new CnView())
    },
    {
        path: '/cycles',
        title: 'Cycles',
        create: () => new CnController(new Model('cycles'), new CnView({ cycleChoice: true }))
    },
    {
        path: '/sandbox',
        title: 'SandBox',
        create: () => new SandBoxController(new Model('sandbox'), new SandBoxView())
    }
];

export const DEFAULT_PATH = '/modelcn';
