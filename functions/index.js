const functions = require("firebase-functions");
const admin = require("firebase-admin");
const axios = require("axios");
const cheerio = require("cheerio");
const cors = require("cors")({ origin: true });

admin.initializeApp();
const db = admin.firestore();

const absUrl = (u) => {
  if (!u) return u;
  if (u.startsWith("//")) return "https:" + u;
  if (u.startsWith("/")) return "https://herosiege.wiki.gg" + u;
  return u;
};

const normalizeSlug = (name) => {
  if (!name) return "";
  return String(name)
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .trim()
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9\-]/g, "");
};

exports.getHeroData = functions.https.onRequest((req, res) => {
  return cors(req, res, async () => {
    const nomeClasse = req.query.nome;

    if (!nomeClasse) {
      return res.status(400).send("Nome da classe é obrigatório.");
    }

    try {
      const slug = normalizeSlug(nomeClasse);
      const docRef = db.collection("classes").doc(slug);
      const doc = await docRef.get();

      // 1. Se os dados já existem no Firebase, entrega na hora!
      if (doc.exists) {
        console.log(`Dados de ${slug} recuperados do Firestore.`);
        return res.json(doc.data());
      }

      // 2. Se não existem, vamos buscar na Wiki (Scraping)
      console.log(`Buscando ${nomeClasse} na Wiki...`);
      const wikiUrl = `https://herosiege.wiki.gg/api.php?action=parse&page=${nomeClasse}&prop=text&format=json&origin=*`;
      const response = await axios.get(wikiUrl);
      const html = response.data.parse.text["*"];
      const $ = cheerio.load(html);

      // Limpeza de links e ajuste de imagens
      $("a").each((i, el) => $(el).replaceWith($(el).contents()));
      $("img").each((i, el) => {
        let src = $(el).attr("src");
        if (src && src.startsWith("/")) $(el).attr("src", "https://herosiege.wiki.gg" + src);
        $(el).removeAttr("srcset").removeAttr("width").removeAttr("height");
      });

      // Extração das tabelas e separação de "Class Augments" em extra_info
      const sections = [];
      const extraInfo = [];
      $("table").each((i, table) => {
        const textLen = $(table).text().replace(/\s+/g, " ").trim().length;
        if (textLen > 50) {
          let title = `Habilidades ${i + 1}`;
          const prev = $(table).prevAll("h2, h3").first();
          if (prev.length) title = prev.text().replace("[edit]", "").trim();
          const htmlTable = $(table).html();
          const header = (title || "").toLowerCase();
          if (header.includes("class augments")) {
            extraInfo.push({ title: "Class Augments", html: htmlTable });
          } else {
            sections.push({ title, html: htmlTable });
          }
        }
      });

      const dataToSave = {
        id: slug,
        nome: nomeClasse,
        weapon: "Informação via Wiki",
        especializacoes: sections,
        extra_info: extraInfo,
        lastUpdated: new Date().toISOString(),
      };

      // 3. Salva no Firestore para o próximo usuário não ter que esperar
      await docRef.set(dataToSave);

      return res.json(dataToSave);
    } catch (error) {
      console.error(error);
      return res.status(500).send("Erro ao processar dados da classe.");
    }
  });
});

exports.getItemCategories = functions.https.onRequest((req, res) => {
  return cors(req, res, async () => {
    try {
      const snap = await db.collection("item_categories").get();
      const categories = [];
      snap.forEach((d) => {
        const data = d.data();
        categories.push({
          id: d.id,
          title: data.title || d.id,
          image: absUrl(data.image || ""),
          wikiUrl: data.wikiUrl || ""
        });
      });
      categories.sort((a, b) => (a.title || "").localeCompare(b.title || ""));
      return res.json({ categories });
    } catch (e) {
      return res.status(500).send("Erro ao carregar categorias de itens.");
    }
  });
});

exports.getItemsByCategory = functions.https.onRequest((req, res) => {
  return cors(req, res, async () => {
    const id = req.query.id;
    if (!id) {
      return res.status(400).send("Parâmetro 'id' obrigatório.");
    }
    try {
      const snap = await db.collection("item_categories").doc(id).collection("items").get();
      const items = [];
      snap.forEach((d) => {
        const data = d.data();
        items.push({
          id: d.id,
          name: data.name || d.id,
          image: absUrl(data.image || ""),
          rarity: data.rarity || null
        });
      });
      items.sort((a, b) => (a.name || "").localeCompare(b.name || ""));
      return res.json({ items });
    } catch (e) {
      return res.status(500).send("Erro ao carregar itens da categoria.");
    }
  });
});

exports.steamPlayers = functions.region("us-central1").https.onRequest((req, res) => {
  return cors(req, res, async () => {
    try {
      const url = "https://api.steampowered.com/ISteamUserStats/GetNumberOfCurrentPlayers/v1/?appid=269210";
      const { data } = await axios.get(url, { timeout: 5000 });
      const count = data?.response?.player_count ?? null;
      return res.json({ player_count: count, updatedAt: new Date().toISOString() });
    } catch (e) {
      console.error("steamPlayers error", e.message || e);
      return res.status(502).json({ player_count: null, error: "Steam API unavailable" });
    }
  });
});
