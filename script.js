// =======================
// 🌍 INICIALIZAÇÃO DO MAPA
// =======================

console.log("Teste");

const map = L.map("map").setView([-5.8, -35.2], 10);

L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
  maxZoom: 19
}).addTo(map);

const markers = L.markerClusterGroup();

map.addLayer(markers);


// =======================
// 🧠 VARIÁVEIS GLOBAIS
// =======================

let dadosGlobais = [];

let cidades_selecionadas = new Set([
  "NATAL",
  "PARNAMIRIM",
  "MACAIBA",
  "SAO JOSE DE MIPIBU",
  "VERA CRUZ",
  "MONTE ALEGRE",
  "NISIA FLORESTA",
  "SENADOR GEORGINO AVELINO"
]);


// =======================
// 📋 OPÇÕES DE STATUS
// =======================

const statusOptions = [
  "Não visitado",
  "Poda BT",
  "Poda MT",
  "Cruzeta deteriorada",
  "Poste deteriorado",
  "Isolador",
  "Ponto quente",
  "Medidor",
  "Padrão do cliente",
  "Outro"
];


// =======================
// 🔧 ESCAPAR HTML
// =======================

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


// =======================
// 📍 RENDERIZAR PONTOS
// =======================

function renderizarPontos(dados) {

  markers.clearLayers();

  dados.forEach(ponto => {

    if (
      ponto.latitude === null ||
      ponto.latitude === undefined ||
      ponto.longitude === null ||
      ponto.longitude === undefined
    ) {
      return;
    }

    const lat = parseFloat(ponto.latitude);
    const lng = parseFloat(ponto.longitude);

    if (isNaN(lat) || isNaN(lng)) {
      return;
    }

    const marker = L.circleMarker([lat, lng], {

      radius: 10,
      fillColor: "blue",
      color: "#000",
      weight: 1,
      fillOpacity: 0.8

    });


    // =======================
    // 📋 POPUP
    // =======================

    const popupContent = `

      <div style="
        min-width: 280px;
        max-width: 400px;
      ">

        <h3 style="margin-top: 0;">
          ${escaparHTML(ponto.nome_local)}
        </h3>

        <b>ID:</b> ${escaparHTML(ponto.id)}<br>

        <b>Cidade:</b> ${escaparHTML(ponto.cidade)}<br>

        <b>Bairro:</b> ${escaparHTML(ponto.bairro)}<br>

        <b>Conta contrato:</b> ${escaparHTML(ponto.conta_contrato)}<br>

        <b>Poste:</b> ${escaparHTML(ponto.poste)}<br>

        <b>Transformador:</b> ${escaparHTML(ponto.trafo)}<br>

        <b>Alimentador:</b> ${escaparHTML(ponto.alimentador)}<br>

        <b>Latitude:</b> ${escaparHTML(ponto.latitude)}<br>

        <b>Longitude:</b> ${escaparHTML(ponto.longitude)}<br>

        <b>UTD:</b> ${escaparHTML(ponto.utd)}<br>

        <b>UTEP:</b> ${escaparHTML(ponto.utep)}<br>

        <hr>

        <label>
          <b>Status:</b>
        </label>

        <select
          id="status-${ponto.id}"
          style="
            width: 100%;
            padding: 6px;
            margin-top: 4px;
            margin-bottom: 10px;
          "
        >

          ${statusOptions.map(status => `
            <option
              value="${escaparHTML(status)}"
              ${ponto.status === status ? "selected" : ""}
            >
              ${escaparHTML(status)}
            </option>
          `).join("")}

        </select>


        <label>
          <b>Observação:</b>
        </label>

        <textarea
          id="observacao-${ponto.id}"
          rows="4"
          placeholder="Digite uma observação..."
          style="
            width: 100%;
            box-sizing: border-box;
            resize: vertical;
            padding: 6px;
            margin-top: 4px;
            margin-bottom: 10px;
          "
        >${escaparHTML(ponto.observacao)}</textarea>


        <div style="
          display: flex;
          gap: 8px;
        ">

          <button
            onclick="salvarPonto(${ponto.id})"
            style="
              flex: 1;
              background-color: #28a745;
              color: white;
              border: none;
              border-radius: 6px;
              padding: 8px;
              cursor: pointer;
            "
          >
            Salvar
          </button>


          <button
            onclick="cancelarEdicao()"
            style="
              flex: 1;
              background-color: #dc3545;
              color: white;
              border: none;
              border-radius: 6px;
              padding: 8px;
              cursor: pointer;
            "
          >
            Cancelar
          </button>

        </div>

      </div>

    `;


    marker.bindPopup(popupContent);

    markers.addLayer(marker);

  });

}


// =======================
// 💾 SALVAR PONTO
// =======================

function salvarPonto(id) {

  const ponto = dadosGlobais.find(
    p => Number(p.id) === Number(id)
  );

  if (!ponto) {
    alert("Ponto não encontrado.");
    return;
  }


  const statusElement =
    document.getElementById(`status-${id}`);

  const observacaoElement =
    document.getElementById(`observacao-${id}`);


  if (!statusElement || !observacaoElement) {
    alert("Erro ao encontrar os campos.");
    return;
  }


  const novoStatus = statusElement.value;

  const novaObservacao = observacaoElement.value;


  // =======================
  // 📦 DADOS PARA ENVIAR
  // =======================

  const dadosAtualizados = {

    id: ponto.id,

    nome_local: ponto.nome_local,

    cidade: ponto.cidade,

    bairro: ponto.bairro,

    conta_contrato: ponto.conta_contrato,

    poste: ponto.poste,

    trafo: ponto.trafo,

    alimentador: ponto.alimentador,

    latitude: ponto.latitude,

    longitude: ponto.longitude,

    utd: ponto.utd,

    utep: ponto.utep,

    status: novoStatus,

    observacao: novaObservacao

  };


  console.log(
    "Enviando atualização:",
    dadosAtualizados
  );


  // =======================
  // 📡 ENVIAR PARA API
  // =======================

  fetch(
    `https://mapa-pontos-eleicao.onrender.com/local/atualizar/${id}`,
    {
      method: "PUT",

      headers: {
        "Content-Type": "application/json"
      },

      body: JSON.stringify(dadosAtualizados)
    }
  )

  .then(response => {

    if (!response.ok) {
      throw new Error(
        `Erro HTTP: ${response.status}`
      );
    }

    Object.assign(ponto, dadosAtualizados)
    filtrar() 
  
    map.closePopup();
    alert("Ponto atualizado com sucesso!");

  })

  .catch(error => {

    console.error(
      "Erro ao atualizar ponto:",
      error
    );

    alert("Erro ao atualizar o ponto.");

  });

}


function cancelarEdicao() {

  map.closePopup();

}


// =======================
// 🔍 FILTRO POR CIDADE
// =======================

function filtrar() {

  const filtrados = dadosGlobais.filter(ponto => {

    return cidades_selecionadas.has(
      ponto.cidade
    );

  });

  renderizarPontos(filtrados);

}

fetch(
  "https://mapa-pontos-eleicao.onrender.com/local/listar"
)

  .then(response => {

    if (!response.ok) {
      throw new Error(
        `Erro HTTP: ${response.status}`
      );
    }

    return response.json();

  })

  .then(data => {

    console.log(
      "Dados recebidos da API:",
      data
    );

    dadosGlobais = data;

    filtrar();

  })

  .catch(error => {

    console.error(
      "Erro ao carregar os pontos:",
      error
    );

    alert(
      "Erro ao carregar os locais de votação."
    );

  });


// =======================
// 🎯 EVENTOS DE FILTRO DE CIDADES
// =======================

document.addEventListener(
  "DOMContentLoaded",
  () => {

    const checkboxes =
      document.querySelectorAll(".city-checkbox");

    checkboxes.forEach(checkbox => {

      checkbox.addEventListener(
        "change",
        function() {

          if (this.checked) {

            cidades_selecionadas.add(
              this.value
            );

          } else {

            cidades_selecionadas.delete(
              this.value
            );

          }

          filtrar();

        }
      );

    });

  }
);


// =======================
// 📍 GEOLOCALIZAÇÃO
// =======================

function goToLocation() {

  map.locate({
    setView: true,
    maxZoom: 16
  });

  map.once(
    "locationfound",
    function(e) {

      L.marker(e.latlng)
        .addTo(map)
        .bindPopup("Você está aqui")
        .openPopup();

    }
  );

}


// =======================
// 📌 MODO COORDENADA
// =======================

let coordMode = false;

let coordMarker = null;


function toggleCoordMode() {

  coordMode = !coordMode;

  alert(
    coordMode
      ? "Modo coordenada ativado"
      : "Modo coordenada desativado"
  );

}


map.on("click", function(e) {

  if (!coordMode) {
    return;
  }


  if (coordMarker) {
    map.removeLayer(coordMarker);
  }


  coordMarker = L.marker(e.latlng)
    .addTo(map)
    .bindPopup(`
      Lat: ${e.latlng.lat.toFixed(6)}<br>
      Lng: ${e.latlng.lng.toFixed(6)}
    `)
    .openPopup();

});