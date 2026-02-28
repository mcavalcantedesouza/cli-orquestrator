import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { CallToolRequestSchema, ListToolsRequestSchema } from "@modelcontextprotocol/sdk/types.js";
import { exec } from "child_process";
import { promisify } from "util";

// Transforma o exec tradicional em uma Promessa para usarmos com async/await
const execPromise = promisify(exec);

// 1. Instancia o servidor MCP
const server = new Server(
  { name: "cli-orquestrator-wsl", version: "1.0.0" },
  { capabilities: { tools: {} } }
);

// 2. Define a ferramenta para a IA
server.setRequestHandler(ListToolsRequestSchema, async () => {
  return {
    tools: [
      {
        name: "executar_comando",
        description: "Executa um comando de terminal (bash/zsh) no sistema Ubuntu/WSL e retorna a saída (stdout/stderr).",
        inputSchema: {
          type: "object",
          properties: {
            comando: { type: "string", description: "O comando exato a ser executado." }
          },
          required: ["comando"]
        }
      }
    ]
  };
});

// 3. Executa a ferramenta
server.setRequestHandler(CallToolRequestSchema, async (request) => {
  if (request.params.name === "executar_comando") {
    const args = request.params.arguments as { comando: string };

    try {
      // Executa o comando no shell do WSL
      const { stdout, stderr } = await execPromise(args.comando);
      
      // Junta o resultado (seja saída padrão ou avisos)
      const resultado = stdout || stderr || "Comando executado com sucesso, mas sem retorno de texto.";
      
      return {
        content: [{ type: "text", text: resultado }]
      };
    } catch (error: any) {
      // Se o comando falhar (ex: comando não encontrado ou erro de sintaxe)
      return {
        isError: true,
        content: [{ type: "text", text: `Erro na execução:\n${error.message}` }]
      };
    }
  }
  
  throw new Error("Ferramenta desconhecida");
});

// 4. Inicia a comunicação
async function start() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error("🚀 Orquestrador CLI MCP ativado e aguardando comandos no WSL!");
}

start();