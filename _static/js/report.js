function getParameterByName(name, url) {
  if (!url) url = window.location.href;
	name = name.replace(/[\[\]]/g, '\\$&');
	var regex = new RegExp('[?&]' + name + '(=([^&#]*)|&|#|$)'),
	    results = regex.exec(url);
	if (!results) return null;
	if (!results[2]) return '';
	return decodeURIComponent(results[2].replace(/\+/g, ' '));
}
function createReport(AppContext){
	var AppContext = JSON.parse(getParameterByName('AppContext'));
	if(AppContext !== null){
		for (var key in AppContext.actions) {
			$('#actions').append(`<h3>${key}: 
				(<span style='color:pink;'>${AppContext.actions[key].length}s</span>)
			</h3>`);
		}
	}
}
$(document).ready(function() {
	createReport();
});

$('#registerButton').on('click', function(e){
	e.preventDefault();
	submitRegisteration(e);
});

$('#form').on('submit', function(e){
	e.preventDefault();
	submitRegisteration(e);
});

function submitRegisteration(e){
	
	var emailInput = $('#registerEmailInput').val();
	var passwordInput = 'UnverifiedUser123';

	$('#registerEmailInput').removeClass('bg-error');	
	$('#registerUserTypeInput').removeClass('bg-error');	
	$('#registerLiveVideoInput').removeClass('bg-error');	
	$('#registerLiveAudioInput').removeClass('bg-error');	

	

	var userTypeInput = $('input[name=userTypeInput]:checked').val();
	var liveVideoInput = $('input[name=liveVideoInput]:checked').val();
	var liveAudioInput = $('input[name=liveAudioInput]:checked').val();


	var error_obj = {
		emailIsValid: true, 
		userTypeIsValid: true,
		liveVideoIsValid: true,
		liveAudioIsValid: true
	};

	error_obj.emailIsValid = validateEmailInput(emailInput);
	error_obj.userTypeIsValid = validateInput(userTypeInput);
	error_obj.liveVideoIsValid = validateInput(liveVideoInput);
	error_obj.liveAudioIsValid = validateInput(liveAudioInput);
	
	
	if(!error_obj.userTypeIsValid || !error_obj.emailIsValid || !error_obj.liveVideoIsValid || !error_obj.liveAudioIsValid) {
		
		if(!error_obj.emailIsValid) $('#registerEmailInput').addClass('bg-error');	
		if(!error_obj.userTypeIsValid) $('#registerUserTypeInput').addClass('bg-error');	
		if(!error_obj.liveVideoIsValid) $('#registerLiveVideoInput').addClass('bg-error');	
		if(!error_obj.liveAudioIsValid) $('#registerLiveAudioInput').addClass('bg-error');	
		
			

		$('#registerErrorPanel').removeClass('hide');
	} else {
		doRegister(emailInput, passwordInput, userTypeInput, liveVideoInput, liveAudioInput, function(err, result){
			if(err) {
				callErrorModal(err);		
			} else {
				console.log('register success');
				callConfirmModal()
			}
		});
	}
};


function validateInput(input){
	if(typeof input === 'undefined' || input=='') {
		return false 
	} else {
		return true;
	}
}
function validateEmailInput(emailInput){
	var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
	return re.test(String(emailInput).toLowerCase());
}
function validatePasswordInput(y){
	var error = false;
	if (y.length < 8) {
	  error = true;
	}
	if (y.search(/[a-z]/) == -1) {
	  error = true;
	}
	if (y.search(/[A-Z]/) == -1) {
	  error = true;
	}
	if (y.search(/[0-9]/) == -1) {
	  error = true;
	}
	if (error) {
	  return false; //if there is an error return false because password is not valid.
	} else {
		return true;
	}
}
$('#confirmButton').on('click', function(e){
	goHome();
});

function goHome(){
			var form = document.createElement("form");
		  form.method = "GET";
		  form.action = "../index.html";   
		  document.body.appendChild(form);
		  form.submit();
		}