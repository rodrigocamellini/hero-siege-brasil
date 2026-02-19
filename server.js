const express = require('express');
const axios = require('axios');
const cors = require('cors');
const app = express();

app.use(cors()); // Isso permite que seu React acesse a API sem erros

app.get('/api/wiki/:nome', async (req, res) => {
    try {
        const { nome } = req.params;
        const wikiUrl = `https://herosiege.wiki.gg/api.php?action=parse&page=${nome}&prop=text&format=json&origin=*`;
        
        // O servidor faz a busca (Servidores não sofrem bloqueio de CORS)
        const response = await axios.get(wikiUrl);
        res.json(response.data);
    } catch (error) {
        res.status(500).json({ error: "Erro ao buscar dados na Wiki" });
    }
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`Servidor rodando na porta ${PORT}`));