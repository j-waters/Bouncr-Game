var titleMenu = function(game){}

titleMenu.prototype = {
	create: function(){
		load()
		if (v.mobile){
			if (v.removedAds == false){AdMob.showBanner(AdMob.AD_POSITION.BOTTOM_CENTER)}
		}
		resizeScreen(game.scale)
		this.game.stage.backgroundColor = v.backgroundColour;
		backgroundEffect()
		p = new player();
		game.add.existing(p)
		
		playt = this.game.add.text(0.5 * game.width, 0.5 * game.height, "tap to play", {fill: v.playerColour, fontSize: 0.03 * game.height})
		playt.anchor.set(0.5, 0.5)
		this.game.add.tween(playt).to({ alpha: 0.5 }, 1500, null, null, null, null, true).start();
		
		titlet = this.game.add.text(0.5 * game.width, 0.27 * game.height, "bouncr", {fill: v.playerColour, font: "bold Arial", fontSize: 0.1 * game.height})
		titlet.anchor.set(0.5, 0.5)
		if (v.mode == "veil"){while (titlet.width > 0.4 * game.width){titlet.fontSize--}}
		
		hight = this.game.add.text(0.5 * game.width, 0.33 * game.height, "top: " + v.highScore[v.mode], {fill: v.playerColour, fontSize: 0.03 * game.height})
		hight.anchor.set(0.5, 0.5)
		
		game.input.onDown.add(this.startGame, this);
		
		settingsb = new menuButton(0.14 * game.width, 0.5 * game.height, "settings/cog", this.goSettings, this)
		
		skinsb = new menuButton(0.86 * game.width, 0.5 * game.height, "settings/skins", this.goSkins, this)
		
		leaderb = new menuButton(0.14 * game.width, 0.6 * game.height, "settings/podium", this.leaderboard, this)
		
		challengeb = new menuButton(0.86 * game.width, 0.6 * game.height, "settings/trophy", this.challenge, this)
		
		modeb = new menuButton(0.5 * game.width, 0.4 * game.height, "settings/mode", this.mode, this)
	},
	
	render: function(){
	},
	
	shutdown: function(){
		if (v.backgroundEffect){
			game.stage.addChild(v.backEffectGroup)
			v.backEffectGroup.visible = false
		}
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
		v.scroll = 0;
		this.game.state.start("settings")
		window.ga.trackView('Settings Screen')
	},
	
	goSkins: function(){
		v.scroll = 0;
		this.game.state.start("skins")
		window.ga.trackView('Themes Screen')
	},
	
	leaderboard: function(){
		window.plugins.playGamesServices.showAllLeaderboards(null, function(){window.plugins.playGamesServices.auth();});
		window.ga.trackView('Leaderboard Screen')
	},
	
	challenge: function(){
		this.game.state.start("challenges")
		window.ga.trackView('Challenges Screen')
	},
	
	mode: function(){
		v.scroll = 0;
		this.game.state.start("mode")
		window.ga.trackView('Mode Screen')
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
			if (v.scroll > (0) * 200  && this.scrollTween == null  && v.scroll != 0){
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
		store.when("remove ads").approved(function(product){
		    v.removedAds = true;
		    product.finish();
		    save()
		    alert("Removed Ads!")
		});
		
		store.refresh();
		
		store.order("remove ads")
		//alert("This doesn't do anything yet. Eventually you will be able to pay £1-2 to remove adverts.")
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
			if (v.scroll > (0.28 * game.width * this.skins.children.length) - (game.height * 0.6) && this.scrollTween == null && v.scroll != 0){
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
		while (titlet.width > 0.95 * game.width){titlet.fontSize--}
		
		desct = this.game.add.text(0.5 * game.width, 0.22 * game.height, "Complete challanges to unlock themes and other game modes", {fill: v.playerColour, font: "bold Arial", fontSize: 0.02 * game.height, align: 'center', wordWrap: true, wordWrapWidth: 0.9 * game.width})
		desct.anchor.set(0.5, 0)
		
		challengenot = this.game.add.text(0.5 * game.width, 0.28 * game.height, "COMPLETED CHALLENGES", {fill: v.playerColour, font: "bold Arial", fontSize: 0.038 * game.height})
		challengenot.anchor.set(0.5, 0)
		while (challengenot.width > 0.95 * game.width){challengenot.fontSize--}
		
		challengeno = this.game.add.text(0.5 * game.width, 0.32 * game.height, v.completed + " / " + v.challenges.length, {fill: v.playerColour, font: "bold Arial", fontSize: 0.038 * game.height})
		challengeno.anchor.set(0.5, 0)
		
		cb = this.game.make.bitmapData(0.9 * game.width, 0.4 * game.height)
		cb.ctx.fillStyle = v.playerColour
		cb.ctx.strokeStyle = v.backgroundColour
		cb.ctx.roundRect(0, 0, 0.9 * game.width, 0.4 * game.height, 20)
		cb.ctx.fill();
		if (v.completed < v.challenges.length){
			var percentage = v.challengeProg / v.challenges[v.completed].unlock[1]
			cb.ctx.strokeStyle = v.obstacleColour
			cb.ctx.beginPath();
			cb.ctx.lineWidth = 0.03 * game.height;
			cb.ctx.arc(0.45 * game.width, 0.27 * game.height, 0.09 * game.height, 0, 2*Math.PI);
			cb.ctx.stroke();
			
			cb.ctx.strokeStyle = v.backgroundColour
			cb.ctx.beginPath();
			cb.ctx.arc(0.45 * game.width, 0.27 * game.height, 0.09 * game.height, -0.5*Math.PI, 2*Math.PI * percentage -0.5*Math.PI);
			cb.ctx.stroke();
		}
		
		challenge = this.game.add.sprite(0.5 * game.width, 0.38 * game.height, cb)
		challenge.anchor.set(0.5, 0)
		
		if (v.completed < v.challenges.length){
			thischallengeno = this.game.add.text(0.5 * game.width, 0.39 * game.height, "Challenge " + (v.completed + 1), {fill: v.backgroundColour, font: "bold Arial", fontSize: 0.06 * game.height})
			thischallengeno.anchor.set(0.5, 0)
			
			challengedesc = this.game.add.text(0.5 * game.width, 0.47 * game.height, v.challenges[v.completed].description, {fill: v.backgroundColour, font: "bold Arial", fontSize: 0.03 * game.height, align: 'center', wordWrap: true, wordWrapWidth: 0.8 * game.width})
			challengedesc.anchor.set(0.5, 0)
			
			challengeprog = this.game.add.text(0.5 * game.width, 0.65 * game.height, v.challengeProg, {fill: v.backgroundColour, font: "bold Arial", fontSize: 0.09 * game.height})
			challengeprog.anchor.set(0.5, 0.5)
		}
		else {
			challengedesc = game.add.text(0.5 * game.width, 0.58 * game.height, "All Challenges Completed!", {fill: v.backgroundColour, font: "bold Arial", fontSize: 0.08 * game.height, align: 'center', wordWrap: true, wordWrapWidth: 0.8 * game.width})
			challengedesc.anchor.set(0.5, 0.5)
		}
		
		backb = new menuButton(0.07 * game.width, 0.04 * game.height, "settings/back", this.goTitle, this)
		
		document.addEventListener("backbutton", function(){this.goTitle()}.bind(this));
	},
	
	goTitle: function(){
		save()
		this.game.state.start("titleMenu")
	}
}

var newChallenge = function(game){}

newChallenge.prototype = {
	create: function(){
		this.game.stage.backgroundColor = v.backgroundColour;
		p = new player();
		game.add.existing(p)
		
		c1 = new challengeBubble(0)
		this.game.add.existing(c1)
		
		c2 = new challengeBubble(1)
		this.game.add.existing(c2)
				
		playt = this.game.add.text(0.5 * game.width, 0.55 * game.height, "tap to continue", {fill: v.playerColour, fontSize: 0.03 * game.height})
		playt.anchor.set(0.5, 0.5)
		this.game.add.tween(playt).to({ alpha: 0.5 }, 1500, null, null, null, null, true).start();
		
		var st = 1
		
		game.time.events.add(500, function(){
			game.input.onDown.add(function(){
				if (st == 1){
					this.game.add.tween(c1).to({x: -0.5 * game.width}, 750).start()
					this.game.add.tween(c2).to({x: 0.5 * game.width}, 750).start()
					st += 1
				}
				else if (st == 2){
					t = this.game.add.tween(c2).to({x: -0.5 * game.width}, 750).start()
					this.game.add.tween(playt).to({x: -0.5 * game.width}, 750).start()
					t.onComplete.add(function(){
						this.game.state.start("titleMenu")
					})
				}
			}, this);
		}, this)
	}
}

var mode = function(game){}

mode.prototype = {
	create: function(){
		load()
		titlet = this.game.add.text(0.5 * game.width, 0.16 * game.height, "mode", {fill: v.playerColour, font: "bold Arial", fontSize: 0.12 * game.height})
		titlet.anchor.set(0.5, 0.5)
		
		backb = new menuButton(0.07 * game.width, 0.04 * game.height, "settings/back", this.goTitle, this)
		
		this.modes = game.add.group()
		
		order = 0
		
		m = new modeOption(order, "classic")
		this.modes.add(m)
		
		order++
		m = new modeOption(order, "moving")
		this.modes.add(m)
		
		order++
		m = new modeOption(order, "clone")
		this.modes.add(m)
		
		order++
		m = new modeOption(order, "patience")
		this.modes.add(m)
		
		order++
		m = new modeOption(order, "tilt")
		this.modes.add(m)
		
		order++
		m = new modeOption(order, "veil")
		this.modes.add(m)
		
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
			if (v.scroll > (0.28 * game.width * this.modes.children.length) - (game.height * 0.6)  && this.scrollTween == null  && v.scroll != 0){
				this.scrollTween = this.game.add.tween(v).to({ scroll: (0.28 * game.width * this.modes.children.length) - (game.height * 0.6) }, 200, Phaser.Easing.Exponential.out, true);
				this.scrollTween.onComplete.add(function(){this.scrollTween = null}, this)
			}
		}
	},
	
	goTitle: function(){
		save()
		this.game.state.start("titleMenu")
	}
}