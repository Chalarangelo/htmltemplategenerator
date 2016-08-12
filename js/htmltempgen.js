$(function(){
	var debug = true;	// Debub flag
	// Version name and setup, always use this and update accordingly
	var versionName = 'v1.0.0_pre12 (cuttlefish_production'+((debug)?'::debug_true':'')+')';
	// Prototype for the templates
	var templateProto = function(){
		this.comments = false;
		this.doctype = '<!DOCTYPE html>';
		this.html = {	start:'<html>', end:'</html>', 
			head: {	start:'  <head>', end:'  </head>' }, 
			body: {	start:'  <body>', end:'  </body>'}
		};
		this.head = {	title: '',
			meta: {	charset: 0, author: '', description: '', keywords: '', gentag: true, viewport: true, favicon: false, oldwarn: false}, 
			lib: ['jQuery-3-1-0'], scripts: '', styles: ''
		};
		this.body = {	classes: '', before: true, userBody: '', templateBase: 'page-template',templateId: 'page-template-min'	};
		this.toText = function(){
			var textRes = this.doctype + '\n' + this.html.start +'\n' + this.headToText() + this.bodyToText() + this.html.end;
			return textRes;
		};
		this.headToText = function(){
			var headText = this.html.head.start +'\n';
			headText += (($.trim(this.head.title).length === 0)?'    <title>HTML5 sample page</title>\n':'    <title>'+$.trim(this.head.title)+'</title>\n');
			headText += this.metaToText() + this.librariesToText() + this.resourcesToText();
			headText += this.html.head.end +'\n';
			return headText;
		}
		this.metaToText = function(){
			var metaText = (this.comments?'    <!-- Start of metadata -->\n':'');
			metaText += ((this.head.meta.charset == 0)?'    <meta charset="utf-8">':'    <meta charset="iso-8859-1">')+'\n';
			metaText += ((this.head.meta.viewport)?'    <meta name="viewport" content="width=device-width, initial-scale=1">\n':'');
			metaText += (($.trim(this.head.meta.description).length === 0)?'':'    <meta name="description" content="'+$.trim(this.head.meta.description)+'">\n');
			metaText += (($.trim(this.head.meta.keywords).length === 0)?'':'    <meta name="keywords" content="'+$.trim(this.head.meta.keywords)+'">\n');
			metaText += (($.trim(this.head.meta.author).length === 0)?'':'    <meta name="author" content="'+$.trim(this.head.meta.author)+'">\n');
			metaText += ((this.head.meta.gentag)?'    <meta name="generator" content="http://chalarangelo.github.io/htmltemplategenerator/">\n':'');
			metaText += ((this.head.meta.favicon)?'    <link rel="icon" type="image/x-icon" href="./favicon.ico">\n':'');
			metaText += ((this.head.meta.oldwarn)?'    <!--[if lt IE 8]>\n      <p class="browsehappy">You are using an <strong>outdated</strong> browser. Please <a href="http://browsehappy.com/">upgrade your browser</a> to improve your experience.</p>\n    <![endif]-->\n':'');
			metaText += (this.comments?'    <!-- End of metadata -->\n':'');
			return metaText;
		}
		this.librariesToText = function(){
			var libText = (this.comments?'    <!-- Start of libraries -->\n':'');
			if(this.head.lib.length > 0)
				for(var i = 0; i <this.head.lib.length; i ++){
					var lib = findLibraryPackageFromId(this.head.lib[i]);
					libText += lib.html;
					if(lib.boilerplate != null && isLibBoilerplateSelected(lib.name)){
						libText += (this.comments?'    <!-- Start of '+lib.name+' boilerplate code -->\n':'');
						libText += '    <script type="text/javascript">\n' + lib.boilerplate + '    </script>\n';
						libText += (this.comments?'    <!-- End of '+lib.name+' boilerplate code -->\n':'');
					}
					if(lib.name == 'jQuery'){
						if(isLibBoilerplateSelected('jQuery-yes')){
							libText += (this.comments?'    <!-- Start of jQuery boilerplate code -->\n':'');
							libText += '    <script type="text/javascript">\n' + boilerplates['jQuery'] + '    </script>\n';
							libText += (this.comments?'    <!-- End of jQuery boilerplate code -->\n':'');
						}
						else if(isLibBoilerplateSelected('jQuery-noConflict')){
							libText += (this.comments?'    <!-- Start of jQuery (noConflict) boilerplate code -->\n':'');
							libText += '    <script type="text/javascript">\n' + boilerplates['jQuery-noConflict'] + '    </script>\n';		
							libText += (this.comments?'    <!-- End of jQuery (noConflict) boilerplate code -->\n':'');
						}
					}
				}
			libText += (this.comments?'    <!-- End of libraries -->\n':'');
			return libText;
		}
		this.resourcesToText = function(){
			var resText = (this.comments?'    <!-- Start of resources -->\n':'');
			var resJSLines = this.head.scripts.match(/[^\r\n]+/g);
			if(resJSLines !== null)
				for(var i = 0; i <resJSLines.length; i ++)
					resText+='    <script type="text/javascript" src="'+resJSLines[i]+'"></script>\n';
			var resCSSLines = this.head.styles.match(/[^\r\n]+/g);
			if(resCSSLines !== null)
				for(var i = 0; i <resCSSLines.length; i ++)
					resText+='    <link rel="stylesheet" href="'+resCSSLines[i]+'">\n';
			resText += (this.comments?'    <!-- End of resources -->\n':'');
			return resText;
		}
		this.bodyToText = function(){
			var bodyText = (($.trim(this.body.classes).length === 0)?(this.html.body.start+'\n'):[this.html.body.start.slice(0, 7), ' classes="'+$.trim(this.body.classes)+'"',this.html.body.start.slice(7)].join('')+'\n');
			bodyText += ((this.body.before)?(this.userBodyToText()+this.templateBodyToText()):(this.templateBodyToText()+this.userBodyToText()));
			bodyText += this.html.body.end + '\n';		
			return bodyText;
		}
		this.userBodyToText = function(){
			var bodyUserText = (this.comments?'    <!-- Start of user-defined body -->\n':'');
			var bodyUserLines = this.body.userBody.match(/[^\r\n]+/g);
			if(bodyUserLines !== null)
				for(var i = 0; i <bodyUserLines.length; i ++)
					bodyUserText+='    '+bodyUserLines[i]+'\n';
			bodyUserText += (this.comments?'    <!-- End of user-defined body -->\n':'');
			return bodyUserText;
		}
		this.templateBodyToText = function(){
			var bodyTemplateText = '';
			if(this.head.lib.length > 0)
				for(var i = 0; i <this.head.lib.length; i ++){
					var lib = findLibraryPackageFromId(this.head.lib[i]);
					if(lib.boilerplateHTML != null && isLibBoilerplateSelected(lib.name)){
						bodyTemplateText += (this.comments?'    <!-- Start of '+lib.name+' HTML boilerplate code -->\n':'');
						bodyTemplateText += lib.boilerplateHTML;
						bodyTemplateText += (this.comments?'    <!-- End of '+lib.name+' HTML boilerplate code -->\n':'');
					}
				}
			bodyTemplateText += (this.comments?'    <!-- Start of generated template -->\n':'');
			switch(this.body.templateBase){
				case 'page-template':
					switch(this.body.templateId.replace('page-template-','')){
						case 'empty':
							break;
						case 'min':
							bodyTemplateText += '    <h1>'+(($.trim(this.head.title).length === 0)?'HTML5 sample page':$.trim(this.head.title))+'</h1>\n';
							bodyTemplateText += '    <p>This is an empty page generated by <a href="https://chalarangelo.github.io/htmltemplategenerator/">HTML5 Template Generator</a>.</p>\n';
							break;
						case 'sample':
							bodyTemplateText += '    <h1>Heading 1</h1>\n    <h2>Heading 2</h2><br>\n';
							bodyTemplateText += '    <p><strong>Paragraph</strong>: Lorem ipsum dolor sit amet, consectetur adipiscing elit. Praesent est mi, commodo vitae mauris at, sagittis vehicula sem. Quisque malesuada dui at justo maximus, vel placerat nibh blandit. Phasellus quis ipsum aliquam, fringilla ante sit amet, sagittis magna. In at dignissim eros, id vulputate tellus. Quisque orci urna, pretium in porttitor et, rhoncus in nulla. Aenean viverra ante in velit tincidunt, sit amet tincidunt ante suscipit. In malesuada consectetur molestie.</p>\n';
							bodyTemplateText += '    <br>\n    <img src="https://www.google.com/images/branding/googlelogo/2x/googlelogo_color_272x92dp.png">\n    <br>\n    <hr>\n    <br>\n    <ul>\n';
							bodyTemplateText += '      <li>Suspendisse convallis ac metus non efficitur.</li>\n      <li>Donec consectetur eu nisi luctus bibendum.</li>\n';
							bodyTemplateText += '      <li>Nam tempor facilisis sem vitae mattis.</li>\n      <li>Fusce feugiat rhoncus eros, id auctor mauris facilisis quis.</li>\n';
							bodyTemplateText += '    </ul>\n    <br>\n';
							bodyTemplateText += '    <div>Etiam maximus, ante vitae porttitor tincidunt, sem erat pharetra turpis, a ornare tortor purus <a href="https://www.google.com">ut justo</a>.\n';
							bodyTemplateText += '    </div>\n    <br>\n    <button type="button">Sample button</button>\n';
							break;
					}
					break;
				case 'form-template':
					switch(this.body.templateId){

					}
					break;
				case 'error-template':
					switch(this.body.templateId){

					}
					break;
				default:
					bodyTemplateText += '    <!-- Error in template generation! Please report your issue! -->\n';
					break;
			}
			bodyTemplateText += (this.comments?'    <!-- End of generated template -->\n':'');
			return bodyTemplateText;
		}
	};
	// Create the templateGen for use in the rest of the application
	var result = new templateProto();
	$('.versionNumbering').text(versionName);
	// Title click (for now it will change tab to content, maybe make it reload page later?)
	$(document).on('click','h1', function(){$('#content-tab').click();});
	// Library package object constructor
	var libraryPackage = function (name, version, type, url, requirements, boilerplate, boilerplateHTML){
		this.name = name;	this.version = version;
		if(type!='mixed'){
			this.html = '    <'+(type=='script'?'script type="text/javascript" src="':'link rel="stylesheet" href="')+url+(type=='script'?'"></script>\n':'">\n');
			this.raw = url;
		}
		this.requirements = requirements;
		this.boilerplate = boilerplate;		
		this.boilerplateHTML = boilerplateHTML;
		var scripts = 0;	var csses = 0;
		this.addScript = function(url){
			if(scripts == 0 && csses == 0) {this.raw = ''; this.html= '';}
			this.raw+=((csses != 0 || scripts != 0)?',':'')+url;
			this.html+='    <script type="text/javascript" src="'+url+'"></script>\n';
			scripts+=1;
			return this;
		};
		this.addCSS = function(url){
			if(scripts == 0 && csses == 0) {this.raw = ''; this.html= '';}
			this.raw+=((csses != 0 || scripts != 0)?',':'')+url;
			this.html+='    <link rel="stylesheet" href="'+url+'">\n';
			csses+=1;
			return this;
		};
	}	
	if(debug)	console.log('Loading libraries...');
	// Library boilerplates
	var boilerplates = {
		'jQuery' : '      $(function(){\n        console.log(\'jQuery: Page loading complete!\');\n      });\n',
		'jQuery-noConflict' :'      jQuery.noConflict();\n      jQuery(function(){\n        console.log(\'jQuery(noConflict): Page loading complete!\');\n      });\n',
		'AngularJS' : '      var app=angular.module(\'myApp\',[]);\n      app.controller(\'myController\',[\n        \'$scope\',function($scope){\n          $scope.demoText=\'AngularJS: This is some demo text!\';\n      }]);\n',
		'Dojo' : '      require([\'dojo/dom\',\'dojo/domReady!\'],function(dom){\n        console.log(\'Dojo: Page loading complete!\');\n      });\n',
		'MooTools' : '      window.addEvent(\'domready\',function(){\n        console.log(\'MooTools: Page loading complete!\');\n      });\n',
		html : {
			'AngularJS' : '    <div ng-app="myApp">\n      <div ng-controller="myController">\n        <p>{{ demoText }}</p>\n      </div>\n    </div>\n'
		}
	}
	var libList = [];
	libList.push(new libraryPackage('jQuery','2.2.4','script','https://ajax.googleapis.com/ajax/libs/jquery/2.2.4/jquery.min.js',null, null, null));
	libList.push(new libraryPackage('jQuery','3.1.0','script','https://ajax.googleapis.com/ajax/libs/jquery/3.1.0/jquery.min.js',null, null, null));
	libList.push(new libraryPackage('AngularJS','1.5.7','script','https://ajax.googleapis.com/ajax/libs/angularjs/1.5.7/angular.min.js',null, boilerplates['AngularJS'], boilerplates.html['AngularJS'])); 
	libList.push(new libraryPackage('Dojo','1.10.4','script','https://ajax.googleapis.com/ajax/libs/dojo/1.10.4/dojo/dojo.js',null, boilerplates['Dojo'], null)); 
	libList.push(new libraryPackage('Prototype','1.7.3.0','script','https://ajax.googleapis.com/ajax/libs/prototype/1.7.3.0/prototype.js',null, null, null));
	libList.push(new libraryPackage('MooTools','1.6.0','script','https://ajax.googleapis.com/ajax/libs/mootools/1.6.0/mootools.min.js',null, boilerplates['MooTools'], null));
	libList.push(new libraryPackage('three.js','1.6.0','script','https://ajax.googleapis.com/ajax/libs/threejs/r76/three.min.js',null, null, null));
	libList.push(new libraryPackage('Font Awesome','4.6.3','css','https://maxcdn.bootstrapcdn.com/font-awesome/4.6.3/css/font-awesome.min.css',null, null, null));
	libList.push(new libraryPackage('Bootstrap','3.3.7','mixed', null, 'jQuery-2-2-4', null, null)
		.addCSS('https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/css/bootstrap.min.css')
		.addScript('https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/js/bootstrap.min.js')
		);
	libList.push(new libraryPackage('Bootstrap','3.3.6','mixed', null,'jQuery-2-2-4', null, null)
		.addCSS('https://maxcdn.bootstrapcdn.com/bootstrap/3.3.6/css/bootstrap.min.css')
		.addScript('https://maxcdn.bootstrapcdn.com/bootstrap/3.3.6/js/bootstrap.min.js')
		);
	libList.push(new libraryPackage('Bootstrap-Extend','1.1','mixed', null,'Bootstrap-3-3-6', null, null)
		.addCSS('https://cdn.rawgit.com/Chalarangelo/bootstrap-extend/880420ae663f7c539971ded33411cdecffcc2134/css/bootstrap-extend.min.css')
		.addScript('https://cdn.rawgit.com/Chalarangelo/bootstrap-extend/880420ae663f7c539971ded33411cdecffcc2134/js/bootstrap-extend.min.js')
		);
	// Initialize libraries table
	var html='<div class="table-responsive"><table class="table table-bordered">';	
	for(var llC = 0; llC < libList.length; llC++){
		if(debug)	console.log(libList[llC]);
		var id = (libList[llC].name+'-'+libList[llC].version).replace(/\./g,'-');
		if(llC%3==0) html+='</tr>';
		html+='<td>';
		html+='<input type="checkbox" class="chkbox chkbox-primary" id="'+id+'"'+(id=='jQuery-3-1-0'?'checked':'')+'><label for="'+id+'">'+libList[llC].name+' ('+libList[llC].version+')</label>';
		html+='</td>';
		if((llC+1)%3==0) html+='</tr>';
	}
	if(!html.endsWith('</tr>'))html+='</tr>';
	html+='</table></div>';
	$('#lib-loader').html(html);
	// Initialize libraries boilerplate forms
	var html2 ='';
	for(var llC = 0; llC < libList.length; llC++){
		if(libList[llC].boilerplate != null || libList[llC].boilerplateHTML != null){
			html2+='<form class="form-horizontal hidden" autocomplete="off" id="boilerplate-form-'+libList[llC].name+'"><div class="form-group">';
            html2+='<label for="boilerplate-'+libList[llC].name+'" class="col-sm-offset-0 col-sm-2 control-label">Boilerplate code for '+libList[llC].name+'</label>';
            html2+='<div class="col-lg-4 col-md-4 col-sm-6">';
            html2+='<input id="boilerplate-'+libList[llC].name+'" class="switch switch-rect-primary switch-yes-no" type="checkbox"> <label for="boilerplate-'+libList[llC].name+'"></label>';
            html2+='</div></div></form>';
		}
	}
	$('#lib-loader-customizers').html(html2);
	// Library searchers
	var findLibraryPackageFromId = function(id){
		for(var llS=0; llS<libList.length; llS++)	if((libList[llS].name+'-'+libList[llS].version).replace(/\./g,'-') == id)	return libList[llS];
		return null;
	}
	var findIdFromLibraryPackage = function(package){
		return (package.name+'-'+package.version).replace(/\./g,'-');
	}	
	var isLibBoilerplateSelected = function(name){
		return ($('#boilerplate-'+name+':checked').length > 0);
	}
	// Navigation and tabs handling
	$(document).on('click','.nav-tabs li', function(){
		$('.nav-tabs li').removeClass('active');	$(this).addClass('active');
		$('.activeRow').removeClass('activeRow').addClass('hidden');
		$('#'+$(this).attr('id').substr(0, $(this).attr('id').indexOf('-'))).removeClass('hidden').addClass('activeRow');
		if($(this).attr('id')=='result-tab'){ editor.setValue(result.toText(), -1); }		
	});
	// Content tab events
	$('#content-title').change(function(){	result.head.title = $('#content-title').val();	});
	$('#content-classes').change(function(){	result.body.classes = $('#content-classes').val();	});
	$('#content-body').change(function(){	result.body.userBody = $('#content-body').val();	});
	$('input[name="content-pos-selector"]').change(function(){	result.body.before = $('#con-before:checked').length>0;	console.log(result.body.before);});
	$('select[name="content-templates"]').change(function(){
		var selected = $('select[name="content-templates"] option:selected' ).val();	result.body.templateBase = selected;
		$('.templates-customizer').addClass('hidden');	$('#content-'+selected+'-customize').removeClass('hidden');
		result.body.templateId = $('[name="content-'+selected+'-selector"]:checked').attr('id');
	});
	$('#commenter').change(function(){result.comments = $('#commenter:checked').length>0;});
	$('input[name^="content-"][name$="-template-selector"]').change(function(){ result.body.templateId = $(this).attr('id'); });
	// Libraries tab events
	$('#lib-loader input:checkbox').change(function(){
		var library = findLibraryPackageFromId($(this).attr('id'));
		for(var llI=0; llI<libList.length;llI++)
			if( library.name == libList[llI].name && library.version != libList[llI].version)
				$('#'+findIdFromLibraryPackage(libList[llI])).prop('checked',false);
		$('#libraries-badge').text($('#lib-loader input:checkbox:checked').length);
		result.head.lib = [];
		$('#lib-loader input:checkbox:checked').each(function(index, element){result.head.lib.push($(this).attr('id'));});
		if($('#boilerplate-form-' + library.name).length > 0) 	$('#boilerplate-form-' + library.name).toggleClass('hidden');
	});
	// Metadata tab events
	$('select[name="meta-charset"]').change(function(){
		if($('select[name="meta-charset"] option:selected' ).val()=='UTF-8') result.head.meta.charset = 0; else result.head.meta.charset = 1;
	});
	$('#meta-author').change(function(){	result.head.meta.author = $('#meta-author').val();	});
	$('#meta-desc').change(function(){	result.head.meta.description = $('#meta-desc').val().replace(/\r?\n/g,' ');	});
	$('#meta-keys').change(function(){	result.head.meta.keywords = $('#meta-keys').val();	});
	$('#meta-gen').change(function(){	result.head.meta.gentag = $('#meta-gen:checked').length>0;	});
	$('#meta-vp').change(function(){	result.head.meta.viewport = $('#meta-vp:checked').length>0;	});
	$('#meta-fav').change(function(){	result.head.meta.favicon = $('#meta-fav:checked').length>0;	});
	$('#meta-old').change(function(){	result.head.meta.oldwarn = $('#meta-old:checked').length>0;	});
	// Resources tab events
	$('#res-js').change(function(){	result.head.scripts = $('#res-js').val();	});
	$('#res-css').change(function(){	result.head.styles = $('#res-css').val();	});
	// Results tab events
	$('#clipboard').on('click',function(){
		var $temp = $("<textarea>");			$("body").append($temp);
	    $temp.val(editor.getValue()).select();	document.execCommand("copy");
	    $temp.remove();
	});
});
/*===============OLD CODE====================================================
// Generate JSFiddle with the specific template.
$('.fa-jsfiddle').click(function(){
	// Create a temporary form that will serve as the POST request submitter.
	var fiddleForm = $('<form class="hidden"></form>');
	fiddleForm.attr('method', 'post');
	fiddleForm.attr('action', 'http://jsfiddle.net/api/post/library/pure/');
    // HTML code for the JSFiddle html panel.
    var fiddleHTML = $('<textarea></textarea>');
    fiddleHTML.attr('name', 'html');
    fiddleHTML.text(fiddleDoc.html);
    fiddleForm.append(fiddleHTML);
	// Javascript code for the JSFiddle js panel.
    var fiddleJS = $('<textarea></textarea>');
    fiddleJS.attr('name', 'js');
    fiddleJS.text(fiddleDoc.js);
    fiddleForm.append(fiddleJS);
    // CSS code for the JSFiddle css panel.
    var fiddleCSS = $('<textarea></textarea>');
    fiddleCSS.attr('name', 'css');
    fiddleCSS.text(fiddleDoc.css);
    fiddleForm.append(fiddleCSS);
    // Resources list for the JSFiddle resources list.
    var fiddleRes = $('<textarea></textarea>');
    fiddleRes.attr('name', 'resources');
    fiddleRes.text(fiddleDoc.resources);
    fiddleForm.append(fiddleRes);
    // Title for the JSFiddle.
    var fiddleTitle = $('<textarea></textarea>');
    fiddleTitle.attr('name', 'title');
    fiddleTitle.text(fiddleDoc.title);
    fiddleForm.append(fiddleTitle);
    // Description for the JSFiddle.
    var fiddleDesc = $('<textarea></textarea>');
    fiddleDesc.attr('name', 'description');
    fiddleDesc.text(fiddleDoc.desc);
    fiddleForm.append(fiddleDesc);
    // DTD substring for the JSFiddle's DTD.
    var fiddleDTD = $('<textarea></textarea>');
    fiddleDTD.attr('name', 'dtd');
    fiddleDTD.text(fiddleDoc.dtd);
    fiddleForm.append(fiddleDTD);
	// The form needs to be a part of the document in
	// order for us to be able to submit it.
    $(document.body).append(fiddleForm);
    fiddleForm.submit();
});
// Prototype function for the object used in the generation of the JSFiddle.
function FiddleDoc(title,desc,html,js,css,resources,dtd){
	this.title = title;
	this.desc = desc;
	this.html = html;
	this.js = js;
	this.css = css;
	this.resources = resources;
	this.dtd = dtd;
}
*/