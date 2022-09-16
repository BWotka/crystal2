# crystal README

Crystal is an updatet fork to the VSC Extension Project STONE by Won Song which aims to make workflows using VSC and Microsoft OneNote easier.
It was created by copying the code from Project STONE into the new default files and updating all the used libs.

## Features

Send whole documents or just your selection to OneNote in your browser via crystal.sendPageToOneNote / crystal.sendSelectionToOneNote .

This can then be copied via the clipboard or opened in the desktop app for further editing/ use.


![Example: ](https://github.com/BWotka/crystal2/blob/main/images/Example.png?raw=true)

Note: Formatting depends on the highlight.js formatting for the language hence function calls might not be highlighted.

## Requirements

When first sending something to OneNote you will have to sign in to OneNote and allow the access for the plugin.

## Extension Settings

It's not yet possible to get the colors actually used.
See https://github.com/microsoft/vscode/issues/32813

This is why the colors are set in the package.json and available via e.g. crystal.string for the color of strings.

Fontsize and Style are pulled from the vscode settings.

## Known Issues

No extensive testing was conducted yet.

### 0.0.1
Copy Project STONE sourcecode into new scaffolding
### 0.0.2
Updated Project STONE to TypeScript 16, using new lib versions.


## For more information

* [The original repo](https://github.com/WonSong/STONE)


**Enjoy!**
