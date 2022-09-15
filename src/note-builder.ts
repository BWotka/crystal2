import * as opn from 'open';
import * as express from 'express';
import * as path from 'path';
import * as fs from 'fs';
import * as MarkdownIt from 'markdown-it';
import hljs from 'highlight.js';
import { toQueryString } from './util';
import { WorkspaceConfiguration } from 'vscode';

export default class NoteBuilder {

  clientId: string;
  redirectUrl: string;
  oAuthAuthroizeUrl: string;
  note: string;
  _title!: string;
  _content!: Array<string>;
  mdEngine: any;

  constructor() {

    this.oAuthAuthroizeUrl = 'https://login.live.com/oauth20_authorize.srf';
    this.clientId = 'ad4f3512-b60e-47f8-96d8-5d52faeebd35';
    this.redirectUrl = 'http://localhost:1337';
    this.mdEngine = new MarkdownIt({
      highlight: function (str: any, lang: any) {
        if (lang && hljs.getLanguage(lang)) {
          try {
            return hljs.highlight(lang, str).value;
          } catch (__) { }
        }
        return '';
      }
    });
    this.note = [
      "<!DOCTYPE html>",
      "<html>",
      "<head>",
      "<title>{title}</title>",
      "<meta name=\"created\" content=\"" + new Date().toISOString() + "\">",
      "</head>",
      "<body>{content}</body>",
      "</html>"
    ].join('');

  }

  addTitle(title: string) {
    this.note = this.note.replace('{title}', title);
  }

  addMarkDownContent(content: string) {
    this.note = this.note.replace('{content}', this.mdEngine.render(content));
  }

  addCodeContent(language: string, codeContent: string) {
    let tokenized = hljs.highlight(codeContent, {language}).value;
    
    this.note = this.note.replace('{content}', '<pre>' + tokenized + '</pre>');
  }

  findBestMatch(workspaceConfig: WorkspaceConfiguration, language: string, requestedVal: string, defaultValue: string):string{
    return workspaceConfig.get(language+'.'+requestedVal)|| workspaceConfig.get(requestedVal) || defaultValue;
  }

  applyStyle(workspaceConfig: WorkspaceConfiguration, language: string, crystalConfig: WorkspaceConfiguration) {
    let fontFamilyList= this.findBestMatch(workspaceConfig, language, 'editor.fontFamily', 'Consolas');
    let fontFamily = fontFamilyList.split(',')[0];
    let fontSize = this.findBestMatch(workspaceConfig,language,'editor.fontSize','14');
    let defaultColor = crystalConfig.default;
    
    this.note =
      this.note
        .replace(/class="hljs-meta"/g, `style="font-family: ${fontFamily}; font-size: ${fontSize}px; color: ${crystalConfig.meta || defaultColor};"`)
        .replace(/class="hljs-comment"/g, `style="font-family: ${fontFamily}; font-size: ${fontSize}px; color: ${crystalConfig.comment || defaultColor};"`)
        .replace(/class="hljs-string"/g, `style="font-family: ${fontFamily}; font-size: ${fontSize}px; color: ${crystalConfig.string || defaultColor};"`)
        .replace(/class="hljs-variable"/g, `style="font-family: ${fontFamily}; font-size: ${fontSize}px; color: ${crystalConfig.variable || defaultColor};"`)
        .replace(/class="hljs-template-variable"/g, `style="font-family: ${fontFamily}; font-size: ${fontSize}px; color: ${crystalConfig.templateVariable || defaultColor};"`)
        .replace(/class="hljs-strong"/g, `style="font-family: ${fontFamily}; font-size: ${fontSize}px; : ${crystalConfig.strong || defaultColor};`)
        .replace(/class="hljs-emphasis"/g, `style="font-family: ${fontFamily}; font-size: ${fontSize}px; color: ${crystalConfig.emphasis || defaultColor};`)
        .replace(/class="hljs-quote"/g, `style="font-family: ${fontFamily}; font-size: ${fontSize}px; color: ${crystalConfig.quote || defaultColor};"`)
        .replace(/class="hljs-keyword"/g, `style="font-family: ${fontFamily}; font-size: ${fontSize}px; color: ${crystalConfig.keyword || defaultColor};"`)
        .replace(/class="hljs-selector-tag"/g, `style="font-family: ${fontFamily}; font-size: ${fontSize}px; color: ${crystalConfig.selectorTag || defaultColor};"`)
        .replace(/class="hljs-type"/g, `style="font-family: ${fontFamily}; font-size: ${fontSize}px; color: ${crystalConfig.type || defaultColor};"`)
        .replace(/class="hljs-literal"/g, `style="font-family: ${fontFamily}; font-size: ${fontSize}px; color: ${crystalConfig.literal || defaultColor};"`)
        .replace(/class="hljs-symbol"/g, `style="font-family: ${fontFamily}; font-size: ${fontSize}px; color: ${crystalConfig.symbol || defaultColor};"`)
        .replace(/class="hljs-bullet"/g, `style="font-family: ${fontFamily}; font-size: ${fontSize}px; color: ${crystalConfig.bullet || defaultColor};"`)
        .replace(/class="hljs-attribute"/g, `style="font-family: ${fontFamily}; font-size: ${fontSize}px; color: ${crystalConfig.attribute || defaultColor};"`)
        .replace(/class="hljs-section"/g, `style="font-family: ${fontFamily}; font-size: ${fontSize}px; color: ${crystalConfig.section || defaultColor};"`)
        .replace(/class="hljs-name"/g, `style="font-family: ${fontFamily}; font-size: ${fontSize}px; color: ${crystalConfig.name || defaultColor};"`)
        .replace(/class="hljs-tag"/g, `style="font-family: ${fontFamily}; font-size: ${fontSize}px; color: ${crystalConfig.tag || defaultColor};"`)
        .replace(/class="hljs-title"/g, `style="font-family: ${fontFamily}; font-size: ${fontSize}px; color: ${crystalConfig.title || defaultColor};"`)
        .replace(/class="hljs-attr"/g, `style="font-family: ${fontFamily}; font-size: ${fontSize}px; color: ${crystalConfig.attr || defaultColor};"`)
        .replace(/class="hljs-selector-id"/g, `style="font-family: ${fontFamily}; font-size: ${fontSize}px; color: ${crystalConfig.selectorId || defaultColor};"`)
        .replace(/class="hljs-selector-class"/g, `style="font-family: ${fontFamily}; font-size: ${fontSize}px; color: ${crystalConfig.selectorClass || defaultColor};"`)
        .replace(/class="hljs-selector-attr"/g, `style="font-family: ${fontFamily}; font-size: ${fontSize}px; color: ${crystalConfig.selectorAttr || defaultColor};"`)
        .replace(/class="hljs-selector-pseudo"/g, `style="font-family: ${fontFamily}; font-size: ${fontSize}px; color: ${crystalConfig.selectorPseudo || defaultColor};"`)
        .replace(/class="hljs-.*?"/g, `style="font-family: ${fontFamily}; font-size: ${fontSize}px; color: ${defaultColor};"`)
        .replace("<pre>", `<pre> <span style="font-family: ${fontFamily}; font-size: ${fontSize}px; color: ${defaultColor};">`)
        .replace("</pre>", "</span></pre>");
      }

  create() {

    const note = this.note;
    const app = express();
    app.get('/', function (req: any, res: { send: (arg0: string) => void; }) {
      const styles = fs.readFileSync(path.join(__dirname, 'client.css'));
      const scripts = fs.readFileSync(path.join(__dirname, 'client.js'));
      const html = [
        '<html>',
        '  <head>',
        `    <style>${styles}</style>`,
        '  </head>',
        '  <body>',
        '    <div class="header">',
        '      <div class="brand">Project Crystal</div>',
        '      <ul class="menus">',
        '        <li><a id="app-link">Open in App</a></li>',
        '      </ul>',
        '    </div>',
        '    <div id="preview"></div>',
        `    <input type="hidden" id="payload" value="${encodeURIComponent(note)}" />`,
        `    <script>${scripts}</script>`,
        '  </body>',
        '</html>'
      ];
      res.send(html.join(''));
      server.close();
    });
    const server = app.listen(1337,  () => {
      var scopes = ['wl.signin', 'office.onenote_create'];
      var query = toQueryString({
        //Microsoft requires these names
        // eslint-disable-next-line @typescript-eslint/naming-convention
        'client_id': this.clientId,
        'scope': scopes.join(' '),
        // eslint-disable-next-line @typescript-eslint/naming-convention
        'redirect_uri': this.redirectUrl,
        // eslint-disable-next-line @typescript-eslint/naming-convention
        'response_type': 'token'
      });
      opn(this.oAuthAuthroizeUrl + "?" + query);
    });
    NoteBuilder.bind(server);
  }

}