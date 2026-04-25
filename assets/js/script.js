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