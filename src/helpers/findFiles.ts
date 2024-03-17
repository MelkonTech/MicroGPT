
import * as vscode from 'vscode';

export const findFiles = async () => {
    const workspace = vscode.workspace.workspaceFolders;
    if (!workspace?.length) {
        vscode.window.showInformationMessage('No active editor');
        return [];
    }

    let workspaceFolder = workspace[0];
    let files = await vscode.workspace.findFiles(new vscode.RelativePattern(workspaceFolder, '**/*.{js,py}'), '**/node_modules/**', 100);

    let projectFilesContent = await Promise.all(files.map(async file => {
        let document = await vscode.workspace.openTextDocument(file);
        return document.uri + " file content " + document.getText();
    }));
    return projectFilesContent;
};
