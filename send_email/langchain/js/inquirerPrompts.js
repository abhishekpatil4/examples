import inquirer from "inquirer";

export async function getEmailPrompts() {
    const { user_prompt_email_content, user_prompt_recipient_email } =
        await inquirer.prompt([
            {
                type: "input",
                name: "user_prompt_email_content",
                message: "What would you like to write in the email?",
            },
            {
                type: "input",
                name: "user_prompt_recipient_email",
                message: "Who would you like to send the email to?",
            },
        ]);

    return {
        emailContent: user_prompt_email_content,
        recipientEmail: user_prompt_recipient_email
    };
}