import * as vscode from 'vscode';
import * as path from 'path';

export class FocusSession {
    private statusBarItem: vscode.StatusBarItem;
    private timer: NodeJS.Timeout | undefined;
    private startTime: number | undefined;
    private readonly sessionDuration: number;

    constructor(private context: vscode.ExtensionContext) {
        this.statusBarItem = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Right, 100);
        this.sessionDuration = vscode.workspace.getConfiguration('invisibleFocus').get('sessionDuration', 50) * 60 * 1000;
    }

    public start() {
        this.startTime = Date.now();
        this.updateStatusBar();
        this.playStartSound();

        this.timer = setInterval(() => {
            const elapsed = Date.now() - this.startTime!;
            if (elapsed >= this.sessionDuration) {
                this.stop();
                this.showBreakReminder();
            } else {
                this.updateStatusBar();
            }
        }, 1000);
    }

    public stop() {
        if (this.timer) {
            clearInterval(this.timer);
            this.timer = undefined;
        }
        this.statusBarItem.hide();
    }

    private updateStatusBar() {
        const elapsed = Date.now() - this.startTime!;
        const remaining = Math.max(0, this.sessionDuration - elapsed);
        const minutes = Math.floor(remaining / 60000);
        const seconds = Math.floor((remaining % 60000) / 1000);

        this.statusBarItem.text = `$(clock) Flow Mode: ${minutes}:${seconds.toString().padStart(2, '0')}`;
        this.statusBarItem.show();
    }

    private async playStartSound() {
        const audioPath = path.join(this.context.extensionPath, 'media', 'start.mp3');
        // TODO: Implement audio playback using Web Audio API
    }

    private showBreakReminder() {
        vscode.window.showInformationMessage('Focus session complete. Time for a break!', 'Start New Session')
            .then(selection => {
                if (selection === 'Start New Session') {
                    this.start();
                }
            });
    }
} 