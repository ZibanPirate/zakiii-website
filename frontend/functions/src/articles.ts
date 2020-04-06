import * as functions from 'firebase-functions';
import * as path from "path";
import * as fs from "fs";
import axios from "axios";

const backendURL = process.env.NODE_ENV === "development" ? "http://127.0.0.1:9090" : "https://data.zakiii.com";

export const articles = functions.https.onRequest(async (request, response) => {
  const language = request.path.startsWith("/ar") ? "ar/" : "";
  const articleSlug = decodeURI(request.path).split("/")[language ? 3 : 2];

  let res;
  try {
    res = await axios.get(backendURL + "/" + language + "/articles/" + articleSlug + ".json");
  } catch (error) {
    console.log(articleSlug + " | not found");
    response.writeHead(302, { 'Location': `/${language}Articles` });
    response.end();
    return;
  }
  const article = res.data;
  const htmlPath = path.join(__dirname, `../html/${language}index.html`);
  fs.readFile(htmlPath, { encoding: 'utf-8' }, (err, data) => {
    if (!err) {
      response.writeHead(200, { 'Content-Type': 'text/html' });
      let html = data;
      html = html.replace(/<title>[\s\S]+<\/title>/, `<title>${article.title} | zakiii</title>`);
      html = html.replace(/<meta name="description" content="[^"]+">/, `<meta name="description" content="${article.description}">`);
      html = html.replace(/<meta property="og:image" content="[^"]+">/, `<meta property="og:image" content="${article.image}">`);
      response.write(html);
      response.end();
    } else {
      response.status(500);
      response.end();
      console.log(err);
    }
  });
});
