ig.module( 
	'game.main' 
)
.requires(
	'impact.game',
	'impact.font',
	//plugins
	'plugins.box2d.game',
	'plugins.box2d.debug',
	//levels
	'game.levels.stage',
	//entities
	'game.entities.edgeShape',
	'game.entities.player',

	'game.entities.obstacle',
	'game.entities.sensor',
	//particles
	//UI classes
	'game.entities.windVector',
	'game.entities.breathCounter',
	'game.entities.breathIndicator',
	'game.entities.breatheText',

	'impact.debug.debug'
)
.defines(function(){

MyGame = ig.Box2DGame.extend({
	font: new ig.Font( 'media/invasionFont.png' ),
	gravity: 250,
	mouseLast: {x: 0, y: 0},
	mouseOverBody: false,
	mouseOverClass: false,
	mouseJoint: false,
	breathCount: 0,
	breaths: [ {i:3 , o: 3} , {i:3 , o: 4} , {i:3 , o: 3} , {i:3 , o: 3} , {i:3 , o: 3} , {i:3 , o: 3} , {i:3 , o: 3} , {i:3 , o: 3} , {i:3 , o: 3} , {i:3 , o: 3} , {i:3 , o: 3} , {i:3 , o: 3}, {i:3 , o: 3} , {i:3 , o: 3} , {i:3 , o: 3} , {i:3 , o: 3} , {i:3 , o: 3} , {i:3 , o: 3} , {i:3 , o: 3} , {i:3 , o: 3} , {i:3 , o: 3} , {i:3 , o: 3} , {i:3 , o: 3} , {i:3 , o: 3} ],
	breathModel: { i : 3 , ih: 1 , o : 4 , oh: 2 }, 
	killList: [],
	bpm: 95,
	timeElapsed: 0,
	edgeBuildTimer: 0,
	breathIndicator: false,
	playerSpawned: false,

	init: function() {
		//box2d debug
		this.debugCollisionRects = true;
		//bind keys
		ig.input.bind( ig.KEY.UP_ARROW, 'up');
		ig.input.bind( ig.KEY.DOWN_ARROW, 'down');
		ig.input.bind( ig.KEY.LEFT_ARROW, 'left');
		ig.input.bind( ig.KEY.RIGHT_ARROW, 'right');
		ig.input.bind( ig.KEY.MOUSE1, 'mouseLeft' );
		// Load level
		this.loadLevel( LevelStage );

		//set up contact listener
		this.setContactListener();
		//set up breath timer for breathController
		this.breathTimer = new ig.Timer();
	},

	loadLevel: function( level ) {        
	    this.parent( level );
	},
	
	update: function() {
		this.parent();
		this.handleMouseInput();
		this.processKillList();

		//count time elapsed 
		this.timeElapsed += ig.system.tick;
		this.edgeBuildTimer += ig.system.tick;	
		//control screen pos
		ig.game.screen.x = ( this.timeElapsed * 100 ) - 450; 
		ig.game.screen.y = this.bpm - 200;

		//spawn player
		if( this.timeElapsed > 3 && this.playerSpawned == false ){
			//spawn player
			this.player = ig.game.spawnEntity( EntityPlayer , 100, 0 );
			this.playerSpawned = true;
		}

		//control edge spawning
		if( this.edgeBuildTimer >= 0.3 ){
			ig.game.spawnEntity( EntityEdgeShape , this.timeElapsed * 100 , this.bpm );
			this.edgeBuildTimer = 0;
		}

		if( ig.game.breathTimer.delta() <= 4 ){
			ig.game.bpm += 0.5;
		}
		else if( ig.game.breathTimer.delta() > 4 && ig.game.breathTimer.delta() <= 10 ){
			ig.game.bpm -= 0.45;
		}
		if( ig.game.breathTimer.delta() > 10 ){
			ig.game.breathTimer.reset();
		}
	},
	
	draw: function() {
		//draw box2d debug
		//this.debugDrawer.draw();
		this.parent();
		//get system dimensions for drawing
		var x = ig.system.width/2,
		y = ig.system.height/2;
		//drawing text
		this.font.draw( "bpm: "+ Math.floor( ig.game.bpm ) , x - 250 , y - 150 , ig.Font.ALIGN.LEFT );	
	},

	handleMouseInput: function() {
		//grab mouse positions and adjust for b2d
        this.mouseX = (ig.input.mouse.x + ig.game.screen.x) * Box2D.SCALE;
    	this.mouseY = (ig.input.mouse.y + ig.game.screen.y) * Box2D.SCALE;

		//click, state & release functions for mouse click
		if (ig.input.pressed('mouseLeft') && this.breathIndicator == false && this.playerSpawned == true ) {
			//do collision detection in box2d
			this.getBodyUnderMouse();

			//spawn a breathIndicator
			this.breathIndicator = ig.game.spawnEntity( EntityBreathIndicator , 0 , 0 );
			//set the timer and state in breathIndicator 
			this.breathIndicator.state = "IN";
			this.breathIndicator.breathTimer.set( this.breathModel.i ); 
        }
        if (ig.input.state('mouseLeft')) {
      		if( this.mouseOverClass != false  ){
	      		this.createMouseJoint();
	      		//check if we have taken a breath, if so switch state
	      		if( this.breathIndicator.fullBreathTaken == true ){ 
	        		this.breathIndicator.state = "HOLDING"
	        	}
        	}

        }
        if (ig.input.released('mouseLeft') && this.breathIndicator != false ) {
			this.destroyMouseJoint();

			//kill breathIndicator
    		this.breathIndicator.state = "OUT";
    		this.breathIndicator.killText();
			this.breathIndicator.breathTimer.set( this.breathModel.o + this.breathModel.oh ); 
        
        }
        this.updateMouseJointTarget();
	}, 

	setContactListener: function(){
		this.contactListener = new Box2D.Dynamics.b2ContactListener;
		ig.world.SetContactListener(this.contactListener);
		this.contactListener.BeginContact = function(contact){
			var fixtureA = contact.GetFixtureA();
			var fixtureB = contact.GetFixtureB();
			var fixtureBIsInTheList = false;
			var fixtureAIsInTheList = false;
			// INVESTIGATE FIXTURE A
			if ( fixtureA.m_userData != null && fixtureB.m_userData != null ){
				switch(fixtureA.m_userData.name){
					case 'CASE':
					break;
				}
			}
			// INVESTIGATE FIXTURE B
			if ( fixtureB.m_userData != null && fixtureA.m_userData != null ){
				switch(fixtureB.m_userData.name){
					case 'CASE':
					break;
				}
			}
		};

		this.contactListener.EndContact = function(contact){
			var fixtureA = contact.GetFixtureA();
			var fixtureB = contact.GetFixtureB();
			// INVESTIGATE FIXTURE A
			if ( contact.GetFixtureA().m_userData != null && contact.GetFixtureB().m_userData != null ){
				switch(contact.GetFixtureA().m_userData.name){
					case 'CASE':
					break;
				}
			}
			// INVESTIGATE FIXTURE B
			if ( contact.GetFixtureA().m_userData != null && contact.GetFixtureB().m_userData != null ){
				switch(contact.GetFixtureA().m_userData.name){
					case 'CASE':
					break;
				}
			}
		};


	},

	processKillList: function(){
		//loop through killList and destroy all bodies
		if( this.killList.length > 0 ){
			for( var i = 0 ; i < this.killList.length ; i++ ){
				this.killList[i].kill();
			}
			//empty killList 
			this.killList = [];
		}
	},

	getBodyUnderMouse: function(){
		//let's grab a body in box2d
        //Create a new bounding box
        var aabb = new Box2D.Collision.b2AABB();
        //set lower & upper bounds
        aabb.lowerBound.Set( this.mouseX - 0.01, this.mouseY - 0.01 );
        aabb.upperBound.Set( this.mouseX + 0.01, this.mouseY + 0.01 );
        //callback for the query function
        function GetBodyCallBack(fixture){
                //store body
                ig.game.mouseOverClass = fixture.GetUserData();
                ig.game.mouseOverBody = fixture.GetBody();
                console.log(fixture.GetUserData().name + " grabbed and stored");
        }
        ig.world.QueryAABB(GetBodyCallBack,aabb);
	},

	createMouseJoint: function(){
		//is there a body stored? is there a joint already?
        if(this.mouseOverBody != false && this.mouseJoint == false){
                var mouseJointDef = new Box2D.Dynamics.Joints.b2MouseJointDef;
                mouseJointDef.bodyA = ig.world.GetGroundBody();
                mouseJointDef.bodyB = this.mouseOverBody;
                mouseJointDef.maxForce = 10000;
                mouseJointDef.target.Set((ig.input.mouse.x + ig.game.screen.x)*Box2D.SCALE,(ig.input.mouse.y + ig.game.screen.y)*Box2D.SCALE);
                this.mouseJoint = ig.world.CreateJoint(mouseJointDef);
        }
	},

	destroyMouseJoint: function(){
		if(this.mouseOverBody != false){
            //clear stored body
            //happens in breathIndicator.cleanUpAfterBreathIsFinished();
            ig.game.mouseOverBody = false;
            ig.game.mouseOverClass = false;
        }
        if(this.mouseJoint != false){
            //destroy mouse joint
            ig.world.DestroyJoint(this.mouseJoint);
            //clear stored body
            this.mouseJoint = false;
        }
	},

	updateMouseJointTarget: function(){
		//if we have a mouse joint, keep setting the target
        if(this.mouseJoint != false){
                var target = new Box2D.Common.Math.b2Vec2((ig.input.mouse.x + ig.game.screen.x) * Box2D.SCALE , (ig.input.mouse.y + ig.game.screen.y) * Box2D.SCALE);
                this.mouseJoint.SetTarget(target);
        }
	}

});

var c = document.createElement('canvas');
c.id = 'canvas';
document.body.appendChild(c);

// Start the Game with 60fps, a resolution of 320x240, scaled
// up by a factor of 2
ig.main( '#canvas', MyGame, 60, 568, 320, 1 );

});
