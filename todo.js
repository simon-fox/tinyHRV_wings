------------------------------
//////////////////////////////////
//  HRV TINY WINGS TODO         //
//////////////////////////////////

//- init horizontal stage
//- clean up balloon lifter code
//- re-build dummy breath indicator
	//- include new in,hold,ex,hold cycle
	//- use 6brpm values for now
	//- indicator constantly runs, doesnt require input
	//- place over player
	- fix text wobble
//- clean up breathIndicator so it does not connect to spawning etc
- Feed in dummy heart rate & coherence values
	//- test bpm values by altering bpm var on a timer
	- test coherence values... somehow

//- Dynamic level building
	//- research edge shapes
	//- test building edge shapes
	//- build in ig.game.bpm and ig.game.timeElapsed 
	//- build an edgeShape every x seconds in update
		//- too much performance hit if we do a 1px line every update
		//- either do a longer line more slowly (naive)
		//- or find a way to feed the right world co-ords into edgeShape 
		  //at time of construction
		//- 2 vertices in array
		//- max delay would be perhaps 0.5 seconds 
		//- first vertex is finishing vertex of previous edgeShape
		//- second vertex is new co-ords expressed relative to local co-ords
			//- so y co-ord = ( ig.game.bpm - this.pos.y )

		- still not great on performance... needs testing. 	
	//- take dummy bpm values and test level building  

- Player character
	- movement connected to coherence score
	- tap to bounce
	- OR: movement connected to breath, tiny wings style. 
		- in breath floats player up, out breath drops player down
		- this should encourage synchrony/RSA! 
	- put breath indicator over player
- Test with dummy values 



/////////////////////

breathController: function(){
		//set the breathIndicator and initialise times 
		//in: 3, hold: 1, out: 4, hold: 2
		//    3        4       8        10

  		//set timer in ig.game scope
		if( this.breathTimer <= this.breathModel.i ){
			//INHALE
		}
		if( this.breathTimer > this.breathModel.i && this.breathTimer <= this.breathModel.i + this.breathModel.ih ){
			//INHALE HOLD
		}
		if( this.breathTimer > this.breathModel.i + this.breathModel.ih && this.breathTimer <= this.breathModel.i + this.breathModel.ih + this.breathModel.o ){
			//EXHALE
		}
		if( this.breathTimer > this.breathModel.i + this.breathModel.ih + this.breathModel.o && this.breathTimer <= this.breathModel.i + this.breathModel.ih + this.breathModel.o + this.breathModel.oh ){
			//EXHALE HOLD

			//reset timer
		}

	}















