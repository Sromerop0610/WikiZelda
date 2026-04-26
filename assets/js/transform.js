async function cargarXML() {
    try {
        const res = await fetch("data/juegos.xml");

        if (!res.ok) {
            throw new Error("No se pudo cargar el XML");
        }

        const xmlText = await res.text();

        const parser = new DOMParser();
        const xmlDoc = parser.parseFromString(xmlText, "text/xml");

        const juegos = xmlDoc.getElementsByTagName("juego");

        const resultado = [];

        for (let i = 0; i < juegos.length; i++) {
            const juego = juegos[i];

            resultado.push({
                id: juego.getAttribute("id"),
                titulo: getTagValue(juego, "titulo"),
                desarrolladora: getTagValue(juego, "desarrolladora"),
                publicadora: getTagValue(juego, "publicadora"),
                plataforma: getTagValue(juego, "plataforma"),
                anio: Number(getTagValue(juego, "anio")),
                puntuacion: Number(getTagValue(juego, "puntuacion"))
            });
        }

        pintarJuegos(resultado);

    } catch (error) {
        console.error("Error cargando XML:", error);
    }
}

// ==========================
// AUXILIAR
// ==========================
function getTagValue(parent, tag) {
    const el = parent.getElementsByTagName(tag)[0];
    return el ? el.textContent : "";
}

// ==========================
// RENDER EN HTML
// ==========================
function pintarJuegos(juegos) {
    const contenedor = document.getElementById("contenedorJuegos");

    if (!contenedor) return;

    contenedor.innerHTML = "";

    juegos.forEach(juego => {
        const card = document.createElement("div");
        card.classList.add("tarjeta");

        card.innerHTML = `
            <h3>${juego.titulo}</h3>
            <p><strong>Año:</strong> ${juego.anio}</p>
            <p><strong>Puntuación:</strong> ${juego.puntuacion}</p>
            <p><strong>Plataforma:</strong> ${juego.plataforma}</p>
        `;

        contenedor.appendChild(card);
    });
}

// ==========================
// INICIO
// ==========================
document.addEventListener("DOMContentLoaded", cargarXML);