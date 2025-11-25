import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import { generateReportPdf } from "./services/pdfGenerator.js";

const app = express();
const PORT = 3001;

// Middlewares
// Nota: O frontend espera que o backend esteja rodando.
app.use(cors({ origin: "http://localhost:5173" }));
app.use(bodyParser.json());

// ===============================================
// ENDPOINT PRINCIPAL: Geração de PDF
// ===============================================// ... Seu código de setup do Express

app.post("/generate-pdf", async (req, res) => {
  try {
    // Recebe 'answers', 'result' E 'questions' do frontend
    const { answers, result, questions } = req.body;

    if (
      !answers ||
      Object.keys(answers).length === 0 ||
      !result ||
      !questions
    ) {
      return res.status(400).send({
        message:
          "Dados do questionário (respostas, perguntas e resultado) são necessários.",
      });
    } // Desestruturação dos dados do resultado (apenas para organização)

    const { score, category, recommendation, description } = result;

    const reportData = {
      // ✅ ESTA É A ESTRUTURA CORRETA QUE ESTÁ SENDO LIDA PELO pdfGenerator.js
      result: {
        score,
        category,
        recommendation,
        description,
      },
      answers: answers,
      questions: questions,
    };

    console.log("Score recebido:", reportData.result.score);

    const pdfBuffer = await generateReportPdf(reportData); // Chamada da função

    res.set({
      "Content-Type": "application/pdf",
      "Content-Disposition":
        'attachment; filename="Lumispect_Relatorio_Detalhado.pdf"',
      "Content-Length": pdfBuffer.length,
    });
    res.send(pdfBuffer);
  } catch (error) {
    console.error("Erro na geração do PDF:", error);
    res.status(500).send({ message: "Erro interno ao gerar o relatório PDF." });
  }
});

// ... Seu código app.listen

app.listen(PORT, () => {
  console.log(`PDF API Server rodando em http://localhost:${PORT}`);
});
