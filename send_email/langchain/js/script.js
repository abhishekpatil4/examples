import 'dotenv/config';
import { ChatOpenAI } from "@langchain/openai";
import { createOpenAIFunctionsAgent, AgentExecutor } from "langchain/agents";
import { LangchainToolSet } from "composio-core";
import { pull } from "langchain/hub";
import { setupUserConnectionIfNotExists } from "./newConnection.js";
import { getEmailPrompts } from './inquirerPrompts.js';

console.log(`
  -------------------------------
  Agent: Send an email
  Tools used: Gmail
  Description: Sends an email via Gmail
  -------------------------------
`);

const llm = new ChatOpenAI({ apiKey: process.env.OPENAI_API_KEY });
const toolset = new LangchainToolSet({ apiKey: process.env.COMPOSIO_API_KEY });

async function run() {
  await setupUserConnectionIfNotExists("default", "gmail", toolset);
  const { emailContent, recipientEmail } = await getEmailPrompts();


  const tools = await toolset.getTools({ actions: ["GMAIL_SEND_EMAIL"] });
  const prompt = await pull("hwchase17/openai-functions-agent");

  const agent = await createOpenAIFunctionsAgent({
    llm,
    tools: tools,
    prompt,
  });

  const agentExecutor = new AgentExecutor({ agent, tools, verbose: false });

  const response = await agentExecutor.invoke({
    input: `Please send an email using Gmail with the following details:

        Recipient Email: ${recipientEmail}
        Email Content: ${emailContent}

        Please compose a relevant subject line based on the content and send the email.`,
  });

  console.log("\nAgent Response:", response.output, "\n");
}

run().catch(console.error);
