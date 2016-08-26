$(function(){
	var debug = false;	// Debub flag (set to false when releasing)
	var versionName = 'v1.0.1 (Cuttlefish'+((debug)?'::debug_true':'')+')';		// Version name and setup, always use this and update accordingly!
	// Prototype for the templates
	var templateProto = function(){
		this.comments = false;
		this.doctype = '<!DOCTYPE html>';
		this.html = {	start:'<html>', end:'</html>', 	head: {	start:'  <head>', end:'  </head>' }, 	body: {	start:'  <body>', end:'  </body>'}	};
		this.head = {	title: '',
			meta: {	charset: 0, author: '', description: '', keywords: '', gentag: true, viewport: true, favicon: false, oldwarn: false}, 
			lib: ['jQuery-3-1-0'], scripts: '', styles: ''
		};
		this.body = {	classes: '', before: true, userBody: '', templateBase: 'page-template',templateId: 'page-template-min'	};
		this.toText = function(){	return this.doctype+'\n'+this.html.start+'\n'+this.headToText()+this.bodyToText()+this.html.end;	};
		this.headToText = function(){
			var headText = this.html.head.start +'\n';
			headText += (($.trim(this.head.title).length === 0)?'    <title>HTML5 sample page</title>\n':'    <title>'+$.trim(this.head.title)+'</title>\n');
			headText += this.metaToText() + this.librariesToText() + this.resourcesToText() + this.templateHeadToText() + this.html.head.end +'\n';
			return headText;
		}
		this.metaToText = function(){
			var metaText = (this.comments?'    <!-- Metadata -->\n':'');
			metaText += ((this.head.meta.charset == 0)?'    <meta charset="utf-8">':'    <meta charset="iso-8859-1">')+'\n';
			metaText += ((this.head.meta.viewport)?'    <meta name="viewport" content="width=device-width, initial-scale=1'+(((this.head.lib.map(findLibraryPackageFromId).filter(function(e){return e.name == 'Bootstrap';}).length>0) && isLibBoilerplateSelected('Bootstrap-lockscale'))?', maximum-scale=1, user-scalable=no':'')+'">\n':'');
			metaText += (($.trim(this.head.meta.description).length === 0)?'':'    <meta name="description" content="'+$.trim(this.head.meta.description)+'">\n');
			metaText += (($.trim(this.head.meta.keywords).length === 0)?'':'    <meta name="keywords" content="'+$.trim(this.head.meta.keywords)+'">\n');
			metaText += (($.trim(this.head.meta.author).length === 0)?'':'    <meta name="author" content="'+$.trim(this.head.meta.author)+'">\n');
			metaText += ((this.head.meta.gentag)?'    <meta name="generator" content="http://chalarangelo.github.io/htmltemplategenerator/">\n':'');
			metaText += ((this.head.meta.favicon)?'    <link rel="icon" type="image/x-icon" href="./favicon.ico">\n':'');
			metaText += ((this.head.meta.oldwarn)?'    <!--[if lt IE 8]>\n      <p class="browsehappy">You are using an <strong>outdated</strong> browser. Please <a href="http://browsehappy.com/">upgrade your browser</a> to improve your experience.</p>\n    <![endif]-->\n':'');
			return metaText;
		}
		this.librariesToText = function(){
			var libText = (this.comments?'    <!-- Libraries -->\n':'');
			if(this.head.lib.length > 0)
				for(var i = 0, libMap = this.head.lib.map(findLibraryPackageFromId); i <libMap.length; i++){
					libText += libMap[i].html;
					if(libMap[i].boilerplate != null && isLibBoilerplateSelected(libMap[i].name))
						libText += (this.comments?'    <!-- '+libMap[i].name+' boilerplate code -->\n':'')+'    <script type="text/javascript">\n' + libMap[i].boilerplate + '    </script>\n';
					if(libMap[i].name == 'jQuery')
						if(isLibBoilerplateSelected('jQuery-yes'))
							libText += (this.comments?'    <!-- jQuery boilerplate code -->\n':'')+'    <script type="text/javascript">\n' + boilerplates['jQuery'] + '    </script>\n';
						else if(isLibBoilerplateSelected('jQuery-noConflict'))
							libText += (this.comments?'    <!-- jQuery (noConflict) boilerplate code -->\n':'')+'    <script type="text/javascript">\n' + boilerplates['jQuery-noConflict'] + '    </script>\n';
				}
			return libText;
		}
		this.resourcesToText = function(){
			var resText = (this.comments?'    <!-- External resources -->\n':'');
			var resJSLines = this.head.scripts.match(/[^\r\n]+/g);	var resCSSLines = this.head.styles.match(/[^\r\n]+/g);
			if(resJSLines !== null)	for(var i = 0; i <resJSLines.length; i ++)	resText+='    <script type="text/javascript" src="'+resJSLines[i]+'"></script>\n';		
			if(resCSSLines !== null)for(var i = 0; i <resCSSLines.length; i ++)	resText+='    <link rel="stylesheet" href="'+resCSSLines[i]+'">\n';
			return resText;
		}
		this.templateHeadToText = function(){
			var headTemplateText = '';
			switch(this.body.templateBase){
				case 'page-template':
					switch(this.body.templateId.replace('page-template-','')){
						case 'twocol':
							if(!((this.head.lib.map(findLibraryPackageFromId).filter(function(e){return e.name == 'Bootstrap';}).length>0) && isLibBoilerplateSelected('Bootstrap'))){
								headTemplateText += (this.comments?'    <!-- Generated template required styles -->\n':'');
								headTemplateText +='    <style>\n      #left-col{\n        float: left;\n        margin-left: 2.5%;\n        width: 61.5%;\n        text-align: justify;\n      }\n';
								headTemplateText +='      #right-col{\n        float: right;\n        margin-right: 2.5%;\n        width: 31.5%;\n        text-align: justify;\n      }\n    </style>\n';
							}
							break;
					}
					break;
				case 'error-template':
					headTemplateText += (this.comments?'    <!-- Generated template required styles -->\n':'');
					headTemplateText +='    <style>\n      html{\n        display: table;\n        height: 100%;\n        width: 100%;\n        text-align: center;\n      }\n';
					headTemplateText +='      body{\n        display: table-cell;\n        vertical-align: middle;\n      }\n    </style>\n';						
					break;
			}
			return headTemplateText;
		}
		this.bodyToText = function(){
			var bodyText = (($.trim(this.body.classes).length === 0)?(this.html.body.start+'\n'):[this.html.body.start.slice(0, 7), ' classes="'+$.trim(this.body.classes)+'"',this.html.body.start.slice(7)].join('')+'\n');
			bodyText += ((this.body.before)?(this.userBodyToText()+this.templateBodyToText()):(this.templateBodyToText()+this.userBodyToText()));
			bodyText += this.html.body.end + '\n';		
			return bodyText;
		}
		this.userBodyToText = function(){
			var bodyUserText = (this.comments?'    <!-- User-defined body -->\n':'');
			var bodyUserLines = this.body.userBody.match(/[^\r\n]+/g);
			if(bodyUserLines !== null)	for(var i = 0; i <bodyUserLines.length; i ++)	bodyUserText+='    '+bodyUserLines[i]+'\n';
			return bodyUserText;
		}
		this.templateBodyToText = function(){
			var isBootstrapStyled = (this.head.lib.map(findLibraryPackageFromId).filter(function(e){return e.name == 'Bootstrap';}).length>0) && isLibBoilerplateSelected('Bootstrap');
			var bodyTemplateText = '';
			if(this.head.lib.length > 0)
				for(var i = 0, libMap = this.head.lib.map(findLibraryPackageFromId); i <libMap.length; i ++)
					if(libMap[i].boilerplateHTML != null && isLibBoilerplateSelected(libMap[i].name))
						bodyTemplateText += (this.comments?'    <!-- '+libMap[i].name+' HTML boilerplate code -->\n':'')+libMap[i].boilerplateHTML;
			bodyTemplateText += (this.comments?'    <!-- Generated template -->\n':'');
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
							bodyTemplateText += '    </div>\n    <br>\n    <button type="button"'+(isBootstrapStyled?' class="btn btn-primary"':'')+'>Sample button</button>\n';
							break;
						case 'showcase':
							bodyTemplateText += '    <h1>Heading 1</h1>\n    <h2>Heading 2</h2><br>\n';
							bodyTemplateText += '    <p><strong>Paragraph</strong>: Lorem ipsum dolor sit amet, consectetur adipiscing elit. Praesent est mi, commodo vitae mauris at, sagittis vehicula sem. Quisque malesuada dui at justo maximus, vel placerat nibh blandit. Phasellus quis ipsum aliquam, fringilla ante sit amet, sagittis magna. In at dignissim eros, id vulputate tellus. Quisque orci urna, pretium in porttitor et, rhoncus in nulla. Aenean viverra ante in velit tincidunt, sit amet tincidunt ante suscipit. In malesuada consectetur molestie.</p>\n';
							bodyTemplateText += '    <br>\n    <img src="https://www.google.com/images/branding/googlelogo/2x/googlelogo_color_272x92dp.png">\n    <br>\n    <hr>\n    <br>\n';
							bodyTemplateText += '    <ol>\n      <li>List element</li>\n      <li>List element</li>\n      <li>List element</li>\n    </ol>\n';
							bodyTemplateText += '    <code><pre>Ut sollicitudin arcu arcu, eget fermentum sem ullamcorper in.\nLorem ipsum dolor sit amet, consectetur adipiscing elit.\nPhasellus nec nisl nunc. Sed sit amet urna arcu.\nDonec non consequat tortor, id fermentum felis.\nQuisque elementum hendrerit egestas. In id rhoncus neque, eget mattis neque.\nSuspendisse varius turpis et dui viverra semper.</pre></code>\n';
							bodyTemplateText += '    <hr>\n    <br>\n    <h3>Heading 3</h3>\n    <form method="post" action="demo_form.php">\n      First name: <input type="text" name="demo_form_name"'+(isBootstrapStyled?' class="form-control"':'')+'><br>\n      Last name: <input type="text" name="demo_form_surname"'+(isBootstrapStyled?' class="form-control"':'')+'><br>\n      <input type="submit" value="Submit form"'+(isBootstrapStyled?' class="btn btn-default"':'')+'>\n    </form>\n';
							bodyTemplateText += '    <h4>Heading 4</h4>\n    <table'+(isBootstrapStyled?' class="table"':'')+'>\n      <tr>\n        <th>Month</th>\n        <th>Savings</th>\n      </tr>\n';
							bodyTemplateText += '      <tr>\n        <td>January</td>\n        <td>$100</td>\n      </tr>\n    </table>\n';
							bodyTemplateText += '    <h5>Heading 5</h5>\n    <textarea rows="4" cols="16">This is a textarea.</textarea>\n    <h6>Heading 6</h6>\n';
							bodyTemplateText += '    <ul>\n      <li>Suspendisse convallis ac metus non efficitur.</li>\n      <li>Donec consectetur eu nisi luctus bibendum.</li>\n';
							bodyTemplateText += '      <li>Nam tempor facilisis sem vitae mattis.</li>\n      <li>Fusce feugiat rhoncus eros, id auctor mauris facilisis quis.</li>\n    </ul>\n    <br>\n';
							bodyTemplateText += '    <div>Etiam maximus, ante vitae porttitor tincidunt, sem erat pharetra turpis, a ornare tortor purus <a href="https://www.google.com">ut justo</a>.\n';
							bodyTemplateText += '    </div>\n    <br>\n    <button type="button"'+(isBootstrapStyled?' class="btn btn-primary"':'')+'>Sample button</button>\n';
							bodyTemplateText += '    <blockquote cite="https://www.google.com">Nam non diam ante. Curabitur non enim vitae eros luctus porta.</blockquote>\n';
							break;
						case 'twocol':
							bodyTemplateText += '    <div id="left-col"'+(isBootstrapStyled?' class="col-xs-12 col-md-7"':'')+'>\n';
							bodyTemplateText += '      <h1>'+(($.trim(this.head.title).length === 0)?'HTML5 sample page':$.trim(this.head.title))+'</h1>\n';
							bodyTemplateText += '      <p><strong>This is the main content</strong>: Lorem ipsum dolor sit amet, consectetur adipiscing elit. Praesent est mi, commodo vitae mauris at, sagittis vehicula sem. Quisque malesuada dui at justo maximus, vel placerat nibh blandit. Phasellus quis ipsum aliquam, fringilla ante sit amet, sagittis magna. In at dignissim eros, id vulputate tellus. Quisque orci urna, pretium in porttitor et, rhoncus in nulla. Aenean viverra ante in velit tincidunt, sit amet tincidunt ante suscipit. In malesuada consectetur molestie.</p>\n';
							bodyTemplateText += '    </div>\n';
							bodyTemplateText += '    <div id="right-col"'+(isBootstrapStyled?' class="col-xs-12 col-md-5"':'')+'>\n';
							bodyTemplateText += '      <h2>Side column</h2>\n';
							bodyTemplateText += '      <p><em>This is the side content</em>: In ut odio eu dui euismod faucibus sed vel justo. Donec dapibus mi purus, vitae venenatis quam elementum at. Aliquam erat volutpat. Quisque id egestas est. Ut sapien mi, viverra in justo sed, finibus lobortis ligula. Nunc ex nibh, ultrices eget fermentum nec, varius ac arcu.</p>\n';
							bodyTemplateText += '    </div>\n';
							break;
					}
					break;
				case 'form-template':
					bodyTemplateText += '    <form autocomplete="off">\n';
					switch(this.body.templateId.replace('form-template-','')){
						case 'empty':
							break;
						case 'login':
							bodyTemplateText += (isBootstrapStyled?'      <div class="form-group">\n':'');
							bodyTemplateText += (isBootstrapStyled?'  ':'')+'      <label for="login-username">Username</label>\n';
							bodyTemplateText += (isBootstrapStyled?'  ':'')+'      <input type="text"'+(isBootstrapStyled?' class="form-control"':'')+' id="login-username" placeholder="username">\n';
							bodyTemplateText += (isBootstrapStyled?'      </div>\n      <div class="form-group">\n':'');
							bodyTemplateText += (isBootstrapStyled?'  ':'')+'      <label for="login-password">Password</label>\n';
							bodyTemplateText += (isBootstrapStyled?'  ':'')+'      <input type="password"'+(isBootstrapStyled?' class="form-control"':'')+' id="login-password" placeholder="password">\n';
							bodyTemplateText += (isBootstrapStyled?'      </div>\n':'')+'      <input type="submit" value="Log in"'+(isBootstrapStyled?' class="btn btn-default"':'')+'>\n';
							break;
						case 'register':
							bodyTemplateText += (isBootstrapStyled?'      <div class="form-group">\n':'');
							bodyTemplateText += (isBootstrapStyled?'  ':'')+'      <label for="register-email">Email</label>\n';
							bodyTemplateText += (isBootstrapStyled?'  ':'')+'      <input type="email"'+(isBootstrapStyled?' class="form-control"':'')+' id="register-email" placeholder="email">\n';
							bodyTemplateText += (isBootstrapStyled?'      </div>\n      <div class="form-group">\n':'');
							bodyTemplateText += (isBootstrapStyled?'  ':'')+'      <label for="register-username">Username</label>\n';
							bodyTemplateText += (isBootstrapStyled?'  ':'')+'      <input type="text"'+(isBootstrapStyled?' class="form-control"':'')+' id="register-username" placeholder="username">\n';
							bodyTemplateText += (isBootstrapStyled?'      </div>\n      <div class="form-group">\n':'');
							bodyTemplateText += (isBootstrapStyled?'  ':'')+'      <label for="register-password">Password</label>\n';
							bodyTemplateText += (isBootstrapStyled?'  ':'')+'      <input type="password"'+(isBootstrapStyled?' class="form-control"':'')+' id="register-password" placeholder="password">\n';
							bodyTemplateText += (isBootstrapStyled?'      </div>\n      <div class="form-group">\n':'');
							bodyTemplateText += (isBootstrapStyled?'  ':'')+'      <label for="register-password-confirm">Confirm password</label>\n';
							bodyTemplateText += (isBootstrapStyled?'  ':'')+'      <input type="password"'+(isBootstrapStyled?' class="form-control"':'')+' id="register-password-confirm" placeholder="password">\n';
							bodyTemplateText += (isBootstrapStyled?'      </div>\n':'')+'      <input type="submit" value="Register"'+(isBootstrapStyled?' class="btn btn-default"':'')+'>\n';
							break;
						case 'payment':
							bodyTemplateText += (isBootstrapStyled?'      <div class="form-group">\n':'');
							bodyTemplateText += (isBootstrapStyled?'  ':'')+'      <label for="payment-name">First and last name</label>\n';
							bodyTemplateText += (isBootstrapStyled?'  ':'')+'      <input type="text"'+(isBootstrapStyled?' class="form-control"':'')+' id="payment-name" placeholder="First and last name">\n';
							bodyTemplateText += (isBootstrapStyled?'      </div>\n      <div class="form-group">\n':'');
							bodyTemplateText += (isBootstrapStyled?'  ':'')+'      <label for="payment-email">Email</label>\n';
							bodyTemplateText += (isBootstrapStyled?'  ':'')+'      <input type="email"'+(isBootstrapStyled?' class="form-control"':'')+' id="payment-email" placeholder="email">\n';
							bodyTemplateText += (isBootstrapStyled?'      </div>\n      <div class="form-group">\n':'');
							bodyTemplateText += (isBootstrapStyled?'  ':'')+'      <label for="payment-phone">Telephone</label>\n';
							bodyTemplateText += (isBootstrapStyled?'  ':'')+'      <input type="tel"'+(isBootstrapStyled?' class="form-control"':'')+' id="payment-phone" placeholder="telephone">\n';
							bodyTemplateText += (isBootstrapStyled?'      </div>\n      <div class="form-group">\n':'');
							bodyTemplateText += (isBootstrapStyled?'  ':'')+'      <label for="payment-method">Payment method</label>\n';
							bodyTemplateText += (isBootstrapStyled?'  ':'')+'      <select'+(isBootstrapStyled?' class="form-control"':'')+' id="payment-method">\n';
							bodyTemplateText += (isBootstrapStyled?'  ':'')+'        <option selected>Paypal</option>\n';
							bodyTemplateText += (isBootstrapStyled?'  ':'')+'        <option>Credit Card</option>\n';
							bodyTemplateText += (isBootstrapStyled?'  ':'')+'      </select>\n';
							bodyTemplateText += (isBootstrapStyled?'      </div>\n':'')+'      <input type="submit" value="Submit"'+(isBootstrapStyled?' class="btn btn-default"':'')+'>\n';
							break;
					}
					bodyTemplateText += '    </form>\n';
					break;
				case 'error-template':
					switch(this.body.templateId.replace('error-template-','')){
						case '400':
							bodyTemplateText +='    <h1>400: Bad request</h1>\n    <p>Sorry, but the page your were trying to view cannot be found.</p>\n';
							break;
						case '401':
							bodyTemplateText +='    <h1>401: Authorization required</h1>\n    <p>Sorry, but we could not verify that you are authorized to access the document requested.</p>\n';
							break;
						case '403':
							bodyTemplateText +='    <h1>Error 403: Forbidden</h1>\n    <p>Sorry, but you do not have permission to access the specified resource.</p>\n';
							break;
						case '404':
							bodyTemplateText +='    <h1>Error 404: Page not found</h1>\n    <p>Sorry, but the page you were trying to view does not exist.</p>\n';
							break;
						case '408':
							bodyTemplateText +='    <h1>Error 408: Request timed out</h1>\n    <p>Sorry, but your requested page took too long to load.</p>\n';
							break;
						case '410':
							bodyTemplateText +='    <h1>Error 410: Page gone</h1>\n    <p>Sorry, but the page you requested is no longer available.</p>\n';
							break;
						case '500':
							bodyTemplateText +='    <h1>Error 500: Internal server error</h1>\n    <p>Sorry, but the server has encountered an error while processing your request.</p>\n';
							break;
						case '502':
							bodyTemplateText +='    <h1>Error 502: Bad gateway</h1>\n    <p>Sorry, but the web server received an invalid response while contacting the content server.</p>\n';
							break;
						case '503':
							bodyTemplateText +='    <h1>Error 503: Service temporarily unavailable</h1>\n    <p>Sorry, but the server is temporarily unavailable (this might be due to scheduled maintenance).</p>\n';
							break;
						case '504':
							bodyTemplateText +='    <h1>Error 504: Gateway timed out</h1>\n    <p>Sorry, but the server took too long to respond to your request.</p>\n';
							break;
					}
					break;
			}
			return bodyTemplateText;
		}
		this.toFiddle = function(){
			var $fiddleForm = $('<form class="hidden" target="_blank"></form>');	$fiddleForm.attr('method', 'post');
			$fiddleForm.attr('action', ((this.head.lib.indexOf('jQuery-3-1-0')>=0)?'http://jsfiddle.net/api/post/jquery/3.1.0/':((this.head.lib.indexOf('jQuery-2-2-4')>=0)?'http://jsfiddle.net/api/post/jquery/2.2.4/':'http://jsfiddle.net/api/post/library/pure/')));
			var $fiddleTitle = $('<textarea></textarea>');	$fiddleTitle.attr('name', 'title');
		    $fiddleTitle.text((($.trim(this.head.title).length === 0)?'HTML5 sample page':$.trim(this.head.title)));
		    $fiddleForm.append($fiddleTitle);
		    var $fiddleDesc = $('<textarea></textarea>');	$fiddleDesc.attr('name', 'description');
		    $fiddleDesc.text((($.trim(this.head.meta.description).length === 0)?'Template page generated by https://chalarangelo.github.io/htmltemplategenerator':$.trim(this.head.meta.description)));
		    $fiddleForm.append($fiddleDesc);
		    var $fiddleDTD = $('<textarea></textarea>');	$fiddleDTD.attr('name', 'dtd');
		    $fiddleDTD.text('html 5');
		    $fiddleForm.append($fiddleDTD);
			var $fiddleHTML = $('<textarea></textarea>');	$fiddleHTML.attr('name', 'html');
    		var fiddleBody = this.bodyToText();
    		$fiddleHTML.text(fiddleBody.substring(fiddleBody.indexOf(">") + 1, fiddleBody.lastIndexOf("</")).replace(/    <!--(.*?)-->\n/g,''));
    		$fiddleForm.append($fiddleHTML);
    		var $fiddleJS = $('<textarea></textarea>');	$fiddleJS.attr('name', 'js');
    		var fiddleScript = '';
    		if(this.head.lib.length > 0)
				for(var i = 0, libMap = this.head.lib.map(findLibraryPackageFromId); i <libMap.length; i++){
					if(libMap[i].boilerplate != null && isLibBoilerplateSelected(libMap[i].name))	fiddleScript += libMap[i].boilerplate;
					if(libMap[i].name == 'jQuery')
						if(isLibBoilerplateSelected('jQuery-yes'))	fiddleScript +=boilerplates['jQuery'];
						else if(isLibBoilerplateSelected('jQuery-noConflict'))	fiddleScript +=boilerplates['jQuery-noConflict'];
				}
    		$fiddleJS.text(fiddleScript);
    		$fiddleForm.append($fiddleJS);
    		var $fiddleCSS = $('<textarea></textarea>');	$fiddleCSS.attr('name', 'css');
    		var fiddleStyle = this.templateHeadToText();
    		$fiddleCSS.text(fiddleStyle.replace(/    <!--(.*?)-->\n/g,'').replace(/    <style>\n/g,'').replace(/    <\/style>\n/g,''));
    		$fiddleForm.append($fiddleCSS);
    		var $fiddleRes = $('<textarea></textarea>');	$fiddleRes.attr('name', 'resources');
    		var fiddleExt = '';
    		if(this.head.lib.length > 0)
				for(var i = 0, libMap = this.head.lib.map(findLibraryPackageFromId); i <libMap.length; i++)
					if(libMap[i].name!='jQuery')		fiddleExt += libMap[i].raw+',';
			var resJSLines = this.head.scripts.match(/[^\r\n]+/g);	var resCSSLines = this.head.styles.match(/[^\r\n]+/g);
			if(resJSLines !== null)	
				for(var i = 0; i <resJSLines.length; i ++)	if(resJSLines[i].startsWith('http:') || resJSLines[i].startsWith('https:'))
					fiddleExt+=resJSLines[i].replace('http:','https:')+',';	
			if(resCSSLines !== null)
				for(var i = 0; i <resCSSLines.length; i ++)	if(resCSSLines[i].startsWith('http:') || resCSSLines[i].startsWith('https:'))
					fiddleExt+=resCSSLines[i].replace('http:','https:')+',';	
			if (fiddleExt.charAt(fiddleExt.length - 1) == ',') 	fiddleExt = fiddleExt.substr(0, fiddleExt.length - 1);
    		$fiddleRes.text(fiddleExt);	
    		$fiddleForm.append($fiddleRes);
			return $fiddleForm;
		}
		this.toCodepen = function(){
			var $codepenForm = $('<form class="hidden" target="_blank"></form>');	$codepenForm.attr('method', 'post');
			$codepenForm.attr('action','http://codepen.io/pen/define');
			var $codepenInput = $('<input>');	$codepenInput.attr('name','data');
			var codepenExt = {js: '', css: ''};
			if(this.head.lib.length > 0)
				for(var i = 0, libMap = this.head.lib.map(findLibraryPackageFromId); i <libMap.length; i++)
					if(libMap[i].type == 'script')	codepenExt.js += libMap[i].raw+';';
					else if (libMap[i].type == 'style')	codepenExt.css += libMap[i].raw+';';
					else for(var cC = 0, links = libMap[i].raw.split(','); cC< links.length; cC++)
						if(links[cC].endsWith('.js'))	codepenExt.js += links[cC]+';';
						else	codepenExt.css += links[cC]+';';
			var resJSLines = this.head.scripts.match(/[^\r\n]+/g);	var resCSSLines = this.head.styles.match(/[^\r\n]+/g);
			if(resJSLines !== null)	
				for(var i = 0; i <resJSLines.length; i ++)	if(resJSLines[i].startsWith('http:') || resJSLines[i].startsWith('https:'))
					codepenExt.js+=resJSLines[i].replace('http:','https:')+'j';	
			if(resCSSLines !== null)
				for(var i = 0; i <resCSSLines.length; i ++)	if(resCSSLines[i].startsWith('http:') || resCSSLines[i].startsWith('https:'))
					codepenExt.css+=resCSSLines[i].replace('http:','https:')+';';
			if (codepenExt.js.charAt(codepenExt.js.length - 1) == ',') 	codepenExt.js = codepenExt.js.substr(0, codepenExt.js.length - 1);
			if (codepenExt.css.charAt(codepenExt.css.length - 1) == ',') 	codepenExt.css = codepenExt.css.substr(0, codepenExt.css.length - 1);	
			var codepenScript = '';
    		if(this.head.lib.length > 0)
				for(var i = 0, libMap = this.head.lib.map(findLibraryPackageFromId); i <libMap.length; i++){
					if(libMap[i].boilerplate != null && isLibBoilerplateSelected(libMap[i].name))	codepenScript += libMap[i].boilerplate;
					if(libMap[i].name == 'jQuery')
						if(isLibBoilerplateSelected('jQuery-yes'))	codepenScript +=boilerplates['jQuery'];
						else if(isLibBoilerplateSelected('jQuery-noConflict'))	codepenScript +=boilerplates['jQuery-noConflict'];
				}
			var codepenHead = (($.trim(this.head.title).length === 0)?'<title>HTML5 sample page</title>\n':'<title>'+$.trim(this.head.title)+'</title>\n');
			codepenHead += this.metaToText().replace(/    <!--(.*?)-->\n/g,'');
			var codepenData = {
				title: (($.trim(this.head.title).length === 0)?'HTML5 sample page':$.trim(this.head.title)), 
				description: (($.trim(this.head.meta.description).length === 0)?'Template page generated by https://chalarangelo.github.io/htmltemplategenerator':$.trim(this.head.meta.description)), 
				html: this.bodyToText().substring(this.bodyToText().indexOf(">") + 1, this.bodyToText().lastIndexOf("</")).replace(/    <!--(.*?)-->\n/g,''), 
				html_classes: this.body.classes,
				css: this.templateHeadToText().replace(/    <!--(.*?)-->\n/g,'').replace(/    <style>\n/g,'').replace(/    <\/style>\n/g,''), 
				js: codepenScript, 	head: codepenHead, 	css_external: codepenExt.css, 	js_external: codepenExt.js
			};
			$codepenInput.attr('value',JSON.stringify(codepenData));	$codepenForm.append($codepenInput);
			return $codepenForm;
		}
	};	
	var result = new templateProto();	// Create the templateGen for use in the rest of the application
	$('.versionNumbering').text(versionName);	
	$(document).on('click','h1', function(){$('#content-tab').click();});	// Title click, change tab to content
	// Library package object constructor
	var libraryPackage = function (name, version, type, url, requirements, boilerplate, boilerplateHTML){
		this.name = name;	this.version = version;
		if(type!='mixed'){
			this.html = '    <'+(type=='script'?'script type="text/javascript" src="':'link rel="stylesheet" href="')+url+(type=='script'?'"></script>\n':'">\n');
			this.raw = url;
		}
		this.requirements = requirements;	this.boilerplate = boilerplate;		this.boilerplateHTML = boilerplateHTML;
		var scripts = 0;	var csses = 0;
		this.addScript = function(url){
			if(scripts == 0 && csses == 0) {this.raw = ''; this.html= '';}
			this.raw+=((csses != 0 || scripts != 0)?',':'')+url;	this.html+='    <script type="text/javascript" src="'+url+'"></script>\n';
			scripts+=1;		return this;
		};
		this.addCSS = function(url){
			if(scripts == 0 && csses == 0) {this.raw = ''; this.html= '';}
			this.raw+=((csses != 0 || scripts != 0)?',':'')+url;	this.html+='    <link rel="stylesheet" href="'+url+'">\n';
			csses+=1;		return this;
		};
	}	
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
	var libList = [];	if(debug)	console.log('Loading libraries...');
	libList.push(new libraryPackage('jQuery','2.2.4','script','https://ajax.googleapis.com/ajax/libs/jquery/2.2.4/jquery.min.js',null, null, null));
	libList.push(new libraryPackage('jQuery','3.1.0','script','https://ajax.googleapis.com/ajax/libs/jquery/3.1.0/jquery.min.js',null, null, null));
	libList.push(new libraryPackage('AngularJS','1.5.7','script','https://ajax.googleapis.com/ajax/libs/angularjs/1.5.7/angular.min.js',null, boilerplates['AngularJS'], boilerplates.html['AngularJS'])); 
	libList.push(new libraryPackage('Bootstrap','3.3.7','mixed', null, ['jQuery-2-2-4'], null, null)
		.addCSS('https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/css/bootstrap.min.css')
		.addScript('https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/js/bootstrap.min.js')	);
	libList.push(new libraryPackage('Bootstrap','3.3.6','mixed', null,['jQuery-2-2-4'], null, null)
		.addCSS('https://maxcdn.bootstrapcdn.com/bootstrap/3.3.6/css/bootstrap.min.css')
		.addScript('https://maxcdn.bootstrapcdn.com/bootstrap/3.3.6/js/bootstrap.min.js')	);
	libList.push(new libraryPackage('Font Awesome','4.6.3','css','https://maxcdn.bootstrapcdn.com/font-awesome/4.6.3/css/font-awesome.min.css',null, null, null));
	libList.push(new libraryPackage('normalize.css','4.2.0','css','https://cdnjs.cloudflare.com/ajax/libs/normalize/4.2.0/normalize.min.css',null, null, null));
	libList.push(new libraryPackage('MooTools','1.6.0','script','https://ajax.googleapis.com/ajax/libs/mootools/1.6.0/mootools.min.js',null, boilerplates['MooTools'], null));
	libList.push(new libraryPackage('Dojo','1.10.4','script','https://ajax.googleapis.com/ajax/libs/dojo/1.10.4/dojo/dojo.js',null, boilerplates['Dojo'], null)); 
	libList.push(new libraryPackage('Prototype','1.7.3.0','script','https://ajax.googleapis.com/ajax/libs/prototype/1.7.3.0/prototype.js',null, null, null));	
	libList.push(new libraryPackage('Pure.CSS','0.6.0','css','http://yui.yahooapis.com/pure/0.6.0/pure-min.css',null, null, null));
	libList.push(new libraryPackage('three.js','1.6.0','script','https://ajax.googleapis.com/ajax/libs/threejs/r76/three.min.js',null, null, null));
	libList.push(new libraryPackage('Bootstrap-Extend','1.1','mixed', null,['Bootstrap-3-3-6','jQuery-2-2-4'], null, null)
		.addCSS('https://cdn.rawgit.com/Chalarangelo/bootstrap-extend/880420ae663f7c539971ded33411cdecffcc2134/css/bootstrap-extend.min.css')
		.addScript('https://cdn.rawgit.com/Chalarangelo/bootstrap-extend/880420ae663f7c539971ded33411cdecffcc2134/js/bootstrap-extend.min.js')	);
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
	if(debug)	console.log('Checking if retuning user...');
	var storedData = JSON.parse(localStorage.getItem("HTML5TemplateGenerator")); 
	if(storedData == null)
	{
		if(debug)	console.log('New user spotted');
		$('#newUserModal').modal();
		$('#newUserModal').on('hidden.bs.modal', function () {
			storedData = {	version: versionName	};
			localStorage.setItem("HTML5TemplateGenerator",JSON.stringify(storedData)); 
			if(debug)	console.log('New user registered as returning user');
		});
	}
	else if(debug)	console.log('Returning user identified');
	$('#lib-loader-customizers').html(html2);
	// Library and package searchers
	var findLibraryPackageFromId = function(id){
		for(var llS=0; llS<libList.length; llS++)	if((libList[llS].name+'-'+libList[llS].version).replace(/\./g,'-') == id)	return libList[llS];
		return null;
	}
	var findIdFromLibraryPackage = function(package){	return (package.name+'-'+package.version).replace(/\./g,'-');	}	
	var isLibBoilerplateSelected = function(name){	return ($('#boilerplate-'+name+':checked').length > 0);	}
	// Navigation events
	$(document).on('click','.nav-tabs li', function(){
		if($(this).attr('id')=='reset-li') return;
		$('.nav-tabs li').removeClass('active');	$(this).addClass('active');
		$('.activeRow').removeClass('activeRow').addClass('hidden');
		$('#'+$(this).attr('id').substr(0, $(this).attr('id').indexOf('-'))).removeClass('hidden').addClass('activeRow');
		if($(this).attr('id')=='result-tab') editor.setValue(result.toText(), -1); 	
	});
	$(document).on('click','#reset-confirm', function(){	location.reload();	});
	// Content tab events
	$('#content-title').change(function(){	result.head.title = $('#content-title').val();	});
	$('#content-classes').change(function(){	result.body.classes = $('#content-classes').val();	});
	$('#content-body').change(function(){	
		result.body.userBody = $('#content-body').val();
		var tester = $('#content-body').val().toLowerCase();
		if(tester.indexOf('<acronym>')>=0 || tester.indexOf('<applet>')>=0  || tester.indexOf('<basefont>')>=0  || tester.indexOf('<big>')>=0  || tester.indexOf('<center>')>=0 || tester.indexOf('<dir>')>=0 || tester.indexOf('<font>')>=0 || tester.indexOf('<frame>')>=0 || tester.indexOf('<frameset>')>=0 || tester.indexOf('<noframes>')>=0 || tester.indexOf('<strike>')>=0 || tester.indexOf('<tt>')>=0)
			$('#content-body-alert').removeClass('hidden');
		else	$('#content-body-alert').addClass('hidden');
	});
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
		result.head.lib = [];	var llreqText = '';
		$('#lib-loader input:checkbox:checked').each(function(index, element){result.head.lib.push($(this).attr('id'));});
		if($('#boilerplate-form-' + library.name).length > 0) 	$('#boilerplate-form-' + library.name).toggleClass('hidden');
		for(var lmC = 0, libMap = result.head.lib.map(findLibraryPackageFromId); lmC < libMap.length; lmC++){
			if(libMap[lmC].requirements != null)
				for(var rpC = 0, reqMap = libMap[lmC].requirements.map(findLibraryPackageFromId); rpC < reqMap.length; rpC++)
					if(!libMap.filter(function(e) { return ((e.name == reqMap[rpC].name) && (e.version >= reqMap[rpC].version)); }).length > 0){
						result.head.lib.unshift(findIdFromLibraryPackage(reqMap[rpC]));
						llreqText+= libMap[lmC].name+' ('+libMap[lmC].version+') requires '+reqMap[rpC].name +' ('+reqMap[rpC].version+') or newer to work properly.\n';
					}
			if(llreqText!=''){
				llreqText += '<strong>Required packages will be loaded automatically.</strong>'
				$('#lib-loader-reqs').html(llreqText);	$('#lib-loader-reqs-alert').removeClass('hidden');
			}
			else	$('#lib-loader-reqs-alert').addClass('hidden');
		}		
		// Duct tape fixes for jQuery and Bootstrap boilerplates (and everything else that supports more than one version)
		if($('#jQuery-3-1-0').prop('checked') || $('#jQuery-2-2-4').prop('checked')) $('#boilerplate-form-jQuery').removeClass('hidden');
		else $('#boilerplate-form-jQuery').addClass('hidden');
		if($('#Bootstrap-3-3-7').prop('checked') || $('#Bootstrap-3-3-6').prop('checked')) $('#boilerplate-form-Bootstrap').removeClass('hidden');
		else $('#boilerplate-form-Bootstrap').addClass('hidden');
	});
	$('#boilerplate-Bootstrap-lockscale').change(function(){	$('#boilerplate-Bootstrap-lockscale-alert').toggleClass('hidden');	});
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
	$('#res-js').change(function(){	
		result.head.scripts = $('#res-js').val();	
		var tester = $('#res-js').val().toLowerCase();
		if(tester.indexOf(',')>=0 || tester.indexOf(' ')>=0)	$('#res-js-alert').removeClass('hidden');
		else	$('#res-js-alert').addClass('hidden');
	});
	$('#res-css').change(function(){
		result.head.styles = $('#res-css').val();	
		var tester = $('#res-css').val().toLowerCase();
		if(tester.indexOf(',')>=0 || tester.indexOf(' ')>=0)	$('#res-css-alert').removeClass('hidden');
		else	$('#res-css-alert').addClass('hidden');
	});
	// Results tab events
	$('#clipboard').on('click',function(){
		var $temp = $('<textarea>');			$('body').append($temp);	$temp.val(editor.getValue()).select();	
		document.execCommand("copy");	$temp.remove();
	});
	$('#fiddle').on('click',function(){
		var $temp = result.toFiddle();	$(document.body).append($temp);	$temp.submit();	$temp.remove();
	});
	$('#codepen').on('click',function(){
		var $temp = result.toCodepen();	$(document.body).append($temp);	$temp.submit();	$temp.remove();
	});
});