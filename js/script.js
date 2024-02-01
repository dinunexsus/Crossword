// A javascript-enhanced crossword puzzle [c] Jesse Weisbeck, MIT/GPL 
(function($) {
	$(function() {
		// provide crossword entries in an array of objects like the following example
		// Position refers to the numerical order of an entry. Each position can have 
		// two entries: an across entry and a down entry
		var puzzleData = [
			{
				clue: "<img src='js/APD icons/Subscriptions@4x.png' alt='Cinema'>",
				answer: "subscriptions",
				position: 1,
				orientation: "across",
				startx: 1,
				starty: 1
			},
			 	
			 	{
					clue: "<img src='js/APD icons/UPI@4x.png' alt='First letter of Greek alphabet'>",
					answer: "upi",
					position: 3,
					orientation: "across",
					startx: 10,
					starty: 4
				},
				{
					clue: "<img src='js/APD icons/Recharge@4x.png' alt='First letter of Greek alphabet'>",
					answer: "recharge",
					position: 5,
					orientation: "across",
					startx: 1,
					starty: 6
				},
				{
					clue: "<img src='js/APD icons/Pay Bills@4x.png' alt='First letter of Greek alphabet'>",
					answer: "paybills",
					position: 8,
					orientation: "across",
					startx: 1,
					starty: 8
				},
				{
					clue: "<img src='js/APD icons/Entertainment@4x.png' alt='Emergency'>",
					answer: "entertainment",
					position: 10,
					orientation: "across",	
					startx: 1,
					starty: 13
				},
				{
					clue: "<img src='js/APD icons/Movie@4x.png' alt='First letter of Greek alphabet'>",
					answer: "movie",
					position: 4,
					orientation: "across",
					startx: 6,
					starty: 9
				},
			
			
				{
					clue: "<img src='js/APD icons/Subscription@4x.png' alt='First letter of Greek alphabet'>",
					answer: "subscription",
					position: 1,
					orientation: "down",
					startx: 1,
					starty: 1
				},
				{
					clue: "<img src='js/APD icons/Insurance@4x.png' alt='First letter of Greek alphabet'>",
					answer: "insurance",
					position: 2,
					orientation: "down",
					startx: 10,
					starty: 1
				},
			
				{
					clue: "<img src='js/APD icons/Wealth@4x.png' alt='First letter of Greek alphabet'>",
					answer: "wealth",
					position: 6,
					orientation: "down",
					startx: 13,
					starty: 9
				},
				{
					clue: "<img src='js/APD icons/Gift Card@4x.png' alt='First letter of Greek alphabet'>",
					answer: "giftcard",
					position: 7,
					orientation: "down",
					startx: 12,
					starty: 3
				},
				
			
			
			
			
			] 
	
		$('#puzzle-wrapper').crossword(puzzleData);
		
	})
	
})(jQuery)
