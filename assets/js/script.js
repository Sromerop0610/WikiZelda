let timeout;

// ==========================
// CONFIGURACIÓN API
// ==========================
const BASE_URL = "https://zelda.fanapis.com/api";


// ==========================
// ELEMENTOS INDEX (BUSCADOR)
// ==========================
const input = document.getElementById("inputBusqueda");
const filtro = document.getElementById("filtroBusqueda");
const contenedor = document.getElementById("contenedorResultados");
const estado = document.getElementById("estado");


// ==========================
// FUNCIÓN API
// ==========================
async function fetchZelda(tipo, busqueda) {
    try {
        const url = `${BASE_URL}/${tipo}?name=${busqueda}`;
        const response = await fetch(url);

        if (!response.ok) throw new Error("Error en la API");

        const data = await response.json();

        console.log("DATOS API:", data);

        return data.data;

    } catch (error) {
        console.error("Error:", error);
        throw error;
    }
}


// ==========================
// CACHE
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
// PINTAR RESULTADOS
// ==========================
function pintarResultados(datos, tipo) {

    if (!contenedor) return;

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
        `;

        tarjeta.addEventListener("click", () => {
            window.location.href = `detalles.html?tipo=${tipo}&id=${item.id}`;
        });

        contenedor.appendChild(tarjeta);
    });
}


// ==========================
// BÚSQUEDA
// ==========================
async function buscar(texto, tipo) {

    if (!estado || !contenedor) return;

    estado.textContent = "Cargando...";
    contenedor.innerHTML = "";

    const cache = obtenerCache(tipo, texto);

    if (cache) {
        estado.textContent = "";
        pintarResultados(cache, tipo);
        return;
    }

    try {
        const resultados = await fetchZelda(tipo, texto);

        guardarCache(tipo, texto, resultados);

        if (!resultados || resultados.length === 0) {
            estado.textContent = "No hay resultados";
            return;
        }

        estado.textContent = "";
        pintarResultados(resultados, tipo);

    } catch (error) {
        estado.textContent = "Error al conectar con la API";
    }
}


// ==========================
// INIT INDEX (BUSCADOR)
// ==========================
if (input && filtro && contenedor) {

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


    filtro.addEventListener("change", () => {

        const texto = input.value.trim();
        const tipo = filtro.value;

        if (texto.length === 0) return;

        buscar(texto, tipo);
    });
}


// ==========================
// DETALLE PAGE
// ==========================
const nombre = document.getElementById("nombre");
const categoria = document.getElementById("categoria");
const descripcion = document.getElementById("descripcion");
const extra = document.getElementById("extra");

function obtenerParametros() {
    const params = new URLSearchParams(window.location.search);

    return {
        tipo: params.get("tipo"),
        id: params.get("id")
    };
}

async function cargarDetalle() {

    const { tipo, id } = obtenerParametros();

    if (!tipo || !id) return;

    try {

        const response = await fetch(`${BASE_URL}/${tipo}/${id}`);
        const data = await response.json();

        if (!data || !data.data) {
            nombre.textContent = "No se encontró el personaje";
            return;
        }

        const item = data.data;

        nombre.textContent = item.name;
        descripcion.textContent = item.description || "Sin descripción";
        categoria.textContent = tipo === "characters" ? "Personaje" : "Monstruo";

        extra.innerHTML = "";

        if (item.gender) {
            extra.innerHTML += `<p><strong>Género:</strong> ${item.gender}</p>`;
        }

        if (item.race) {
            extra.innerHTML += `<p><strong>Raza:</strong> ${item.race}</p>`;
        }

        if (item.appearances?.length) {
            extra.innerHTML += `<p><strong>Apariciones:</strong> ${item.appearances.length}</p>`;
        }

    } catch (error) {
        nombre.textContent = "Error al cargar el detalle";
    }
}


// ==========================
// INIT DETALLE
// ==========================
document.addEventListener("DOMContentLoaded", () => {

    const enDetalle = window.location.pathname.includes("detalles.html");

    if (enDetalle) {
        cargarDetalle();
    }

});