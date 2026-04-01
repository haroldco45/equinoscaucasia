/**
 * Pesebrera Digital Pro v1.0
 * Lógica de gestión local con persistencia y alertas sanitarias ICA
 */

// 1. Configuración de Navegación
function showSection(id) {
    document.querySelectorAll('section').forEach(s => s.style.display = 'none');
    const target = document.getElementById(id);
    if (target) target.style.display = 'block';
}

// 2. Base de Datos Local (Persistent Storage)
let caballos = JSON.parse(localStorage.getItem('pesebrera_db')) ||;
let inventario = JSON.parse(localStorage.getItem('pesebrera_inv')) |

| {
    italcol_brio: 20,
    solla_campeon: 15,
    finca_cinta_azul: 10
};

// 3. Lógica de Sanidad Equina (Requisitos ICA 2025)
// IE: 1 año | EEV: 2 años | AIE: 120 días
function calculateHealth(fechaVacuna, diasVigencia) {
    if (!fechaVacuna) return { status: 'Pendiente', class: 'warn' };
    const hoy = new Date();
    const ultima = new Date(fechaVacuna);
    const diff = Math.ceil((hoy - ultima) / (1000 * 60 * 60 * 24));
    
    if (diff > diasVigencia) return { status: 'Vencida', class: 'danger' };
    return { status: 'Al día', class: 'success' };
}

// 4. Renderizado de Interfaz
function renderHorses() {
    const list = document.getElementById('horseList');
    if (!list) return;

    list.innerHTML = caballos.map((c, index) => {
        const IE = calculateHealth(c.fechaIE, 365);
        const EEV = calculateHealth(c.fechaEEV, 730);
        const AIE = calculateHealth(c.fechaAIE, 120);

        return `
            <div class="card">
                <h3>${c.nombre} <small>(${c.andar})</small></h3>
                <p><strong>Microchip:</strong> ${c.microchip |

| 'No reg.'}</p>
                <div class="health-grid">
                    <span class="badge ${IE.class}">IE: ${IE.status}</span>
                    <span class="badge ${EEV.class}">EEV: ${EEV.status}</span>
                    <span class="badge ${AIE.class}">AIE: ${AIE.status}</span>
                </div>
                <button class="btn-del" onclick="deleteHorse(${index})">Eliminar</button>
            </div>
        `;
    }).join('');
}

function renderInventory() {
    const invEl = document.getElementById('stockStatus');
    if (!invEl) return;

    invEl.innerHTML = `
        <div class="card-inv">Italcol Brío: <strong>${inventario.italcol_brio}</strong> bultos</div>
        <div class="card-inv">Solla Campeón: <strong>${inventario.solla_campeon}</strong> bultos</div>
        <div class="card-inv">Finca Cinta Azul: <strong>${inventario.finca_cinta_azul}</strong> bultos</div>
        ${inventario.italcol_brio < 5? '<p class="danger">¡Alerta Stock Crítico!</p>' : ''}
    `;
}

// 5. Gestión de Eventos (Formularios)
const horseForm = document.getElementById('horseForm');
if (horseForm) {
    horseForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const nuevoCaballo = {
            nombre: document.getElementById('nombre').value,
            andar: document.getElementById('andar').value,
            microchip: document.getElementById('microchip').value,
            fechaIE: new Date().toISOString().split('T'), // Ejemplo: asume vacunación hoy al registrar
            fechaEEV: null,
            fechaAIE: null
        };

        caballos.push(nuevoCaballo);
        saveData();
        renderHorses();
        horseForm.reset();
    });
}

function deleteHorse(index) {
    if (confirm('¿Desea eliminar este registro?')) {
        caballos.splice(index, 1);
        saveData();
        renderHorses();
    }
}

function saveData() {
    localStorage.setItem('pesebrera_db', JSON.stringify(caballos));
    localStorage.setItem('pesebrera_inv', JSON.stringify(inventario));
}

// 6. Instalación PWA (Manejo del Banner)
let deferredPrompt;
const installBtn = document.getElementById('installApp');

window.addEventListener('beforeinstallprompt', (e) => {
    e.preventDefault();
    deferredPrompt = e;
    if (installBtn) installBtn.style.display = 'block';
});

if (installBtn) {
    installBtn.addEventListener('click', async () => {
        if (deferredPrompt) {
            deferredPrompt.prompt();
            const { outcome } = await deferredPrompt.userChoice;
            if (outcome === 'accepted') installBtn.style.display = 'none';
            deferredPrompt = null;
        }
    });
}

// Inicialización
document.addEventListener('DOMContentLoaded', () => {
    renderHorses();
    renderInventory();
});
