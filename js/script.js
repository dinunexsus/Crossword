// A javascript-enhanced crossword puzzle [c] Jesse Weisbeck, MIT/GPL 
(function($) {
	$(function() {
		// provide crossword entries in an array of objects like the following example
		// Position refers to the numerical order of an entry. Each position can have 
		// two entries: an across entry and a down entry
		var puzzleData = [
			{
				clue: "<img src='js/APD icons/Recharge@4x.png' alt='First letter of Greek alphabet'>",
				answer: "recharge",
				// position: 5,
				position:1,
				orientation: "across",
				startx: 1,
				starty: 1
			},
			{
				clue: "<img src='js/APD icons/Gift Card@4x.png' alt='First letter of Greek alphabet'>",
				answer: "giftcard",
				position: 4,
				// position:2,
				orientation: "down",
				startx: 7,
				starty: 1
			},
			{
				clue: "<img src='js/APD icons/Pay Bills@4x.png' alt='First letter of Greek alphabet'>",
				answer: "paybills",
				position: 5,
				// position:3,
				orientation: "down",
				startx: 5,
				starty: 3
			},

			{
				clue: "<img src='js/APD icons/Wealth@4x.png' alt='First letter of Greek alphabet'>",
				answer: "wealth",
				// position: 6,
				// position:4,
				position:2,
				orientation: "across",
				startx: 3,
				starty: 4
			},
		
			 	{
					clue: "<img src='js/APD icons/UPI@4x.png' alt='First letter of Greek alphabet'>",
					answer: "upi",
					position: 3,
					// position:5,
					orientation: "across",
					startx: 3,
					starty: 7
				},
			
				
			
			
			
				
			
			
			
			
			] 
	
		$('#puzzle-wrapper').crossword(puzzleData);
		
	})
	
})(jQuery)
