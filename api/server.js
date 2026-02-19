const express = require('express');
const axios = require('axios');
const cheerio = require('cheerio'); // Biblioteca para limpar HTML no servidor
const cors = require('cors');
const app = express();

app.use(cors());

app.get('/api/classe/:nome', async (req, res) => {
    try {
        const { nome } = req.params;
        const url = `https://herosiege.wiki.gg/api.php?action=parse&page=${nome}&prop=text&format=json&origin=*`;
        const response = await axios.get(url);
        const rawHtml = response.data.parse.text["*"];
        
        const $ = cheerio.load(rawHtml);
        
        // Limpeza de links e imagens (Igual fazíamos no front, mas agora aqui)
        $('a').each(function() {
            $(this).replaceWith($(this).contents());
        });

        // Organizar especializações
        const sections = [];
        $('table').each((i, el) => {
            const tableHtml = $.html(el);
            if (tableHtml.length > 100) {
                sections.push({ title: `Tree ${i+1}`, html: tableHtml });
            }
        });

        res.json({
            nome,
            weapon: "Extraído da Wiki",
            especializacoes: sections
        });
    } catch (error) {
        res.status(500).send("Erro ao processar");
    }
});

app.listen(3001, () => console.log("API rodando na porta 3001"));