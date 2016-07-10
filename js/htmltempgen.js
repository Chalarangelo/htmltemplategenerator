$(document).ready(function(){
	$('h3').click(function(){location.reload();});	// Reload page when title is clicked.
	// Look at the end of this function for the html template variables.
	var $output = $('#output');
	// Original menu click event.
	$('.startgroup-option').click(function(){
		var id = $(this).attr('id');
		var templateText;
		if(id=='std'){			// Generate Standard template page without any content.
			templateText 	= htmlBegin
							+ ($('#jquery-startgroup').is(":checked")?'  <script src="https://ajax.googleapis.com/ajax/libs/jquery/2.2.4/jquery.min.js"></script>\n':'')
							+ ($('#angularjs-startgroup').is(":checked")?'  <script src="https://ajax.googleapis.com/ajax/libs/angularjs/1.5.7/angular.min.js"></script>\n':'')
							+ ($('#dojo-startgroup').is(":checked")?'  <script src="https://ajax.googleapis.com/ajax/libs/dojo/1.10.4/dojo/dojo.js"></script>\n':'')
							+ ($('#prototype-startgroup').is(":checked")?'  <script src="https://ajax.googleapis.com/ajax/libs/prototype/1.7.3.0/prototype.js"></script>\n':'')
							+ (($('#bootstrap-startgroup').is(":checked") && $('#jquery-startgroup').is(":checked")) ?'  <link rel="stylesheet" href="http://maxcdn.bootstrapcdn.com/bootstrap/3.3.6/css/bootstrap.min.css">\n  <script src="http://maxcdn.bootstrapcdn.com/bootstrap/3.3.6/js/bootstrap.min.js"></script>\n':'')
							+ (($('#bootstrap-startgroup').is(":checked") && !($('#jquery-startgroup').is(":checked"))) ?'  <link rel="stylesheet" href="http://maxcdn.bootstrapcdn.com/bootstrap/3.3.6/css/bootstrap.min.css">\n  <script src="https://ajax.googleapis.com/ajax/libs/jquery/1.12.4/jquery.min.js"></script>\n  <script src="http://maxcdn.bootstrapcdn.com/bootstrap/3.3.6/js/bootstrap.min.js"></script>\n':'')
							+ ($('#font-awesome-startgroup').is(":checked")?'  <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/font-awesome/4.6.3/css/font-awesome.min.css">\n':'')
							+ headStartgroup
							+ genSignature
							+ headToBody
							+ htmlEnd;
			$output.text(templateText);
			$('#output-wrapper').toggleClass('hidden');
		}
		else if(id=='std-c'){	// Generate Standard template page with sample content.
			templateText 	= htmlBegin
							+ ($('#jquery-startgroup').is(":checked")?'  <script src="https://ajax.googleapis.com/ajax/libs/jquery/2.2.4/jquery.min.js"></script>\n':'')
							+ ($('#angularjs-startgroup').is(":checked")?'  <script src="https://ajax.googleapis.com/ajax/libs/angularjs/1.5.7/angular.min.js"></script>\n':'')
							+ ($('#dojo-startgroup').is(":checked")?'  <script src="https://ajax.googleapis.com/ajax/libs/dojo/1.10.4/dojo/dojo.js"></script>\n':'')
							+ ($('#prototype-startgroup').is(":checked")?'  <script src="https://ajax.googleapis.com/ajax/libs/prototype/1.7.3.0/prototype.js"></script>\n':'')
							+ (($('#bootstrap-startgroup').is(":checked") && $('#jquery-startgroup').is(":checked")) ?'  <link rel="stylesheet" href="http://maxcdn.bootstrapcdn.com/bootstrap/3.3.6/css/bootstrap.min.css">\n  <script src="http://maxcdn.bootstrapcdn.com/bootstrap/3.3.6/js/bootstrap.min.js"></script>\n':'')
							+ (($('#bootstrap-startgroup').is(":checked") && !($('#jquery-startgroup').is(":checked"))) ?'  <link rel="stylesheet" href="http://maxcdn.bootstrapcdn.com/bootstrap/3.3.6/css/bootstrap.min.css">\n  <script src="https://ajax.googleapis.com/ajax/libs/jquery/1.12.4/jquery.min.js"></script>\n  <script src="http://maxcdn.bootstrapcdn.com/bootstrap/3.3.6/js/bootstrap.min.js"></script>\n':'')
							+ ($('#font-awesome-startgroup').is(":checked")?'  <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/font-awesome/4.6.3/css/font-awesome.min.css">\n':'')
							+ headStartgroup
							+ genSignature
							+ headToBody
							+ body_std_c
							+ htmlEnd;
			$output.text(templateText);
			$('#output-wrapper').toggleClass('hidden');
		}
		else if(id=='std-cs'){	// Generate Standard template page with full content showcase.
			templateText 	= htmlBegin
							+ ($('#jquery-startgroup').is(":checked")?'  <script src="https://ajax.googleapis.com/ajax/libs/jquery/2.2.4/jquery.min.js"></script>\n':'')
							+ ($('#angularjs-startgroup').is(":checked")?'  <script src="https://ajax.googleapis.com/ajax/libs/angularjs/1.5.7/angular.min.js"></script>\n':'')
							+ ($('#dojo-startgroup').is(":checked")?'  <script src="https://ajax.googleapis.com/ajax/libs/dojo/1.10.4/dojo/dojo.js"></script>\n':'')
							+ ($('#prototype-startgroup').is(":checked")?'  <script src="https://ajax.googleapis.com/ajax/libs/prototype/1.7.3.0/prototype.js"></script>\n':'')
							+ (($('#bootstrap-startgroup').is(":checked") && $('#jquery-startgroup').is(":checked")) ?'  <link rel="stylesheet" href="http://maxcdn.bootstrapcdn.com/bootstrap/3.3.6/css/bootstrap.min.css">\n  <script src="http://maxcdn.bootstrapcdn.com/bootstrap/3.3.6/js/bootstrap.min.js"></script>\n':'')
							+ (($('#bootstrap-startgroup').is(":checked") && !($('#jquery-startgroup').is(":checked"))) ?'  <link rel="stylesheet" href="http://maxcdn.bootstrapcdn.com/bootstrap/3.3.6/css/bootstrap.min.css">\n  <script src="https://ajax.googleapis.com/ajax/libs/jquery/1.12.4/jquery.min.js"></script>\n  <script src="http://maxcdn.bootstrapcdn.com/bootstrap/3.3.6/js/bootstrap.min.js"></script>\n':'')
							+ ($('#font-awesome-startgroup').is(":checked")?'  <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/font-awesome/4.6.3/css/font-awesome.min.css">\n':'')
							+ headStartgroup
							+ genSignature
							+ headToBody
							+ body_std_cs
							+ htmlEnd;
			$output.text(templateText);
			$('#output-wrapper').toggleClass('hidden');
		}
		else if(id=='pre-built'){	// Show next menu for pre-built templates.
			templateText 	= htmlBegin
							+ headStartgroup
							+ genSignature
							+ headToBody
							+ body_temporary
							+ htmlEnd;	
			$output.text(templateText);
			$('#output-wrapper').toggleClass('hidden');		
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
	$(document).on('click', '#custom-gen', function() {
		templateText 	= htmlBegin
						+ headStartgroup
						+ genSignature
						+ headToBody
						+ body_temporary
						+ htmlEnd;	
		$output.text(templateText);
		$('#output-wrapper').toggleClass('hidden');	
	});
	// Close the output wrapper, reload the page.
	$('.fa-times').click(function(){
		location.reload();
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
	// Template variables
	var htmlBegin 		= '<!DOCTYPE HTML>\n<html>\n <head>\n  <meta charset="utf-8"/>\n';
	var htmlEnd   		= ' </body>\n</html>\n';
	var headStartgroup	= '  <script type="text/javascript" src="js/script.js"></script>\n  <link rel="stylesheet" href="css/stylesheet.css"/>\n  <title>HTML5 Sample Page</title>\n';
	var genSignature 	= '  <!-- Page template generated by http://chalarangelo.github.io/htmltemplategenerator/ -->\n';
	var headToBody 		= ' </head>\n <body>\n';
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
});