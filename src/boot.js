var boot = function(game){
    console.log("%cStarting Bouncr", "color:white; background:red");
};

boot.prototype = {
    preload: function(){
    },
    
    create: function(){
    	load()
    	if (this.game.device.desktop || this.game.device.iPhone){
    		this.game.scale.setGameSize(window.innerHeight * 0.5625, window.innerHeight);
    		this.game.scale.fullScreenScaleMode = Phaser.ScaleManager.SHOW_ALL;
    		this.game.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
    		this.scale.pageAlignHorizontally = true;
    		this.scale.pageAlignVertically = true;
    		this.scale.windowConstraints.bottom = "visual";
    		this.scale.updateLayout();
    		this.scale.refresh();
    		v.mobile = false
    	}
    	else {
    		this.androidScale(this.scale)
    		v.mobile = true
    		if (v.mobile){
    			window.ga.startTrackerWithId('UA-92975224-3', 30)
    			window.ga.trackView('Launch App', '', true)
    			window.ga.enableUncaughtExceptionReporting(true)
    			if (v.playGames) {window.plugins.playGamesServices.auth();}
    			
    			document.addEventListener("pause", function(){game.paused = true}, false);
    			document.addEventListener("resume", function(){game.paused = false}, false);
    			
    			cordova.getAppVersion.getVersionNumber(function(version){v.version = version; window.ga.setAppVersion(v.version); Raven.setRelease(version)})
    			store.register({
    				id: "remove_adverts",
    			    alias: "remove ads",
    			    type: store.CONSUMABLE
    			});
    			store.refresh()
    		}
    	}
    	
    	game.time.advancedTiming = true
    	game.time.desiredFps = 60
    	
        this.game.state.start("Pre_Preload");
    },
    
    androidScale: function(scale){
    	scale.scaleMode = Phaser.ScaleManager.USER_SCALE;
    	scale.fullScreenScaleMode = Phaser.ScaleManager.USER_SCALE;
    	scale.windowConstraints.bottom = "visual";
    	scale.windowConstraints.right = "layout";
    	window.addEventListener('resize', function(){resizeScreen(game.scale); game.state.start(game.state.current)})
    	resizeScreen(scale)
    	scale.pageAlignHorizontally = true;
    	scale.pageAlignVertically = true;
    	scale.forceOrientation(false, true);
    	scale.updateLayout();
    	scale.refresh();
    },
}

function resizeScreen(manager){
    var userRatio = 1; //0.8 limit
    if (this.game.device.pixelRatio > 1){
    	userRatio = this.game.device.pixelRatio * 1;
    }
    if (manager.width !== window.innerWidth*userRatio || manager.height !== window.innerHeight*userRatio){
    	manager.setGameSize(window.innerWidth*userRatio,window.innerHeight*userRatio);
    	if (this.game.device.desktop){this.game.scale.setGameSize(window.innerHeight * 0.5625 *userRatio, window.innerHeight*userRatio);}
    	manager.setUserScale(1/userRatio, 1/userRatio);
    }
}