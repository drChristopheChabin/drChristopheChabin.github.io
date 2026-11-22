import { BaseController } from './BaseController.js';

/**
 * Contrôleur de l'écran « Modélisation » (route #/modelcn)
 */
export class CnController extends BaseController {
    render() {
        this.view.generate_form();
    }
}
