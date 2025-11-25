import puppeteer from "puppeteer";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename); // Ex: .../src/api/services/

// --- Lógica para converter a imagem para Base64 ---
// NOTA: Ajuste o caminho se sua estrutura de pastas for diferente de:
// .../src/api/services/pdfGenerator.js
// .../src/assets/logo-lumis.png

const imagePath = path.join(
  __dirname,
  "..", // sobe de services
  "..", // sobe de api
  "assets", // entra em assets
  "logo-lumis.png"
);

// Verifica se o arquivo existe e faz a conversão
let BASE64_IMAGE_URL = "";
try {
  if (!fs.existsSync(imagePath)) {
    console.error(
      `ERRO CRÍTICO: Imagem de logo não encontrada em: ${imagePath}`
    ); // Usa um placeholder ou lança erro
  } else {
    const imageBuffer = fs.readFileSync(imagePath); // Assumindo que é um PNG
    BASE64_IMAGE_URL = `data:image/png;base64,${imageBuffer.toString(
      "base64"
    )}`;
  }
} catch (error) {
  console.error("Erro ao ler ou converter imagem para Base64:", error.message);
}
// --- Fim da Lógica Base64 ---

async function generateReportPdf(reportData) {
  // Desestrutura APENAS o score (pontuação)
  const { score } = reportData.result;

  const numericScore =
    typeof score === "number" ? score : parseFloat(score) || 0;

  let category = "";
  let recommendation = "";
  let description = "";
  if (numericScore >= 70) {
    // Categoria: Excelente (Aderência Alta)
    category = "Alta Probabilidade de Traços no Espectro";
    description =
      "O resultado do seu teste indica uma forte presença de traços avaliados pelo Lumispect. É crucial entender que esta é apenas uma triagem, mas o alinhamento com o escore máximo sugere que buscar uma avaliação profissional formal pode ser o passo mais importante para o seu autoconhecimento e bem-estar.";
    recommendation =
      "Recomendamos fortemente a busca por profissionais de saúde mental (Neurologista, Psiquiatra ou Psicólogo com experiência em TEA) para um diagnóstico formal e início de um plano de suporte. Temos uma lista de clínicas e especialistas parceiros que podem auxiliar neste processo.";
  } else if (numericScore >= 40) {
    category = "Sinais Moderados: Traços de Rigidez e Sensibilidade";
    description =
      "Seu resultado indica uma presença moderada de traços relacionados ao espectro. Embora o Lumispect não seja diagnóstico, esses traços podem impactar áreas da sua vida. O autoconhecimento é a chave.";
    recommendation =
      "Se os traços causarem desconforto significativo, uma consulta com um profissional de saúde mental é o caminho. Procure informações confiáveis e continue a se observar. Considere conversar com um psicólogo para explorar esses traços em profundidade.";
  } else {
    category = "Traços Comuns ou Baixa Probabilidade";
    description =
      "O seu resultado sugere que as suas experiências se alinham mais com o padrão neurotípico, com pouca intensidade nos traços avaliados. Continue focando no seu bem-estar geral e no autoconhecimento.";
    recommendation =
      "Se os traços causarem desconforto significativo, uma consulta com um profissional de saúde mental é o caminho. Procure informações confiáveis e continue a se observar. Considere conversar com um psicólogo para explorar esses traços em profundidade.";
  }

  // --- FIM DA LÓGICA DE CATEGORIZAÇÃO ---

  const chartScoreDegrees = (numericScore / 100) * 360;
  const remainingScore = 100 - numericScore;

  const templatePath = path.join(
    __dirname,
    "..",
    "templates",
    "reportTemplate.html"
  );

  if (!fs.existsSync(templatePath)) {
    throw new Error(`Template HTML não encontrado em: ${templatePath}`);
  }

  let htmlTemplate = fs.readFileSync(templatePath, "utf8"); // Substituir todas as variáveis no HTML

  // ✅ AGORA USANDO AS VARIÁVEIS CALCULADAS
  htmlTemplate = htmlTemplate
    .replace("{{CATEGORY}}", category)
    .replace("{{DESCRIPTION}}", description)
    .replace("{{RECOMMENDATION}}", recommendation)
    .replace(/{{SCORE}}/g, numericScore.toFixed(0)) // Substituição global para todas as ocorrências
    .replace("{{REMAINING_SCORE}}", remainingScore.toFixed(0)) // Arredondado
    .replace("{{CHART_SCORE_DEG}}", chartScoreDegrees) // Valor para Chart.js
    .replace("{{DATE}}", new Date().toLocaleDateString("pt-BR"))
    .replace("{{LOGO_COMPOSITE_URL}}", BASE64_IMAGE_URL);

  const browser = await puppeteer.launch({
    args: ["--no-sandbox", "--disable-setuid-sandbox"],
    headless: true,
  });
  const page = await browser.newPage();

  await page.setContent(htmlTemplate, {
    waitUntil: "networkidle0",
  });

  const pdfBuffer = await page.pdf({
    format: "A4",
    printBackground: true,
    margin: {
      top: "0.8in",
      right: "0.8in",
      bottom: "0.8in",
      left: "0.8in",
    },
  });

  await browser.close();
  return pdfBuffer;
}

export { generateReportPdf };
