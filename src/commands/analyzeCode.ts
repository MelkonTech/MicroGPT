import * as vscode from 'vscode';
import { generateChatGPTInput } from '../helpers/generateChatGPTInput';
import { generateResponse } from '../api/chatgpt';


export const analyzeCode = async (context: vscode.ExtensionContext) => {
    const editor = vscode.window.activeTextEditor;
    if (!editor) {
        vscode.window.showInformationMessage('No active editor');
        return;
    }

    vscode.window.withProgress({
        location: vscode.ProgressLocation.Notification,
        title: "MicroGPT: Analyzing code...",
        cancellable: false
    }, async () => {

        const content = await generateChatGPTInput();

        await generateResponse(content.join(' '), context);
    });
};