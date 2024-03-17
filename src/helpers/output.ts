import * as vscode from "vscode";


function markdownToHtmlWithDynamicCode(input: string): string {
    const escapedHtml = input
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");

    // Enhanced to dynamically detect the language
    const htmlWithCode = escapedHtml
        .replace(/```(\w+)([\s\S]*?)```/g, (match, lang, code) => {
            return `<pre><code class="language-${lang}">${code.trim()}</code></pre>`;
        });

    return htmlWithCode;
}


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
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.9.0/styles/default.min.css">
    <script src="https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.9.0/highlight.min.js"></script>
    
    <!-- and it's easy to individually load additional languages -->
    <script src="https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.9.0/languages/go.min.js"></script>
    
</head>
<body>
${markdownToHtmlWithDynamicCode(feedback).replace(/\n/g, '<br>')}
<script>hljs.highlightAll();</script>
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
    try {
        if (webviewPanel) {
            // Panel already exists, update its content
            webviewPanel.webview.html = generateFeedbackHtml(feedback);
            webviewPanel.reveal(); // Bring the webview to the foreground
        } else {
            // Create and show a new webview
            webviewPanel = vscode.window.createWebviewPanel(
                'feedback', // Identifies the type of the webview. Used internally
                'MicroGPT: Feedback', // Title of the panel displayed to the user
                vscode.ViewColumn.Two, // Editor column to show the new webview panel in.
                {} // Webview options.
            );
            webviewPanel.webview.html = generateFeedbackHtml(feedback);

            // Reset when the current panel is closed
            // webviewPanel.onDidDispose(() => {
            //     webviewPanel = null;
            // }, null, context.subscriptions);
        }
    } catch (error) {
        // Create and show a new webview
        webviewPanel = vscode.window.createWebviewPanel(
            'feedback', // Identifies the type of the webview. Used internally
            'Feedback', // Title of the panel displayed to the user
            vscode.ViewColumn.Two, // Editor column to show the new webview panel in.
            {} // Webview options.
        );
        webviewPanel.webview.html = generateFeedbackHtml(feedback);

    }
}


export const outputContent = async (output: string, fullContent: string) => {
    // TEMPORARY DISABLED
    // outputChannel.show(true); // Brings the Output Channel into view
    // outputChannel.append(output);

    console.log(fullContent)

    showOrUpdateFeedbackPanel(fullContent);
};