let timeout;

// ==========================
// CONFIGURACIÓN API
// ==========================
const BASE_URL = "https://zelda.fanapis.com/api";

// ==========================
// FUNCIÓN PARA PEDIR DATOS
// ==========================
async function fetchZelda(tipo, busqueda) {
    try {
        const url = `${BASE_URL}/${tipo}?name=${busqueda}`;

        const response = await fetch(url);

        if (!response.ok) {
            throw new Error("Error en la API");
        }

        const data = await response.json();

        console.log("DATOS API:", data);

        return data.data;

    } catch (error) {
        console.error("Error:", error);
        throw error;
    }
}

// ==========================
// ELEMENTOS DOM
// ==========================
const input = document.getElementById("inputBusqueda");
const filtro = document.getElementById("filtroBusqueda");
const contenedor = document.getElementById("contenedorResultados");

// ==========================
// PINTAR RESULTADOS
// ==========================
function pintarResultados(datos, tipo) {

    contenedor.innerHTML = "";

    if (!datos || datos.length === 0) {
        contenedor.innerHTML = "<p>No hay resultados</p>";
        return;
    }

    datos.forEach(item => {

        const tarjeta = document.createElement("div");
        tarjeta.classList.add("tarjeta");

        tarjeta.innerHTML = `
            <h3>${item.name}</h3>
            <p>${item.description?.slice(0, 120) || "Sin descripción"}...</p>
            <p><strong>Tipo:</strong> ${tipo === "characters" ? "Personaje" : "Monstruo"}</p>
        `;

        contenedor.appendChild(tarjeta);
    });
}

// ==========================
// CACHÉ
// ==========================
function obtenerCache(tipo, busqueda) {
    const clave = `${tipo}_${busqueda}`;
    const datos = localStorage.getItem(clave);
    return datos ? JSON.parse(datos) : null;
}

function guardarCache(tipo, busqueda, datos) {
    const clave = `${tipo}_${busqueda}`;
    localStorage.setItem(clave, JSON.stringify(datos));
}

// ==========================
// FUNCIÓN PRINCIPAL DE BÚSQUEDA
// ==========================
async function buscar(texto, tipo) {

    const cache = obtenerCache(tipo, texto);

    if (cache) {
        console.log("Usando caché");
        pintarResultados(cache, tipo);
        return;
    }

    try {
        const resultados = await fetchZelda(tipo, texto);

        guardarCache(tipo, texto, resultados);

        pintarResultados(resultados, tipo);

    } catch (error) {
        contenedor.innerHTML = "<p>Error al cargar datos</p>";
    }
}

// ==========================
// EVENTO INPUT (DEBOUNCE)
// ==========================
input.addEventListener("input", () => {

    const texto = input.value.trim();
    const tipo = filtro.value;

    clearTimeout(timeout);

    timeout = setTimeout(() => {

        if (texto.length === 0) {
            contenedor.innerHTML = "";
            return;
        }

        buscar(texto, tipo);

    }, 500);
});

// ==========================
// EVENTO CAMBIO DE FILTRO
// ==========================
filtro.addEventListener("change", () => {

    const texto = input.value.trim();
    const tipo = filtro.value;

    if (texto.length === 0) return;

    buscar(texto, tipo);
});