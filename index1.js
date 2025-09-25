// index.js
// ApiTed Logística - 2 app en una--- 1)Servidor básico + OAuth con Mercado Libre
//                                    2)Scanner paquetes QR sin conexion con vendedores de Meli
const express = require("express");
const bodyParser = require("body-parser");
const axios = require("axios");

const app = express();
const PORT = process.env.PORT || 3000;


//------------App de scaneo- sin autorizacion de vendedor de meli-----------
const path = require("path");

app.use("/static", express.static(path.join(__dirname, "static")));
app.get("/scan", (req, res) => {
  res.sendFile(path.join(__dirname, "static", "scan.html"));
});

//---------------------------------------------------------------------

app.use(bodyParser.json());

// ---------- CONFIG MERCADO LIBRE ----------
// ⚠ Reemplazá con tus datos reales
const MELI_APP_ID = "5792548551402409";
const MELI_SECRET = "SWBwfb7yGsiO1KtU7ImYbnuaV3dxvmAw";
// ⚠ Poné EXACTAMENTE tu URL https de ngrok + /auth/callback
// Ejemplo: "https://e483edef17ce.ngrok-free.app/auth/callback"
const REDIRECT_URI = "https://f2573b281646.ngrok-free.app/auth/callback";

// Guardamos el access token en memoria (para pruebas)
let ACCESS_TOKEN = null;

// ---------- RUTAS BÁSICAS ----------
app.get("/", (req, res) => {
  res.send("🚚 ApiTed Logística: servidor OK. Probá /hello, /auth/login, /me");
});

app.get("/hello", (req, res) => {
  res.send("🚚 ApiTed Logística anda bien");
});

// ---------- OAUTH: LOGIN ----------
/* app.get("/auth/login", (req, res) => {
  const authUrl =`https://auth.mercadolibre.com.ar/authorization` +
      `?response_type=code`+
      `&client_id=${MELI_APP_ID}`+
      `&redirect_uri=${encodeURIComponent(REDIRECT_URI)}`;
  return res.redirect(authUrl);
}); */


// ---------- OAUTH: CALLBACK ----------
/* app.get("/auth/callback", async (req, res) => {
  const code = req.query.code;
  if (!code) return res.status(400).send("Falta ?code en el callback");

  try {
    const tokenResp = await axios.post(
      "https://api.mercadolibre.com/oauth/token",
      null,
      {
        params: {
          grant_type: "authorization_code",
          client_id: MELI_APP_ID,
          client_secret: MELI_SECRET,
          code,
          redirect_uri: REDIRECT_URI,
        },
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
      }
    );

    ACCESS_TOKEN = tokenResp.data.access_token;
    console.log("🔑 Access Token:", ACCESS_TOKEN);
    return res.send("✅ Conexión exitosa con Mercado Libre. Probá /me");
  } catch (err) {
    console.error("❌ Error al obtener token:", err.response?.data || err.message);
    return res.status(500).send("Error al conectar con Mercado Libre (callback)");
  }
}); */

// ---------- PRUEBA: MIS DATOS ----------
/* app.get("/me", async (req, res) => {
  if (!ACCESS_TOKEN) return res.status(401).send("Primero hacé login en /auth/login");
  try {
    const meResp = await axios.get("https://api.mercadolibre.com/users/me", {
      headers: { Authorization: `Bearer ${ACCESS_TOKEN}`},
    });
    return res.json(meResp.data);
  } catch (err) {
    console.error(err.response?.data || err.message);
    return res.status(500).send("Error consultando /me");
  }
}); */

// ---------- WEBHOOK DE MELI (lo dejamos listo) ----------
app.post("/meli-notifications", (req, res) => {
  console.log("📦 Notificación de Mercado Libre:", req.body);
  res.sendStatus(200);
});

// ---------- ARRANQUE ----------
app.listen(PORT, () => {
  console.log(`✅ Servidor corriendo en http://localhost:${PORT}`);
});
