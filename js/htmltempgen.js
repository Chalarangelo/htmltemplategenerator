$(document).ready(function(){
	$('#output').text('<!DOCTYPE HTML>\n<html>\n');
	$('#output').append(document.createTextNode(' <head>\n'));
	$('#output').append(document.createTextNode('  <meta http-equiv="Content-Type" content="text/html; charset=UTF-8"/>\n'));
	$('#output').append(document.createTextNode('  <link rel="stylesheet" href="style.css"/>\n'));
	$('#output').append(document.createTextNode('  <script type="text/javascript" src="script.js"></script>\n'));
	$('#output').append(document.createTextNode('  <title>HTML5 Sample Page</title>\n'));
	$('#output').append(document.createTextNode(' </head>\n'));
	$('#output').append(document.createTextNode(' <body>\n'));
	$('#output').append(document.createTextNode(' </body>\n'));
	$('#output').append(document.createTextNode('</html>\n'));
});