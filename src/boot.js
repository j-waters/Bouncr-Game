var boot = function(game){
    console.log("%cStarting Bouncr", "color:white; background:red");
};

boot.prototype = {
    preload: function(){
    },
    
    create: function(){
    	load()
    	if (this.game.device.desktop || this.game.device.iPhone){
    		this.game.scale.fullScreenScaleMode = Phaser.ScaleManager.SHOW_ALL;
    		this.game.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
    		this.game.scale.windowConstraints.bottom = "visual";
    		this.scale.pageAlignHorizontally = true;
    		this.scale.pageAlignVertically = true;
    		this.scale.windowConstraints.bottom = "visual";
    		this.scale.updateLayout();
    		this.scale.refresh();
    		v.mobile = false
    	}
    	else {
    		cordova.getAppVersion.getVersionNumber(function(version){v.version = version + "-beta"})
    		if (v.playGames) {window.plugins.playGamesServices.auth();}
    		this.androidScale(this.scale)
    		v.mobile = true
    	}
    	    	
    	game.time.desiredFps = 60
    	game.time.advancedTiming = true
    	
        this.game.state.start("Pre_Preload");
    },
    
    androidScale: function(scale){
    	scale.scaleMode = Phaser.ScaleManager.USER_SCALE;
    	scale.fullScreenScaleMode = Phaser.ScaleManager.USER_SCALE;
    	scale.windowConstraints.bottom = "visual";
    	scale.windowConstraints.right = "layout";
    	window.addEventListener('resize', function(){resizeScreen(game.scale); game.state.start(game.state.current); console.log("OTHER RESIZE")})
    	//this.game.scale.setResizeCallback(this.resizeCallback, this);
    	resizeScreen(scale)
    	scale.pageAlignHorizontally = true;
    	scale.pageAlignVertically = true;
    	scale.forceOrientation(false, true);
    	scale.updateLayout();
    	scale.refresh();
    },
}

function resizeScreen(manager){
    var userRatio = 1;
    if (this.game.device.pixelRatio > 1){
    	userRatio = this.game.device.pixelRatio * 1;
    }
    if(manager.width !== window.innerWidth*userRatio || manager.height !== window.innerHeight*userRatio){
    	manager.setGameSize(window.innerWidth*userRatio,window.innerHeight*userRatio);
    	manager.setUserScale(1/userRatio, 1/userRatio);
    }
}