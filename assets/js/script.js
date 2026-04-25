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
    }
}

fetchZelda("characters", "an");


// ==========================
// ELEMENTOS DOM
// ==========================
const input = document.getElementById("inputBusqueda");
const filtro = document.getElementById("filtroBusqueda");

// ==========================
// VOLCADO EN HTML
// ==========================
const contenedor = document.getElementById("contenedorResultados");

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
            <p>${item.description || "Sin descripción"}</p>
            <p><strong>Tipo:</strong> ${tipo === "characters" ? "Personaje" : "Monstruo"}</p>
        `;

        contenedor.appendChild(tarjeta);
    });
}
// ==========================
// EVENTO DE BÚSQUEDA
// ==========================
input.addEventListener("input", () => {

    const texto = input.value.trim();
    const tipo = filtro.value;

    clearTimeout(timeout);

    timeout = setTimeout(async () => {

        if (texto.length === 0) {
            contenedor.innerHTML = "";
            return;
        }

        const resultados = await fetchZelda(tipo, texto);

        pintarResultados(resultados, tipo);

    }, 500);
});
