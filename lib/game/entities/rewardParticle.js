ig.module(
	'game.entities.rewardParticle'
)
.requires(
	'impact.entity'
)
.defines(function(){

	EntityRewardParticle = ig.Entity.extend({
		//physical movement parameters
		collides: ig.Entity.COLLIDES.NEVER,
		lifeTime: 1,
		fadeTime: 0.3,
		zIndex: 100,
		gravityFactor: -0.5,

		init: function( x, y, settings ){
			//call the parent constructor
			this.parent( x, y, settings );

			
			this.animSheet =  new ig.AnimationSheet( 'media/Text_GoodGreatPerfect_132x83px_3f.png', 132, 83 );
			this.size = {x:132, y:83};
			


			//set a timer so we know how long to keep it around for
			this.idleTimer = new ig.Timer();

			//add animations
			this.addAnim( 'good', 0.1, [0] );
			this.addAnim( 'great', 0.1, [1] );
			this.addAnim( 'perfect', 0.1, [2] );
			//establish a random anim
			var randNum = Math.ceil( Math.random() * 3 );
			switch( randNum ){
				case 1:
					this.currentAnim = this.anims.good;
				break;
				case 2:
					this.currentAnim = this.anims.great;
				break;
				case 3: 
					this.currentAnim = this.anims.perfect;
				break;
			}


			this.parent( x, y, settings );


			

		},

		update: function(){
			if ( this.idleTimer.delta() > this.lifeTime ){
				this.kill();
				return;
			}

			this.currentAnim.alpha = this.idleTimer.delta().map(this.lifeTime - this.fadeTime, this.lifeTime, 1, 0);

			//call the parent
			this.parent();
		}

	});
});

