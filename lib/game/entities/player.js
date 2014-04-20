ig.module(
	'game.entities.player'
)
.requires(
	'impact.entity',
	'plugins.box2d.entity'
)
.defines(function(){

EntityPlayer = ig.Box2DEntity.extend({
	size: {x: 63, y:62},
	type: ig.Entity.TYPE.B,
	checkAgainst: ig.Entity.TYPE.NONE,
	collides: ig.Entity.COLLIDES.NEVER, // Collision is already handled by Box2D!
	name: "PLAYER",
	state: "ON",
	dampingRatio: 0.5,
	frequencyHz: 12,
	zIndex: 100,
	upForce: 0,
	grabbable: true,
	tickCount: 0,

	init: function( x, y, settings ) {

		this.animSheet = new ig.AnimationSheet( 'media/spinner.png' , 63 , 62 );
	
		this.addAnim( 'idle' , 0.1 , [0] );
		
		this.currentAnim = this.anims.idle;
		
		//call parent
		this.parent( x, y, settings );
	},

	createBody: function() {
		//build new body definition from prototype
		var bodyDef = new Box2D.Dynamics.b2BodyDef();
		//set values
	    bodyDef.position = new Box2D.Common.Math.b2Vec2(
			(this.pos.x ) * Box2D.SCALE,
			(this.pos.y ) * Box2D.SCALE
		); 
	    bodyDef.type = Box2D.Dynamics.b2Body.b2_dynamicBody;    
	    //create body, assign to this class
	    this.body = ig.world.CreateBody(bodyDef);

	    //new fixture definition from prototype
	    var fixture = new Box2D.Dynamics.b2FixtureDef;
	    //set values
		fixture.shape = new Box2D.Collision.Shapes.b2CircleShape( ( this.size.x / 2 ) * Box2D.SCALE);  
	    fixture.density = 0.8;
	    fixture.restitution = 0.7;
	    fixture.friction = 1;
	   
	    //set userData
	    fixture.userData = this;

	    //create with body as parent 
	    this.fixture = this.body.CreateFixture(fixture);
	    //set body properties
	    this.body.SetLinearDamping(1);
	    this.body.SetAngularDamping(0);
	},

	update: function() {
		this.tickCount += ig.system.tick;

		if( ig.input.state('left') ){
			this.body.ApplyTorque( -1000 );	
		}
		if( ig.input.state('right') ){
			this.body.ApplyTorque( 1000 );
		}

		if( ig.game.breathIndicator != false ){
			switch( ig.game.breathIndicator.state ){
				case 'IN':
					//float up and spin
					this.body.ApplyForce( new Box2D.Common.Math.b2Vec2( -30 , -500 ), this.body.GetPosition() );	
					this.body.ApplyTorque( 500 );
					
				break
				case 'HOLDING':
					//stay still and spin

				break;
				case 'OUT':
					//push forwards and keep spinning
					this.body.ApplyTorque( 2000 );
				break;
			}
		}
		else{
			if( this.tickCount > 2 ){
				this.body.SetAngularVelocity( 0 );	
				this.tickCount = 2.1;
			}
		}

		this.parent();
	
	},

	kill: function(){

		this.parent();

	}

});

});