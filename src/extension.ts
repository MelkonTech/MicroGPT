import * as vscode from 'vscode';
import { analyzeCode } from './commands/analyzeCode';


export function activate(context: vscode.ExtensionContext) {
	console.log('Congratulations, your extension "MicroGPT" is now active!');


	let disposable = vscode.commands.registerCommand('MicroGPT.analyzeCode', () => analyzeCode(context));
	context.subscriptions.push(disposable);
	// Registering an event listener for the onDidSaveTextDocument event
	const config = vscode.workspace.getConfiguration('MicroGPT');
	const allowedLanguages = config.get<string[]>('allowedLanguages') || [];

	vscode.workspace.onDidSaveTextDocument((document) => {
		if (allowedLanguages.includes(document.languageId)) {
			vscode.commands.executeCommand('MicroGPT.analyzeCode');
		}
	});
}

export function deactivate() { }
