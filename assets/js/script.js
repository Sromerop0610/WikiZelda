let timeout;

// ==========================
// CONFIG API
// ==========================
const BASE_URL = "https://zelda.fanapis.com/api";


// ==========================
// DOM INDEX
// ==========================
const input = document.getElementById("inputBusqueda");
const filtro = document.getElementById("filtroBusqueda");
const contenedor = document.getElementById("contenedorResultados");
const estado = document.getElementById("estado");


// ==========================
// FAVORITOS STORAGE
// ==========================
function getFavoritos() {
    return JSON.parse(localStorage.getItem("favoritos")) || [];
}

function guardarFavoritos(favs) {
    localStorage.setItem("favoritos", JSON.stringify(favs));
}

function esFavorito(id) {
    return getFavoritos().some(f => f.id === id);
}


// ==========================
// API
// ==========================
async function fetchZelda(tipo, busqueda) {
    try {
        const url = `${BASE_URL}/${tipo}?name=${busqueda}`;
        const response = await fetch(url);

        if (!response.ok) throw new Error("Error API");

        const data = await response.json();
        return data.data;

    } catch (error) {
        console.error(error);
        return [];
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
// PINTAR RESULTADOS (INDEX)
// ==========================
function pintarResultados(datos, tipo) {

    contenedor.innerHTML = "";

    if (!datos || datos.length === 0) {
        contenedor.innerHTML = "<p>No hay resultados</p>";
        return;
    }

    datos.forEach(item => {

        const card = document.createElement("div");
        card.classList.add("tarjeta");

        const favActivo = esFavorito(item.id);

        card.innerHTML = `
            <h3>${item.name}</h3>
            <p>${item.description?.slice(0, 120) || "Sin descripción"}...</p>
            <button class="fav-btn">
                ${favActivo ? "💖" : "⭐"}
            </button>
        `;

        // IR A DETALLE
        card.addEventListener("click", () => {
            window.location.href = `detalles.html?tipo=${tipo}&id=${item.id}`;
        });

        // FAVORITOS
        const btnFav = card.querySelector(".fav-btn");

        btnFav.addEventListener("click", (e) => {
            e.stopPropagation();

            let favs = getFavoritos();

            const index = favs.findIndex(f => f.id === item.id);

            if (index !== -1) {
                favs.splice(index, 1);
            } else {
                favs.push({
                    id: item.id,
                    name: item.name,
                    tipo: tipo,
                    description: item.description
                });
            }

            guardarFavoritos(favs);

            pintarResultados(datos, tipo); // refresca UI
        });

        contenedor.appendChild(card);
    });
}


// ==========================
// BUSQUEDA
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

    const resultados = await fetchZelda(tipo, texto);

    guardarCache(tipo, texto, resultados);

    if (!resultados.length) {
        estado.textContent = "No hay resultados";
        return;
    }

    estado.textContent = "";
    pintarResultados(resultados, tipo);
}


// ==========================
// INIT INDEX
// ==========================
if (input && filtro && contenedor) {

    input.addEventListener("input", () => {

        const texto = input.value.trim();
        const tipo = filtro.value;

        clearTimeout(timeout);

        timeout = setTimeout(() => {

            if (!texto) {
                contenedor.innerHTML = "";
                return;
            }

            buscar(texto, tipo);

        }, 500);
    });

    filtro.addEventListener("change", () => {

        const texto = input.value.trim();
        const tipo = filtro.value;

        if (texto) buscar(texto, tipo);
    });
}


// ==========================
// DETALLE PAGE
// ==========================
const nombre = document.getElementById("nombre");
const categoria = document.getElementById("categoria");
const descripcion = document.getElementById("descripcion");
const extra = document.getElementById("extra");
const btnFav = document.getElementById("btnFavorito");

function getParams() {
    const params = new URLSearchParams(window.location.search);
    return {
        tipo: params.get("tipo"),
        id: params.get("id")
    };
}


// ==========================
// DETALLE LOAD
// ==========================
async function cargarDetalle() {

    const { tipo, id } = getParams();

    if (!tipo || !id) return;

    const res = await fetch(`${BASE_URL}/${tipo}/${id}`);
    const data = await res.json();

    const item = data.data;

    nombre.textContent = item.name;
    descripcion.textContent = item.description || "Sin descripción";
    categoria.textContent = tipo === "characters" ? "Personaje" : "Monstruo";

    extra.innerHTML = `
        ${item.gender ? `<p>Género: ${item.gender}</p>` : ""}
        ${item.race ? `<p>Raza: ${item.race}</p>` : ""}
        ${item.appearances ? `<p>Apariciones: ${item.appearances.length}</p>` : ""}
    `;

    // BOTÓN FAVORITO DETALLE
    const favs = getFavoritos();
    const existe = favs.some(f => f.id === item.id);

    if (btnFav) {
        btnFav.textContent = existe ? "💖 Quitar de favoritos" : "⭐ Añadir a favoritos";

        btnFav.addEventListener("click", () => {

            let favs = getFavoritos();

            const index = favs.findIndex(f => f.id === item.id);

            if (index !== -1) {
                favs.splice(index, 1);
            } else {
                favs.push({
                    id: item.id,
                    name: item.name,
                    tipo,
                    description: item.description
                });
            }

            guardarFavoritos(favs);

            cargarDetalle(); // refresca botón
        });
    }
}


// ==========================
// FAVORITOS PAGE
// ==========================
const contFav = document.getElementById("contenedorFavoritos");
const mensajeVacio = document.getElementById("mensajeVacio");

function pintarFavoritos() {

    if (!contFav) return;

    const favs = getFavoritos();

    contFav.innerHTML = "";

    if (favs.length === 0) {
        mensajeVacio.style.display = "block";
        return;
    }

    mensajeVacio.style.display = "none";

    favs.forEach(item => {

        const card = document.createElement("div");
        card.classList.add("tarjeta");

        card.innerHTML = `
            <h3>${item.name}</h3>
            <p>${item.description?.slice(0, 120) || "Sin descripción"}...</p>
            <button class="eliminar">🗑️</button>
        `;

        card.addEventListener("click", () => {
            window.location.href = `detalles.html?tipo=${item.tipo}&id=${item.id}`;
        });

        const btn = card.querySelector(".eliminar");

        btn.addEventListener("click", (e) => {
            e.stopPropagation();

            let favs = getFavoritos();
            favs = favs.filter(f => f.id !== item.id);

            guardarFavoritos(favs);
            pintarFavoritos();
        });

        contFav.appendChild(card);
    });
}


// ==========================
// INIT DETALLE / FAVORITOS
// ==========================
document.addEventListener("DOMContentLoaded", () => {

    if (window.location.pathname.includes("detalles.html")) {
        cargarDetalle();
    }

    if (window.location.pathname.includes("favoritos.html")) {
        pintarFavoritos();
    }

});