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
  { name:"Elden Ring", price:59.99, stock:10, category:"RPG", description:"An action RPG set in a vast open world filled with ancient secrets, fearsome enemies and powerful bosses.", image:"https://imgs.search.brave.com/DXyE6bhUjEvxCG47uGL-woN9FVrDOqG5LUnUsD3b83k/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9pbWcu/dWhkcGFwZXIuY29t/L3dhbGxwYXBlci9l/bGRlbi1yaW5nLWdh/bWUtNDYwQDVAaw" },
  { name:"Hollow Knight", price:14.99, stock:20, category:"Indie", description:"Forge your own path in Hollownest, a vast ruined kingdom of insects and heroes.", image:"https://imgs.search.brave.com/9FUP8ioWE47a6OlaKGubGImPTFdLd7JdUHKWYJJUzGM/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly93YWxs/cGFwZXJjYXZlLmNv/bS93cC93cDMxMTY3/ODYuanBn" },
  { name:"Cyberpunk 2077", price:39.99, stock:8, category:"Action", description:"An open-world RPG set in the dark future of Night City, a megalopolis obsessed with power and body modification.", image:"https://imgs.search.brave.com/G2JLohRyMFGzU68NDnBhrcJGlOYLBvZFiYNnFP5RgZU/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly93YWxs/cGFwZXJzLmNvbS9p/bWFnZXMvaGQvY3li/ZXJwdW5rLTIwNzct/Z2lybC13aXRoLWd1/bi1rZ3g1YTFwdXp4/aHNjZWM2LmpwZw" },
  { name:"Civilization VI", price:29.99, stock:15, category:"Strategy", description:"Build an empire to stand the test of time. Explore, expand, exploit and exterminate.", image:"https://imgs.search.brave.com/prTmQbUrSgeof4XjM3ie98kX5iE6od4e1h-g3-HrTjE/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly93YWxs/cGFwZXJjYXZlLmNv/bS93cC93cDM4MDU5/NDUuanBn" },
  { name:"Resident Evil 4", price:49.99, stock:6, category:"Horror", description:"Survive the nightmare. Leon S. Kennedy is sent on a mission to rescue the president's daughter.", image:"https://imgs.search.brave.com/wapLB6L_CL6qUjlhUwVLgSd18QfnSZpUX5yOavAmSIE/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly93YWxs/cGFwZXJjYXZlLmNv/bS93cC93cDEyMDEz/NjMyLmpwZw" },
  { name:"Stardew Valley", price:14.99, stock:25, category:"Simulation", description:"You've inherited your grandfather's old farm. Pack up and head to the countryside to begin your new life.", image:"https://imgs.search.brave.com/Z01gQNI11fhxuJoWduiVhDyV_e02C3gVWGNkIXbOuxY/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly93YWxs/cGFwZXJzLmNvbS9p/bWFnZXMvaGQvc3Rh/cmRldy12YWxsZXkt/ZmllbGR0cmlwLTdz/M2FhYTB3MXdiYXQx/MWUuanBn" },
  { name:"DOOM Eternal", price:39.99, stock:12, category:"Action", description:"Hell's armies have invaded Earth. Become the Slayer in an epic single-player campaign.", image:"https://imgs.search.brave.com/99sDOlkPQzVPdK3S60AK-w5wexmNewDgvwlQOgb0UAo/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9zaGFy/ZWQuYWthbWFpLnN0/ZWFtc3RhdGljLmNv/bS9zdG9yZV9pdGVt/X2Fzc2V0cy9zdGVh/bS9hcHBzLzc4MjMz/MC9oZWFkZXIuanBn/P3Q9MTc1NTEwOTkx/MA" },
  { name:"Hades", price:24.99, stock:18, category:"Indie", description:"Defy the god of the dead as you hack and slash your way out of the Underworld.", image:"https://imgs.search.brave.com/pJSpCW6NUsdPJmn67nJNzkzO3avS8h6Peo8A_2KeYCE/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9pLnl0/aW1nLmNvbS92aV93/ZWJwLzNHUktKODdT/NWNJL21heHJlc2Rl/ZmF1bHQud2VicA" },
  { name:"Total War: Warhammer III", price:59.99, stock:5, category:"Strategy", description:"Lead your forces through a world on the brink of destruction in this epic strategy game.", image:"https://imgs.search.brave.com/MFQ1DEU_AoOzdC8PxGBrJr8XqeX1bVFNZL6glXdgLwU/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9hc3Nl/dHMtcHJkLmlnbmlt/Z3MuY29tLzIwMjEv/MDIvMDMvdG90YWwt/d2FyLXdhcmhhbW1l/ci0zLWJ1dHRvbi0w/Mi0xNjEyMzc2MjY0/NzM3LmpwZz9jcm9w/PTE6MSxzbWFydCZm/b3JtYXQ9anBnJmF1/dG89d2VicCZxdWFs/aXR5PTgw" },
  { name:"Outer Wilds", price:24.99, stock:14, category:"Indie", description:"An open world mystery about a solar system trapped in an endless time loop.", image:"https://imgs.search.brave.com/EhdMbMlMJYWDzQiid784HwmgAuthoF-N8jjDr3KNzVo/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9nYW1p/bmctY2RuLmNvbS9p/bWFnZXMvcHJvZHVj/dHMvMjU4Ni82MTZ4/MzUzL291dGVyLXdp/bGRzLXBjLWp1ZWdv/LXN0ZWFtLWNvdmVy/LmpwZz92PTE3MTAy/MzA5MjQ" },
  { name:"Chess", price:84.67, stock:2, category:"Strategy", description:"Classic two-player strategy board game that challenges the mind.", image:"https://imgs.search.brave.com/yj4Pqpw9GGmIz7SHUEVwwTDtUKt8aRdwtB2131DkVJI/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly90NC5m/dGNkbi5uZXQvanBn/LzA1Lzg3LzQ4LzEx/LzM2MF9GXzU4NzQ4/MTE3NV9ZazhTZmtq/WEVuVFlSQ1NUVEs4/eGFVM0Q4cUUxNUFR/ai5qcGc" },
];

const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

async function seed() {
  for (const product of products) {
    await push(ref(db, "products"), product);
    console.log(`✓ ${product.name}`);
  }
  console.log("¡Todos los productos cargados!");
  process.exit(0);
}

seed();