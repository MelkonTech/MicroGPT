import * as vscode from 'vscode';
import { ROLE_PROMT } from "../helpers/promts";
import OpenAI from 'openai';
import { outputContent } from '../helpers/output';



enum MODEL_VERSIONS {
    GPT_3_5_TURBO = "gpt-3.5-turbo",
    DAVINCI_003 = "text-davinci-003"
}


export const generateResponse = async (promt: string, context: vscode.ExtensionContext) => {
    const config = vscode.workspace.getConfiguration('coder');
    const apiKey = config.get<string>('chatGPTApiKey');

    if (!apiKey) {
        vscode.window.showWarningMessage('ChatGPT API Key for Coder is not set.', 'Set API Key')
            .then(selection => {
                // When the user clicks the "Set API Key" button, selection will be "Set API Key"
                if (selection === 'Set API Key') {
                    // Trigger the command to open settings to the specific API key configuration
                    vscode.commands.executeCommand('workbench.action.openSettings', 'Coder Configuration');
                }
            });
        return;
    }

    try {
        const openai = new OpenAI({
            apiKey: apiKey
        });

        const stream = await openai.chat.completions.create({
            model: MODEL_VERSIONS.GPT_3_5_TURBO,
            messages: [{ role: 'user', content: promt + "assist me" }, { role: 'assistant', content: ROLE_PROMT }],
            stream: true,
        });
        let content = "";
        const outputChannel = vscode.window.createOutputChannel("Coder Audit");

        for await (const chunk of stream) {
            content += chunk.choices[0]?.delta?.content || '';
            outputContent(chunk.choices[0]?.delta?.content || '', content, outputChannel);
        }


    } catch (error: any) {
        console.error('Error making API request:', error);
        throw new Error('Failed to communicate with the ChatGPT API.');
    }
};