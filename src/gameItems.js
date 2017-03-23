function player(){
	width = 0.08 * game.height
	var circle = game.make.bitmapData(width, width);
	circle.circle(width/2, width/2, width/2, v.playerColour);
	
	Phaser.Sprite.call(this, game, 0.5 * game.width, 0.7 * game.height, circle);
	this.anchor.set(0.5, 0.5)
	
	var line = game.add.bitmapData(game.width, 0.008 * game.height);
	line.line(0, 0.004 * game.height, game.width, 0.004 * game.height, v.playerColour, 0.0016 * game.height)
	game.add.sprite(0, 0.7 * game.height, line)
	
	if (v.mode == "veil"){
		var mask = game.make.bitmapData(game.width * 3, game.height);
		mask.rect(0, 0, game.width * 1.3, game.height, v.obstacleColour)
		mask.rect((game.width) * 1.7, 0, game.width * 1.2, game.height, v.obstacleColour)
		mask.rect(0, game.height * 0.7, game.width * 3, game.height * 0.3, v.obstacleColour)
		mask.rect(0, 0, game.width * 3, game.height * 0.15, v.obstacleColour)
		//mask.rect(0, 0, game.width * 3, game.height, v.obstacleColour)
		mask.ctx.fillStyle = v.obstacleColour;
		//mask.ctx.fillRect(0, 0, game.width * 3, game.height);
		
		mask.ctx.beginPath();
		mask.ctx.fillStyle = "rgba(0, 0, 0, 1)";
		mask.ctx.globalCompositeOperation = 'destination-out';
		mask.ctx.arc(game.width * 1.5, game.height * 0.7, 0.2 * game.width, 0, Math.PI*2);
		mask.ctx.arc(game.width * 1.5, game.height * 0.15, 0.2 * game.width, 0, Math.PI*2);
		mask.ctx.fill();
		mask.ctx.globalCompositeOperation = 'source-over';
		m = game.make.sprite(0, 0, mask)
		m.anchor.set(0.5, 0.7)
		this.addChild(m)
	}
	
	if (game.state.current == "theGame"){
		this.direction = 1
		if (v.mode != "patience"){
			if (v.mode == "chance"){this.direction = 0}
			game.input.onDown.add(function(){
				if (v.mode != "chance"){this.direction *= -1}
				if (v.mode == "chance" && v.gameEnd == false){this.x = randomInt(this.width/2, game.width - this.width/2)}
				if(v.gameEnd == false){if (v.challenges[v.completed].unlock[0] == "notouch" && (v.challenges[v.completed].mode == v.mode || v.challenges[v.completed].mode == "")){
					if (v.tempProg > v.challengeProg){v.challengeProg = v.tempProg}
					v.tempProg = 0
				}}
			}, this);
		}
		if (v.mode == "tilt"){
			this.direction = 0
			// Listen for the deviceorientation event and handle the raw data
			this.change = 0
			window.addEventListener('deviceorientation', function(eventData) {
				var tiltLR = eventData.gamma;
				this.change = tiltLR
				console.log(tiltLR)
			}.bind(this), false);
		}
	}
	
}

player.prototype = Object.create(Phaser.Sprite.prototype);
player.prototype.constructor = player;
player.prototype.update = function() {
	if (game.state.current == "theGame"){
		if (v.mode != "tilt"){this.change = (v.speed * 1.1) * this.direction * (game.width/720)}
		var side = false
		if (this.x + this.change >= game.width - this.width/2){
			this.direction *= -1;
			this.x = game.width - this.width/2 - 1
			side = true
		}
		else if (this.x + this.change <= 0 + this.width/2){
			this.direction *= -1;
			this.x = 0 + this.width/2 + 1
			side = true
		}
		if (side) {if (v.challenges[v.completed].unlock[0] == "sides" && (v.challenges[v.completed].mode == v.mode || v.challenges[v.completed].mode == "")){
			if (v.tempProg > v.challengeProg){v.challengeProg = v.tempProg}
			v.tempProg = 0
		}}
		if (v.mode != "tilt"){
			this.x += this.change;
		}
		else {
			this.x += (v.speed * 1.1) * sign(this.change) * (game.width/720)
			if (this.x >= game.width - this.width/2){
				this.x = game.width - this.width/2 - 1
				side = true
			}
			else if (this.x <= 0 + this.width/2){
				this.x = 0 + this.width/2 + 1
				side = true
			}
		}
	}
}

function obstacle(x, width, height, points){
	if (x == undefined) {
		switch (randomInt(1, 3)) {
			case 1: // Simple Block
				var width = randomInt(0.14 * game.width, 0.35 * game.width);
				var height = 0.04 * game.height;
				var x = randomInt(0 + width/2, game.width - width/2);
				this.points = 1;
				break;
			case 2: // Side
				var width = randomInt(0.42 * game.width, 0.55 * game.width);
				var height = 0.047 * game.height;
				if (randomInt(1, 2) == 1) {var x = 0 + width/2} else {var x = game.width - width/2}
				this.points = 1;
				break;
			case 3:
				var width = randomInt(0.17 * game.width, 0.42 * game.width);
				var height = 0.043 * game.height;
				var x = 0 + width/2
				this.points = 0.5;
				o = new obstacle(game.width - ((0.58 * game.width) - width)/2, (0.58 * game.width) - width, height, 0.5)
				v.obstacles.add(o)
				break;
		}
	}
	else {
		this.points = points;
	}
	
	this.otype = "rectangle";
	
	rectangle = game.cache.getBitmapData('obst_rectangle')
	Phaser.Sprite.call(this, game, x, -height/2, rectangle);
	this.width = width
	this.height = height
	
	this.anchor.set(0.5, 0.5)
	
	this.scored = false;
	
	if (Math.floor(v.distance) / 60 == v.highScore[v.mode]){
		hs = new hsLine(this.y)
		v.obstacles.add(hs)
		v.obstacles.sendToBack(hs)
	}
}

obstacle.prototype = Object.create(Phaser.Sprite.prototype);
obstacle.prototype.constructor = obstacle;
obstacle.prototype.update = function() {
	if (RectCircleColliding({x: p.x, y:p.y, r:p.width/2}, {x: this.x, y: this.y, w: this.width, h: this.height}) && v.gameEnd == false){
		v.gameEnd = true;
		v.gameEndTarget = this
    	v.speed = 0;
		gameEnd()
    }
	
	if (v.mode != "patience" || (v.mode == "patience" && game.input.activePointer.isDown)){
		this.y += v.speed * (game.height/1280);
	}
	
	if (this.y - this.height >= game.height){
		this.destroy()
	}
	if (this.y >= 0.7 * game.height && this.scored == false){
		v.score += this.points;
		this.scored = true;
		if ((v.challenges[v.completed].unlock[0] == "sides" || v.challenges[v.completed].unlock[0] == "notouch") && (v.challenges[v.completed].mode == v.mode || v.challenges[v.completed].mode == "")){
			v.tempProg += this.points
			if (v.tempProg > v.challengeProg){v.challengeProg = v.tempProg}
		}
	}
}

obstacle.prototype.die = function(){
	this.key.fill(hexToRgbA(v.backgroundColour)[0], hexToRgbA(v.backgroundColour)[1], hexToRgbA(v.backgroundColour)[2])
}

function gameEnd(){
	game.stage.backgroundColor = v.obstacleColour;
	while (v.obstacles.children.length != 1){
		if (v.obstacles.children[1] != v.gameEndTarget){
			//v.obstacles.children[1].kill()
			//v.deadObstacles.push(v.obstacles.children[1])
			v.obstacles.remove(v.obstacles.children[1], true)
		}
		else {
			v.obstacles.children.push(v.obstacles.children.shift());
		}
	}
	v.gameEndTarget.die()
	game.state.states["theGame"].scoreText.alpha = 1;
	game.state.states["theGame"].scoreText.fill = v.backgroundColour
	game.state.states["theGame"].scoreText.bringToTop()
	
	hight = this.game.add.text(0.5 * game.width, 0.29 * game.height, "top: " + v.highScore[v.mode], {fill: v.backgroundColour, boundsAlignH: "center", fontSize: 0.03 * game.height})
	hight.anchor.set(0.5, 0.5)
					
	playt = this.game.add.text(0.5 * game.width, 0.5 * game.height, "tap to play again", {fill: v.backgroundColour, boundsAlignH: "center", fontSize: 0.03 * game.height})
	playt.anchor.set(0.5, 0.5)
	this.game.add.tween(playt).to({ alpha: 0.5 }, 1500, null, null, null, null, true).start();
	
	sb = new shareButton()
	this.game.add.existing(sb)
	
	if (v.backgroundEffect){v.backEffectGroup.destroy()}
}
function movingObstacle(mode){
	this.mode = mode
	width = 0.08 * game.height
	if (this.mode == "moving"){
		rend = game.cache.getRenderTexture('obst_triangle').texture
		this.otype = "triangle"
	}
	
	if (this.mode == "clone"){
		rend = game.cache.getBitmapData('obst_circle')
		this.otype = "circle"
	}
	
	var x = randomInt(0 + width/2, game.width - width/2);
		
	this.points = 1
	this.speedMod = randomInt(7, 10)/10
	
	this.scored = false
	
	Phaser.Sprite.call(this, game, x, -width/2, rend);
	this.anchor.set(0.5, 0.5)
	
	var line = game.add.bitmapData(game.width, 0.008 * game.height);
	line.line(0, 0.004 * game.height, game.width, 0.004 * game.height, v.obstacleColour, 0.0016 * game.height)
	this.l = game.add.sprite(0, -0.1 * width, line)
	game.world.sendToBack(this.l)
	
	this.direction = 1 + (-2 * randomInt(0, 1))
	this.direction *= 0.9
	
	if (Math.floor(v.distance) / 60 == v.highScore[v.mode]){
		hs = new hsLine(this.y - 0.1 * width)
		v.obstacles.add(hs)
		v.obstacles.sendToBack(hs)
	}
	
	if (this.mode == "clone"){
		game.input.onDown.add(function(){
			this.direction *= -1
		}, this);
	}
	
}

movingObstacle.prototype = Object.create(Phaser.Sprite.prototype);
movingObstacle.prototype.constructor = movingObstacle;
movingObstacle.prototype.update = function() {
		x1 = this.x - this.width/2
		y1 = this.y - this.width/2
		x2 = this.x +this.width/2
		y2 = this.y - this.width/2
		x3 = this.x
		y3 = this.y + this.width/2
		trc = TriangleRectColliding({x1: x1, y1: y1, x2: x2, y2: y2, x3: x3, y3: y3}, {x: p.x, y:p.y, r:p.width/2})
		ccc = CircleCircleColliding({x: this.x, y: this.y, r: this.width/2}, {x: p.x, y:p.y, r:p.width/2})
		if ((this.mode == "moving" && trc) || (this.mode == "clone" && ccc)){
			v.gameEnd = true;
			v.gameEndTarget = this
	    	v.speed = 0;
			gameEnd()
		}
		var change = v.speed * this.direction * (game.width/720) * this.speedMod
		if (this.x + change >= game.width - this.width/2){
			this.direction *= -1;
			this.x = game.width - this.width/2 - 1
			side = true
		}
		if (this.x + change <= 0 + this.width/2){
			this.direction *= -1;
			this.x = 0 + this.width/2 + 1
			side = true
		}
		
		this.x += change;
		
		if (v.mode != "patience" || (v.mode == "patience" && game.input.activePointer.isDown)){
			this.y += v.speed * (game.height/1280);
		}
		
		this.l.y = this.y -0.1 * this.width
		
		if (this.y - this.height >= game.height){
			this.destroy()
		}
		if (this.y >= 0.7 * game.height && this.scored == false){
			v.score += this.points;
			this.scored = true;
			if ((v.challenges[v.completed].unlock[0] == "sides" || v.challenges[v.completed].unlock[0] == "notouch") && (v.challenges[v.completed].mode == v.mode || v.challenges[v.completed].mode == "")){
				v.tempProg += this.points
				if (v.tempProg > v.challengeProg){v.challengeProg = v.tempProg}
			}
		}
}

movingObstacle.prototype.die = function(){
	if (this.mode == "moving"){
		var rend = game.make.graphics(0, 0);
		rend.beginFill(parseInt(v.backgroundColour.replace(/^#/, ''), 16));
		rend.drawPolygon([0, 0, this.width/2, Math.sqrt(0.75) * this.width, this.width, 0, 0, 0])
		rend.endFill();
		rend = rend.generateTexture()
	}
	
	if (this.mode == "clone"){
		var rend = game.make.bitmapData(this.width, this.width);
		rend.circle(this.width/2, this.width/2, this.width/2, v.backgroundColour);
	}
	
	this.loadTexture(rend)
}

function hsLine(y){
	var line = game.add.bitmapData(game.width, 0.008 * game.height);
	for (i=0; i < game.width; i++){
		line.line(i*20, 0.004 * game.height, i*20 + 10, 0.004 * game.height, v.playerColour, 0.004 * game.height)
	}
	Phaser.Sprite.call(this, game, 0, y, line);
}

hsLine.prototype = Object.create(Phaser.Sprite.prototype);
hsLine.prototype.constructor = hsLine;
hsLine.prototype.update = function() {
	if (v.mode != "patience" || (v.mode == "patience" && game.input.activePointer.isDown)){
		this.y += v.speed * (game.height/1280);
	}
	if (this.y - 10 >= game.height){
		this.destroy()
	}
}


function randomInt(min, max){
	out = Math.floor(Math.random()*(max-min+1)+min);
    return out
}

function RectCircleColliding(circle, rect){
    var distX = Math.abs(circle.x - rect.x);
    var distY = Math.abs(circle.y - rect.y);

    if (distX > (rect.w/2 + circle.r)) { return false; }
    if (distY > (rect.h/2 + circle.r)) { return false; }

    if (distX <= (rect.w/2)) { return true; } 
    if (distY <= (rect.h/2)) { return true; }

    var dx=distX-rect.w/2;
    var dy=distY-rect.h/2;
    return (dx*dx+dy*dy<=(circle.r*circle.r));
}

function TriangleRectColliding(triangle, circle){
	 //corners
	 dist = Math.sqrt(Math.pow(triangle.x1 - circle.x, 2) + Math.pow(triangle.y1 - circle.y, 2))
	 if (dist < circle.r){ return true;}
	 
	 dist = Math.sqrt(Math.pow(triangle.x2 - circle.x, 2) + Math.pow(triangle.y2 - circle.y, 2))
	 if (dist < circle.r){ return true;}
	 
	 dist = Math.sqrt(Math.pow(triangle.x3 - circle.x, 2) + Math.pow(triangle.y3 - circle.y, 2))
	 if (dist < circle.r){ return true;}
	 
	 //sides
	 dist = Math.sqrt(Math.pow((triangle.x1 + triangle.x2)/2 - circle.x, 2) + Math.pow((triangle.y1 + triangle.y2)/2 - circle.y, 2))
	 if (dist < circle.r){ return true;}
	 
	 dist = Math.sqrt(Math.pow((triangle.x2 + triangle.x3)/2 - circle.x, 2) + Math.pow((triangle.y2 + triangle.y3)/2 - circle.y, 2))
	 if (dist < circle.r){ return true;}
	 
	 dist = Math.sqrt(Math.pow((triangle.x3 + triangle.x1)/2 - circle.x, 2) + Math.pow((triangle.y3 + triangle.y1)/2 - circle.y, 2))
	 if (dist < circle.r){ return true;}
}

function CircleCircleColliding(circle1, circle2){
	dist = Math.sqrt(Math.pow(circle1.x - circle2.x, 2) + Math.pow(circle1.y - circle2.y, 2))
	if (dist < circle1.r + circle2.r){ return true;}
}


Array.prototype.max = function() {
	var max = Number.MIN_VALUE
	for(var i = 0; i < this.length; i++ ) if (this[i] > max) max = this[i];
	return max
};

Array.prototype.min = function() {
	var min = Number.MAX_VALUE
	for(var i = 0; i < this.length; i++ ) if (this[i] < min) min = this[i];
	return min
};


function stats(){
	v.stats.fps.list = v.stats.fps.list.slice(120, -1)
	var sum = 0
	for(i=0; i < v.stats.fps.list.length; i++){
	    sum += parseInt(v.stats.fps.list[i], 10);
	}
	v.stats.fps.average = Math.round(sum/v.stats.fps.list.length)
	v.stats.fps.min = v.stats.fps.list.min()
	v.stats.fps.max = v.stats.fps.list.max()
	
	endTime = new Date();
	if (!(v.mode in v.stats.time)){v.stats.time[v.mode] = {list:[], total:0}}
	v.stats.time[v.mode].list.push(endTime - v.startTime)
	v.stats.time[v.mode].total += endTime - v.startTime
}

function save(){
	var storage = window.localStorage;
	for (i=0; i < Object.keys(v.highScore).length; i++){
		storage.setItem("highScore_" + Object.keys(v.highScore)[i], v.highScore[Object.keys(v.highScore)[i]])
	}
	for (i=0; i < Object.keys(v.plays).length; i++){
		storage.setItem("plays_" + Object.keys(v.plays)[i], v.plays[Object.keys(v.plays)[i]])
	}
	storage.setItem("theme", v.themeOrder)
	storage.setItem("gameService", v.playGames)
	storage.setItem("completed", v.completed)
	storage.setItem("progress", v.challengeProg)
	storage.setItem("ads", v.removedAds)
	storage.setItem("stats", JSON.stringify(v.stats))
	storage.setItem("version", v.version)
	
	v.totalPlays = 0
	for (var k in v.plays){
		v.totalPlays += v.plays[k]
	}
		
	if (v.mobile){
		window.ga.addCustomDimension(1, v.mode)
		window.ga.addCustomDimension(2, v.themes[v.themeOrder].name)
		window.plugins.playGamesServices.isSignedIn(function (result) {
			if (result.isSignedIn){
				var data = {
				    score: v.score,
				};
				if (v.mode == "classic"){board = "CgkIy72U_e4TEAIQBg"}
				if (v.mode == "moving"){board = "CgkIy72U_e4TEAIQBw"}
				if (v.mode == "clone"){board = "CgkIy72U_e4TEAIQCA"}
				if (v.mode == "patience"){board = "CgkIy72U_e4TEAIQCQ"}
				if (v.mode == "tilt"){board = "CgkIy72U_e4TEAIQCg"}
				if (v.mode == "veil"){board = "CgkIy72U_e4TEAIQCw"}
				if (v.mode == "chance"){board = "CgkIy72U_e4TEAIQEg"}
				data["leaderboardId"] = board
				window.plugins.playGamesServices.submitScore(data);
				
				var data = {}
				if (v.score >= 10){data["achievementId"] = "CgkIy72U_e4TEAIQAQ"}
				if (v.score >= 25){data["achievementId"] = "CgkIy72U_e4TEAIQAg"}
				if (v.score >= 50){data["achievementId"] = "CgkIy72U_e4TEAIQAw"}
				if (v.score >= 75){data["achievementId"] = "CgkIy72U_e4TEAIQBA"}
				if (v.score >= 100){data["achievementId"] = "CgkIy72U_e4TEAIQBQ"}
				if (v.completed >= 30){data["achievementId"] = "CgkIy72U_e4TEAIQDA"}
				if (v.completed >= v.challenges.length){data["achievementId"] = "CgkIy72U_e4TEAIQDQ"}
				if (v.unlockedThemes >= v.themes.length){data["achievementId"] = "CgkIy72U_e4TEAIQDg"}
				if (v.unlockedModes >= v.modes.length){data["achievementId"] = "CgkIy72U_e4TEAIQDw"}
				if (v.unlockedModes >= v.modes.length && v.unlockedThemes >= v.themes.length && v.completed >= v.challenges.length){data["achievementId"] = "CgkIy72U_e4TEAIQEA"}
				
				if (Object.keys(data).length > 0){window.plugins.playGamesServices.unlockAchievement(data);}
			}
		})
	}
}

function load(){
	var storage = window.localStorage;
	for (i=0; i < Object.keys(v.highScore).length; i++){
		v.highScore[Object.keys(v.highScore)[i]] = storage.getItem("highScore_" + Object.keys(v.highScore)[i]) || 0
	}
	for (i=0; i < Object.keys(v.plays).length; i++){
		v.plays[Object.keys(v.plays)[i]] = storage.getItem("plays_" + Object.keys(v.plays)[i]) || 0
	}
	v.themeOrder = storage.getItem("theme") || 0;
	v.playGames = storage.getItem("gameService") || true;
	v.completed = parseInt(storage.getItem("completed")) || 0;
	v.challengeProg = parseInt(storage.getItem("progress")) || 0;
	v.removedAds = storage.getItem("ads") == "true" || false;
	v.stats = storage.getItem("stats") || v.stats;
	if (typeof v.stats == "string"){v.stats = JSON.parse(v.stats)}
	
	v.oldVersion = storage.getItem("version") || "";
	
	v.playerColour = v.themes[v.themeOrder].player
	v.obstacleColour = v.themes[v.themeOrder]. obstacle
	v.backgroundColour = v.themes[v.themeOrder].background
	v.backgroundEffect = v.themes[v.themeOrder].effect
	document.body.style.backgroundColor = v.backgroundColour
	v.backEffectGroup = null
	
	if (v.mobile){
		window.ga.addCustomDimension(1, v.mode)
		window.ga.addCustomDimension(2, v.themes[v.themeOrder].name)
	}
}

CanvasRenderingContext2D.prototype.roundRect = function (x, y, w, h, r) {
	if (w < 2 * r) r = w / 2;
	if (h < 2 * r) r = h / 2;
	this.beginPath();
	this.moveTo(x+r, y);
	this.arcTo(x+w, y,   x+w, y+h, r);
	this.arcTo(x+w, y+h, x,   y+h, r);
	this.arcTo(x,   y+h, x,   y,   r);
	this.arcTo(x,   y,   x+w, y,   r);
	this.closePath();
	return this;
}

function gen_themes(){
	var width = 0.94 * game.width
	var height = 0.28 * game.width
	for (i=0; i<v.themes.length; i++){
		generate_theme(i, width, height)
	}
}

function generate_theme(order, width, height){
	var background = game.make.bitmapData(width, height);
	background.ctx.fillStyle = v.themes[order].background
	background.ctx.lineWidth = 0.0043 * game.width
	background.ctx.strokeStyle=v.themes[order].player;
	background.ctx.roundRect(0, 0, width, height, 20)
	background.ctx.fill();
	if (v.themeOrder == order){background.ctx.stroke()}
	background.circle(550/720 * game.width, 150/720 * game.width, 25/720 * game.width, v.themes[order].player)
	background.rect(480/720 * game.width, 80/720 * game.width, 50/720 * game.width, 25/720 * game.width, v.themes[order].obstacle)
	background.rect(560/720 * game.width, 40/720 * game.width, 60/720 * game.width, 25/720 * game.width, v.themes[order].obstacle)
	game.cache.addBitmapData('theme_' + order, background);
}

function gen_challenge(){
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
	game.cache.addBitmapData('challenge', cb);
}

function themeUnlock(order){
	background = game.cache.getBitmapData('theme_' + order)
	
	Phaser.Sprite.call(this, game, 0.5 * game.width, (0.22 * game.height) + (0.14 * game.width) + (0.31 * game.width) * order, background);
	this.anchor.set(0.5, 0.5)
	
	//this.width = 0.94 * game.width
	//this.height = 0.28 * game.width
	
	this.startY = this.y
	
	var name = game.make.text(-300/720 * game.width, -25/720 * game.width, v.themes[order].name, {fill: v.themes[order].player, font: "bold Arial", fontSize: 80/720 * game.width})
	name.anchor.set(0, 0.5)
	this.addChild(name)
	
	this.unlocked = false
	
	if (v.themes[order].unlock[0] == "score"){
		var stext = (v.themes[order].unlock[1] > v.highScore[v.themes[order].mode]) ? "Score " + v.themes[order].unlock[1] + " in " + v.themes[order].mode + " mode to unlock" : "Unlocked!"
	}
	else if (v.themes[order].unlock[0] == "plays"){
		if (v.themes[order].unlock[1] - v.plays == 1){
			var stext = "Play 1 more game in " + v.themes[order].mode + " mode to unlock"
		}
		else {
			var stext = (v.themes[order].unlock[1] > v.plays[v.themes[order].mode]) ? "Play " + (v.themes[order].unlock[1] - v.plays[v.themes[order].mode]) + " more games in " + v.themes[order].mode + " mode to unlock" : "Unlocked!"
		}
	}
	
	if (stext == "Unlocked!") {
		this.unlocked = true
		v.unlockedThemes++
	}
	
	var score = game.make.text(-300/720 * game.width, 60/720 * game.width, stext, {fill: v.themes[order].player, font: "bold Arial", fontSize: 45/720 * game.width, align: 'left', wordWrap: true, wordWrapWidth: 450/720 * game.width})
	score.lineSpacing = -10/720 * game.width
	while(score.height > 80/720 * game.width && score.fontSize > 0){score.fontSize--; score.updateText()}
	score.anchor.set(0, 0.5)
	this.addChild(score)
	
	mask = game.add.graphics(0, 0);
    mask.beginFill("#ffffff");
    mask.drawRect(0, 0, game.width, game.height);
    mask.x = 0
    mask.y = 0.21875 * game.height
    this.mask = mask;
	
	this.inputEnabled = true
	this.drag = this.game.input.activePointer.position.y
	this.events.onInputDown.add(function(){this.drag = this.game.input.activePointer.position.y}, this)
	this.events.onInputUp.add(function(){
		if (Math.abs(this.drag - this.game.input.activePointer.position.y) < 10 && this.unlocked){
			v.playerColour = v.themes[order].player
			v.obstacleColour = v.themes[order]. obstacle
			v.backgroundColour = v.themes[order].background
			v.backgroundEffect = v.themes[v.themeOrder].effect
			v.themeOrder = order
			
			titlet.fill = v.playerColour
			game.stage.backgroundColor = v.backgroundColour;
			document.body.style.backgroundColor = v.backgroundColour
			v.backEffectGroup = null
			
			backb.colour()
			
			save()
			game.state.start("titleMenu")
		}
	}, this);
}

themeUnlock.prototype = Object.create(Phaser.Sprite.prototype);
themeUnlock.prototype.constructor = themeUnlock;
themeUnlock.prototype.update = function() {
	this.y = this.startY - v.scroll
}

function hexToRgbA(hex){
    var c;
    if(/^#([A-Fa-f0-9]{3}){1,2}$/.test(hex) || true){
        c= hex.substring(1).split('');
        if(c.length== 3){
            c= [c[0], c[0], c[1], c[1], c[2], c[2]];
        }
        c= '0x'+c.join('');
        return [(c>>16)&255, (c>>8)&255, c&255];
    }
    throw new Error('Bad Hex ' + hex);
}

function menuButton(x, y, key, callback, context, wm){
	this.skey = key
	this.colour(true)
	Phaser.Sprite.call(this, game, x, y, this.image)
	
	this.anchor.set(0.5, 0.5)
	this.width = 0.06 * game.height * (wm || 1)
	this.height = 0.06 * game.height * (wm || 1)
	
	this.inputEnabled = true
	this.input.priorityID = 1
	this.events.onInputDown.add(callback, context)
	
	h = game.make.sprite(0, 0)
	h.width = h.height = game.height * 0.4
	h.anchor.set(0.5, 0.5)
	this.addChild(h)
	
	game.add.existing(this)
}

menuButton.prototype = Object.create(Phaser.Sprite.prototype);
menuButton.prototype.constructor = menuButton;
menuButton.prototype.update = function() {
}
menuButton.prototype.colour = function(f){
	this.image = game.make.bitmapData(70, 70);
	this.image.load(this.skey);
	this.image.replaceRGB(1, 0, 0, 255, hexToRgbA(v.playerColour)[0], hexToRgbA(v.playerColour)[1], hexToRgbA(v.playerColour)[2], 255)
	this.image.replaceRGB(254, 255, 255, 255, hexToRgbA(v.backgroundColour)[0], hexToRgbA(v.backgroundColour)[1], hexToRgbA(v.backgroundColour)[2], 255)
	if (f != true){this.loadTexture(this.image)}
}


function settingsOption(order, name, callBack){
	var width = 680
	var height = 200
	var background = game.make.bitmapData(width, height);
	background.ctx.fillStyle = v.playerColour;
	background.ctx.roundRect(0, 0, width, height, 20)
	background.ctx.fill();
	Phaser.Sprite.call(this, game, 0.5 * game.width, (0.2525 * game.height) + (0.14 * game.width) + (0.31 * game.width) * order, background);
	this.anchor.set(0.5, 0.5)
	
	this.width = 0.94 * game.width
	this.height = 0.28 * game.width
	
	this.startY = this.y
	
	var name = game.make.text(-300, 0, name, {fill: v.backgroundColour, font: "bold 80px Arial"})
	name.anchor.set(0, 0.5)
	while(name.width > 600 && name.fontSize > 0){name.fontSize--; name.updateText()}
	this.addChild(name)
	
	mask = game.add.graphics(0, 0);
    mask.beginFill("#ffffff");
    mask.drawRect(0, 0, game.width, game.height);
    mask.x = 0
    mask.y = 0.25 * game.height
    this.mask = mask;
	
	this.inputEnabled = true
	this.drag = this.game.input.activePointer.position.y
	this.events.onInputDown.add(function(){this.drag = this.game.input.activePointer.position.y}, this)
	this.events.onInputUp.add(function(){
		if (Math.abs(this.drag - this.game.input.activePointer.position.y) < 10){
			callBack()
			save()
		}
	}, this);
}

settingsOption.prototype = Object.create(Phaser.Sprite.prototype);
settingsOption.prototype.constructor = settingsOption;
settingsOption.prototype.update = function() {
	this.y = this.startY - v.scroll
}

function challengeBubble(mod){
	cb = game.make.bitmapData(0.8 * game.width, 0.15 * game.height)
	cb.ctx.fillStyle = (mod == 0) ? v.playerColour : v.obstacleColour
	cb.ctx.roundRect(0, 0, 0.8 * game.width, 0.15 * game.height, 20)
	cb.ctx.fill();
	
	Phaser.Sprite.call(this, game, 0.5 * game.width + (game.width * mod), 0.4 * game.height, cb)
	this.anchor.set(0.5, 0.5)
	
	if (v.completed - 1 + mod < v.challenges.length){
		titlet = game.make.text(0, -0.03 * game.height, (mod == 0) ? "Challenge Completed" : "New Challenge", {fill: v.backgroundColour, font: "bold Arial", fontSize: 0.04 * game.height})
		titlet.anchor.set(0.5, 0.5)
		this.addChild(titlet)
		
		desc = game.make.text(0, 0.03 * game.height, v.challenges[v.completed - 1 + mod].description, {fill: v.backgroundColour, font: "bold Arial", fontSize: 0.03 * game.height, align: 'center', wordWrap: true, wordWrapWidth: 0.8 * game.width})
		desc.anchor.set(0.5, 0.5)
		this.addChild(desc)
	}
	else {
		titlet = game.make.text(0, 0, "All Challenges Completed!", {fill: v.backgroundColour, font: "bold Arial", fontSize: 0.03 * game.height})
		titlet.anchor.set(0.5, 0.5)
		this.addChild(titlet)
	}
}

challengeBubble.prototype = Object.create(Phaser.Sprite.prototype);
challengeBubble.prototype.constructor = challengeBubble;
challengeBubble.prototype.update = function() {
}

function modeOption(order, mode){
	var width = 0.94 * game.width
	var height = 0.28 * game.width
	var background = game.make.bitmapData(width, height);
	background.ctx.fillStyle = (v.mode == mode) ? v.obstacleColour : v.playerColour
	background.ctx.roundRect(0, 0, width, height, 20)
	background.ctx.fill();
	Phaser.Sprite.call(this, game, 0.5 * game.width, (0.2525 * game.height) + (0.14 * game.width) + (0.31 * game.width) * order, background);
	this.anchor.set(0.5, 0.5)
	
	this.mode = mode
	
	this.startY = this.y
	
	var name = game.make.text(-0.42 * game.width, -0.01 * game.width, this.mode, {fill: v.backgroundColour, font: "bold Arial", fontSize: 0.07 * game.height})
	name.anchor.set(0, 0.5)
	while(name.width > 600 && name.fontSize > 0){name.fontSize--; name.updateText()}
	this.addChild(name)
	
	
	icon = game.make.bitmapData(70, 70);
	icon.load("mode/" + this.mode);
	icon.replaceRGB(254, 255, 255, 255, hexToRgbA(v.backgroundColour)[0], hexToRgbA(v.backgroundColour)[1], hexToRgbA(v.backgroundColour)[2], 255)
	
	i = game.make.sprite(0.3 * game.width, 0, icon)
	i.anchor.set(0.5, 0.5)
	i.width = i.height = 0.25 * game.width
	this.addChild(i)
	
	if (v.modes[this.mode].unlock[0] == "score"){
		var stext = (v.modes[this.mode].unlock[1] > v.highScore[v.modes[this.mode].mode]) ? "Score " + v.modes[this.mode].unlock[1] + " to unlock" : ""//"Unlocked!"
	}
	else if (v.modes[this.mode].unlock[0] == "plays"){
		if (v.modes[this.mode].unlock[1] - v.plays == 1){
			var stext = "Play 1 more game to unlock"
		}
		else {
			var stext = (v.modes[this.mode].unlock[1] > v.plays[v.modes[this.mode].mode]) ? "Play " + (v.modes[this.mode].unlock[1] - v.plays[v.modes[this.mode].mode]) + " more games to unlock" : ""//"Unlocked!"
		}
	}
	else if (v.modes[this.mode].unlock[0] == "challenge"){
		if (v.modes[this.mode].unlock[1] - v.completed == 1){
			var stext = "Complete 1 more challenge to unlock"
		}
		else {
			var stext = (v.modes[this.mode].unlock[1] > v.completed) ? "Complete " + (v.modes[this.mode].unlock[1] - v.completed) + " more challenges to unlock" : ""//"Unlocked!"
		}
	}
	
	this.unlocked = false
	if (stext == "") {
		this.unlocked = true
		v.unlockedModes++
	}
	
	var score = game.make.text(-0.415 * game.width, 0.12* game.width, stext, {fill: v.backgroundColour, font: "bold Arial", fontSize: 0.031 * game.height})
	while(score.width > 0.6 * game.width && score.fontSize > 0){score.fontSize--; score.updateText()}
	score.anchor.set(0, 1)
	this.addChild(score)
	
	mask = game.add.graphics(0, 0);
    mask.beginFill("#ffffff");
    mask.drawRect(0, 0, game.width, game.height);
    mask.x = 0
    mask.y = 0.25 * game.height
    this.mask = mask;
	
	this.inputEnabled = true
	this.drag = this.game.input.activePointer.position.y
	this.events.onInputDown.add(function(){this.drag = this.game.input.activePointer.position.y}, this)
	this.events.onInputUp.add(function(){
		if (Math.abs(this.drag - this.game.input.activePointer.position.y) < 10 && this.unlocked){
			v.mode = this.mode
			game.state.start("titleMenu")
		}
	}, this);
}

modeOption.prototype = Object.create(Phaser.Sprite.prototype);
modeOption.prototype.constructor = modeOption;
modeOption.prototype.update = function() {
	this.y = this.startY - v.scroll
}

function backgroundEffect(){
	if (v.backgroundEffect){
		if (v.backEffectGroup != null){
			v.backEffectGroup.visible = true
			game.world.addChild(v.backEffectGroup)
			game.world.sendToBack(v.backEffectGroup)
			game.stage.removeChild(v.backEffectGroup)
			return
		}
		v.backEffectGroup = game.make.group()
		if (v.backgroundEffect == "stars"){
			for (i=0; i < 100; i++){
				s = new effectObject(randomInt(0, game.width), randomInt(0, game.height), "effect/star" + randomInt(1, 8), randomInt(5, 15)/10, randomInt(1, 10)/10)
				v.backEffectGroup.add(s)
			}
		}
		if (v.backgroundEffect == "matrix"){
			chinese = "ムタ二コク1234567890シモラキリエスハヌトユABCDEF";
			chinese = this.chinese.split("");
			for (i=0; i < chinese.length; i++){
				image = game.make.bitmapData(0.042 * game.width, 0.042 * game.width)
				image.ctx.fillStyle = "rgba(0, 0, 0, 0.05)";
				image.ctx.fillRect(0, 0, 0.042 * game.width, 0.042 * game.width);
				
				image.ctx.fillStyle = v.obstacleColour
				image.ctx.font = 0.014 * game.width + "px arial";
				var text = chinese[i];
				image.ctx.fillText(text, 0.021 * game.width, 0.021 * game.width);
				game.cache.addBitmapData("Matrix" + chinese[i], image)
			}
			for (i=0; i < 200; i++){
				s = new effectObject(Math.floor(randomInt(0, game.width)/25) * 25, randomInt(0, game.height), "matrix", 1, randomInt(10, 12)/10)
				v.backEffectGroup.add(s)
			}
		}
		if (v.backgroundEffect == "bubbles"){
			for (i=0; i < 100; i++){
				s = new effectObject(randomInt(0, game.width), randomInt(0, game.height), "effect/bubble" + randomInt(1, 1), randomInt(5, 15)/10, randomInt(-5, -1)/10)
				v.backEffectGroup.add(s)
			}
		}
		if (v.backgroundEffect == "moon"){
			s = new effectObject(0.8 * game.width, 0.13 * game.height, "effect/moon" + randomInt(1, 1), 0.3, 0)
			v.backEffectGroup.add(s)
		}
		game.world.addChild(v.backEffectGroup)
	}
}

function effectObject(x, y, key, w, speed){
	this.skey = key
	if (this.skey == "matrix"){
		this.chinese = "ムタ二コク1234567890シモラキリエスハヌトユABCDEF";
		this.chinese = this.chinese.split("");
		image = game.cache.getBitmapData("Matrix" + this.chinese[Math.floor(Math.random()*this.chinese.length)])
	}
	else{
		image = key
	}
	Phaser.Sprite.call(this, game, x, y, image);
	this.anchor.set(0.5, 0.5)
	this.width = this.height = this.width * w * 0.002 * game.width
	this.speedMod = speed
}

effectObject.prototype = Object.create(Phaser.Sprite.prototype);
effectObject.prototype.constructor = effectObject;
effectObject.prototype.update = function() {
	if (game.state.current == "theGame"){this.y += v.speed * (game.height/1280) * this.speedMod;}
	if ((this.y - this.height >= game.height && sign(this.speedMod) == 1) || (this.y + this.height <= 0 && sign(this.speedMod) == -1)){
		this.y = (sign(this.speedMod) == 1) ? 0 - this.height : game.height + this.height
		//this.x = randomInt(0, game.width)
	}
	if (this.skey == "matrix" && randomInt(1, 30) == 2 && game.state.current == "theGame"){
		image = game.cache.getBitmapData("Matrix" + this.chinese[Math.floor(Math.random()*this.chinese.length)])
		this.loadTexture(image.generateTexture())
	}
}

function sign(x){return x>0?1:x<0?-1:x;}

function shareButton(){
	var width = 0.4 * game.width
	var height = 0.1 * game.width
	var background = game.make.bitmapData(width, height);
	background.ctx.fillStyle =  v.backgroundColour
	background.ctx.roundRect(0, 0, width, height, 20)
	background.ctx.fill();
	Phaser.Sprite.call(this, game, 0.5 * game.width, 0.55 * game.height, background);
	this.anchor.set(0.5, 0.5)
			
	var text = game.make.text(0, 0, "share", {fill: v.playerColour, font: "bold Arial", fontSize: 0.04 * game.height})
	text.anchor.set(0.5, 0.5)
	while(text.width > 600 && text.fontSize > 0){text.fontSize--; text.updateText()}
	this.addChild(text)
	
	this.inputEnabled = true
	this.events.onInputUp.add(function(){		
		var options = {
			message: "I just scored " + v.score + " on Bouncr!", // not supported on some apps (Facebook, Instagram)
			subject: 'Bouncr', // fi. for email
			files: [v.link], // an array of filenames either locally or remotely
			url: 'https://goo.gl/X31wIb',
			chooserTitle: 'Pick an app' // Android only, you can override the default share sheet title
		}

		var onSuccess = function(result) {
			window.ga.trackView('Share')
		}

		var onError = function(msg) {
		  console.log("Sharing failed with message: " + msg);
		}

		if (v.mobile){window.plugins.socialsharing.shareWithOptions(options, onSuccess, onError);}
	})
}

shareButton.prototype = Object.create(Phaser.Sprite.prototype);
shareButton.prototype.constructor = shareButton;
shareButton.prototype.update = function() {
}

function saveCanvas() {
	image = game.make.bitmapData(game.width, game.height)
	
	image.fill(hexToRgbA(v.backgroundColour)[0], hexToRgbA(v.backgroundColour)[1], hexToRgbA(v.backgroundColour)[2])
	
	image.ctx.font = "bold " + 300/1280 * game.height + "px Arial";
	image.ctx.fillStyle = v.playerColour;
	image.ctx.textAlign = "center";
	image.ctx.textBaseline = "middle"; 
	image.ctx.fillText(v.score, game.width * 0.5, game.height * 0.5);
	
	image.ctx.font = "bold " + 0.1 * game.height + "px Arial";
	image.ctx.fillText("bouncr", game.width * 0.5, game.height * 0.2);
	
	image.ctx.font = "bold " + 0.03 * game.height + "px Arial";
	image.ctx.fillText(v.mode + " mode", game.width * 0.5, game.height * 0.38);
	
	image.ctx.fillText("top: " + v.highScore[v.mode], game.width * 0.5, game.height * 0.26);
	image.ctx.fillText("plays: " + v.plays[v.mode], game.width * 0.5, game.height * 0.3);
	image.ctx.fillText("complete: " + Math.round((v.completed / v.challenges.length)*100) + "%", game.width * 0.5, game.height * 0.34);
	
	image.line(0, 0.7 * game.height, game.width, 0.7 * game.height, v.playerColour, 0.0016 * game.height)
	
	image.ctx.drawImage(p.key.ctx.canvas, 0, 0, p.key.ctx.canvas.width, p.key.ctx.canvas.height, p.x - p.width/2, p.y - p.height/2, p.width, p.height)
	
	if (v.gameEndTarget.otype == "rectangle"){
		var src = game.make.bitmapData(v.gameEndTarget.width, v.gameEndTarget.height);
		src.rect(0, 0, v.gameEndTarget.width, v.gameEndTarget.height, v.obstacleColour);
		src = src.ctx.canvas}
	if (v.gameEndTarget.otype == "circle"){var src = game.cache.getBitmapData('obst_circle').ctx.canvas}
	if (v.gameEndTarget.otype == "triangle"){var src = game.cache.getRenderTexture('obst_triangle').texture.baseTexture.source}
	image.ctx.drawImage(src, 0, 0, src.width, src.height, v.gameEndTarget.x - v.gameEndTarget.width/2, v.gameEndTarget.y - v.gameEndTarget.height/2, v.gameEndTarget.width, v.gameEndTarget.height)
	image.ctx.fill()
	
	v.link = image.ctx.canvas.toDataURL();
};

function alert(){
	var background = game.make.bitmapData(game.width * 0.8, game.height * 0.5);
	background.ctx.fillStyle = v.playerColour
	background.ctx.roundRect(0, 0, game.width * 0.8, game.height * 0.5, 20)
	background.ctx.fill();
	background.ctx.font = "bold " + 80/1280 * game.height + "px Arial";
	background.ctx.textAlign = "center";
	background.ctx.textBaseline = "top";
	background.ctx.fillStyle = v.backgroundColour
	background.ctx.fillText(v.alert.title, game.width * 0.4, game.height * 0.01);
	
	background.ctx.textAlign = "center";
	background.ctx.font = "bold " + 40/1280 * game.height * v.alert.size + "px Arial";
	wrapText(background.ctx, v.alert.content, 0.4 * game.width, game.height * 0.08, game.width * 0.7, game.height * 0.04 * v.alert.size)

	Phaser.Sprite.call(this, game, 0.5 * game.width, 0.5 * game.height, background);
	this.anchor.set(0.5, 0.5)
	
}

alert.prototype = Object.create(Phaser.Sprite.prototype);
alert.prototype.constructor = alert;
alert.prototype.update = function() {
}

function wrapText(context, text, x, y, maxWidth, lineHeight) {
    var words = text.split(' ');
    var line = '';

    for(var n = 0; n < words.length; n++) {
      var testLine = line + words[n] + ' ';
      var metrics = context.measureText(testLine);
      var testWidth = metrics.width;
      if ((testWidth > maxWidth && n > 0) || words[n] == "¦") {
        context.fillText(line, x, y);
        line = (words[n] != "¦") ? words[n] + ' ' : '';
        y += lineHeight;
      }
      else {
        line = testLine;
      }
    }
    context.fillText(line, x, y);
  }