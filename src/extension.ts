import * as vscode from 'vscode';
import { analyzeCode } from './commands/analyzeCode';


export function activate(context: vscode.ExtensionContext) {
	console.log('Congratulations, your extension "coder" is now active!');


	let disposable = vscode.commands.registerCommand('coder.analyzeCode', () => analyzeCode(context));
	context.subscriptions.push(disposable);
	// Registering an event listener for the onDidSaveTextDocument event
	const config = vscode.workspace.getConfiguration('coder');
	const allowedLanguages = config.get<string[]>('allowedLanguages') || [];

	vscode.workspace.onDidSaveTextDocument((document) => {
		if (allowedLanguages.includes(document.languageId)) {
			vscode.commands.executeCommand('coder.analyzeCode');
		}
	});
}

export function deactivate() { }
