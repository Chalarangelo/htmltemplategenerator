$(function(){
	var debug = true;	// Debub flag
	// Version name and setup, always use this and update accordingly
	var versionName = 'v1.0.0_pre11 (cuttlefish_production'+((debug)?'::debug_true':'')+')';
	// Create the templateGen for use in the rest of the application
	var result = new templateProto();
	$('.versionNumbering').text(versionName);
	// Title click (for now it will change tab to content, maybe make it reload page later?)
	$(document).on('click','h1', function(){$('#content-tab').click();});
	// Library package object constructor
	var libraryPackage = function (name, version, type, url, requirements){
		this.name = name;	this.version = version;
		if(type!='mixed'){
			this.html = '    <'+(type=='script'?'script src="':'link rel="stylesheet" href="')+url+(type=='script'?'"></script>':'">');
			this.raw = url;
		}
		if(requirements != null){	this.requirements = requirements;	}
		var scripts = 0;	var csses = 0;
		this.addScript = function addScript(url){
			if(scripts == 0 && csses == 0) {this.raw = ''; this.html= '';}
			this.raw+=((csses != 0 || scripts != 0)?',':'')+url;
			this.html+=((csses != 0 || scripts != 0)?'\n':'')+'    <script src="'+url+'"></script>';
			scripts+=1;
		};
		this.addCSS = function(url){
			if(scripts == 0 && csses == 0) {this.raw = ''; this.html= '';}
			this.raw+=((csses != 0 || scripts != 0)?',':'')+url;
			this.html+=((csses != 0 || scripts != 0)?'\n':'')+'    <link rel="stylesheet" href="'+url+'"/>';
			csses+=1;
		};
	}	
	if(debug)	console.log('Loading libraries...');
	// Get libraries from XML file
	var libXML = $.parseXML('<document><library>'+
		'<name>jQuery</name><type>script</type>'+
		'<package><version>2.2.4</version><url>https://ajax.googleapis.com/ajax/libs/jquery/2.2.4/jquery.min.js</url></package>'+
		'<package><version>3.1.0</version><url>https://ajax.googleapis.com/ajax/libs/jquery/3.1.0/jquery.min.js</url></package>'+
	'</library><library>'+
		'<name>AngularJS</name><type>script</type>'+
		'<package><version>1.5.7</version><url>https://ajax.googleapis.com/ajax/libs/angularjs/1.5.7/angular.min.js</url></package>'+
	'</library><library>'+
		'<name>Dojo</name><type>script</type>'+
		'<package><version>1.10.4</version><url>https://ajax.googleapis.com/ajax/libs/dojo/1.10.4/dojo/dojo.js</url></package>'+
	'</library><library>'+
		'<name>Prototype</name><type>script</type>'+
		'<package><version>1.7.3.0</version><url>https://ajax.googleapis.com/ajax/libs/prototype/1.7.3.0/prototype.js</url></package>'+
	'</library><library>'+
		'<name>MooTools</name><type>script</type>'+
		'<package><version>1.6.0</version><url>https://ajax.googleapis.com/ajax/libs/mootools/1.6.0/mootools.min.js</url></package>'+
	'</library><library>'+
		'<name>three.js</name><type>script</type>'+
		'<package><version>1.6.0</version><url>https://ajax.googleapis.com/ajax/libs/threejs/r76/three.min.js</url></package>'+
	'</library><library>'+
		'<name>Font Awesome</name><type>css</type>'+
		'<package><version>4.6.3</version><url>https://maxcdn.bootstrapcdn.com/font-awesome/4.6.3/css/font-awesome.min.css</url></package>'+
	'</library><library>'+
		'<name>Bootstrap</name><type>mixed</type>'+
		'<package><version>3.3.7</version><requires>jQuery</requires><requiresVersion>2.2.4</requiresVersion>'+
			'<url>https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/css/bootstrap.min.css</url><url>https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/js/bootstrap.min.js</url>'+
		'</package>'+
		'<package><version>3.3.6</version><requires>jQuery</requires><requiresVersion>2.2.4</requiresVersion>'+
			'<url>https://maxcdn.bootstrapcdn.com/bootstrap/3.3.6/css/bootstrap.min.css</url><url>https://maxcdn.bootstrapcdn.com/bootstrap/3.3.6/js/bootstrap.min.js</url>'+
		'</package>'+
	'</library><library>'+
		'<name>Bootstrap-Extend</name><type>mixed</type>'+
		'<package><version>1.1</version><requires>Bootstrap</requires><requiresVersion>3.3.6</requiresVersion>'+
			'<url>https://cdn.rawgit.com/Chalarangelo/bootstrap-extend/880420ae663f7c539971ded33411cdecffcc2134/css/bootstrap-extend.min.css</url><url>https://cdn.rawgit.com/Chalarangelo/bootstrap-extend/880420ae663f7c539971ded33411cdecffcc2134/js/bootstrap-extend.min.js</url>'+
		'</package>'+
	'</library></document>');
	var libList = [];
	var libraries = libXML.getElementsByTagName('library');
	for(var lC = 0; lC < libraries.length; lC++){
		var type = libraries[lC].getElementsByTagName('type')[0].childNodes[0].nodeValue;
		var packages = libraries[lC].getElementsByTagName('package');
		for(var pC = 0; pC < packages.length; pC++){
			var name = libraries[lC].getElementsByTagName('name')[0].childNodes[0].nodeValue;
			var version = packages[pC].getElementsByTagName('version')[0].childNodes[0].nodeValue;
			var requires = packages[pC].getElementsByTagName('requires');
			var requiresVersion = packages[pC].getElementsByTagName('requiresVersion');
			var requirements;
			if(typeof requires[0] != 'undefined')
				requirements = requires[0].childNodes[0].nodeValue + requiresVersion[0].childNodes[0].nodeValue;
			else
				requirements = null;
			if(type!='mixed'){	
				var url = packages[pC].getElementsByTagName('url')[0].childNodes[0].nodeValue;
				libList.push(new libraryPackage(name,version,type,url,requirements));
			}
			else{
				var newLib = new libraryPackage(name,version,type,'',requirements);
				var urls = packages[pC].getElementsByTagName('url');
				for(var uC = 0; uC < urls.length; uC++){
					if(urls[uC].childNodes[0].nodeValue.endsWith('.js'))
						newLib.addScript(urls[uC].childNodes[0].nodeValue);
					else
						newLib.addCSS(urls[uC].childNodes[0].nodeValue);
				}
				libList.push(newLib);
			}
		}
	}
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
	var findLibraryPacakgeFromId = function(id){
		for(var llS=0; llS<libList.length; llS++)	if((libList[llS].name+'-'+libList[llS].version).replace(/\./g,'-') == id)	return libList[llS];
		return null;
	}
	var findIdFromLibraryPackage = function(package){
		return (package.name+'-'+package.version).replace(/\./g,'-');
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
		var library = findLibraryPacakgeFromId($(this).attr('id'));
		for(var llI=0; llI<libList.length;llI++)
			if( library.name == libList[llI].name && library.version != libList[llI].version)
				$('#'+findIdFromLibraryPackage(libList[llI])).prop('checked',false);
		$('#libraries-badge').text($('#lib-loader input:checkbox:checked').length);
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

	// Results tab events
	$('#clipboard').on('click',function(){
		var $temp = $("<textarea>");			$("body").append($temp);
	    $temp.val(editor.getValue()).select();	document.execCommand("copy");
	    $temp.remove();
	});
});
// Prototype for the templates
var templateProto = function(){
	this.comments = false;
	this.doctype = '<!DOCTYPE html>';
	this.html = {
		start:'<html>', 
		end:'</html>', 
		head: {
			start:'  <head>', 
			end:'  </head>'
		}, 
		body: {
			start:'  <body>', // TODO: this might cause problems with body classes, change the tagging accordingly to something like start p1, start p2 for classes or overhaul using classes, just work it!
			end:'  </body>'
		}
	};
	this.head = {
		title: '',
		meta: {
			charset:0, 
			author: '', 
			description: '', 
			keywords: '', 
			gentag: true, 
			viewport: true, 
			favicon: false, 
			oldwarn: false
		}, 
		lib: [], 
		scripts: [], 
		styles: [] 
	};
	this.body = {
		classes: '', 
		before: true, 
		userBody: '', 
		templateBase: 'page-template',
		templateId: 'page-template-min'
	};
	this.toText = function(){
		var textRes = this.doctype + '\n' + this.html.start +'\n'
		+ this.headToText()
		+ this.bodyToText()
		+ this.html.end;
		return textRes;
	};
	this.headToText = function(){
		var headText = '';
		headText += this.html.head.start +'\n';
		headText += (($.trim(this.head.title).length === 0)?'    <title>HTML5 sample page</title>\n':'    <title>'+$.trim(this.head.title)+'</title>\n');
		headText += this.metaToText();
		headText += this.librariesToText();
		headText += this.resourcesToText();
		headText += this.html.head.end +'\n';
		return headText;
	}
	this.metaToText = function(){
		var metaText = '';
		metaText += (this.comments?'    <!-- Start of metadata -->\n':'');
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
		var libText = '';
		libText += (this.comments?'    <!-- Start of libraries -->\n':'');
		// TODO: Add libraries code here!
		libText += (this.comments?'    <!-- End of libraries -->\n':'');
		return libText;
	}
	this.resourcesToText = function(){
		var resText ='';
		resText += (this.comments?'    <!-- Start of resources -->\n':'');
		// TODO: Add resources code here!
		resText += (this.comments?'    <!-- End of resources -->\n':'');
		return resText;
	}
	this.bodyToText = function(){
		var bodyText = '';
		bodyText += (($.trim(this.body.classes).length === 0)?(this.html.body.start+'\n'):[this.html.body.start.slice(0, 7), ' classes="'+$.trim(this.body.classes)+'"',this.html.body.start.slice(7)].join('')+'\n');
		bodyText += ((this.body.before)?(this.userBodyToText()+this.templateBodyToText()):(this.templateBodyToText()+this.userBodyToText()));
		bodyText += this.html.body.end + '\n';		
		return bodyText;
	}
	this.userBodyToText = function(){
		var bodyUserText = '';
		bodyUserText += (this.comments?'    <!-- Start of user-defined body -->\n':'');
		var bodyUserLines = this.body.userBody.match(/[^\r\n]+/g);
		if(bodyUserLines !== null)
			for(var i = 0; i <bodyUserLines.length; i ++)
				bodyUserText+='    '+bodyUserLines[i]+'\n';
		bodyUserText += (this.comments?'    <!-- End of user-defined body -->\n':'');
		return bodyUserText;
	}
	this.templateBodyToText = function(){
		var bodyTemplateText = '';
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