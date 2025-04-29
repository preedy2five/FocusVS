import * as vscode from 'vscode';
import * as path from 'path';

export class AmbientSoundPanel {
    public static currentPanel: AmbientSoundPanel | undefined;
    private readonly panel: vscode.WebviewPanel;

    private constructor(panel: vscode.WebviewPanel, extensionUri: vscode.Uri) {
        this.panel = panel;
        this.initializeWebview();
    }

    public static createOrShow(extensionUri: vscode.Uri) {
        const column = vscode.window.activeTextEditor
            ? vscode.window.activeTextEditor.viewColumn
            : undefined;

        if (AmbientSoundPanel.currentPanel) {
            AmbientSoundPanel.currentPanel.panel.reveal(column);
            return;
        }

        const panel = vscode.window.createWebviewPanel(
            'ambientSound',
            'Ambient Sound',
            column || vscode.ViewColumn.One,
            {
                enableScripts: true,
                localResourceRoots: [
                    vscode.Uri.joinPath(extensionUri, 'media')
                ]
            }
        );

        AmbientSoundPanel.currentPanel = new AmbientSoundPanel(panel, extensionUri);
    }

    private initializeWebview() {
        this.panel.webview.html = this.getWebviewContent();
        this.panel.onDidDispose(() => {
            AmbientSoundPanel.currentPanel = undefined;
        });
    }

    private getWebviewContent(): string {
        const defaultSound = vscode.workspace.getConfiguration('invisibleFocus').get('ambientSound', 'forest');
        const soundPath = this.panel.webview.asWebviewUri(
            vscode.Uri.joinPath(this.panel.webview.asWebviewUri(vscode.Uri.file(path.join(__dirname, '..', 'media'))), `${defaultSound}.mp3`)
        );

        return `<!DOCTYPE html>
            <html lang="en">
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>Ambient Sound</title>
                <style>
                    body {
                        padding: 20px;
                        background-color: var(--vscode-editor-background);
                        color: var(--vscode-editor-foreground);
                    }
                    .sound-controls {
                        display: flex;
                        gap: 10px;
                        margin-top: 20px;
                    }
                    button {
                        padding: 8px 16px;
                        background-color: var(--vscode-button-background);
                        color: var(--vscode-button-foreground);
                        border: none;
                        border-radius: 2px;
                        cursor: pointer;
                    }
                    button:hover {
                        background-color: var(--vscode-button-hoverBackground);
                    }
                </style>
            </head>
            <body>
                <h2>Ambient Sound</h2>
                <div class="sound-controls">
                    <button onclick="playSound()">Play</button>
                    <button onclick="pauseSound()">Pause</button>
                </div>
                <audio id="ambientSound" loop>
                    <source src="${soundPath}" type="audio/mpeg">
                </audio>
                <script>
                    const audio = document.getElementById('ambientSound');
                    function playSound() {
                        audio.play();
                    }
                    function pauseSound() {
                        audio.pause();
                    }
                </script>
            </body>
            </html>`;
    }

    public show() {
        AmbientSoundPanel.createOrShow(this.panel.webview.asWebviewUri(vscode.Uri.file(path.join(__dirname, '..'))));
    }

    public dispose() {
        AmbientSoundPanel.currentPanel = undefined;
        this.panel.dispose();
    }
} 