$(function(){
	var debug = true;
	// Version name and setup, always use this and update accordingly
	var versionName = 'v1.0.0_pre09 (cuttlefish_production'+((debug)?'::debug_true':'')+')';
	// Create the templateGen for use in the rest of the application
	var result = new templateProto();
	$('.versionNumbering').text(versionName);
	// Title click (for now it will change tab to content, maybe make it reload page later?)
	$(document).on('click','h1', function(){$('#content-tab').click();});
	// Navigation and tabs handling
	$(document).on('click','.nav-tabs li', function(){
		$('.nav-tabs li').removeClass('active');
		$(this).addClass('active');
		$('.activeRow').removeClass('activeRow').addClass('hidden');
		$('#'+$(this).attr('id').substr(0, $(this).attr('id').indexOf('-'))).removeClass('hidden').addClass('activeRow');
		if($(this).attr('id')=='result-tab'){ $('#result-copier').val(result.toText()); editor.setValue(result.toText(), -1); }
			
	});
	// Content tab events
	$('#content-title').change(function(){	result.head.title = $('#content-title').val();	});
	$('#content-classes').change(function(){	result.body.classes = $('#content-classes').val();	});
	$('#content-body').change(function(){	result.body.userBody = $('#content-body').val();	});
	$('input[name="content-pos-selector"]').change(function(){	result.body.before = $('#con-before:checked').length>0;	});
	$('select[name="content-templates"]').change(function(){
		var selected = $('select[name="content-templates"] option:selected' ).val();
		$('.templates-customizer').addClass('hidden');	$('#content-'+selected+'-customize').removeClass('hidden');
	});
	$('#commenter').change(function(){result.comments = $('#commenter:checked').length>0;});
	// Libraries tab events
	$('#lib-loader input:checkbox').change(function(){$('#libraries-badge').text($('#lib-loader input:checkbox:checked').length);});
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
		base: 0, 
		userBody: '', 
		templateBody: ''
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
		metaText += (this.comments?'    <!-- Start of Metadata -->\n':'');
		metaText += ((this.head.meta.charset == 0)?'    <meta charset="utf-8">':'    <meta charset="iso-8859-1">')+'\n';
		metaText += ((this.head.meta.viewport)?'    <meta name="viewport" content="width=device-width, initial-scale=1">\n':'');
		metaText += (($.trim(this.head.meta.description).length === 0)?'':'    <meta name="description" content="'+$.trim(this.head.meta.description)+'">\n');
		metaText += (($.trim(this.head.meta.keywords).length === 0)?'':'    <meta name="keywords" content="'+$.trim(this.head.meta.keywords)+'">\n');
		metaText += (($.trim(this.head.meta.author).length === 0)?'':'    <meta name="author" content="'+$.trim(this.head.meta.author)+'">\n');
		metaText += ((this.head.meta.gentag)?'    <meta name="generator" content="http://chalarangelo.github.io/htmltemplategenerator/">\n':'');
		metaText += ((this.head.meta.favicon)?'    <link rel="icon" type="image/x-icon" href="./favicon.ico">\n':'');
		metaText += ((this.head.meta.oldwarn)?'    <!--[if lt IE 8]>\n      <p class="browsehappy">You are using an <strong>outdated</strong> browser. Please <a href="http://browsehappy.com/">upgrade your browser</a> to improve your experience.</p>\n    <![endif]-->\n':'');
		metaText += (this.comments?'    <!-- End of Metadata -->\n':'');
		return metaText;
	}
	this.librariesToText = function(){
		var libText = '';
		libText += (this.comments?'    <!-- Start of Libraries -->\n':'');
		// TODO: Add libraries code here!
		libText += (this.comments?'    <!-- End of Libraries -->\n':'');
		return libText;
	}
	this.resourcesToText = function(){
		var resText ='';
		resText += (this.comments?'    <!-- Start of Resources -->\n':'');
		// TODO: Add resources code here!
		resText += (this.comments?'    <!-- End of Resources -->\n':'');
		return resText;
	}
	this.bodyToText = function(){
		var bodyText = '';
		bodyText += (($.trim(this.body.classes).length === 0)?(this.html.body.start+'\n'):[this.html.body.start.slice(0, 7), ' classes="'+$.trim(this.body.classes)+'"',this.html.body.start.slice(7)].join('')+'\n');
		bodyText += this.html.body.end + '\n';
		return bodyText;
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