import { Router } from 'express';
import { locacaoController } from '../controllers/locacaoController.js';

const router = Router();

router.get('/', locacaoController.listar);
router.get('/:id', locacaoController.buscarPorId);
router.post('/', locacaoController.locar);
router.post('/:id/devolucao', locacaoController.devolver);

export default router;
