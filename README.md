# HTML5 Template Page Generator

**v0.3.0**   -   **Check the live version [here](https://chalarangelo.github.io/htmltemplategenerator/).**

![HTML5 Template Generator](https://raw.githubusercontent.com/Chalarangelo/htmltemplategenerator/master/gif1.gif "Empty HTML5 template page code generation")

## Generate a new HTML5 template page to use in your project in just a few seconds.

I found the lack of proper HTML5 templates disturbing, thus I set up this simple generator to save myself (and hopefully others) some time when starting a new project or page or even when testing some styles or scripts. The list of features is not very long yet, but it will expand eventually to include some more useful things (i.e. jQuery inclusion and sample code generation).

## Features

**HTML5 compliance!** The HTML5 Template Generator will only generate HTML5 template pages, based on the latest standards and best practices. However, this means that the templates might not be backwards compatible with older browsers and/or systems, but that's the only caveat for now!

**Popular libraries support:**
+ AngularJS (1.5.7)
+ Bootstrap (3.3.6)
+ Dojo (1.10.4)
+ FontAwesome (4.6.3)
+ jQuery (2.2.4 & 3.0.0)
+ MooTools (1.6.0)
+ Prototype (1.7.3.0)
+ three.js (r76)

**Pre-built templates for testing and quick deployment, fully customizable templates to suit your needs.**

![Custom page generator](https://raw.githubusercontent.com/Chalarangelo/htmltemplategenerator/master/gif3.gif "Custom HTML5 template page code generation")

With this HTML5 Template Generator you can quickly and easily create a custom page to fully suit your needs or a basic template to start from. Some pre-built templates will be available soon, such as common forms, some common page layouts etc. The less HTML you get to write, the better this generator works.

**Export to JSFiddle** (and soon Codepen) or **copy to clipboard**. 

![Export to JSFiddle, Copy to clipboard](https://raw.githubusercontent.com/Chalarangelo/htmltemplategenerator/master/gif2.gif "Export to JSFiddle, Copy to clipboard")

The aim of the HTML5 Template Generator is to simplify things, help you write less boilerplate code and speed up your development workflow. Bearing that in mind, the ability to automatically copy the generated pages to clipboard or export them to a site like JSFiddle or Codepen helps speed up the process of creating, testing and debugging your projects.

## Use

Go to the live version, follow the instructions, get your template, use it in all your projects.

## Suggestions and Contributing

If you find any problems with the HTML5 Template Generator itself or have any useful suggestions, please use the [Issues section](https://github.com/Chalarangelo/htmltemplategenerator/issues). Libraries and templates will be added over time as the project is constantly in development. Try to specify as many details as you can about the features that you would like to see implemented!

If you want to **contribute your own pre-built templates**:

1. Fork into your account.
2. Branch into a template branch `template/your_template`.
3. Add a file named `your_template.txt` with a statement `var templateText = '...'` including the whole sample page's text, formatted similarly to the templates that are already included in the generator.
4. Push to your fork and submit an issue to this repository with the label `template submission` under the `template submissions` milestone, including a short description of your template and a link to the `your_template.txt` file.

Template submissions will be reviewed as soon as possible and included in the next stable release. 

If you want to update your template submission, submit a new issue to this repository with the label `enhancement`, including a link to the `your_template.txt` file in its latest version and a short changelog since the last version.

## License

The project is licensed under the MIT License.
