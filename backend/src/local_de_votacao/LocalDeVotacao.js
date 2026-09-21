class LocalDeVotacao {
    id;
    nome_local;
    cidade;
    bairro;
    conta_contrato;
    poste;
    trafo;
    alimentador;
    lat;
    long;
    utd;
    utep;
    status;
    observacao;

    constructor(
        nome_local,
        cidade,
        bairro,
        conta_contrato,
        poste,
        trafo,
        alimentador,
        lat,
        long,
        utd,
        utep,
        status = 'Não visitado',
        observacao = null,
        id = null
    ) {
        this.id = id;
        this.nome_local = nome_local;
        this.cidade = cidade;
        this.bairro = bairro;
        this.conta_contrato = conta_contrato;
        this.poste = poste;
        this.trafo = trafo;
        this.alimentador = alimentador;
        this.lat = lat;
        this.long = long;
        this.utd = utd;
        this.utep = utep;
        this.status = status;
        this.observacao = observacao;
    }

    get_id() {
        return this.id;
    }

    get_nome_local() {
        return this.nome_local;
    }

    get_cidade() {
        return this.cidade;
    }

    get_bairro() {
        return this.bairro;
    }

    get_conta_contrato() {
        return this.conta_contrato;
    }

    get_poste() {
        return this.poste;
    }

    get_trafo() {
        return this.trafo;
    }

    get_alimentador() {
        return this.alimentador;
    }

    get_lat() {
        return this.lat;
    }

    get_long() {
        return this.long;
    }

    get_utd() {
        return this.utd;
    }

    get_utep() {
        return this.utep;
    }

    get_status() {
        return this.status;
    }

    get_observacao() {
        return this.observacao;
    }


    set_nome_local(nome_local) {
        this.nome_local = nome_local;
    }

    set_cidade(cidade) {
        this.cidade = cidade;
    }

    set_bairro(bairro) {
        this.bairro = bairro;
    }

    set_conta_contrato(conta_contrato) {
        this.conta_contrato = conta_contrato;
    }

    set_poste(poste) {
        this.poste = poste;
    }

    set_trafo(trafo) {
        this.trafo = trafo;
    }

    set_alimentador(alimentador) {
        this.alimentador = alimentador;
    }

    set_lat(lat) {
        this.lat = lat;
    }

    set_long(long) {
        this.long = long;
    }

    set_utd(utd) {
        this.utd = utd;
    }

    set_utep(utep) {
        this.utep = utep;
    }

    set_status(status) {
        this.status = status;
    }

    set_observacao(observacao) {
        this.observacao = observacao;
    }
}

export default LocalDeVotacao;
