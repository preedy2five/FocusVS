import * as vscode from 'vscode';
import { FocusSession } from './focusSession';
import { AmbientSoundPanel } from './ambientSoundPanel';

let focusSession: FocusSession | undefined;
let ambientSoundPanel: AmbientSoundPanel | undefined;

export function activate(context: vscode.ExtensionContext) {
    // Register commands
    let startFocusSession = vscode.commands.registerCommand('invisible-focus.startFocusSession', () => {
        if (focusSession) {
            focusSession.stop();
        }
        focusSession = new FocusSession(context);
        focusSession.start();
    });

    let openAmbientSound = vscode.commands.registerCommand('invisible-focus.openAmbientSound', () => {
        AmbientSoundPanel.createOrShow(context.extensionUri);
    });

    context.subscriptions.push(startFocusSession, openAmbientSound);
}

export function deactivate() {
    if (focusSession) {
        focusSession.stop();
    }
    if (ambientSoundPanel) {
        ambientSoundPanel.dispose();
    }
} 