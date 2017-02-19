var theGame = function(game){}

theGame.prototype = {
		create: function(){
			this.game.forceSingleUpdate = true;
			game.stage.backgroundColor = v.backgroundColour;
			console.log("start game")
			
			this.scoreText = this.game.add.text(0.5 * game.width, 0.4 * game.height, 0, {fill: v.playerColour, font:"bold Arial", fontSize: 300/1280 * game.height})
			this.scoreText.alpha = 0.1;
			this.scoreText.anchor.set(0.5, 0.5);
			
			p = new player();
			game.add.existing(p)
			
			v.obstacles = game.add.group();
						
			this.finished = false;
		},
		
		render: function(){
			if (false){
				game.debug.renderShadow = false
		    	game.debug.font = '30px Courier bold'
		    	game.debug.lineHeight = 30
		    	this.game.debug.start(20, 40, 'red');
		    	this.game.debug.line("FPS: " + game.time.fps);
		    	this.game.debug.stop();
			}
		},
		
		update: function(){
			if (v.gameEnd == false){
				v.distance += 1;
				v.speed += 0.002
			}
			else {
				if (this.finished == false){
					if (v.mobile){AdMob.showBanner(AdMob.AD_POSITION.BOTTOM_CENTER)}
					this.finished = true;
					v.plays++
					game.stage.backgroundColor = (v.obstacleColour != "#ffffff") ? v.obstacleColour : "#000014";
					document.body.style.backgroundColor = (v.obstacleColour != "#ffffff") ? v.obstacleColour : "#000014"
					this.scoreText.alpha = 1;
					this.scoreText.fill = "#ffffff"
					this.scoreText.bringToTop()
					
					while (v.obstacles.children.length != 1){
			    		if (v.obstacles.children[1] != v.gameEndTarget){
			    			v.obstacles.children[1].destroy()
			    		}
			    		else {
			    			v.obstacles.children.push(v.obstacles.children.shift());
			    		}
			    	}
					
					v.score = Math.ceil(v.score)
					
					if (v.score > v.highScore){
						v.highScore = v.score
					}
					
					var newch = false
					if (v.completed < Object.keys(v.challenges).length){
						if (v.challenges[(v.completed).toString()].unlock[0] == "plays"){
							v.challengeProg += 1
						}
						if (v.challenges[(v.completed).toString()].unlock[0] == "score"){
							v.challengeProg = v.score
						}
						if (v.challenges[(v.completed).toString()].unlock[0] == "total"){
							v.challengeProg += v.score
						}
						if (v.challengeProg >= v.challenges[(v.completed).toString()].unlock[1]){
							v.completed += 1
							v.challengeProg = 0
							newch = true
						}
					}
					
					save()

					hight = this.game.add.text(0.5 * game.width, 0.29 * game.height, "top: " + v.highScore, {fill: "#ffffff", boundsAlignH: "center", fontSize: 0.03 * game.height})
					hight.anchor.set(0.5, 0.5)
					
					playt = this.game.add.text(0.5 * game.width, 0.5 * game.height, "tap to play again", {fill: "#ffffff", boundsAlignH: "center", fontSize: 0.03 * game.height})
					playt.anchor.set(0.5, 0.5)
					this.game.add.tween(playt).to({ alpha: 0.5 }, 1500, null, null, null, null, true).start();
					
					
					game.time.events.add(300, function(){
						game.input.onDown.add((newch == false) ? this.goTitle : this.goChallenge, this);
					}, this);
				}
			}
			this.scoreText.text = v.score
			if (Math.floor(v.distance) % 60 == 0){
				e = new obstacle();
				v.obstacles.add(e)
			}
		},
		
		goTitle: function(){
			this.game.state.start("titleMenu");
		},
		
		goChallenge: function(){
			game.state.start("newChallenge")
		}
}