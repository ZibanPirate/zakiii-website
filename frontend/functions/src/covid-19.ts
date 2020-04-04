import * as functions from 'firebase-functions';
import axios from "axios";

export const covid19 = functions.https.onRequest(async (request, response) => {

  const res = await axios.get("https://news.totok.ai/corov/dayinfo/rank");
  const data = res.data.response;

  const lastUpdate = (data.lastUpdate as string).substring((data.lastUpdate as string).indexOf(":") + 2);

  const all = (data.perDayInfo as Array<any>).pop();
  const dz = (data.perDayInfo as Array<any>).find((country) => country.country === "Algeria");
  const uae = (data.perDayInfo as Array<any>).find((country) => country.country === "UAE");

  response.json({
    lastUpdateTime: lastUpdate,
    stats: [
      {
        code: "all",
        name_en: "World Wide",
        name_ar: "جميع أنحاء العالم",
        confirm: all.totalCases.replace(/\D/g, ""),
        heal: all.totalRecovered.replace(/\D/g, ""),
        dead: all.totalDeath.replace(/\D/g, ""),
      },
      {
        code: "dz",
        name_en: "Algeria",
        name_ar: "الجزائر",
        confirm: dz.totalCases.replace(/\D/g, ""),
        heal: dz.totalRecovered.replace(/\D/g, ""),
        dead: dz.totalDeath.replace(/\D/g, ""),
      },
      {
        code: "uae",
        name_en: "UAE",
        name_ar: "الإمارات العربية المتحدة",
        confirm: uae.totalCases.replace(/\D/g, ""),
        heal: uae.totalRecovered.replace(/\D/g, ""),
        dead: uae.totalDeath.replace(/\D/g, ""),
      }
    ],
  }).end();
});
