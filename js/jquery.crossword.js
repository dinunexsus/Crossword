(function($){
	$.fn.crossword = function(entryData) {
			
		  // Initialize timer and score variables
		  let startTime, endTime, elapsedTime, score = 0;
		  let isGameCompleted = false;
		  let COUNTDOWN_DURATION = 60; // 5 minutes in seconds
			
			
			var puzz = {};
			puzz.data = entryData;
			
		
			this.after('<div id="puzzle-clues"><h2>Across</h2><ol id="across"></ol><h2>Down</h2><ol id="down"></ol></div>');
			
		
			var tbl = ['<table id="puzzle">'],
			    puzzEl = this,
				clues = $('#puzzle-clues'),
				clueLiEls,
				coords,
				entryCount = puzz.data.length,
				entries = [], 
				rows = [],
				cols = [],
				solved = [],
				tabindex,
				$actives,
				activePosition = 0,
				activeClueIndex = 0,
				currOri,
				targetInput,
				mode = 'interacting',
				solvedToggle = false,
				z = 0;

			var puzInit = {
				
				init: function() {

					  // Create elements for score and timer
					  $('#puzzle-clues').after('<div id="score">Score: <span id="score-value">0</span></div>');
					  $('#puzzle-clues').after('<div id="timer">Timer: <span id="timer-value">0</span> seconds</div>');

				

					currOri = 'across'; // app's init orientation could move to config object

		
					
					// Reorder the problems array ascending by POSITION
					puzz.data.sort(function(a,b) {
						return a.position - b.position;
					});

					// Set keyup handlers for the 'entry' inputs that will be added presently
					puzzEl.delegate('input', 'keyup', function(e){
						mode = 'interacting';
						
						
						// need to figure out orientation up front, before we attempt to highlight an entry
						switch(e.which) {
							case 39:
							case 37:
								currOri = 'across';
								break;
							case 38:
							case 40:
								currOri = 'down';
								break;
							default:
								break;
						}
						
						if ( e.keyCode === 9) {
							return false;
						} else if (
							e.keyCode === 37 ||
							e.keyCode === 38 ||
							e.keyCode === 39 ||
							e.keyCode === 40 ||
							e.keyCode === 8 ||
							e.keyCode === 46 ) {			
												

							
							if (e.keyCode === 8 || e.keyCode === 46) {
								currOri === 'across' ? nav.nextPrevNav(e, 37) : nav.nextPrevNav(e, 38); 
							} else {
								nav.nextPrevNav(e);
							}
							
							e.preventDefault();
							return false;
						} else {
							
							console.log('input keyup: '+solvedToggle);
							
							puzInit.checkAnswer(e);

						}

						e.preventDefault();
						return false;					
					});
			
					// tab navigation handler setup
					puzzEl.delegate('input', 'keydown', function(e) {

						if ( e.keyCode === 9) {
							
							mode = "setting ui";
							if (solvedToggle) solvedToggle = false;

							//puzInit.checkAnswer(e)
							nav.updateByEntry(e);
							
						} else {
							return true;
						}
												
						e.preventDefault();
									
					});
					
					// tab navigation handler setup
					puzzEl.delegate('input', 'click', function(e) {
						mode = "setting ui";
						if (solvedToggle) solvedToggle = false;

						console.log('input click: '+solvedToggle);
					
						nav.updateByEntry(e);
						e.preventDefault();
									
					});
					
					
					// click/tab clues 'navigation' handler setup
					clues.delegate('li', 'click', function(e) {
						mode = 'setting ui';
						
						if (!e.keyCode) {
							nav.updateByNav(e);
						} 
						e.preventDefault(); 
					});
					
					
					// highlight the letter in selected 'light' - better ux than making user highlight letter with second action
					puzzEl.delegate('#puzzle', 'click', function(e) {
						$(e.target).focus();
						$(e.target).select();
					});
					
					// DELETE FOR BG
					puzInit.calcCoords();
					
					// Puzzle clues added to DOM in calcCoords(), so now immediately put mouse focus on first clue
					clueLiEls = $('#puzzle-clues li');
					$('#' + currOri + ' li' ).eq(0).addClass('clues-active').focus();
				
					// DELETE FOR BG
					puzInit.buildTable();
					puzInit.buildEntries();
					puzInit.startTimer(); // Start timer when puzzle initializes
				},
				// startTimer: function () {
				// 	startTime = new Date();
				// 	// Update the timer every second
				// 	setInterval(function () {
				// 	  if (!isGameCompleted) {
				// 		  puzInit.updateTimer();
				// 	  }
				// 	}, 1000);
				//   },

				startTimer: function () {
					COUNTDOWN_DURATION = 60; // Reset the countdown duration to 5 minutes
					startTime = new Date();
					endTime = new Date(startTime.getTime() + COUNTDOWN_DURATION * 1000); // Set the end time
					// Update the timer initially
					puzInit.updateTimer();
					// Update the timer every second
					const timerInterval = setInterval(function () {
						if (!isGameCompleted && new Date() <= endTime) {
							puzInit.updateTimer();
						} else {
							clearInterval(timerInterval); // Stop the timer if the game is completed or time is up
							if (!isGameCompleted) {
								puzInit.endGame(); // End the game if time is up
							}
						}
					}, 1000);
				},
				
				
				//   updateTimer: function () {
				// 	if (!isGameCompleted) {
				// 		endTime = new Date();
				// 		elapsedTime = Math.floor((endTime - startTime) / 1000); // in seconds
				// 		// Update the timer display (you need to implement this)
				// 		console.log('Elapsed Time: ' + elapsedTime + ' seconds');
				// 		$('#timer-value').text(puzInit.formatTime(elapsedTime));
				// 	}
				//   },


				updateTimer: function () {
					if (!isGameCompleted) {
						const now = new Date();
						const timeDifference = Math.floor((endTime - now) / 1000); // in seconds
						const minutes = Math.floor(timeDifference / 60);
						const seconds = timeDifference % 60;
						const formattedTime = `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
						// Update the timer display
						$('#timer-value').text(formattedTime);


						    // Check if all input fields are filled
							const allInputsFilled = $('#puzzle input').toArray().every(input => input.value.trim() !== '');

						
						// Check if time is up
						
			

						  if (timeDifference <= 0 || allInputsFilled) {
							  puzInit.endGame(); // End the game if time is up or all entries are filled
							  clearInterval(timerInterval); // Stop the timer

						  }
					}
				},
				
				  formatTime: function (timeInSeconds) {
					  const minutes = Math.floor(timeInSeconds / 60);
					  const seconds = timeInSeconds % 60;
					  return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
				  },

				   
											
				//   endGame: function () {
				// 	isGameCompleted = true;
				// 	// Calculate the score based on remaining time
				// 	const remainingTime = Math.max(Math.floor((endTime - new Date()) / 1000), 0); // Calculate remaining time or 0 if time is already up
				// 	const timeBonus = remainingTime * 0.1; // 10 points per second remaining
				// 	score += timeBonus;
				// 	// Update the score display
				// 	$('#score-value').text(Math.round(score));
					
				// 	let message;
				// 	if (remainingTime <= 0) {
				// 		message = "Time's up! Your final score is: " + Math.round(score);
				// 	} else {
				// 		message = "Congratulations! You've completed all entries! Your final score is: " + Math.round(score);
				// 	}
					
				// 	// Show score as a popup
				// 	alert(message);
				
				// 	// Clear all entered values in the puzzle box
				// 	$('#puzzle input').val('');
				
				// 	// Optionally, you can reset other game-related variables here if needed
				// },
				
				endGame: function () {
					isGameCompleted = true;
					// Calculate the score based on remaining time
					const remainingTime = Math.max(Math.floor((endTime - new Date()) / 1000), 0); // Calculate remaining time or 0 if time is already up
					const timeBonus = remainingTime * 0.1; // 10 points per second remaining
					score += timeBonus;
					// Update the score display
					$('#score-value').text(Math.round(score));
					
					// Display score as a popup
					const message = "Your final score is: " + Math.round(score);
					alert(message);
				
					// Clear all entered values in the puzzle box
					$('#puzzle input').val('');
				
					// Optionally, you can reset other game-related variables here if needed
				},
				
				
				
				
			
				calcCoords: function() {
				
					for (var i = 0, p = entryCount; i < p; ++i) {		
						// set up array of coordinates for each problem
						entries.push(i);
						entries[i] = [];

						for (var x=0, j = puzz.data[i].answer.length; x < j; ++x) {
							entries[i].push(x);
							coords = puzz.data[i].orientation === 'across' ? "" + puzz.data[i].startx++ + "," + puzz.data[i].starty + "" : "" + puzz.data[i].startx + "," + puzz.data[i].starty++ + "" ;
							entries[i][x] = coords; 
						}

						// while we're in here, add clues to DOM!
						console.log(puzz.data);
						// $('#' + puzz.data[i].orientation).append('<li tabindex="1" data-position="' + i + '">' + puzz.data[i].clue + '</li>'); 


						$('#' + puzz.data[i].orientation).append('<li tabindex="1" data-position="' + i + '">' + puzz.data[i].clue + '</li>'); 
					}				
					
					// Calculate rows/cols by finding max coords of each entry, then picking the highest
					for (var i = 0, p = entryCount; i < p; ++i) {
						for (var x=0; x < entries[i].length; x++) {
							cols.push(entries[i][x].split(',')[0]);
							rows.push(entries[i][x].split(',')[1]);
						};
					}

					rows = Math.max.apply(Math, rows) + "";
					cols = Math.max.apply(Math, cols) + "";
		
				},
				
				
				buildTable: function() {
					for (var i=1; i <= rows; ++i) {
						tbl.push("<tr>");
							for (var x=1; x <= cols; ++x) {
								tbl.push('<td data-coords="' + x + ',' + i + '"></td>');		
							};
						tbl.push("</tr>");
					};

					tbl.push("</table>");
					puzzEl.append(tbl.join(''));
				},
				
			
				buildEntries: function() {
					var puzzCells = $('#puzzle td'),
						light,
						$groupedLights,
						hasOffset = false,
						positionOffset = entryCount - puzz.data[puzz.data.length-1].position; // diff. between total ENTRIES and highest POSITIONS
						
					for (var x=1, p = entryCount; x <= p; ++x) {
						var letters = puzz.data[x-1].answer.split('');

						for (var i=0; i < entries[x-1].length; ++i) {
							light = $(puzzCells +'[data-coords="' + entries[x-1][i] + '"]');
							
						
							if(x > 1 ){
								if (puzz.data[x-1].position === puzz.data[x-2].position) {
									hasOffset = true;
								};
							}
							
							if($(light).empty()){
								$(light)
									.addClass('entry-' + (hasOffset ? x - positionOffset : x) + ' position-' + (x-1) )
									.append('<input maxlength="1" val="" type="text" tabindex="-1" />');
							}
						};
						
					};	


			

					
					
					// Put entry number in first 'light' of each entry, skipping it if already present
					for (var i=1, p = entryCount; i < p; ++i) {
						$groupedLights = $('.entry-' + i);
						if(!$('.entry-' + i +':eq(0) span').length){
							$groupedLights.eq(0)
								.append('<span>' + puzz.data[i].position + '</span>');
						}
					}	
					
					util.highlightEntry();
					util.highlightClue();
					$('.active').eq(0).focus();
					$('.active').eq(0).select();
										
				},
				
				// checkAnswer: function(e) {
					
				// 	var valToCheck, currVal;
					
				// 	util.getActivePositionFromClassGroup($(e.target));
				
				// 	valToCheck = puzz.data[activePosition].answer.toLowerCase();

				// 	currVal = $('.position-' + activePosition + ' input')
				// 		.map(function() {
				// 	  		return $(this)
				// 				.val()
				// 				.toLowerCase();
				// 		})
				// 		.get()
				// 		.join('');
					
				// 	//console.log(currVal + " " + valToCheck);
				// 	if(valToCheck === currVal){	
				// 		score += 10; // Increment score for correct answer
				// 		$('#score-value').text(score);

						

				// 		$('.active')
				// 			.addClass('done')
				// 			.removeClass('active');
					
				// 		$('.clues-active').addClass('clue-done');

				// 		solved.push(valToCheck);
				// 		solvedToggle = true;
				// 		return;
				// 	}
					
				// 	currOri === 'across' ? nav.nextPrevNav(e, 39) : nav.nextPrevNav(e, 40);


				// }				


				checkAnswer: function(e) {
                    
                    var valToCheck, currVal;
                    
                    util.getActivePositionFromClassGroup($(e.target));
                
                    valToCheck = puzz.data[activePosition].answer.toLowerCase();

                    currVal = $('.position-' + activePosition + ' input')
                        .map(function() {
                            return $(this)
                                .val()
                                .toLowerCase();
                        })
                        .get()
                        .join('');
                    
                    // Check if the answer is already solved
                    if (!util.checkSolved(valToCheck)) {
                        if(valToCheck === currVal){    
                            score += 10; // Increment score for correct answer
                            $('#score-value').text(score);

                            $('.active')
                                .addClass('done')
                                .removeClass('active');
                        
                            $('.clues-active').addClass('clue-done');

                            solved.push(valToCheck);
                            solvedToggle = true;

                            // Check if all answers are solved
                            if (solved.length === entryCount) {
                                isGameCompleted = true;
                            }
                            return;
                        }
                    }
                    
                    currOri === 'across' ? nav.nextPrevNav(e, 39) : nav.nextPrevNav(e, 40);


                }           


			};
			

			var nav = {
				
				nextPrevNav: function(e, override) {

					var len = $actives.length,
						struck = override ? override : e.which,
						el = $(e.target),
						p = el.parent(),
						ps = el.parents(),
						selector;
				
					util.getActivePositionFromClassGroup(el);
					util.highlightEntry();
					util.highlightClue();
					
					$('.current').removeClass('current');
					
					selector = '.position-' + activePosition + ' input';
					
					switch(struck) {
						case 39:
							p
								.next()
								.find('input')
								.addClass('current')
								.select();

							break;
						
						case 37:
							p
								.prev()
								.find('input')
								.addClass('current')
								.select();

							break;

						case 40:
							ps
								.next('tr')
								.find(selector)
								.addClass('current')
								.select();

							break;

						case 38:
							ps
								.prev('tr')
								.find(selector)
								.addClass('current')
								.select();

							break;

						default:
						break;
					}
															
				},
	
				updateByNav: function(e) {
					var target;
					
					$('.clues-active').removeClass('clues-active');
					$('.active').removeClass('active');
					$('.current').removeClass('current');
					currIndex = 0;

					target = e.target;
					activePosition = $(e.target).data('position');
					
					util.highlightEntry();
					util.highlightClue();
										
					$('.active').eq(0).focus();
					$('.active').eq(0).select();
					$('.active').eq(0).addClass('current');
					
					// store orientation for 'smart' auto-selecting next input
					currOri = $('.clues-active').parent('ol').prop('id');
										
					activeClueIndex = $(clueLiEls).index(e.target);

					
				},
			
				// Sets activePosition var and adds active class to current entry
				updateByEntry: function(e, next) {
					var classes, next, clue, e1Ori, e2Ori, e1Cell, e2Cell;
					
					if(e.keyCode === 9 || next){
						// handle tabbing through problems, which keys off clues and requires different handling		
						activeClueIndex = activeClueIndex === clueLiEls.length-1 ? 0 : ++activeClueIndex;
					
						$('.clues-active').removeClass('.clues-active');
												
						next = $(clueLiEls[activeClueIndex]);
						currOri = next.parent().prop('id');
						activePosition = $(next).data('position');
												
						// skips over already-solved problems
						util.getSkips(activeClueIndex);
						activePosition = $(clueLiEls[activeClueIndex]).data('position');
						
																								
					} else {
						activeClueIndex = activeClueIndex === clueLiEls.length-1 ? 0 : ++activeClueIndex;
					
						util.getActivePositionFromClassGroup(e.target);
						
						clue = $(clueLiEls + '[data-position=' + activePosition + ']');
						activeClueIndex = $(clueLiEls).index(clue);
						
						currOri = clue.parent().prop('id');
						
					}
						
						util.highlightEntry();
						util.highlightClue();

				}
				
			}; // end nav object

			
			var util = {
				highlightEntry: function() {

					$actives = $('.active');
					$actives.removeClass('active');
					$actives = $('.position-' + activePosition + ' input').addClass('active');
					$actives.eq(0).focus();
					$actives.eq(0).select();
				},
				
				highlightClue: function() {
					var clue;				
					$('.clues-active').removeClass('clues-active');
					$(clueLiEls + '[data-position=' + activePosition + ']').addClass('clues-active');
					
					if (mode === 'interacting') {
						clue = $(clueLiEls + '[data-position=' + activePosition + ']');
						activeClueIndex = $(clueLiEls).index(clue);
					};
				},
				
				getClasses: function(light, type) {
					if (!light.length) return false;
					
					var classes = $(light).prop('class').split(' '),
					classLen = classes.length,
					positions = []; 

					// pluck out just the position classes
					for(var i=0; i < classLen; ++i){
						if (!classes[i].indexOf(type) ) {
							positions.push(classes[i]);
						}
					}
					
					return positions;
				},

				getActivePositionFromClassGroup: function(el){

						classes = util.getClasses($(el).parent(), 'position');

						if(classes.length > 1){
							// get orientation for each reported position
							e1Ori = $(clueLiEls + '[data-position=' + classes[0].split('-')[1] + ']').parent().prop('id');
							e2Ori = $(clueLiEls + '[data-position=' + classes[1].split('-')[1] + ']').parent().prop('id');

							e1Cell = $('.position-' + classes[0].split('-')[1] + ' input').index(el);
							e2Cell = $('.position-' + classes[1].split('-')[1] + ' input').index(el);

							if(mode === "setting ui"){
								currOri = e1Cell === 0 ? e1Ori : e2Ori; // change orientation if cell clicked was first in a entry of opposite direction
							}

							if(e1Ori === currOri){
								activePosition = classes[0].split('-')[1];		
							} else if(e2Ori === currOri){
								activePosition = classes[1].split('-')[1];
							}
						} else {
							activePosition = classes[0].split('-')[1];						
						}
						
						console.log('getActivePositionFromClassGroup activePosition: '+activePosition);
						
				},
				
				checkSolved: function(valToCheck) {
					for (var i=0, s=solved.length; i < s; i++) {
						if(valToCheck === solved[i]){
							return true;
						}

					}
				},
				
				getSkips: function(position) {
					if ($(clueLiEls[position]).hasClass('clue-done')){
						activeClueIndex = position === clueLiEls.length-1 ? 0 : ++activeClueIndex;
						util.getSkips(activeClueIndex);						
					} else {
						return false;
					}
				}
				
			}; // end util object

				
			puzInit.init();
							
	}
	
})(jQuery);