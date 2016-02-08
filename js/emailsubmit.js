(function () {
    'use strict';
    
    var module = {
        options: [],
        header: [navigator.platform, navigator.userAgent, navigator.appVersion, navigator.vendor, window.opera],
        dataos: [
            { name: 'Windows Phone', value: 'Windows Phone', version: 'OS' },
            { name: 'Windows', value: 'Win', version: 'NT' },
            { name: 'iPhone', value: 'iPhone', version: 'OS' },
            { name: 'iPad', value: 'iPad', version: 'OS' },
            { name: 'Kindle', value: 'Silk', version: 'Silk' },
            { name: 'Android', value: 'Android', version: 'Android' },
            { name: 'PlayBook', value: 'PlayBook', version: 'OS' },
            { name: 'BlackBerry', value: 'BlackBerry', version: '/' },
            { name: 'Macintosh', value: 'Mac', version: 'OS X' },
            { name: 'Linux', value: 'Linux', version: 'rv' },
            { name: 'Palm', value: 'Palm', version: 'PalmOS' }
        ],
        databrowser: [
            { name: 'Chrome', value: 'Chrome', version: 'Chrome' },
            { name: 'Firefox', value: 'Firefox', version: 'Firefox' },
            { name: 'Safari', value: 'Safari', version: 'Version' },
            { name: 'Internet Explorer', value: 'MSIE', version: 'MSIE' },
            { name: 'Opera', value: 'Opera', version: 'Opera' },
            { name: 'BlackBerry', value: 'CLDC', version: 'CLDC' },
            { name: 'Mozilla', value: 'Mozilla', version: 'Mozilla' }
        ],
        getMetadata: function () {
            var agent = this.header.join(' '),
                os = this.matchItem(agent, this.dataos),
                browser = this.matchItem(agent, this.databrowser);
            
            return { os: os, browser: browser };
        },
        matchItem: function (string, data) {
            var i = 0,
                j = 0,
                html = '',
                regex,
                regexv,
                match,
                matches,
                version;
            
            for (i = 0; i < data.length; i += 1) {
                regex = new RegExp(data[i].value, 'i');
                match = regex.test(string);
                if (match) {
                    regexv = new RegExp(data[i].version + '[- /:;]([\\d._]+)', 'i');
                    matches = string.match(regexv);
                    version = '';
                    if (matches) { if (matches[1]) { matches = matches[1]; } }
                    if (matches) {
                        matches = matches.split(/[._]+/);
                        for (j = 0; j < matches.length; j += 1) {
                            if (j === 0) {
                                version += matches[j] + '.';
                            } else {
                                version += matches[j];
                            }
                        }
                    } else {
                        version = '0';
                    }
                    return {
                        name: data[i].name,
                        version: parseFloat(version)
                    };
                }
            }
            return { name: 'unknown', version: 0 };
        },
        emailIsValid: function(email) {
            var re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
            return re.test(email.trim());
        },
        submitEmail: function () {
			$('.signupButton').click(function(event) {
				event.preventDefault();

				var buttonId = '#' + event.target.id;
                var inputElement = $(buttonId).closest('div.signup').find('input[class=signupInput]');
                var email = inputElement.val();
				
                if (!module.emailIsValid(email)) {
                    if (email != null && email != "") {
                        // there's a non-empty string, but it's not a valid email address
                        window.alert('Please enter a valid email address.');
                    }
                    return; // text input was empty, so do nothing
                }

                var metadata = module.getMetadata();
                var payload = JSON.stringify({
                    'email': email,
                    'os-name':  metadata.os.name,
                    'os-version': metadata.os.version,
                    'browser-name': metadata.browser.name,
                    'browser-version': metadata.browser.version
                });

                inputElement.val(''); // clear input field immediately after click event

                $.ajax({
					type: 'PUT',
					url: 'https://07uhfwl806.execute-api.us-west-2.amazonaws.com/prod/SignupEmailLambda/',
					data: payload,
					success: function() {
						window.alert('Email submitted successfully.'); // TODO: output proper response from server
					},
					error: function() {
						window.alert('Error submitting email. Try again.');
					}
				});
			});
		}
    };

	module.submitEmail();
    
}());