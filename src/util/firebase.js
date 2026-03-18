

import { initializeApp, getApps, getApp } from "firebase/app";
import { getDatabase } from "firebase/database";

//Alex original RTDB config
// const firebaseConfig = {
//   apiKey: "AIzaSyBMTnvGuPzveNWDs87Mtw5brECuqk_oJ5M",
//   authDomain: "revit-api-test.firebaseapp.com",
//   databaseURL: "https://revit-api-test-default-rtdb.asia-southeast1.firebasedatabase.app",
//   projectId: "revit-api-test",
//   storageBucket: "revit-api-test.firebasestorage.app",
//   messagingSenderId: "117903387594",
//   appId: "1:117903387594:web:ce35ba202acf7aec76fd33"
// };

const firebaseConfig = {
  apiKey: "AIzaSyBILynm5cuRy3OUBTIUa08yMQJDqaNiKMU",
  authDomain: "bim-project-management.firebaseapp.com",
  databaseURL: "https://bim-project-management-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "bim-project-management",
  storageBucket: "bim-project-management.firebasestorage.app",
  messagingSenderId: "505754871867",
  appId: "1:505754871867:web:f40767fe3d9840cc80541e",
  measurementId: "G-XHM2FWRB6K"
};

// Initialize Firebase
const app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);
const db = getDatabase(app);

export { app, db };
