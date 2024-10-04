import admin from "firebase-admin";
import serviceAccount from "./key.json";

// Inicializar Firebase apenas se não estiver inicializado
if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount as admin.ServiceAccount),
    databaseURL: process.env.FIREBASE_ADMIN_DATABASEURL,
  });
}

export default admin;
