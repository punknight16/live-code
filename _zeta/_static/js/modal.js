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

function callModal(content){
	$("#modal-body").html(content);
	$("#modal-background").css("display", "block");
}