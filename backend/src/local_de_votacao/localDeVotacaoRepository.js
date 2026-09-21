class LocalDeVotacaoRepository {
  constructor(db) {
    this.db = db;
  }

  async listar() {
    const [rows] = await this.db.execute(
      "SELECT * FROM locais_de_votacao"
    );

    return rows;
  }

  async encontrarPorId(id) {
    const [rows] = await this.db.execute(
      "SELECT * FROM locais_de_votacao WHERE id = ?",
      [id]
    );

    return rows[0];
  }

  async atualizar(id, ponto) {
    await this.db.execute(
      `UPDATE locais_de_votacao
       SET
         nome_local = ?,
         cidade = ?,
         bairro = ?,
         conta_contrato = ?,
         poste = ?,
         trafo = ?,
         alimentador = ?,
         lat = ?,
         long = ?,
         utd = ?,
         utep = ?,
         status = ?,
         observacao = ?
       WHERE id = ?`,
      [
        ponto.nome_local,
        ponto.cidade,
        ponto.bairro,
        ponto.conta_contrato,
        ponto.poste,
        ponto.trafo,
        ponto.alimentador,
        ponto.lat,
        ponto.long,
        ponto.utd,
        ponto.utep,
        ponto.status,
        ponto.observacao,
        id,
      ]
    );
  }
}

export default LocalDeVotacaoRepository;
