var titleMenu = function(game){}

titleMenu.prototype = {
	create: function(){
		load()
		if (v.mobile){
			AdMob.showBanner(AdMob.AD_POSITION.BOTTOM_CENTER)
			//window.cordova.plugins.firebase.analytics.setEnabled(true)
			window.FirebasePlugin.logEvent("view_page", {page: "title_menu"});
			//window.cordova.plugins.firebase.analytics.logEvent("page_view", {page: "title_menu"});
		}
		resizeScreen(game.scale)
		this.game.stage.backgroundColor = v.backgroundColour;
		p = new player();
		game.add.existing(p)
		
		playt = this.game.add.text(0.5 * game.width, 0.5 * game.height, "tap to play", {fill: v.playerColour, fontSize: 0.03 * game.height})
		playt.anchor.set(0.5, 0.5)
		this.game.add.tween(playt).to({ alpha: 0.5 }, 1500, null, null, null, null, true).start();
		
		titlet = this.game.add.text(0.5 * game.width, 0.27 * game.height, "bouncr", {fill: v.playerColour, font: "bold Arial", fontSize: 0.1 * game.height})
		titlet.anchor.set(0.5, 0.5)
		
		hight = this.game.add.text(0.5 * game.width, 0.33 * game.height, "top: " + v.highScore, {fill: v.playerColour, fontSize: 0.03 * game.height})
		hight.anchor.set(0.5, 0.5)
		
		game.input.onDown.add(this.startGame, this);
		
		settingsb = new menuButton(0.14 * game.width, 0.5 * game.height, "settings/cog", this.goSettings, this)
		
		skinsb = new menuButton(0.86 * game.width, 0.5 * game.height, "settings/skins", this.goSkins, this)
		
		leaderb = new menuButton(0.14 * game.width, 0.6 * game.height, "settings/podium", this.leaderboard, this)
		
		challengeb = new menuButton(0.86 * game.width, 0.6 * game.height, "settings/trophy", this.challenge, this)
	},
	
	render: function(){
	},
	
	startGame: function(){
		if (game.input.position.x > 0.2 * game.width && game.input.position.x < 0.8 * game.width){
			if (v.mobile){AdMob.hideBanner()}
			v.distance = 0;
			v.score = 0;
			v.gameEnd = false;
			v.speed = 5;
			this.game.state.start("theGame");
		}
	},
	
	goSettings: function(){
		this.game.state.start("settings")
	},
	
	goSkins: function(){
		this.game.state.start("skins")
	},
	
	leaderboard: function(){
		window.plugins.playGamesServices.showAllLeaderboards(null, function(){window.plugins.playGamesServices.auth();});
	},
	
	challenge: function(){
		this.game.state.start("challenges")
	}
}

var settings = function(game){}

settings.prototype = {
	create: function(){
		load()
		if (v.mobile){window.FirebasePlugin.logEvent("test", {page: "title_menu"});}
		titlet = this.game.add.text(0.5 * game.width, 0.16 * game.height, "settings", {fill: v.playerColour, font: "bold Arial", fontSize: 0.12 * game.height})
		titlet.anchor.set(0.5, 0.5)
		
		if (v.mobile){
			cordova.getAppVersion.getVersionNumber(function (version) {
		    v.version = version + "-alpha";
			});
		
			version = this.game.add.text(0.5 * game.width, 0.24 * game.height, "version: " + v.version, {fill: v.playerColour, font: "bold Arial", fontSize: 0.02 * game.height})
			version.anchor.set(0.5, 0.5)
		}
		backb = new menuButton(0.07 * game.width, 0.04 * game.height, "settings/back", this.goTitle, this)
		
		settings = game.add.group()
		
		order = 0
		s = new settingsOption(order, "Leave a Review", this.review)
		settings.add(s)
		
		order++
		s = new settingsOption(order, "Remove Ads", this.removeAds)
		settings.add(s)
		
		document.addEventListener("backbutton", function(){this.goTitle()}.bind(this));
	},
	
	update: function(){
		if (this.game.input.activePointer.isDown) {	
			if (this.game.origDragPoint) {
				v.scroll += this.game.origDragPoint.y - this.game.input.activePointer.position.y;	
			}
			this.game.origDragPoint = this.game.input.activePointer.position.clone();
		}
		else {
			this.game.origDragPoint = null;
			if (v.scroll < 0 && this.scrollTween == null){
				this.scrollTween = this.game.add.tween(v).to({ scroll: 0 }, 200, Phaser.Easing.Exponential.out, true);
				this.scrollTween.onComplete.add(function(){this.scrollTween = null}, this)
			}
			if (v.scroll > (0) * 200  && this.scrollTween == null){
				this.scrollTween = this.game.add.tween(v).to({ scroll: (0) * 200 }, 200, Phaser.Easing.Exponential.out, true);
				this.scrollTween.onComplete.add(function(){this.scrollTween = null}, this)
			}
		}
	},
	
	goTitle: function(){
		save()
		this.game.state.start("titleMenu")
	},
	
	removeAds: function(){
		alert("This doesn't do anything yet. Eventually you will be able to pay £1-2 to remove adverts.")
	},
	
	review: function(){
		LaunchReview.launch("com.lightopa.bouncr");
	}
}

var skins = function(game){}

skins.prototype = {
	create: function(){
		load()
		
		titlet = this.game.add.text(0.5 * game.width, 0.16 * game.height, "themes", {fill: v.playerColour, font: "bold Arial", fontSize: 0.12 * game.height})
		titlet.anchor.set(0.5, 0.5)
		
		backb = new menuButton(0.07 * game.width, 0.04 * game.height, "settings/back", this.goTitle, this)
		
		this.skins = game.add.group()
		
		for (i=0; i < Object.keys(v.themes).length; i++){
			sk = new themeUnlock(i)
			this.skins.add(sk)
		}
		
		v.scroll = 0;
		
		document.addEventListener("backbutton", function(){this.goTitle()}.bind(this));
		
		this.scrollTween = null;
	},
	
	update: function(){
		if (this.game.input.activePointer.isDown) {	
			if (this.game.origDragPoint) {
				v.scroll += this.game.origDragPoint.y - this.game.input.activePointer.position.y;	
				}	// set new drag origin to current position	
			this.game.origDragPoint = this.game.input.activePointer.position.clone();
		}
		else {
			this.game.origDragPoint = null;
			if (v.scroll < 0 && this.scrollTween == null){
				this.scrollTween = this.game.add.tween(v).to({ scroll: 0 }, 200, Phaser.Easing.Exponential.out, true);
				this.scrollTween.onComplete.add(function(){this.scrollTween = null}, this)
			}
			if (v.scroll > (0.28 * game.width * this.skins.children.length) - (game.height * 0.6) && this.scrollTween == null){
				this.scrollTween = this.game.add.tween(v).to({ scroll: (0.28 * game.width * this.skins.children.length) - (game.height * 0.6) }, 200, Phaser.Easing.Exponential.out, true);
				this.scrollTween.onComplete.add(function(){this.scrollTween = null}, this)
			}
		}
	},
	
	goTitle: function(){
		save()
		this.game.state.start("titleMenu")
	}
}

var challenges = function(game){}

challenges.prototype = {
	create: function(){
		load()
		
		titlet = this.game.add.text(0.5 * game.width, 0.16 * game.height, "Challenges", {fill: v.playerColour, font: "bold Arial", fontSize: 0.1 * game.height})
		titlet.anchor.set(0.5, 0.5)
		
		backb = new menuButton(0.07 * game.width, 0.04 * game.height, "settings/back", this.goTitle, this)
	},
	
	goTitle: function(){
		save()
		this.game.state.start("titleMenu")
	}
}