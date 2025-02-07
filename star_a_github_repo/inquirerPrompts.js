import inquirer from "inquirer";

export async function getGithubRepoPrompt() {
  const { user_prompt } = await inquirer.prompt([
    {
      type: "input",
      name: "user_prompt",
      message: "Which repo do you want to star?",
      default: "composiohq/composio",
    },
  ]);

  return {
    repoName: user_prompt
  };
}