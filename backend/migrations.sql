CREATE TABLE locais_de_votacao (
    id INT PRIMARY KEY,

    nome_local VARCHAR(255) NOT NULL,
    cidade VARCHAR(255) NOT NULL,
    bairro VARCHAR(255) NOT NULL,

    conta_contrato VARCHAR(255) NOT NULL,
    poste VARCHAR(255) NOT NULL,
    trafo VARCHAR(255) NOT NULL,
    alimentador VARCHAR(255) NOT NULL,

    latitude DECIMAL(10,8) NOT NULL,
    longitude DECIMAL(11,8) NOT NULL,

    utd VARCHAR(255) NOT NUll,
    utep VARCHAR(255) NOT NULL,

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
