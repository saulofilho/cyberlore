import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json({ limit: "5mb" }));

  // Helper to initialize Gemini SDK
  function getGeminiClient(): GoogleGenAI | null {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey || apiKey === "MY_GEMINI_API_KEY" || apiKey.trim() === "") {
      return null;
    }
    return new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          "User-Agent": "aistudio-build",
        },
      },
    });
  }

  // API Health Check
  app.get("/api/health", (_req, res) => {
    res.json({ status: "ok", aiEnabled: Boolean(process.env.GEMINI_API_KEY && process.env.GEMINI_API_KEY !== "MY_GEMINI_API_KEY") });
  });

  // CyberShield AI Lesson Tutor Endpoint
  app.post("/api/ai/explain", async (req, res) => {
    try {
      const {
        lessonTitle,
        trackTitle,
        lessonContent,
        keyTerms,
        codeExample,
        userQuestion,
        conversationHistory
      } = req.body;

      if (!userQuestion || typeof userQuestion !== "string") {
        return res.status(400).json({ error: "A pergunta ou pedido de explicação é obrigatório." });
      }

      const ai = getGeminiClient();

      if (!ai) {
        return res.status(503).json({
          error: "Chave da API Gemini não configurada no ambiente. Adicione sua GEMINI_API_KEY nas configurações para respostas ao vivo do Gemini.",
          isApiKeyMissing: true,
        });
      }

      // Build context from current active lesson
      let contextPrompt = `Você é o "CyberShield AI", o tutor inteligente e mentor sênior de cibersegurança e defesa cibernética ética da plataforma CyberShield.

Seu propósito é explicar conceitos complexos de cibersegurança de forma simples, didática, visualmente clara e prática para estudantes e entusiastas de segurança.

CONTEXTO DA LIÇÃO ATUAL QUE O ALUNO ESTÁ ESTUDANDO:
- Trilha: ${trackTitle || "Geral de Segurança"}
- Lição: ${lessonTitle || "Lição Atual"}
- Resumo do conteúdo técnico da lição:
${lessonContent ? String(lessonContent).slice(0, 3500) : "Sem conteúdo detalhado fornecido."}`;

      if (keyTerms && Array.isArray(keyTerms) && keyTerms.length > 0) {
        contextPrompt += `\n\nTermos-chave da aula:
${keyTerms.map((t: { term?: string; definition?: string }) => `- ${t.term}: ${t.definition}`).join("\n")}`;
      }

      if (codeExample && (codeExample.vulnerable || codeExample.secure)) {
        contextPrompt += `\n\nLaboratório de código da aula (${codeExample.language || "código"}):
Vulnerável:
${codeExample.vulnerable || "N/A"}

Blindado/Seguro:
${codeExample.secure || "N/A"}

Explicação do código:
${codeExample.explanation || "N/A"}`;
      }

      if (conversationHistory && Array.isArray(conversationHistory) && conversationHistory.length > 0) {
        contextPrompt += `\n\nHISTÓRICO RECENTE DA CONVERSA NESTA LIÇÃO:\n`;
        for (const msg of conversationHistory.slice(-4)) {
          contextPrompt += `${msg.role === "user" ? "Aluno" : "CyberShield AI"}: ${msg.content}\n`;
        }
      }

      contextPrompt += `\n\nNOVA DÚVIDA / PEDIDO DO ALUNO:
"${userQuestion}"

DIRETRIZES DE RESPOSTA DO CYBERSHIELD AI:
1. Responda em Português do Brasil (pt-BR).
2. Conecte sua resposta diretamente com os tópicos da lição em andamento.
3. Se o conceito for abstrato ou complexo (ex: criptografia assimétrica, buffer overflow, SQLi, CSRF, handshake TLS), inclua uma ANALOGIA DO MUNDO REAL intuitiva (cofre, correio, selo de cera, crachá, restaurante, etc.).
4. Adicione dicas práticas de DEFESA e boas práticas de hacker ético (Blue Team / Pentest com autorização).
5. Estruture a resposta com títulos concisos em Markdown, listas com bullet points e trechos de código ou comandos quando relevante.
6. Mantenha o tom encorajador, técnico porém acessível, sem jargões desnecessários sem explicação.`;

      const response = await ai.models.generateContent({
        model: "gemini-3.8-flash",
        contents: contextPrompt,
        config: {
          systemInstruction: "Você é o CyberShield AI, um mentor e especialista sênior de segurança da informação empático, preciso e didático.",
          temperature: 0.7,
        },
      });

      const explanation = response.text || "Não foi possível gerar a explicação neste momento.";

      return res.json({
        explanation,
        lessonTitle,
        model: "gemini-3.8-flash"
      });
    } catch (error: any) {
      console.error("Erro na API CyberShield AI:", error);
      return res.status(500).json({
        error: error.message || "Falha ao processar solicitação com a IA.",
      });
    }
  });

  // Vite middleware in dev or static server in prod
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (_req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
