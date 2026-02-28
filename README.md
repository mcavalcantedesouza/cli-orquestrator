# 🚀 MCP Orquestrador CLI (WSL)

Este repositório contém um servidor **Model Context Protocol (MCP)** construído em TypeScript. Ele atua como uma ponte, permitindo que assistentes de Inteligência Artificial (como o Cline) executem comandos de terminal nativamente dentro do ambiente Linux (WSL).

Com este servidor rodando, a IA ganha a capacidade de ler arquivos, gerenciar pastas, monitorar recursos do sistema e orquestrar ferramentas de linha de comando de forma autônoma.

## 📋 Pré-requisitos

Para rodar este projeto, seu ambiente precisa de:

* **Node.js:** Versão **24** ou superior (necessário para a execução nativa de arquivos `.ts` sem etapa de compilação).
* **Ambiente:** Linux ou WSL (Ubuntu recomendado).
* **Cliente MCP:** Extensão [Cline](https://marketplace.visualstudio.com/items?itemName=saoudrizwan.claude-dev) (ou Roo Code) instalada no VS Code.

## 🛠️ Instalação

Como os arquivos de configuração (`package.json` e `tsconfig.json`) já estão no repositório, basta instalar as dependências.

No terminal do seu WSL, dentro da pasta raiz do projeto, execute:

```bash
npm install
```

## 🧠 Configurando a Inteligência Artificial (Google Gemini)

O Cline é apenas a interface; ele precisa de um provedor de IA para processar os raciocínios. Neste projeto, utilizamos a API gratuita do Google Gemini.

1. Acesse o painel do [Google AI Studio](https://aistudio.google.com/).
2. Faça login com a sua conta Google e clique no menu lateral **Get API key** para gerar a sua chave de acesso gratuita.
3. No VS Code, abra a aba da extensão **Cline**.
4. Clique no ícone de engrenagem (Settings) no topo da extensão para abrir a tela de configuração.
5. Na seção **API Configuration**, preencha da seguinte forma:
   * **API Provider:** Selecione `Google Gemini`.
   * **Gemini API Key:** Cole a chave gerada no passo 2.
   * **Model:** Selecione `gemini-2.5-flash` (ideal para tarefas rápidas de terminal) ou `gemini-2.5-pro` (para análises profundas de código e planejamento).


6. Clique no botão **Done** para concluir.

## 🔌 Como Conectar o Servidor MCP ao Cline

Este projeto foi desenhado para rodar o arquivo TypeScript diretamente, aproveitando os recursos do Node 24. Para plugar este servidor na sua IA:

1. Abra o VS Code e vá até a aba da extensão **Cline**.
2. Clique no ícone de Servidores MCP (ícone de tomada/servidor).
3. Abra as configurações do MCP (isso editará o arquivo `cline_mcp_settings.json`).
4. Adicione a configuração abaixo, substituindo o caminho pelo local exato do repositório no seu WSL:

```json
{
  "mcpServers": {
    "orquestrador_wsl": {
      "command": "node",
      "args": [
        "/caminho/absoluto/para/este/repositorio/index.ts"
      ]
    }
  }
}
```

5. Salve o arquivo. O servidor conectará automaticamente e a ferramenta `executar_comando` ficará disponível para a IA.

## 🎯 Exemplos de Uso

No chat do seu assistente de IA, você pode enviar prompts como:

* *"Crie uma pasta chamada 'testes', adicione um arquivo de log vazio lá dentro e liste o conteúdo para confirmar."*
* *"Use o `df -h` e me diga como está o espaço do meu disco."*
* *"Leia as últimas 20 linhas do arquivo de log em `/var/log/syslog` e procure por erros."*

## ⚠️ Segurança e Boas Práticas

**Atenção:** Este servidor executa comandos de shell (via `child_process`).

* Certifique-se de manter a opção de **Aprovação Manual (Approve)** sempre ativada no seu cliente MCP.
* Leia os comandos gerados pela IA antes de autorizar a execução, especialmente para comandos que envolvem remoção de arquivos (`rm`) ou alterações de permissão.
