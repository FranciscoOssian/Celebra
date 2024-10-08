import admin from "firebase-admin";
import s from "firebase-admin/storage";

//const jsonString = JSON.stringify(serviceAccount);
//const base64String = Buffer.from(jsonString).toString("base64");
//console.log(base64String);

let serviceAccount;

try {
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  serviceAccount = require("./key.json");
} catch {
  serviceAccount = JSON.parse(
    Buffer.from(process.env.FIREBASE_ADMIN_KEY_BASE64 ?? "", "base64").toString(
      "utf-8"
    )
  );
}

// Inicializar Firebase apenas se não estiver inicializado
if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount as admin.ServiceAccount),
    databaseURL: process.env.FIREBASE_ADMIN_DATABASEURL,
  });
}

export const storage = s;
export default admin;
