// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';

import NoteBuilder from './note-builder';

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {
	let noteBuilder = null;
	
  context.subscriptions.push(
    vscode.commands.registerCommand('crystal.sendPageToOneNote',
      () => {
        const editor = vscode.window.activeTextEditor;
        if (!editor) {
          vscode.window.showErrorMessage("You must have a document open to send to OneNote.");
          return;
        }

        noteBuilder = new NoteBuilder();
        noteBuilder.addTitle('Sent from Visual Studio Code: ' + editor.document.fileName.replace(/^.*[\\\/]/, ''));
        if (editor.document.languageId === 'markdown') {
          noteBuilder.addMarkDownContent(editor.document.getText());
        } else {
          noteBuilder.addCodeContent(editor.document.languageId, editor.document.getText());
        }
        noteBuilder.applyStyle(vscode.workspace.getConfiguration('stone.theme'));
        noteBuilder.create();

      }
    )
  );

  context.subscriptions.push(
    vscode.commands.registerCommand('crystal.sendSelectionToOneNote',
      () => {

        const editor = vscode.window.activeTextEditor;
        if (!editor) {
          vscode.window.showErrorMessage("You must have a document open to send to OneNote.");
          return;
        }

        const selection = editor.selection;
        const selectedText = editor.document.getText(selection);

        if (selectedText.length === 0) {
          vscode.window.showErrorMessage("You must have text selected to send to OneNote.");
          return;
        }

        noteBuilder = new NoteBuilder();
        noteBuilder.addTitle('Sent from Visual Studio Code: Part of ' + editor.document.fileName.replace(/^.*[\\\/]/, ''));
        if (editor.document.languageId === 'markdown') {
          noteBuilder.addMarkDownContent(selectedText);
        } else {
          noteBuilder.addCodeContent(editor.document.languageId, selectedText);
        }
        noteBuilder.applyStyle(vscode.workspace.getConfiguration('stone.theme'));
        noteBuilder.create();

      }
    )
  );
}

// this method is called when your extension is deactivated
export function deactivate() {}
