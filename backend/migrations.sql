CREATE TABLE locais_de_votacao (
    id INT PRIMARY KEY,

    nome_local VARCHAR(255)  NULL,
    cidade VARCHAR(255)  NULL,
    bairro VARCHAR(255)  NULL,

    conta_contrato VARCHAR(255)  NULL,
    poste VARCHAR(255)  NULL,
    trafo VARCHAR(255)  NULL,
    alimentador VARCHAR(255)  NULL,

    latitude DECIMAL(10,8) NOT NULL,
    longitude DECIMAL(11,8) NOT NULL,

    utd VARCHAR(255)  NUll,
    utep VARCHAR(255)  NULL,

    status ENUM(
        'Não visitado',
        'Poda BT',
        'Poda MT',
        'Cruzeta deteriorada',
        'Poste deteriorado',
        'Isolador',
        'Ponto quente',
        'Medidor',
        'Padrão do cliente',
        'Outro'
    ) NOT NULL DEFAULT 'Não visitado',

    observacao TEXT NULL
)
