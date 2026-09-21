import LocalDeVotacaoRepository from './localDeVotacaoRepository.js';

class LocalDeVotacaoService {
    constructor(db) {
        this.LocalDeVotacaoRepository = new LocalDeVotacaoRepository(db);
    }

    async listar(req, res) {
        const locais = await this.LocalDeVotacaoRepository.listar();

        res.status(200).json(locais);
    }

    async encontrarPorId(req, res) {
        const { id } = req.params;

        const local = await this.LocalDeVotacaoRepository.encontrarPorId(id);

        if (!local) {
            return res.status(404).json({
                error: "Local de votação não encontrado"
            });
        }

        return res.status(200).json(local);
    }

    async atualizar(req, res) {
        const { id } = req.params;
        const localAtualizado = req.body;

        const local = await this.LocalDeVotacaoRepository.encontrarPorId(id);

        console.log(localAtualizado.status)

        if (!local) {
            return res.status(404).json({
                error: "Local de votação não encontrado"
            });
        }

        await this.LocalDeVotacaoRepository.atualizar(
            id,
            localAtualizado
        );

        return res.status(204).send();
    }
}

export default LocalDeVotacaoService;
