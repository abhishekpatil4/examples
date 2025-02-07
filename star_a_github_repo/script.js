import 'dotenv/config';
import { ChatOpenAI } from "@langchain/openai";
import { createOpenAIFunctionsAgent, AgentExecutor } from "langchain/agents";
import { LangchainToolSet } from "composio-core";
import { pull } from "langchain/hub";
import { getGithubRepoPrompt } from "./inquirerPrompts.js";
import { setupUserConnectionIfNotExists } from "./newConnection.js";

console.log(`
  -------------------------------
  Agent: Star a repo
  Tools used: GitHub
  Description: Stars the specified GitHub repository
  -------------------------------
`);

const llm = new ChatOpenAI({ apiKey: process.env.OPENAI_API_KEY });
const toolset = new LangchainToolSet({ apiKey: process.env.COMPOSIO_API_KEY });

async function run() {
  const { repoName } = await getGithubRepoPrompt();
  await setupUserConnectionIfNotExists("default", "github", toolset);

  const tools = await toolset.getTools({
    actions: ["GITHUB_STAR_A_REPOSITORY_FOR_THE_AUTHENTICATED_USER"],
  });
  const prompt = await pull("hwchase17/openai-functions-agent");

  const agent = await createOpenAIFunctionsAgent({
    llm,
    tools: tools,
    prompt,
  });

  const agentExecutor = new AgentExecutor({ agent, tools, verbose: false });

  const response = await agentExecutor.invoke({
    input: `Star a repo specified by the user on GitHub. User prompt: ${repoName}`,
  });

  console.log("Agent Response:", response.output, "\n");
}

run().catch(console.error);
