var theGame = function(game){}

theGame.prototype = {
		preload: function(){
			var width = 0.5 * game.width
			var height = 0.047 * game.height

			var rectangle = game.make.bitmapData(width, height);
			rectangle.rect(0, 0, width, height, v.obstacleColour);
			game.cache.addBitmapData('obst_rectangle', rectangle);
			
			width = 0.08 * game.height
			
			var circle = game.make.bitmapData(width, width);
			circle.circle(width/2, width/2, width/2, v.obstacleColour);
			game.cache.addBitmapData('obst_circle', circle);
			
			var triangle = game.make.graphics(0, 0);
			triangle.beginFill(parseInt(v.obstacleColour.replace(/^#/, ''), 16));
			triangle.drawPolygon([0, 0, width/2, Math.sqrt(0.75) * width, width, 0, 0, 0])
			triangle.endFill();
			triangle = triangle.generateTexture()
			game.cache.addRenderTexture('obst_triangle', triangle);
			
			if (v.mobile){window.ga.trackView('Start Game')}
            else {ga('send', 'pageview', 'Start Game');}
		},

		create: function(){
			this.game.forceSingleUpdate = true;
			game.stage.backgroundColor = v.backgroundColour;
			backgroundEffect()
			
			this.scoreText = this.game.add.text(0.5 * game.width, 0.4 * game.height, 0, {fill: v.playerColour, font:"bold Arial", fontSize: 300/1280 * game.height})
			this.scoreText.alpha = 0.1;
			this.scoreText.anchor.set(0.5, 0.5);
			
			game.input.maxPointers = 1
			
			p = new player();
			game.add.existing(p)
			
			v.obstacles = game.add.group();
						
			this.finished = false;
			
			v.startTime = new Date();
		},
		
		render: function(){
			if (false){
				game.debug.renderShadow = false
		    	game.debug.font = '30px Arial bold'
		    	game.debug.lineHeight = 30
		    	this.game.debug.start(20, 40, 'red');
		    	this.game.debug.line("FPS: " + game.time.fps);
		    	this.game.debug.line("Desired FPS: " + game.time.desiredFps);
		    	this.game.debug.line("Suggested FPS: " + game.time.suggestedFps);
		    	this.game.debug.line("FPS Mod: " + v.fpsMod);
		    	this.game.debug.stop();
			}
		},
		
		update: function(){
			if (v.gameEnd == false){
				if (v.mode != "patience" || (v.mode == "patience" && game.input.activePointer.isDown)){
					v.distance += 1;
					v.speed += 0.002
				}
				v.stats.fps.list.push(game.time.fps)
			}
			else {
				if (this.finished == false){
					stats()
					if (v.mobile){
						window.FirebasePlugin.logEvent("game_end", {mode: v.mode, score: v.score, theme: v.themes[v.themeOrder].name});

						window.ga.trackMetric(1, v.score, function(){
							window.ga.trackMetric(2, v.stats.fps.average, function(){
								window.ga.trackMetric(5, game.time.desiredFps, function(){
									window.ga.trackMetric(6, 1, function(){
										window.ga.trackView('End Game')
										window.ga.trackEvent('Game', 'End', "", v.score)
									}, function(e){console.log("Metric6 Error: " + e)})
								}, function(e){console.log("Metric5 Error: " + e)})
							}, function(e){console.log("Metric2 Error: " + e)})
						}, function(e){console.log("Metric1 Error: " + e)})
					}
                else {
                    ga('set', 'metric1', v.score);
                    ga('set', 'metric2', v.stats.fps.average);
                    ga('set', 'metric5', game.time.desiredFps);
                    ga('set', 'metric6', 1);

                    ga('send', 'event', 'Game', 'End', "", v.score)
                    ga('send', 'pageview', 'End Game');
                }
					if (v.mobile && v.removedAds == false){AdMob.showBanner(AdMob.AD_POSITION.BOTTOM_CENTER)}
					this.finished = true;
					
					saveCanvas()
					
					if (v.stats.plays == 1 && game.time.desiredFps < 45){
						v.fpsAlert = true
					}
					
					var newch = false
					v.tempProg = 0
					if (v.completed < v.challenges.length){
						if (v.challenges[v.completed].mode == v.mode || v.challenges[v.completed].mode == ""){
							if (v.challenges[v.completed].unlock[0] == "plays"){
								v.challengeProg += 1
							}
							if (v.challenges[v.completed].unlock[0] == "score"){
								v.challengeProg = v.score
							}
							if (v.challenges[v.completed].unlock[0] == "total"){
								v.challengeProg += v.score
							}
							if (v.challenges[v.completed].unlock[0] == "theme"){
								if (v.challenges[v.completed].unlock[2] == "any" && v.themeOrder != 0){
									v.challengeProg += 1
								}
								if (v.challenges[v.completed].unlock[2] == v.themeOrder){
									v.challengeProg += 1
								}
							}
							if (v.challengeProg >= v.challenges[v.completed].unlock[1]){
								v.completed += 1
								v.challengeProg = 0
								newch = true
							}
						}
					}
					
					save()

					game.time.events.add(300, function(){
						game.input.onDown.add((newch == false) ? this.goTitle : this.goChallenge, this);
					}, this);
				}
			}
			this.scoreText.text = v.score
			var mod = (v.mode != "chance") ? 0 : 20
			var distMod = (v.mode != "chance") ? 0.24 : 0.35
			if (Math.floor(v.distance) % Math.floor((60 + mod)/ v.fpsMod) == 0){
				if (v.mode == "classic") {e = new obstacle();}
				if (v.mode == "moving" || v.mode == "clone") {e = new movingObstacle(v.mode);}
				if (v.mode == "patience" || v.mode == "tilt" || v.mode == "veil"|| v.mode == "chance"){
					switch (randomInt(1, 3)) {
						case 1:
						case 2:
							e = new obstacle();
							break;
						case 3:
							e = new movingObstacle("moving");
							break;
					}
				}
				v.obstacles.add(e)
				v.distance += 1 + Math.floor((distMod * v.score)/v.fpsMod)
			}
		},
		
		goTitle: function(){
			this.game.state.start("titleMenu");
		},
		
		goChallenge: function(){
			game.state.start("newChallenge")
		}
}
