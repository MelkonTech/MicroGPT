import * as vscode from 'vscode';
import { findFiles } from '../helpers/findFiles';
import { generateResponse } from '../api/chatgpt';


export const analyzeCode = async (context: vscode.ExtensionContext) => {
    const editor = vscode.window.activeTextEditor;
    if (!editor) {
        vscode.window.showInformationMessage('No active editor');
        return;
    }

    vscode.window.withProgress({
        location: vscode.ProgressLocation.Notification,
        title: "Coder: Analyzing code...",
        cancellable: false
    }, async () => {

        const content = await findFiles();

        await generateResponse(content.join(' '), context);
    });
};