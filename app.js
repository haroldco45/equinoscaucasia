// Navegación entre secciones
function showSection(id) {
    document.querySelectorAll('section').forEach(s => s.style.display = 'none');
    document.getElementById(id).style.display = 'block';
}

// Gestión de base de datos local de caballos
const horseForm = document.getElementById('horseForm');
const horseList = document.getElementById('horseList');

let caballos = JSON.parse(localStorage.getItem('pesebrera_db')) ||;

function renderHorses() {
    horseList.innerHTML = caballos.map((c, index) => `
        <div class="card">
            <h3>${c.nombre}</h3>
            <p><strong>Andar:</strong> ${c.andar}</p>
            <p><strong>Microchip:</strong> ${c.microchip |

| 'No registrado'}</p>
            <button onclick="deleteHorse(${index})">Eliminar</button>
        </div>
    `).join('');
}

horseForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const nuevo = {
        nombre: document.getElementById('nombre').value,
        andar: document.getElementById('andar').value,
        microchip: document.getElementById('microchip').value
    };
    caballos.push(nuevo);
    localStorage.setItem('pesebrera_db', JSON.stringify(caballos));
    renderHorses();
    horseForm.reset();
});

function deleteHorse(index) {
    caballos.splice(index, 1);
    localStorage.setItem('pesebrera_db', JSON.stringify(caballos));
    renderHorses();
}

renderHorses();
