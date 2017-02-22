function player(){
	width = 0.08 * game.height
	var circle = game.make.bitmapData(width, width);
	circle.circle(width/2, width/2, width/2, v.playerColour);
	
	Phaser.Sprite.call(this, game, 0.5 * game.width, 0.7 * game.height, circle);
	this.anchor.set(0.5, 0.5)
	
	var line = game.add.bitmapData(game.width, 0.008 * game.height);
	line.line(0, 0.004 * game.height, game.width, 0.004 * game.height, v.playerColour, 0.0016 * game.height)
	game.add.sprite(0, 0.7 * game.height, line)
	
	if (game.state.current == "theGame"){
		this.direction = 1
		game.input.onDown.add(function(){
			this.direction *= -1
			if(v.gameEnd == false){if (v.challenges[v.completed].unlock[0] == "notouch" && (v.challenges[v.completed].mode == v.mode || v.challenges[v.completed].mode == "")){
				if (v.tempProg > v.challengeProg){v.challengeProg = v.tempProg}
				v.tempProg = 0
			}}
		}, this);
	}
	
}

player.prototype = Object.create(Phaser.Sprite.prototype);
player.prototype.constructor = player;
player.prototype.update = function() {
	if (game.state.current == "theGame"){
		var change = (v.speed * 1.1) * this.direction * (game.width/720)
		var side = false
		if (this.x + change >= game.width - this.width/2){
			this.direction *= -1;
			this.x = game.width - this.width/2
			side = true
		}
		if (this.x + change <= 0 + this.width/2){
			this.direction *= -1;
			this.x = 0 + this.width/2
			side = true
		}
		if (side) {if (v.challenges[v.completed].unlock[0] == "sides" && (v.challenges[v.completed].mode == v.mode || v.challenges[v.completed].mode == "")){
			if (v.tempProg > v.challengeProg){v.challengeProg = v.tempProg}
			v.tempProg = 0
		}}
		this.x += change;
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
	
	var rectangle = game.make.bitmapData(width, height);
	rectangle.rect(0, 0, width, height, v.obstacleColour);
	Phaser.Sprite.call(this, game, x, -height/2, rectangle);
	
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
    	this.key.fill(hexToRgbA(v.backgroundColour)[0], hexToRgbA(v.backgroundColour)[1], hexToRgbA(v.backgroundColour)[2])
    }
	
	this.y += v.speed * (game.height/1280);
	
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



function movingObstacle(){
	width = 0.08 * game.height
	if (v.mode == "moving"){
		var rend = game.make.graphics(0, 0);
		rend.beginFill(parseInt(v.obstacleColour.replace(/^#/, ''), 16));
		rend.drawPolygon([0, 0, width/2, Math.sqrt(0.75) * width, width, 0, 0, 0])
		rend.endFill();
		rend = rend.generateTexture()
	}
	
	if (v.mode == "clone"){
		var rend = game.make.bitmapData(width, width);
		rend.circle(width/2, width/2, width/2, v.obstacleColour);
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
		hs = new hsLine(this.y)
		v.obstacles.add(hs)
		v.obstacles.sendToBack(hs)
	}
	
	if (v.mode == "clone"){
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
		if ((v.mode == "moving" && trc) || (v.mode == "clone" && ccc)){
			v.gameEnd = true;
			v.gameEndTarget = this
	    	v.speed = 0;
			
			if (v.mode == "moving"){
				var rend = game.make.graphics(0, 0);
				rend.beginFill(parseInt(v.backgroundColour.replace(/^#/, ''), 16));
				rend.drawPolygon([0, 0, this.width/2, Math.sqrt(0.75) * this.width, this.width, 0, 0, 0])
				rend.endFill();
				rend = rend.generateTexture()
			}
			
			if (v.mode == "clone"){
				var rend = game.make.bitmapData(this.width, this.width);
				rend.circle(this.width/2, this.width/2, this.width/2, v.backgroundColour);
			}
			
			this.loadTexture(rend)
		}
		var change = v.speed * this.direction * (game.width/720) * this.speedMod
		if (this.x + change >= game.width - this.width/2){
			this.direction *= -1;
			this.x = game.width - this.width/2
			side = true
		}
		if (this.x + change <= 0 + this.width/2){
			this.direction *= -1;
			this.x = 0 + this.width/2
			side = true
		}
		
		this.x += change;
		
		this.y += v.speed * (game.height/1280);
		
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
	this.y += v.speed * (game.height/1280);
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
	 dist = Math.sqrt(Math.pow(triangle.x1 - circle.x, 2) + Math.pow(triangle.y1 - circle.y, 2))
	 if (dist < circle.r){ return true;}
	 
	 dist = Math.sqrt(Math.pow(triangle.x2 - circle.x, 2) + Math.pow(triangle.y2 - circle.y, 2))
	 if (dist < circle.r){ return true;}
	 
	 dist = Math.sqrt(Math.pow(triangle.x3 - circle.x, 2) + Math.pow(triangle.y3 - circle.y, 2))
	 if (dist < circle.r){ return true;}
}

function CircleCircleColliding(circle1, circle2){
	dist = Math.sqrt(Math.pow(circle1.x - circle2.x, 2) + Math.pow(circle1.y - circle2.y, 2))
	if (dist < circle1.r + circle2.r){ return true;}
}

function save(){
	var storage = window.localStorage;
	for (i=0; i < Object.keys(v.highScore).length; i++){
		storage.setItem("highScore" + Object.keys(v.highScore)[i], v.highScore[Object.keys(v.highScore)[i]])
	}
	storage.setItem("theme", v.themeOrder)
	storage.setItem("plays", v.plays)
	storage.setItem("gameService", v.playGames)
	storage.setItem("completed", v.completed)
	storage.setItem("progress", v.challengeProg)
	
	if (v.mobile){
		window.plugins.playGamesServices.isSignedIn(function (result) {
			if (result.isSignedIn){
				var data = {
				    score: v.score,
				    leaderboardId: "CgkIy72U_e4TEAIQBg"
				};
				window.plugins.playGamesServices.submitScore(data);
			}
		})
	}
}

function load(){
	var storage = window.localStorage;
	//v.highScore = storage.getItem("highScore") || 0;
	for (i=0; i < Object.keys(v.highScore).length; i++){
		v.highScore[Object.keys(v.highScore)[i]] = storage.getItem("highScore" + Object.keys(v.highScore)[i]) || 0
	}
	v.plays = storage.getItem("plays") || 0;
	v.themeOrder = storage.getItem("theme") || 0;
	v.playGames = storage.getItem("gameService") || true;
	v.completed = parseInt(storage.getItem("completed")) || 0;
	v.challengeProg = parseInt(storage.getItem("progress")) || 0;
	
	v.playerColour = v.themes[v.themeOrder.toString()].player
	v.obstacleColour = v.themes[v.themeOrder.toString()]. obstacle
	v.backgroundColour = v.themes[v.themeOrder.toString()].background
	document.body.style.backgroundColor = v.backgroundColour
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


function themeUnlock(order){
	var width = 680
	var height = 200
	var background = game.make.bitmapData(width, height);
	background.ctx.fillStyle = (v.themes[order.toString()].background != "#ffffff") ? v.themes[order.toString()].background : "#eeeeee";
	background.ctx.roundRect(0, 0, width, height, 20)
	background.ctx.fill();
	background.circle(550, 150, 25, v.themes[order.toString()].player)
	background.rect(480, 80, 50, 25, v.themes[order.toString()].obstacle)
	background.rect(560, 40, 60, 25, v.themes[order.toString()].obstacle)
	Phaser.Sprite.call(this, game, 0.5 * game.width, (0.22 * game.height) + (0.14 * game.width) + (0.31 * game.width) * order, background);
	this.anchor.set(0.5, 0.5)
	
	this.width = 0.94 * game.width
	this.height = 0.28 * game.width
	
	this.startY = this.y
	
	var name = game.make.text(-300, -25, v.themes[order.toString()].name, {fill: v.themes[order.toString()].player, font: "bold 80px Arial"})
	name.anchor.set(0, 0.5)
	this.addChild(name)
	
	this.unlocked = false
	
	if (v.themes[order.toString()].unlock[0] == "score"){
		var stext = (v.themes[order.toString()].unlock[1] > v.highScore) ? "Score " + v.themes[order.toString()].unlock[1] + " to unlock" : "Unlocked!"
	}
	else if (v.themes[order.toString()].unlock[0] == "plays"){
		if (v.themes[order.toString()].unlock[1] - v.plays == 1){
			var stext = "Play 1 more game to unlock"
		}
		else {
			var stext = (v.themes[order.toString()].unlock[1] > v.plays) ? "Play " + (v.themes[order.toString()].unlock[1] - v.plays) + " more games to unlock" : "Unlocked!"
		}
	}
	
	if (stext == "Unlocked!") {
		this.unlocked = true
	}
	
	var score = game.make.text(-300, 80, stext, {fill: v.themes[order.toString()].player, font: "bold 40px Arial"})
	while(score.width > 450 && score.fontSize > 0){score.fontSize--; score.updateText()}
	score.anchor.set(0, 1)
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
			v.playerColour = v.themes[order.toString()].player
			v.obstacleColour = v.themes[order.toString()]. obstacle
			v.backgroundColour = v.themes[order.toString()].background
			v.themeOrder = order
			
			titlet.fill = v.playerColour
			game.stage.backgroundColor = v.backgroundColour;
			document.body.style.backgroundColor = v.backgroundColour
			
			backb.colour()
			
			save()
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
    if(/^#([A-Fa-f0-9]{3}){1,2}$/.test(hex)){
        c= hex.substring(1).split('');
        if(c.length== 3){
            c= [c[0], c[0], c[1], c[1], c[2], c[2]];
        }
        c= '0x'+c.join('');
        return [(c>>16)&255, (c>>8)&255, c&255];
    }
    throw new Error('Bad Hex');
}

function menuButton(x, y, key, callback, context){
	this.skey = key
	this.colour(true)
	Phaser.Button.call(this, game, x, y, this.image, callback, context)
	
	this.anchor.set(0.5, 0.5)
	this.width = 0.06 * game.height
	this.height = 0.06 * game.height
	this.input.priorityID = 1
	
	game.add.existing(this)
}

menuButton.prototype = Object.create(Phaser.Button.prototype);
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
	
	var name = game.make.text(-0.42 * game.width, 0, this.mode, {fill: v.backgroundColour, font: "bold Arial", fontSize: 0.07 * game.height})
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
			v.mode = this.mode
			game.state.start("mode")
		}
	}, this);
}

modeOption.prototype = Object.create(Phaser.Sprite.prototype);
modeOption.prototype.constructor = modeOption;
modeOption.prototype.update = function() {
	this.y = this.startY - v.scroll
}