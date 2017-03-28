var preload = function(game){}

preload.prototype = {
	preload: function(){ 
        i = game.add.sprite(0, 0, 'splashscreen')
        i.width = game.width
        i.height = game.height
        
        game.load.image('settings/cog', 'assets/images/cog.png')
        game.load.image('settings/back', 'assets/images/back.png')
        game.load.image('settings/skins', 'assets/images/skins.png')
        game.load.image('settings/podium', 'assets/images/podium.png')
        game.load.image('settings/trophy', 'assets/images/trophy.png')
        game.load.image('settings/mode', 'assets/images/mode.png')
        game.load.image('settings/achieve', 'assets/images/achievements.png')
        game.load.image('settings/alert', 'assets/images/alert.png')
        
        game.load.image('mode/classic', 'assets/images/classic.png')
        game.load.image('mode/moving', 'assets/images/moving.png')
        game.load.image('mode/clone', 'assets/images/clone.png')
        game.load.image('mode/patience', 'assets/images/patience.png')
        game.load.image('mode/tilt', 'assets/images/tilt.png')
        game.load.image('mode/veil', 'assets/images/veil.png')
        game.load.image('mode/chance', 'assets/images/chance.png')
        
        game.load.image('effect/star1', 'assets/images/effects/star1.png')
        game.load.image('effect/star2', 'assets/images/effects/star2.png')
        game.load.image('effect/star3', 'assets/images/effects/star3.png')
        game.load.image('effect/star4', 'assets/images/effects/star4.png')
        game.load.image('effect/star5', 'assets/images/effects/star5.png')
        game.load.image('effect/star6', 'assets/images/effects/star6.png')
        game.load.image('effect/star7', 'assets/images/effects/star7.png')
        game.load.image('effect/star8', 'assets/images/effects/star8.png')
        game.load.image('effect/bubble1', 'assets/images/effects/bubble1.png')
        game.load.image('effect/moon1', 'assets/images/effects/moon.png')
	},
  	create: function(){
  		if (v.mobile){window.ga.trackTiming('Load Times', Date.now() - timerStart, 'Boot')}
  		game.state.start("titleMenu")
	},
}

var pre_preload = function(game){}

pre_preload.prototype = {
	preload: function(){ 
		game.load.image('splashscreen', 'assets/images/icons/Splashcreen.png')
	},
  	create: function(){
  		game.state.start("Preload")
	},
}