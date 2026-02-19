import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";

// Configuração do Firebase
// NOTA: Ajustei alguns valores baseados no padrão do Firebase.
// Você precisará substituir 'INSIRA_SUA_API_KEY_AQUI' pela chave real (começa com "AIza").
const firebaseConfig = {
  apiKey: "AIzaSyDCgl4dbGTJUH-0bsGsisO9KbWYoIN3KU4", // A chave API real começa com "AIza..."
  authDomain: "herosiege-ef56f.firebaseapp.com", // Domínio padrão baseado no ID do projeto
  projectId: "herosiege-ef56f",
  storageBucket: "herosiege-ef56f.firebasestorage.app",
  messagingSenderId: "147989943940", // O número "147989943940" é geralmente o ID do Remetente (Project Number)
  appId: "1:147989943940:web:3b107b85598b7033fd94d1" // O ID do App parece com "1:147989943940:web:..."
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const db = getFirestore(app);

export { db };
export default app;