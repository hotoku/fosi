# fosi

livereloading server for markdown editing

![usage](./samples/fosi.gif)

## usage

Run this command.

``` shellsession
$ fosi -i document.md
```

Then,

1. A process starts watching your `document.md` and automatically compiles it to html when updated.
2. The compiled html is served at http://localhost:3000/ and the file will be reloaded when it is updated.
3. The files in the folders under the one where `document.md` exists are also watched and served, your browser will reload when these files are updated.

Other command line options are following:

``` shellsession
Options:
      --help     Show help                                             [boolean]
      --version  Show version number                                   [boolean]
  -i             input file                                  [string] [required]
  -d             output file                  [string] [default: "./index.html"]
  -f             overwrite existing output                             [boolean]
```

## install

``` shellsession
$ npm i -g @hotoku/fosi
```

### for use from emacs (optional)

This repo includes very simple function that launches a fosi process from Emacs.
The source file is [here](./elisp/fosi.el).

You can install the elisp by the following steps.

1. Download the raw file from github. eg. `curl -o /tmp/fosi.el https://raw.githubusercontent.com/hotoku/fosi/main/elisp/fosi.el`
1. Install the file by invoking `M-x package-install-file` and input the path you downloaded in the previous step.
1. Put `(require 'fosi)` in your `init.el`.

## license

This software is published under MIT license.

## credit

- [markdown-github.css][markdown-github.css] is based on [github-markdown-css][github-markdown-css] by [Sindre Sorhus][sindre sorhus ], which is published under [MIT license][mit]. I have changed definitions of selectors slightily. The original one selects elements based on classes like `.markdown-body { ... }`. My version does by tags like `body { ... }`.
- [cat1.jpg][cat1.jpg] is a work of [Francesca Cesa Bianchi][Francesca Cesa Bianchi], copied from [here][cat1-orig], and published under [cc by-sa 3.0 it][cc by-sa 3.0 it].
- [cat2.jpg][cat2.jpg] is a work of [lisa zins][lisa zins], copied from the following url, and published under [cc by 2.0][cc by 2.0]: `https://commons.wikimedia.org/wiki/File:%22Smile_Noah%22_-_%22THBPBPTHPT%5E%5E%22_-))_-_Flickr_-_Lisa_Zins.jpg`

<!-- links -->
[github-markdown-css]: https://github.com/sindresorhus/github-markdown-css
[MIT]: https://opensource.org/licenses/MIT
[markdown-github.css]: ./templates/markdown-github.css
[cat1.jpg]: ./samples/cat1.jpg
[cat2.jpg]: ./samples/cat2.jpg
[cc by 2.0]: https://creativecommons.org/licenses/by/2.0/
[cc by-sa 3.0 it]: https://creativecommons.org/licenses/by-sa/3.0/it/deed.en
[Sindre Sorhus]: https://github.com/sindresorhus
[Francesca Cesa Bianchi]: https://commons.wikimedia.org/wiki/File:%22_11_-_ITALY_-_cat.JPG
[Lisa Zins]: https://www.flickr.com/people/94846844@N04
[cc by 2.0]: https://creativecommons.org/licenses/by/2.0/
[cc by-sa 3.0 it]: https://creativecommons.org/licenses/by-sa/3.0/it/deed.en
[Sindre Sorhus]: https://github.com/sindresorhus
[Francesca Cesa Bianchi]: https://commons.wikimedia.org/wiki/File:%22_11_-_ITALY_-_cat.JPG
[Lisa Zins]: https://www.flickr.com/people/94846844@N04
[cat1-orig]: https://commons.wikimedia.org/wiki/Category:Domestic_cats#/media/File:%22_11_-_ITALY_-_cat.JPG
