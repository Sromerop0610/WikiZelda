import { initializeApp } from "https://www.gstatic.com/firebasejs/10.0.0/firebase-app.js";
import {
    getFirestore,
    collection,
    addDoc,
    getDocs,
    deleteDoc,
    doc
} from "https://www.gstatic.com/firebasejs/10.0.0/firebase-firestore.js";

const firebaseConfig = {
    apiKey: "AIzaSyCWBrk3OFrbcaauXV-FoMJmEnM_WXRE3v0",
    authDomain: "wikizelda-d73f7.firebaseapp.com",
    projectId: "wikizelda-d73f7",
    storageBucket: "wikizelda-d73f7.firebasestorage.app",
    messagingSenderId: "109172771635",
    appId: "1:109172771635:web:47cce476059ad5e5898c46",
    measurementId: "G-KXHFSR4ZPW"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);

// colección
const favCollection = "favoritos";

// ==========================
// GET FAVORITOS FIREBASE
// ==========================
export async function getFavsFirebase() {
    const snapshot = await getDocs(collection(db, favCollection));
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
}

// ==========================
// ADD FAVORITO
// ==========================
export async function addFavFirebase(item) {
    return await addDoc(collection(db, favCollection), item);
}

// ==========================
// DELETE FAVORITO
// ==========================
export async function deleteFavFirebase(id) {
    return await deleteDoc(doc(db, favCollection, id));
}