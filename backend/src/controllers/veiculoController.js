import { veiculoService } from '../services/veiculoService.js';

export const veiculoController = {
  listar(req, res) {
    res.json(veiculoService.listar());
  },

  buscarPorId(req, res) {
    res.json(veiculoService.buscarPorId(Number(req.params.id)));
  },

  criar(req, res) {
    const novo = veiculoService.criar(req.body);
    res.status(201).json(novo);
  },

  atualizar(req, res) {
    res.json(veiculoService.atualizar(Number(req.params.id), req.body));
  },

  remover(req, res) {
    veiculoService.remover(Number(req.params.id));
    res.status(204).end();
  },
};

