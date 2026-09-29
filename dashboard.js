
const API_URL =
  "https://mapa-pontos-eleicao.onrender.com/local/listar";

let todosOsPontos = [];

// Elementos da página
const tabela = document.getElementById("tabelaPontos");
const filtroCidade = document.getElementById("filtroCidade");
const filtroAlimentador = document.getElementById("filtroAlimentador");
const filtroStatus = document.getElementById("filtroStatus");
const busca = document.getElementById("busca");
const erro = document.getElementById("error");

// Escapa valores antes de inseri-los no HTML
function escaparHTML(valor) {
  if (valor === null || valor === undefined) {
    return "";
  }

  return String(valor)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

// Normaliza texto para busca sem diferenciar acentos
function normalizarTexto(valor) {
  return String(valor ?? "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim();
}

// Exibe valores vazios como um traço
function exibir(valor) {
  if (valor === null || valor === undefined || valor === "") {
    return "—";
  }

  return escaparHTML(valor);
}

// Define a aparência do status
function classeStatus(status) {
  if (status === "Não visitado") {
    return "status-pendente";
  }

  if (status === "Nenhum defeito encontrado") {
    return "status-concluido";
  }

  return "status-outro";
}

// Carrega os dados da API
async function carregarDados() {
  erro.style.display = "none";
  tabela.innerHTML = `
    <tr>
      <td colspan="14" class="loading">
        Carregando dados...
      </td>
    </tr>
  `;

  try {
    const resposta = await fetch(API_URL, {
      cache: "no-store"
    });

    if (!resposta.ok) {
      throw new Error(`Erro HTTP: ${resposta.status}`);
    }

    const dados = await resposta.json();

    if (!Array.isArray(dados)) {
      throw new Error("A API não retornou uma lista de pontos.");
    }

    todosOsPontos = dados;

    preencherFiltros();
    atualizarIndicadores();
    aplicarFiltros();

  } catch (error) {
    console.error("Erro ao carregar dashboard:", error);

    erro.textContent =
      "Não foi possível carregar os pontos. Verifique a conexão com a API e tente novamente.";

    erro.style.display = "block";

    tabela.innerHTML = `
      <tr>
        <td colspan="14" class="empty">
          Erro ao carregar os dados.
        </td>
      </tr>
    `;

    document.getElementById("contadorResultados").textContent =
      "Dados indisponíveis";
  }
}

// Preenche os filtros com os valores existentes na API
function preencherFiltros() {
  preencherSelect(
    filtroCidade,
    todosOsPontos.map(ponto => ponto.cidade),
    "Todas as cidades"
  );

  preencherSelect(
    filtroAlimentador,
    todosOsPontos.map(ponto => ponto.alimentador),
    "Todos os alimentadores"
  );

  preencherSelect(
    filtroStatus,
    todosOsPontos.map(ponto => ponto.status),
    "Todos os status"
  );
}

function preencherSelect(select, valores, textoPadrao) {
  const valorAnterior = select.value;

  const valoresUnicos = [...new Set(
    valores
      .filter(valor => valor !== null && valor !== undefined)
      .map(valor => String(valor).trim())
      .filter(valor => valor !== "")
  )].sort((a, b) => a.localeCompare(b, "pt-BR"));

  select.innerHTML = "";

  const opcaoPadrao = document.createElement("option");
  opcaoPadrao.value = "";
  opcaoPadrao.textContent = textoPadrao;
  select.appendChild(opcaoPadrao);

  valoresUnicos.forEach(valor => {
    const opcao = document.createElement("option");
    opcao.value = valor;
    opcao.textContent = valor;
    select.appendChild(opcao);
  });

  // Mantém a seleção se ela ainda existir
  if (valoresUnicos.includes(valorAnterior)) {
    select.value = valorAnterior;
  }
}

// Atualiza os cartões de indicadores
function atualizarIndicadores() {
  const total = todosOsPontos.length;

  const naoVisitados = todosOsPontos.filter(
    ponto => ponto.status === "Não visitado"
  ).length;

  const semDefeito = todosOsPontos.filter(
    ponto => ponto.status === "Nenhum defeito encontrado"
  ).length;

  const comDefeito = todosOsPontos.filter(
    ponto =>
      ponto.status &&
      ponto.status !== "Não visitado" &&
      ponto.status !== "Nenhum defeito encontrado"
  ).length;

  document.getElementById("totalPontos").textContent = total;
  document.getElementById("naoVisitados").textContent = naoVisitados;
  document.getElementById("comDefeito").textContent = comDefeito;
  document.getElementById("semDefeito").textContent = semDefeito;
}

// Aplica todos os filtros selecionados
function aplicarFiltros() {
  const cidade = filtroCidade.value;
  const alimentador = filtroAlimentador.value;
  const status = filtroStatus.value;
  const termoBusca = normalizarTexto(busca.value);

  const filtrados = todosOsPontos.filter(ponto => {
    const correspondeCidade =
      !cidade || ponto.cidade === cidade;

    const correspondeAlimentador =
      !alimentador || ponto.alimentador === alimentador;

    const correspondeStatus =
      !status || ponto.status === status;

    const textoPonto = normalizarTexto([
      ponto.id,
      ponto.nome_local,
      ponto.cidade,
      ponto.bairro,
      ponto.alimentador,
      ponto.conta_contrato,
      ponto.poste,
      ponto.trafo,
      ponto.utd,
      ponto.utep,
      ponto.status,
      ponto.observacao
    ].join(" "));

    const correspondeBusca =
      !termoBusca || textoPonto.includes(termoBusca);

    return (
      correspondeCidade &&
      correspondeAlimentador &&
      correspondeStatus &&
      correspondeBusca
    );
  });

  renderizarTabela(filtrados);
}

// Renderiza os pontos na tabela
function renderizarTabela(pontos) {
  document.getElementById("contadorResultados").textContent =
    `${pontos.length} de ${todosOsPontos.length} pontos`;

  if (pontos.length === 0) {
    tabela.innerHTML = `
      <tr>
        <td colspan="14" class="empty">
          Nenhum ponto encontrado com esses filtros.
        </td>
      </tr>
    `;
    return;
  }

  tabela.innerHTML = pontos.map(ponto => `
    <tr>
      <td>${exibir(ponto.id)}</td>
      <td>${exibir(ponto.nome_local)}</td>
      <td>${exibir(ponto.cidade)}</td>
      <td>${exibir(ponto.bairro)}</td>
      <td>${exibir(ponto.alimentador)}</td>
      <td>${exibir(ponto.conta_contrato)}</td>
      <td>${exibir(ponto.poste)}</td>
      <td>${exibir(ponto.trafo)}</td>
      <td>${exibir(ponto.latitude)}</td>
      <td>${exibir(ponto.longitude)}</td>
      <td>${exibir(ponto.utd)}</td>
      <td>${exibir(ponto.utep)}</td>
      <td>
        <span class="status ${classeStatus(ponto.status)}">
          ${exibir(ponto.status)}
        </span>
      </td>
      <td>${exibir(ponto.observacao)}</td>
    </tr>
  `).join("");
}

// Limpa todos os filtros
function limparFiltros() {
  filtroCidade.value = "";
  filtroAlimentador.value = "";
  filtroStatus.value = "";
  busca.value = "";

  aplicarFiltros();
}

// Eventos dos filtros
filtroCidade.addEventListener("change", aplicarFiltros);
filtroAlimentador.addEventListener("change", aplicarFiltros);
filtroStatus.addEventListener("change", aplicarFiltros);
busca.addEventListener("input", aplicarFiltros);

// Inicializa o dashboard
carregarDados();