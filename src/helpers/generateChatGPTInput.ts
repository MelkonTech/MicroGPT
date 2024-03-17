import * as vscode from 'vscode';

export const generateChatGPTInput = async () => {
    const workspace = vscode.workspace.workspaceFolders;
    if (!workspace?.length) {
        vscode.window.showInformationMessage('No active directory open.');
        return [];
    }

    let workspaceFolder = workspace[0];
    // Pattern to exclude common directories not typically included in version control

    const config = vscode.workspace.getConfiguration('MicroGPT');
    const allowedFileExtensions = config.get<string[]>('allowedFileExtensions');
    const excludePatterns = config.get<string[]>('excludePatterns') || [];
    const excludePatternsGroup = `{${excludePatterns.map(pattern => `**/${pattern}/**`).join(',')}}`;
    const files = await vscode.workspace.findFiles(new vscode.RelativePattern(workspaceFolder, `**/*.{${allowedFileExtensions?.join(',')}}`), excludePatternsGroup, 1000);
    let input: string[] = ['Here is the project:'];
    if (files.length > 20) {
        // When more than 20 files are found, return just their paths
        input = input.concat(files.map(file => file.toString()));
    } else {
        // If 20 or fewer files are found, return their paths and contents
        let projectFilesContent = await Promise.all(files.map(async file => {
            let document = await vscode.workspace.openTextDocument(file);
            const documentContent = document.getText();
            return document.uri.toString()
                + " file content: "
                + (documentContent.length > 500 ? documentContent.toString().slice(0, 500) + '...' : documentContent);
        }));
        input = input.concat(projectFilesContent);
    }

    vscode.window.activeTextEditor?.document.uri && input.push(
        'The current active file is'
        + vscode.window.activeTextEditor?.document.uri.toString()
        + " file content: " + vscode.window.activeTextEditor?.document.getText()
    );

    const chatGPTPrompt = config.get<string>('chatGPTPrompt');
    chatGPTPrompt && input.push(chatGPTPrompt);

    return input;
};
