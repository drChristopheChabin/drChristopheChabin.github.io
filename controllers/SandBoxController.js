import { OperationType } from '../models/metier/Constants.js';
import { BaseController } from './BaseController.js';

/**
 * Contrôleur de l'écran « SandBox » (route #/sandbox)
 */
export class SandBoxController extends BaseController {
    render() {
        this.view.generateForm(OperationType);
    }
}
