$('#container').load('https://efka.pilar.moe/changelog-ext #container', function(xhr, status) {
	if (status == "error") {
		$('#loading').html('Could not load the Changelog. Please <a id="reload" href="#">refresh</a> the page or try again later.');
		$('#reload').click(function(){
			location.reload();
		});
	} else {
		$('#loading').remove();
		$('#container').slideDown(500, function() {
			if (window.location.href.split('#')[1]) {
				$('#' + window.location.href.split('#')[1]).scrollView();
			}
		});

	}
}); // Can't do this in-line or I will receive a Content Security Policy error

$.fn.scrollView = function () {
	return this.each(function () {
		$('html, body').animate({
			scrollTop: $(this).offset().top
		}, 1000);
	});
}
