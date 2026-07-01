import { initializeApp } from "firebase/app";
import { getDatabase, ref, push } from "firebase/database";

const firebaseConfig = {
  apiKey: process.env.VITE_FIREBASE_API_KEY,
  authDomain: process.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: process.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.VITE_FIREBASE_APP_ID,
  databaseURL: process.env.VITE_FIREBASE_DATABASE_URL,
};
const products = [
  {
    name: "Elden Ring",
    price: 59.99,
    stock: 10,
    category: "RPG",
    description: "Un RPG de acción ambientado en un vasto mundo abierto lleno de secretos, enemigos y jefes poderosos.",
    image: "https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/1245620/header.jpg",
  },
  {
    name: "Hollow Knight",
    price: 14.99,
    stock: 20,
    category: "Indie",
    description: "Forjá tu propio camino en Hallownest, un vasto reino arruinado de insectos y héroes.",
    image: "https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/367520/header.jpg",
  },
  {
    name: "Cyberpunk 2077",
    price: 39.99,
    stock: 8,
    category: "Action",
    description: "Un RPG de mundo abierto ambientado en el futuro oscuro de Night City.",
    image: "https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/1091500/header.jpg",
  },
  {
    name: "Civilization VI",
    price: 29.99,
    stock: 15,
    category: "Strategy",
    description: "Construí un imperio que resista la prueba del tiempo.",
    image: "https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/289070/header.jpg",
  },
  {
    name: "Resident Evil 4",
    price: 49.99,
    stock: 6,
    category: "Horror",
    description: "Leon S. Kennedy es enviado a rescatar a la hija del presidente.",
    image: "https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/2050650/header.jpg",
  },
  {
    name: "Stardew Valley",
    price: 14.99,
    stock: 25,
    category: "Simulation",
    description: "Heredaste la granja de tu abuelo. Empezá una nueva vida en el campo.",
    image: "https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/413150/header.jpg",
  },
  {
    name: "DOOM Eternal",
    price: 39.99,
    stock: 12,
    category: "Action",
    description: "Los ejércitos del infierno invadieron la Tierra. Convertite en el Slayer.",
    image: "https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/782330/header.jpg",
  },
  {
    name: "Hades",
    price: 24.99,
    stock: 18,
    category: "Indie",
    description: "Desafiá al dios de los muertos mientras escapás del Inframundo.",
    image: "https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/1145360/header.jpg",
  },
  {
    name: "Total War: Warhammer III",
    price: 59.99,
    stock: 5,
    category: "Strategy",
    description: "Llevá tus fuerzas a través de un mundo al borde de la destrucción.",
    image: "https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/1142710/header.jpg",
  },
  {
    name: "Outer Wilds",
    price: 24.99,
    stock: 14,
    category: "Indie",
    description: "Un misterio de mundo abierto sobre un sistema solar atrapado en un bucle de tiempo.",
    image: "https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/753640/header.jpg",
  },
  {
    name: "Chess Ultra",
    price: 9.99,
    stock: 50,
    category: "Strategy",
    description: "El ajedrez definitivo con gráficos increíbles y partidas online.",
    image: "https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/516750/header.jpg",
  },
];

const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

async function seed() {
  console.log("Cargando productos...");
  for (const product of products) {
    await push(ref(db, "products"), product);
    console.log(`✓ ${product.name}`);
  }
  console.log("\n¡Todos los productos cargados!");
  process.exit(0);
}

seed();
