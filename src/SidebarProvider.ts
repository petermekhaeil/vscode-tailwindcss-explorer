import * as vscode from "vscode";
import * as path from "path";
import getPlugins from "./plugins";
import getCorePugins from "./corePlugins";
import pathExists from "./pathExists";
import { kebabToTitleCase } from "./kebabToTitleCase";
import { stringifyProperties } from "./stringifyProperties";
export class SidebarProvider implements vscode.WebviewViewProvider {
  public static readonly viewType = "TailwindCssPanel";
  private _view?: vscode.WebviewView;

  _utilities = {};

  constructor(
    private readonly _extensionUri: vscode.Uri,
    private workspaceRoot: string
  ) {
    this._build();
  }

  private _build() {
    if (!this.workspaceRoot) {
      return false;
    }

    if (
      !pathExists(path.join(this.workspaceRoot, "node_modules", "tailwindcss"))
    ) {
      return false;
    }

    const plugins = getPlugins(this.workspaceRoot);
    const corePlugins = getCorePugins(plugins, this.workspaceRoot);

    this._utilities = corePlugins;
  }

  public resolveWebviewView(
    webviewView: vscode.WebviewView,
    context: vscode.WebviewViewResolveContext,
    _token: vscode.CancellationToken
  ) {
    this._view = webviewView;

    webviewView.webview.options = {
      // Allow scripts in the webview
      enableScripts: true,

      localResourceRoots: [this._extensionUri],
    };

    webviewView.webview.html = this._getHtmlForWebview(
      webviewView.webview,
      this._utilities
    );
  }

  private _getHtmlForWebview(webview: vscode.Webview, variants) {
    // Get the local path to main script run in the webview, then convert it to a uri we can use in the webview.
    const scriptUri = webview.asWebviewUri(
      vscode.Uri.joinPath(this._extensionUri, "media", "index.js")
    );

    // Do the same for the stylesheet.
    const styleResetUri = webview.asWebviewUri(
      vscode.Uri.joinPath(this._extensionUri, "media", "reset.css")
    );
    const styleVSCodeUri = webview.asWebviewUri(
      vscode.Uri.joinPath(this._extensionUri, "media", "vscode.css")
    );
    const styleMainUri = webview.asWebviewUri(
      vscode.Uri.joinPath(this._extensionUri, "media", "index.css")
    );

    // Use a nonce to only allow a specific script to be run.
    const nonce = getNonce();

    return `<!DOCTYPE html>
		<html lang="en">
		<head>
			<meta charset="UTF-8">
			<!--
				Use a content security policy to only allow loading images from https or from our extension directory,
				and only allow scripts that have a specific nonce.
			-->
			<meta http-equiv="Content-Security-Policy" content="default-src 'none'; style-src ${
        webview.cspSource
      }; script-src 'nonce-${nonce}';">
			<meta name="viewport" content="width=device-width, initial-scale=1.0">
			<link href="${styleResetUri}" rel="stylesheet">
			<link href="${styleVSCodeUri}" rel="stylesheet">
			<link href="${styleMainUri}" rel="stylesheet">
		</head>
    <body>
      <input type="text" placeholder="Search"></input>
      <ul id="list-primary">
        ${variants
          .map((variant) => {
            return `
              <li>
                <span class="caret">${kebabToTitleCase(variant.plugin)}</span>
                <ul class="nested">
                  ${Object.keys(variant.utilities)
                    .map((utility) => {
                      const css = variant.utilities[utility];
                      const cssText = stringifyProperties(css);
                      return `
                        <li>
                          ${utility}
                          <span class="tooltiptext"><pre>${cssText}</pre></span>
                        </li>
                      `;
                    })
                    .join("")}
                </ul>
              </li>
            `;
          })
          .join("")}
      </ul>
      <script nonce="${nonce}" src="${scriptUri}"></script>
		</body>
		</html>`;
  }
}

function getNonce() {
  let text = "";
  const possible =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  for (let i = 0; i < 32; i++) {
    text += possible.charAt(Math.floor(Math.random() * possible.length));
  }
  return text;
}
