$(function(){
	var debug = true;
	// Library package object constructor
	var libraryPackage = function libraryPackage (name, version, type, url, requirements){
		this.name = name;
		this.version = version;
		if(type!='mixed'){
			this.html = '    <'+(type=='script'?'script src="':'link rel="stylesheet" href="')+url+(type=='script'?'"></script>':'">');
			this.raw = url;
		}
		if(requirements != null){
			this.requirements = requirements;
		}
		var scripts = 0;
		var csses = 0;
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
		var id = (libList[llC].name+libList[llC].version).replace(/\./g,'-');
		if(llC%3==0) html+='</tr>';
		html+='<td>';
		html+='<input type="checkbox" class="chkbox chkbox-primary" id="'+id+'"'+(id=='jQuery3-1-0'?'checked':'')+'><label for="'+id+'">'+libList[llC].name+' ('+libList[llC].version+')</label>';
		html+='</td>';
		if((llC+1)%3==0) html+='</tr>';
	}
	if(!html.endsWith('</tr>'))html+='</tr>';
	html+='</table></div>';
	$('#lib-loader').html(html);
});