// When the user clicks on <span> with .close class (x), close the modal
$('.close').on('click', function(){
	$(".modal").css("display", "none");
});
//when a user clicks anywhere off the window close the modal
$('.modal').on('click', function(e){
	
	if($(event.target).attr('class') === 'modal'){
		$(".modal").css("display", "none");	
	}
});

function hideModal(){
	$(".modal").css("display", "none");
}

function callErrorModal(err){
	if(typeof err == 'undefined'){
		var err = JSON.stringify({"error": "genereric error"});	
	}
	var errText = `<p class='text-color6 mt-4' style='text-align:center;'>
		<span class='text-error'>*</span>
		${err}</p>`;
	$('#errorModalContent').append(errText);
	$("#errorModal").css("display", "block");
}

function callConfirmModal(){
	$("#confirmModal").css("display", "block");
}