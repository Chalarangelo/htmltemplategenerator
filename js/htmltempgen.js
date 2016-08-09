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
		var textRes = this.doctype + '\n' + this.html.start +'\n' + this.html.head.start + '\n'
		+ this.metaToText()
		+ '    <!-- TODO: ADD HEAD HERE -->' + '\n'
		+ this.html.head.end + '\n' + this.html.body.start + '\n'
		+ '    <!-- TODO: ADD BODY HERE -->' + '\n'
		+ this.html.body.end + '\n' + this.html.end;
		return textRes;
	};
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
};

/*
$(document).ready(function(){
	// Checks which libraries are loaded for the standard templates and creates a resource string from them.
	function checkStdLib(){
		var empty = true;
		var stdLibRes = '';
		if($('#jquery-startgroup').is(":checked")){
			stdLibRes+='https://ajax.googleapis.com/ajax/libs/jquery/2.2.4/jquery.min.js';
			empty = false;
		}
		if($('#angularjs-startgroup').is(":checked")){
			stdLibRes+=((!empty)?',':'')+'https://ajax.googleapis.com/ajax/libs/angularjs/1.5.7/angular.min.js';
			empty = false;
		}
		if($('#dojo-startgroup').is(":checked")){
			stdLibRes+=((!empty)?',':'')+'https://ajax.googleapis.com/ajax/libs/dojo/1.10.4/dojo/dojo.js';
			empty = false;
		}
		if($('#prototype-startgroup').is(":checked")){
			stdLibRes+=((!empty)?',':'')+'https://ajax.googleapis.com/ajax/libs/prototype/1.7.3.0/prototype.js';
			empty = false;
		}
		if($('#bootstrap-startgroup').is(":checked") && $('#jquery-startgroup').is(":checked")){
			stdLibRes+=((!empty)?',':'')+'http://maxcdn.bootstrapcdn.com/bootstrap/3.3.6/css/bootstrap.min.css,http://maxcdn.bootstrapcdn.com/bootstrap/3.3.6/js/bootstrap.min.js';
			empty = false;
		}
		if($('#bootstrap-startgroup').is(":checked") && !($('#jquery-startgroup').is(":checked"))){
			stdLibRes+=((!empty)?',':'')+'http://maxcdn.bootstrapcdn.com/bootstrap/3.3.6/css/bootstrap.min.css,https://ajax.googleapis.com/ajax/libs/jquery/1.12.4/jquery.min.js,http://maxcdn.bootstrapcdn.com/bootstrap/3.3.6/js/bootstrap.min.js';
			empty = false;
		}
		if($('#font-awesome-startgroup').is(":checked")){
			stdLibRes+=((!empty)?',':'')+'https://maxcdn.bootstrapcdn.com/font-awesome/4.6.3/css/font-awesome.min.css';
			empty = false;
		}
		return stdLibRes;
	}
	function checkCustomLib(scripts,styles){
		var empty = true;
		var stdLibRes = '';
		if($('#jquery-224-customgroup').is(":checked")){
			stdLibRes+='https://ajax.googleapis.com/ajax/libs/jquery/2.2.4/jquery.min.js';
			empty = false;
		}
		if($('#jquery-300-customgroup').is(":checked")){
			stdLibRes+='https://ajax.googleapis.com/ajax/libs/jquery/3.0.0/jquery.min.js';
			empty = false;
		}
		if($('#angularjs-customgroup').is(":checked")){
			stdLibRes+=((!empty)?',':'')+'https://ajax.googleapis.com/ajax/libs/angularjs/1.5.7/angular.min.js';
			empty = false;
		}
		if($('#dojo-customgroup').is(":checked")){
			stdLibRes+=((!empty)?',':'')+'https://ajax.googleapis.com/ajax/libs/dojo/1.10.4/dojo/dojo.js';
			empty = false;
		}
		if($('#prototype-customgroup').is(":checked")){
			stdLibRes+=((!empty)?',':'')+'https://ajax.googleapis.com/ajax/libs/prototype/1.7.3.0/prototype.js';
			empty = false;
		}
		if($('#bootstrap-customgroup').is(":checked") && ($('#jquery-224-customgroup').is(":checked") || $('#jquery-300-customgroup').is(":checked"))){
			stdLibRes+=((!empty)?',':'')+'http://maxcdn.bootstrapcdn.com/bootstrap/3.3.6/css/bootstrap.min.css,http://maxcdn.bootstrapcdn.com/bootstrap/3.3.6/js/bootstrap.min.js';
			empty = false;
		}
		if($('#bootstrap-customgroup').is(":checked") && !($('#jquery-224-customgroup').is(":checked")) && !($('#jquery-300-customgroup').is(":checked"))){
			stdLibRes+=((!empty)?',':'')+'http://maxcdn.bootstrapcdn.com/bootstrap/3.3.6/css/bootstrap.min.css,https://ajax.googleapis.com/ajax/libs/jquery/1.12.4/jquery.min.js,http://maxcdn.bootstrapcdn.com/bootstrap/3.3.6/js/bootstrap.min.js';
			empty = false;
		}
		if($('#font-awesome-customgroup').is(":checked")){
			stdLibRes+=((!empty)?',':'')+'https://maxcdn.bootstrapcdn.com/font-awesome/4.6.3/css/font-awesome.min.css';
			empty = false;
		}
		if($('#mootools-customgroup').is(":checked")){
			stdLibRes+=((!empty)?',':'')+'https://ajax.googleapis.com/ajax/libs/mootools/1.6.0/mootools.min.js';
			empty = false;
		}  
		if($('#threejs-customgroup').is(":checked")){
			stdLibRes+=((!empty)?',':'')+'https://ajax.googleapis.com/ajax/libs/threejs/r76/three.min.js';
			empty = false;
		}	
		for(var i = 0; i < scripts.external.length; i++){
			stdLibRes+=((!empty)?',':'')+scripts.external[i];
			empty = false;
		}
		for(var i = 0; i < styles.external.length; i++){
			stdLibRes+=((!empty)?',':'')+styles.external[i];
			empty = false;
		}
		console.log(stdLibRes);
		return stdLibRes;
	}
	// Look at the end of this function for the html template variables.
	var $output = $('#output');
	// Original menu click event.
	$('.startgroup-option').click(function(){
		var id = $(this).attr('id');
		var templateText;
		if(id=='std'){			// Generate Standard template page without any content.
			templateText 	= stdTemplate.begin
							+ ($('#jquery-startgroup').is(":checked")?'  <script src="https://ajax.googleapis.com/ajax/libs/jquery/2.2.4/jquery.min.js"></script>\n':'')
							+ ($('#angularjs-startgroup').is(":checked")?'  <script src="https://ajax.googleapis.com/ajax/libs/angularjs/1.5.7/angular.min.js"></script>\n':'')
							+ ($('#dojo-startgroup').is(":checked")?'  <script src="https://ajax.googleapis.com/ajax/libs/dojo/1.10.4/dojo/dojo.js"></script>\n':'')
							+ ($('#prototype-startgroup').is(":checked")?'  <script src="https://ajax.googleapis.com/ajax/libs/prototype/1.7.3.0/prototype.js"></script>\n':'')
							+ (($('#bootstrap-startgroup').is(":checked") && $('#jquery-startgroup').is(":checked")) ?'  <link rel="stylesheet" href="http://maxcdn.bootstrapcdn.com/bootstrap/3.3.6/css/bootstrap.min.css">\n  <script src="http://maxcdn.bootstrapcdn.com/bootstrap/3.3.6/js/bootstrap.min.js"></script>\n':'')
							+ (($('#bootstrap-startgroup').is(":checked") && !($('#jquery-startgroup').is(":checked"))) ?'  <link rel="stylesheet" href="http://maxcdn.bootstrapcdn.com/bootstrap/3.3.6/css/bootstrap.min.css">\n  <script src="https://ajax.googleapis.com/ajax/libs/jquery/1.12.4/jquery.min.js"></script>\n  <script src="http://maxcdn.bootstrapcdn.com/bootstrap/3.3.6/js/bootstrap.min.js"></script>\n':'')
							+ ($('#font-awesome-startgroup').is(":checked")?'  <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/font-awesome/4.6.3/css/font-awesome.min.css">\n':'')
							+ stdTemplate.head
							+ stdTemplate.end;
			$output.text(templateText);
			$('#output-wrapper').toggleClass('hidden');
			fiddleDoc = new FiddleDoc('HTML5 Sample page', 
				'Generated by http://chalarangelo.github.io/htmltemplategenerator/',
				'','','',checkStdLib(),'html 5');
		}
		else if(id=='std-c'){	// Generate Standard template page with sample content.
			templateText 	= stdTemplate.begin
							+ ($('#jquery-startgroup').is(":checked")?'  <script src="https://ajax.googleapis.com/ajax/libs/jquery/2.2.4/jquery.min.js"></script>\n':'')
							+ ($('#angularjs-startgroup').is(":checked")?'  <script src="https://ajax.googleapis.com/ajax/libs/angularjs/1.5.7/angular.min.js"></script>\n':'')
							+ ($('#dojo-startgroup').is(":checked")?'  <script src="https://ajax.googleapis.com/ajax/libs/dojo/1.10.4/dojo/dojo.js"></script>\n':'')
							+ ($('#prototype-startgroup').is(":checked")?'  <script src="https://ajax.googleapis.com/ajax/libs/prototype/1.7.3.0/prototype.js"></script>\n':'')
							+ (($('#bootstrap-startgroup').is(":checked") && $('#jquery-startgroup').is(":checked")) ?'  <link rel="stylesheet" href="http://maxcdn.bootstrapcdn.com/bootstrap/3.3.6/css/bootstrap.min.css">\n  <script src="http://maxcdn.bootstrapcdn.com/bootstrap/3.3.6/js/bootstrap.min.js"></script>\n':'')
							+ (($('#bootstrap-startgroup').is(":checked") && !($('#jquery-startgroup').is(":checked"))) ?'  <link rel="stylesheet" href="http://maxcdn.bootstrapcdn.com/bootstrap/3.3.6/css/bootstrap.min.css">\n  <script src="https://ajax.googleapis.com/ajax/libs/jquery/1.12.4/jquery.min.js"></script>\n  <script src="http://maxcdn.bootstrapcdn.com/bootstrap/3.3.6/js/bootstrap.min.js"></script>\n':'')
							+ ($('#font-awesome-startgroup').is(":checked")?'  <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/font-awesome/4.6.3/css/font-awesome.min.css">\n':'')
							+ stdTemplate.head
							+ body_std_c
							+ stdTemplate.end;
			$output.text(templateText);
			$('#output-wrapper').toggleClass('hidden');
			fiddleDoc = new FiddleDoc('HTML5 Sample page', 
				'Generated by http://chalarangelo.github.io/htmltemplategenerator/',
				body_std_c,'','',checkStdLib(),'html 5');
		}
		else if(id=='std-cs'){	// Generate Standard template page with full content showcase.
			templateText 	= stdTemplate.begin
							+ ($('#jquery-startgroup').is(":checked")?'  <script src="https://ajax.googleapis.com/ajax/libs/jquery/2.2.4/jquery.min.js"></script>\n':'')
							+ ($('#angularjs-startgroup').is(":checked")?'  <script src="https://ajax.googleapis.com/ajax/libs/angularjs/1.5.7/angular.min.js"></script>\n':'')
							+ ($('#dojo-startgroup').is(":checked")?'  <script src="https://ajax.googleapis.com/ajax/libs/dojo/1.10.4/dojo/dojo.js"></script>\n':'')
							+ ($('#prototype-startgroup').is(":checked")?'  <script src="https://ajax.googleapis.com/ajax/libs/prototype/1.7.3.0/prototype.js"></script>\n':'')
							+ (($('#bootstrap-startgroup').is(":checked") && $('#jquery-startgroup').is(":checked")) ?'  <link rel="stylesheet" href="http://maxcdn.bootstrapcdn.com/bootstrap/3.3.6/css/bootstrap.min.css">\n  <script src="http://maxcdn.bootstrapcdn.com/bootstrap/3.3.6/js/bootstrap.min.js"></script>\n':'')
							+ (($('#bootstrap-startgroup').is(":checked") && !($('#jquery-startgroup').is(":checked"))) ?'  <link rel="stylesheet" href="http://maxcdn.bootstrapcdn.com/bootstrap/3.3.6/css/bootstrap.min.css">\n  <script src="https://ajax.googleapis.com/ajax/libs/jquery/1.12.4/jquery.min.js"></script>\n  <script src="http://maxcdn.bootstrapcdn.com/bootstrap/3.3.6/js/bootstrap.min.js"></script>\n':'')
							+ ($('#font-awesome-startgroup').is(":checked")?'  <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/font-awesome/4.6.3/css/font-awesome.min.css">\n':'')
							+ stdTemplate.head
							+ body_std_cs
							+ stdTemplate.end;
			$output.text(templateText);
			$('#output-wrapper').toggleClass('hidden');
			fiddleDoc = new FiddleDoc('HTML5 Sample page', 
				'Generated by http://chalarangelo.github.io/htmltemplategenerator/',
				body_std_cs,'','',checkStdLib(),'html 5');
		}
		else if(id=='pre-built'){	// Show next menu for pre-built templates.
			templateText 	= stdTemplate.begin
							+ stdTemplate.head
							+ body_temporary
							+ stdTemplate.end;
			$output.text(templateText);
			$('#output-wrapper').toggleClass('hidden');	
			fiddleDoc = new FiddleDoc('HTML5 Sample page', 
				'Generated by http://chalarangelo.github.io/htmltemplategenerator/',
				body_temporary,'','',checkStdLib(),'html 5');	
		}
		else {	// Show next menu for template customization.
			$('#question').fadeOut('slow',function(){
				$('#question').html('Choose from the given options to customize your HTML5 template page to your desire. When you are ready to generate your template page, click the button below:<br><br><span class="button-span" id="custom-gen">Generate custom template</span>');
				$('#question').fadeIn('slow');
			});
			$('#startgroup').fadeOut('slow',function(){
				$('#startgroup').toggleClass('hidden');
				$('#customgroup').toggleClass('hidden');
				$('#customgroup').fadeIn('slow');

			});
		}	
	});
	// Custom template generation click event.
	$(document).on('click', '#custom-gen', function() {
		var meta = new Meta($('#meta_charset').find(":selected").val(),$('#meta_author').val(),$('#meta_description').val(),$('#meta_keywords').val());
		var scripts = new Scripts($('#page_js_files').val());
		var styles = new Styles($('#page_css_files').val());
		templateText 	= doctype + htmlTags.begin + headTags.begin
						+ ((meta.charset!=null)?meta.charset:'')
						+ ((meta.author!=null)?meta.author:'')
						+ ((meta.description!=null)?meta.description:'')
						+ ((meta.keywords!=null)?meta.keywords:'')
						+ meta.generator
						+ titleTags.begin + $('#page_title').val() + titleTags.end
						+ ($('#angularjs-customgroup').is(":checked")?'  <script src="https://ajax.googleapis.com/ajax/libs/angularjs/1.5.7/angular.min.js"></script>\n':'')
						+ (($('#bootstrap-customgroup').is(":checked") && ($('#jquery-224-customgroup').is(":checked") || $('#jquery-300-customgroup').is(":checked"))) ?'  <link rel="stylesheet" href="http://maxcdn.bootstrapcdn.com/bootstrap/3.3.6/css/bootstrap.min.css">\n  <script src="http://maxcdn.bootstrapcdn.com/bootstrap/3.3.6/js/bootstrap.min.js"></script>\n':'')
						+ (($('#bootstrap-customgroup').is(":checked") && !($('#jquery-224-customgroup').is(":checked")) && !($('#jquery-300-customgroup').is(":checked"))) ?'  <link rel="stylesheet" href="http://maxcdn.bootstrapcdn.com/bootstrap/3.3.6/css/bootstrap.min.css">\n  <script src="https://ajax.googleapis.com/ajax/libs/jquery/1.12.4/jquery.min.js"></script>\n  <script src="http://maxcdn.bootstrapcdn.com/bootstrap/3.3.6/js/bootstrap.min.js"></script>\n':'')
						+ ($('#dojo-customgroup').is(":checked")?'  <script src="https://ajax.googleapis.com/ajax/libs/dojo/1.10.4/dojo/dojo.js"></script>\n':'')
						+ ($('#font-awesome-customgroup').is(":checked")?'  <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/font-awesome/4.6.3/css/font-awesome.min.css">\n':'')
						+ ($('#jquery-224-customgroup').is(":checked")?'  <script src="https://ajax.googleapis.com/ajax/libs/jquery/2.2.4/jquery.min.js"></script>\n':'')
						+ ($('#jquery-300-customgroup').is(":checked")?'  <script src="https://ajax.googleapis.com/ajax/libs/jquery/3.0.0/jquery.min.js"></script>\n':'')
						+ ($('#mootools-customgroup').is(":checked")?'  <script src="https://ajax.googleapis.com/ajax/libs/mootools/1.6.0/mootools.min.js"></script>\n':'')
						+ ($('#prototype-customgroup').is(":checked")?'  <script src="https://ajax.googleapis.com/ajax/libs/prototype/1.7.3.0/prototype.js"></script>\n':'')
						+ ($('#threejs-customgroup').is(":checked")?'  <script src="https://ajax.googleapis.com/ajax/libs/threejs/r76/three.min.js"></script>\n':'')
						+ scripts.getLocal() + scripts.getExternal()
						+ styles.getLocal() + styles.getExternal()
						+ headTags.end + bodyTags.begin
						+ $('#page_body').val()
						+ '\n'+ bodyTags.end + htmlTags.end;
		$output.text(templateText);
		$('#output-wrapper').toggleClass('hidden');
		fiddleDoc = new FiddleDoc($('#page_title').val(), 
				(($('#meta_description').val()!=null)?$('#meta_description').val()+'\n':'')
				+'Generated by http://chalarangelo.github.io/htmltemplategenerator/',
				$('#page_body').val(),'','',checkCustomLib(scripts,styles),'html 5');	
	});
	// Mutually exclusive jQuery versions.
	$('#jquery-224-customgroup').click(function(){
		if($(this).is(':checked'))	$('#jquery-300-customgroup').prop('checked', false);
	});
	// Mutually exclusive jQuery versions.
	$('#jquery-300-customgroup').click(function(){
		if($(this).is(':checked'))	$('#jquery-224-customgroup').prop('checked', false);
	});
	// Close the output wrapper, reload the page.
	$('.fa-times').click(function(){
		location.reload();
	});
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
	// Copy the text from the output area to the clipboard.
	$('.fa-clipboard').click(function(){
		var copyTextarea = document.querySelector('#output');
  		copyTextarea.select();
		document.execCommand('copy');
	});

	// Open new tab/window with the project's github on footer click.
	$('#footer').click(function(){
		window.open('https://github.com/chalarangelo/htmltemplategenerator', '_blank');
	});
	// Highlight footer on hover.
	$('#footer').hover(
		function(){
			$('.fa-github').removeClass('fa-github').addClass('fa-arrow-circle-down');
		},
		function(){
			$('.fa-arrow-circle-down').removeClass('fa-arrow-circle-down').addClass('fa-github');
		});
	// ----------------------------------------------
	// Template variables and other helper functions.
	// ----------------------------------------------
	var doctype = '<!DOCTYPE html>\n';						// Doctype.
	var htmlTags = {begin:'<html>\n', end:'</html>\n'};		// Html open and close.
	var headTags = {begin:' <head>\n', end:' </head>\n'};	// Head open and close.
	var bodyTags = {begin:' <body>\n', end:' </body>\n'};	// Body open and close.
	var titleTags = {begin:'  <title>', end:'</title>\n'};	// Title open and close.
	// Prototype function for the HTML5 meta tags. 
	function Meta(charset,author,description,keywords){
		if(charset != null)	this.charset = '  <meta charset="'+charset+'">\n';
		else	this.charset = '  <meta charset="utf-8">\n';
		if(author.length != 0)	this.author = '  <meta name="author" content="'+author+'">\n';
		else	this.author = null;
		if(description.length != 0)	this.description = '  <meta name="description" content="'+description+'">\n';
		else	this.description = null;
		this.generator = '  <meta name="generator" content="http://chalarangelo.github.io/htmltemplategenerator/">\n';
		if(keywords.length != 0)	this.keywords = '  <meta name="keywords" content="'+keywords+'">\n';
		else	this.keywords = null;		
	}
	// Prototype function for the Javascript resources.
	function Scripts(scriptsList){
		if(scriptsList.trim() == ''){
			this.local = null;
			this.external = null; 			
			this.getExternal = function(){return '';}
			this.getLocal = function(){return '';}
			return;
		}
		var scriptsArray = scriptsList.split(',');
		this.local = [];	this.external = [];
		for(var i = 0; i < scriptsArray.length; i++)
		{
			scriptsArray[i] = scriptsArray[i].trim();
			if(scriptsArray[i].startsWith('http://') || scriptsArray[i].startsWith('https://'))
				this.external.push(scriptsArray[i]);
			else
				this.local.push(scriptsArray[i]);
		}
		this.getExternal = function(){
			var externalString = '';
			for(var i = 0; i< this.external.length; i++)
			{
				externalString+='  <script type="text/javascript" src="'+this.external[i]+'"></script>\n';
			}
			return externalString;
		}
		this.getLocal = function(){
			var localString = '';
			for(var i = 0; i< this.local.length; i++)
			{
				localString+='  <script type="text/javascript" src="'+this.local[i]+'"></script>\n';
			}
			return localString;
		}
	}
	function Styles(stylesList){
		if(stylesList.trim() == ''){
			this.local = null;
			this.external = null; 			
			this.getExternal = function(){return '';}
			this.getLocal = function(){return '';}
			return;
		}
		var styleArray = stylesList.split(',');
		this.local = [];	this.external = [];
		for(var i = 0; i < styleArray.length; i++)
		{
			styleArray[i] = styleArray[i].trim();
			if(styleArray[i].startsWith('http://') || styleArray[i].startsWith('https://'))
				this.external.push(styleArray[i]);
			else
				this.local.push(styleArray[i]);
		}
		this.getExternal = function(){
			var externalString = '';
			for(var i = 0; i< this.external.length; i++)
			{
				externalString+='  <link rel="stylesheet" href="'+this.external[i]+'"/>\n';
			}
			return externalString;
		}
		this.getLocal = function(){
			var localString = '';
			for(var i = 0; i< this.local.length; i++)
			{
				localString+='  <link rel="stylesheet" href="'+this.local[i]+'"/>\n';
			}
			return localString;
		}
	}
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
	// Holds the object used in the generation of the JSFiddle.
	var fiddleDoc = new FiddleDoc('Template page', 'Generated by http://chalarangelo.github.io/htmltemplategenerator/','sample html','sample js code','sample css code','https://ajax.googleapis.com/ajax/libs/jquery/2.2.4/jquery.min.js','html 5');
	// Standard templates variables.
	var stdTemplate = { begin: (doctype + htmlTags.begin + headTags.begin + '  <meta charset="utf-8"/>\n' 
						+ '  <meta name="generator" content="http://chalarangelo.github.io/htmltemplategenerator/">\n'), 
						head:( '  <script type="text/javascript" src="js/script.js"></script>\n'
						+ '  <link rel="stylesheet" href="css/stylesheet.css"/>\n'
						+ titleTags.begin + 'HTML5 Sample page' + titleTags.end + headTags.end + bodyTags.begin) , 
						end: (bodyTags.end + htmlTags.end)
					};
	var body_std_c		= '  <h1>This is a sample title</h1>\n'
						+ '  <h2>This is a sample subtitle</h2><br>\n'
						+ '  <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Praesent est mi, commodo vitae mauris at, sagittis vehicula sem. Quisque malesuada dui at justo maximus, vel placerat nibh blandit. Phasellus quis ipsum aliquam, fringilla ante sit amet, sagittis magna. In at dignissim eros, id vulputate tellus. Quisque orci urna, pretium in porttitor et, rhoncus in nulla. Aenean viverra ante in velit tincidunt, sit amet tincidunt ante suscipit. In malesuada consectetur molestie.</p><br>\n'
						+ '  <img src="https://www.google.com/images/branding/googlelogo/2x/googlelogo_color_272x92dp.png"><br>\n'
						+ '  <hr><br>\n'
						+ '  <ul>\n'
						+ '   <li>Suspendisse convallis ac metus non efficitur.</li>\n'
						+ '   <li>Donec consectetur eu nisi luctus bibendum.</li>\n'
						+ '   <li>Nam tempor facilisis sem vitae mattis.</li>\n'
						+ '   <li>Fusce feugiat rhoncus eros, id auctor mauris facilisis quis.</li>\n'
						+ '  </ul><br>\n'
						+ '  <div>Etiam maximus, ante vitae porttitor tincidunt, sem erat pharetra turpis, a ornare tortor purus <a href="https://www.google.com">ut justo</a>.</div><br>\n'				 
						+ '  <button type="button">Click Me!</button>\n';
	var body_std_cs		= '  <h1>This is a sample title</h1>\n'
						+ '  <h2>This is a sample subtitle</h2><br>\n'
						+ '  <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Praesent est mi, commodo vitae mauris at, sagittis vehicula sem. Quisque malesuada dui at justo maximus, vel placerat nibh blandit. Phasellus quis ipsum aliquam, fringilla ante sit amet, sagittis magna. In at dignissim eros, id vulputate tellus. Quisque orci urna, pretium in porttitor et, rhoncus in nulla. Aenean viverra ante in velit tincidunt, sit amet tincidunt ante suscipit. In malesuada consectetur molestie.</p><br>\n'
						+ '  <img src="https://www.google.com/images/branding/googlelogo/2x/googlelogo_color_272x92dp.png"><br>\n'
						+ '  <hr><br>\n'
						+ '  <ol>\n'
						+ '   <li>First</li>\n'
						+ '   <li>Second</li>\n'
						+ '   <li>Third</li>\n'
						+ '  </ol>\n'
						+ '  <code>Ut sollicitudin arcu arcu, eget fermentum sem ullamcorper in.\n'
						+ '   Lorem ipsum dolor sit amet, consectetur adipiscing elit.\n'
						+ '   Phasellus nec nisl nunc. Sed sit amet urna arcu.\n'
						+ '   Donec non consequat tortor, id fermentum felis.\n'
						+ '   Quisque elementum hendrerit egestas. In id rhoncus neque, eget mattis neque.\n'
						+ '   Suspendisse varius turpis et dui viverra semper. </code>\n'
						+ '  <hr><br>\n'
						+ '  <h3>This is another title</h3>\n'
						+ '  <form action="demo_form.asp" method="get">\n'
						+ '   First name: <input type="text" name="fname"><br>\n'
						+ '   Last name: <input type="text" name="lname"><br>\n'
						+ '   <input type="submit" value="Submit">\n'
						+ '  </form>\n'
						+ '  <h4>And another title</h4>\n'
						+ '  <table>\n'
						+ '   <tr>\n'
						+ '    <th>Month</th>\n'
						+ '    <th>Savings</th>\n'
						+ '   </tr>\n'
						+ '   <tr>\n'
						+ '    <td>January</td>\n'
						+ '    <td>$100</td>\n'
						+ '   </tr>\n'
						+ '  </table> \n'			 
						+ '  <h5>One more title</h5>\n'
						+ '  <textarea rows="4" cols="50">\n'
						+ '   This text is a sample for the textarea.\n'
						+ '  </textarea>\n'
						+ '  <h6>And this is the last one of the titles</h6>\n'
						+ '  <ul>\n'
						+ '   <li>Suspendisse convallis ac metus non efficitur.</li>\n'
						+ '   <li>Donec consectetur eu nisi luctus bibendum.</li>\n'
						+ '   <li>Nam tempor facilisis sem vitae mattis.</li>\n'
						+ '   <li>Fusce feugiat rhoncus eros, id auctor mauris facilisis quis.</li>\n'
						+ '  </ul><br>\n'
						+ '  <div>Etiam maximus, ante vitae porttitor tincidunt, sem erat pharetra turpis, a ornare tortor purus <a href="https://www.google.com">ut justo</a>.</div><br>\n'				 
						+ '  <button type="button">Click Me!</button>\n'
						+ '  <blockquote cite="https://www.google.com">Nam non diam ante. Curabitur non enim vitae eros luctus porta.</blockquote><br><br>\n';
	var body_temporary 	= '  <!-- COMING SOON -->\n';
});	*/