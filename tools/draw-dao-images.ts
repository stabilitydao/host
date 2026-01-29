import { createCanvas, loadImage } from "canvas";
import * as fs from "fs";
import * as path from "path";
import { daos, STATIC_BASE_URL } from "../src";

const tempDir = "./temp";
const imagesDir = "./temp/images";

async function drawImages() {
  if (!fs.existsSync(tempDir)) {
    fs.mkdirSync(tempDir);
  }
  if (!fs.existsSync(imagesDir)) {
    fs.mkdirSync(imagesDir);
  }
  for (const dao of daos) {
    try {
      const canvas = createCanvas(800, 400);
      const ctx = canvas.getContext("2d");

      ctx.fillStyle = "##0D1117";
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      const logoPath = dao.images.token;

      if (!logoPath) {
        console.log(`No logo found for ${dao.name} DAO`);
        continue;
      }

      const logoUrl = getLogoUrl(logoPath);

      if (!logoUrl) {
        console.log(`No logo found for ${dao.name} DAO`);
        continue;
      }

      const logo = await loadImage(logoUrl);
      if (!logo) {
        console.log(`No logo found for ${dao.name} DAO`);
        continue;
      }

      const logoSize = 200;
      const logoX = (canvas.width - logoSize) / 2;
      const logoY = 50;
      ctx.drawImage(logo, logoX, logoY, logoSize, logoSize);

      ctx.fillStyle = "#FAFAFA";
      ctx.font = "bold 48px Arial";
      ctx.textAlign = "center";
      ctx.fillText(dao.symbol, canvas.width / 2, logoY + logoSize + 60);

      ctx.font = "36px Arial";
      ctx.fillText(`${dao.name} DAO`, canvas.width / 2, logoY + logoSize + 120);

      const buffer = canvas.toBuffer("image/png");
      const fileName = `${dao.symbol.toLowerCase()}-dao.png`;

      const filePath = path.join(imagesDir, fileName);
      fs.writeFileSync(filePath, buffer);

      console.log(`Generated image for ${dao.name} DAO: ${filePath}`);
    } catch (error) {
      console.log(`Error generating image for ${dao.name} DAO:`, error);
    }
  }
}

function getLogoUrl(path: string) {
  return STATIC_BASE_URL + "/os" + path;
}

drawImages();
