// =======================
// 🌍 INICIALIZAÇÃO DO MAPA
// =======================
const map = L.map('map').setView([-5.8, -35.2], 10);

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  maxZoom: 19
}).addTo(map);

const markers = L.markerClusterGroup();
map.addLayer(markers);

// =======================
// 🧠 VARIÁVEIS GLOBAIS
// =======================
let dadosGlobais = [];
let cidades_selecionadas = new Set([
  "NATAL", "PARNAMIRIM", "MACAÍBA", "SÃO JOSÉ DE MIPIBU", 
  "VERA CRUZ", "MONTE ALEGRE", "NÍSIA FLORESTA", "SENADOR GEORGINO AVELINO"
]);

// Função para normalizar strings (remove acentos)
function normalizarString(str) {
  return str.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toUpperCase();
}

// =======================
// 📍 RENDERIZAR PONTOS
// =======================
function renderizarPontos(dados) {
  markers.clearLayers();

  dados.forEach(ponto => {
    if (!ponto.LATITUDE || !ponto.LONGITUDE) return;

    const lat = parseFloat(ponto.LATITUDE);
    const lng = parseFloat(ponto.LONGITUDE);

    if (isNaN(lat) || isNaN(lng)) return;

    const cor = "blue"

    const marker = L.circleMarker([lat, lng], {
      radius: 10,
      fillColor: cor,
      color: "#000",
      weight: 1,
      fillOpacity: 0.8
    });

    marker.bindPopup(`
      <h1> ${ponto.NOME_LOCAL}</h1>
    
      <b>Cidade:</b> ${ponto.CIDADE}<br>
      <b>Bairro:</b> ${ponto.BAIRRO}<br>
      <b>Conta contrato:</b> ${ponto.CONTA_CONTRATO}<br>
      <b>Poste:</b> ${ponto.POSTE}<br>
      <b>Transformador:</b> ${ponto.TRAFO}<br>
      <b>Alimentador:</b> ${ponto.ALIMENTADOR}<br>
    `);

    markers.addLayer(marker);
  });
}

// =======================
// 🔍 FILTRO POR CIDADE
// =======================
function filtrar() {
  const filtrados = dadosGlobais.filter(ponto => {
    const cidadeNormalizada = normalizarString(ponto.CIDADE);
    
    // Verifica se a cidade normalizada está na lista de selecionadas
    for (let cidadeSelecionada of cidades_selecionadas) {
      if (normalizarString(cidadeSelecionada) === cidadeNormalizada) {
        return true;
      }
    }
    return false;
  });

  renderizarPontos(filtrados);
}

// =======================
// 📥 CARREGAR CSV
// =======================
Papa.parse("locais_de_votacao_2026.csv", {
  download: true,
  header: true,
  complete: function(results) {
    dadosGlobais = results.data;
    renderizarPontos(dadosGlobais);
  }
});

// =======================
// 🎯 EVENTOS DE FILTRO DE CIDADES
// =======================
document.addEventListener("DOMContentLoaded", () => {
  const checkboxes = document.querySelectorAll(".city-checkbox");

  checkboxes.forEach(checkbox => {
    checkbox.addEventListener("change", function() {
      if (this.checked) {
        cidades_selecionadas.add(this.value);
      } else {
        cidades_selecionadas.delete(this.value);
      }
      filtrar();
    });
  });
});

// =======================
// 📍 GEOLOCALIZAÇÃO
// =======================
function goToLocation() {
  map.locate({ setView: true, maxZoom: 16 });

  map.on('locationfound', function(e) {
    L.marker(e.latlng).addTo(map)
      .bindPopup("Você está aqui")
      .openPopup();
  });
}

// =======================
// 📌 MODO COORDENADA
// =======================
let coordMode = false;
let coordMarker = null;

function toggleCoordMode() {
  coordMode = !coordMode;
  alert(coordMode ? "Modo coordenada ativado" : "Modo coordenada desativado");
}

map.on("click", function(e) {
  if (!coordMode) return;

  if (coordMarker) {
    map.removeLayer(coordMarker);
  }

  coordMarker = L.marker(e.latlng).addTo(map)
    .bindPopup(`Lat: ${e.latlng.lat.toFixed(6)}<br>Lng: ${e.latlng.lng.toFixed(6)}`)
    .openPopup();
});
