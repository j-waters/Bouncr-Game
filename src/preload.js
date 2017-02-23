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
        
        game.load.image('mode/classic', 'assets/images/classic.png')
        game.load.image('mode/moving', 'assets/images/moving.png')
        game.load.image('mode/clone', 'assets/images/clone.png')
        game.load.image('mode/patience', 'assets/images/patience.png')
	},
  	create: function(){
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