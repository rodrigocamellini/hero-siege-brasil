const axios = require('axios');
const cheerio = require('cheerio');

async function testScrape() {
  try {
    const url = 'https://herosiege.wiki.gg/wiki/Viking';
    console.log(`Fetching ${url}...`);
    const { data } = await axios.get(url);
    const $ = cheerio.load(data);

    const description = $('#mw-content-text .mw-parser-output > p').first().text().trim();
    console.log('Description:', description);

    const image = $('.infobox-image img').attr('src');
    console.log('Image:', image);

    console.log('Headers found:');
    $('.mw-parser-output h2, .mw-parser-output h3').each((i, el) => {
        console.log($(el).text().trim());
    });

  } catch (error) {
    console.error(error);
  }
}

testScrape();
