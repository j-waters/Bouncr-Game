var boot = function(game){
    console.log("%cStarting Bouncr", "color:white; background:red");
};

function androidScale(scale){
	scale.scaleMode = Phaser.ScaleManager.RESIZE;
	scale.fullScreenScaleMode = Phaser.ScaleManager.RESIZE;
	scale.parentIsWindow = true;
	scale.windowConstraints.bottom = "visual";
	//scale.setShowAll()
	window.addEventListener('resize', function(){game.state.start(game.state.current);})
	//scale.minWidth = v.gameWidth/3;
	//scale.minHeight = v.gameHeight/3;
	//scale.maxWidth = v.gameWidth * 2.5;
	//scale.maxHeight = v.gameHeight * 2.5;
	scale.pageAlignHorizontally = true;
	scale.pageAlignVertically = true;
	scale.forceOrientation(false, true);
	scale.updateLayout();
	scale.refresh();
}

boot.prototype = {
    preload: function(){
    },
    
    create: function(){
    	load()
    	console.log(this.game.device.desktop)
    	if (this.game.device.desktop){
    		//this.scale.fullScreenScaleMode = Phaser.ScaleManager.SHOW_ALL;
    		//this.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
    		this.scale.pageAlignHorizontally = true;
    		this.scale.pageAlignVertically = true;
    		this.scale.windowConstraints.bottom = "visual";
    		this.scale.updateLayout();
    		this.scale.refresh();
    		v.mobile = false
    	}
    	else {
    		//if (v.playGames) {window.plugins.playGamesServices.auth();}
    		androidScale(this.scale)
    		v.mobile = false
    	}
    	
    	game.time.desiredFps = 60
    	game.time.advancedTiming = true
    	
        this.game.state.start("Pre_Preload");
    }
}