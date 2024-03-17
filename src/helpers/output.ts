import * as vscode from "vscode";


/**
 * Generates HTML for the feedback webview.
 * @param feedback The feedback to include in the HTML.
 * @returns The generated HTML string.
 */
function generateFeedbackHtml(feedback: string): string {
    return `<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>Feedback</title>
</head>
<body>
    <p>${feedback}</p>
</body>
</html>`;
}



let webviewPanel: vscode.WebviewPanel | null = null;
/**
 * Shows or updates the feedback panel with new content.
 * @param feedback The feedback content to display in the webview.
 * @param context The extension context for managing subscriptions.
 */
function showOrUpdateFeedbackPanel(feedback: string): void {
    if (webviewPanel) {
        // Panel already exists, update its content
        // webviewPanel.webview.html = generateFeedbackHtml(feedback);
        webviewPanel.reveal(); // Bring the webview to the foreground
    } else {
        // Create and show a new webview
        webviewPanel = vscode.window.createWebviewPanel(
            'feedback', // Identifies the type of the webview. Used internally
            'Feedback', // Title of the panel displayed to the user
            vscode.ViewColumn.Two, // Editor column to show the new webview panel in.
            {} // Webview options.
        );

        webviewPanel.webview.html = generateFeedbackHtml(feedback);

        // Reset when the current panel is closed
        // webviewPanel.onDidDispose(() => {
        //     webviewPanel = null;
        // }, null, context.subscriptions);
    }
}



export const outputContent = async (output: string, fullContent: string, outputChannel: vscode.OutputChannel) => {
    outputChannel.show(true); // Brings the Output Channel into view
    outputChannel.append(output);

    // TEMPORARY DISABLED
    // showOrUpdateFeedbackPanel(fullContent);
};