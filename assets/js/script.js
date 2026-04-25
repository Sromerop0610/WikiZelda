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
// EVENTO DE BÚSQUEDA
// ==========================
input.addEventListener("input", async () => {

    const texto = input.value.trim();
    const tipo = filtro.value;

    if (texto.length === 0) return;

    const resultados = await fetchZelda(tipo, texto);

    console.log("RESULTADOS:", resultados);
});