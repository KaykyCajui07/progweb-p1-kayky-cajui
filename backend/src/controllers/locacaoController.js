import { locacaoService } from '../services/locacaoService.js';

export const locacaoController = {
  listar(req, res) {
    res.json(locacaoService.listar());
  },

  buscarPorId(req, res) {
    res.json(locacaoService.buscarPorId(Number(req.params.id)));
  },

  locar(req, res) {
    const nova = locacaoService.locar(req.body);
    res.status(201).json(nova);
  },

  devolver(req, res) {
    res.json(locacaoService.devolver(Number(req.params.id)));
  },
};
