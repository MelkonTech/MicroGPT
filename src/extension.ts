import * as vscode from 'vscode';
import { analyzeCode } from './commands/analyzeCode';


export function activate(context: vscode.ExtensionContext) {
	console.log('Congratulations, your extension "coder" is now active!');


	let disposable = vscode.commands.registerCommand('coder.analyzeCode', () => analyzeCode(context));
	context.subscriptions.push(disposable);
	// Registering an event listener for the onDidSaveTextDocument event
	vscode.workspace.onDidSaveTextDocument((document) => {
		if (document.languageId === 'javascript' || document.languageId === 'python') { // Adjust according to supported languages
			vscode.commands.executeCommand('coder.analyzeCode');
		}
	});
}

export function deactivate() { }
