var v = {
	version: "oops. I don't know.",
	speed: 5,
	gameWidth: 720,
	gameHeight: 1280,
	playGames: true,
	backgroundColour: "#ffffff",
	playerColour: "#000000",
	obstacleColour: "#ff0000",
	distance: 0,
	score: 0,
	plays: 0,
	gameEnd: false,
	gameEndTarget: null,
	obstacles: null,
	highScore: 0,
	mobile: true,
	scroll: 0,
	themeOrder: 0,
	themes: {"0": {name: "Default", player: "#000000", background: "#ffffff", obstacle: "#ff0000", unlock: ["score", 0]},
			"1": {name: "Negative", player: "#ffffff", background: "#000000", obstacle: "#0000ff", unlock: ["score", 10]},
			"2": {name: "Ice", player: "#0000ff", background: "#00ffff", obstacle: "#ffffff", unlock: ["score", 25]},
			"3": {name: "Magma", player: "#640000", background: "#ff0000", obstacle: "#c4a460", unlock: ["plays", 25]},
			"4": {name: "Earth", player: "#00FF00", background: "#654321", obstacle: "#228B22", unlock: ["plays", 50]},
		},
	completed: 0,
	challenges: {"0": {description: "Play 5 games of classic mode", unlock: ["plays", 5]},
				"1": {description: "Score 20 in classic mode", unlock: ["score", 20]},
				"2": {description: "Score a total of 100 in classic mode", unlock: ["total", 100],},
				"3": {description: "Get 20 points without touching the sides", unlock: ["sides", 20]},
				"4": {description: "Score 3 points without tapping the screen", unlock: ["notouch", 2]},
				"5": {description: "Play a game using a different theme", unlock: ["theme", 1, "any"]},
				"6": {description: "Play 15 games of classic mode", unlock: ["plays", 15]},
				"7": {description: "Score 40 in classic mode", unlock: ["score", 40]},
				"8": {description: "Score a total of 200 in classic mode", unlock: ["total", 200],},
				"9": {description: "Get 30 points without touching the sides", unlock: ["sides", 30]},
				"10": {description: "Score 4 points without tapping the screen", unlock: ["notouch", 3]}
		},
	challengeProg: 0,
	tempProg: 0,
};

FastClick.attach(document.body);

//					  ( width , height , renderer , parent , state , transparent , anti alias , physicsConfig )

game = new Phaser.Game(window.innerWidth * window.devicePixelRatio, window.innerHeight * window.devicePixelRatio, Phaser.AUTO, "", null, null, true, null);

game.state.add("Boot", boot);
game.state.add("Pre_Preload", pre_preload);
game.state.add("Preload", preload);

game.state.add("titleMenu", titleMenu);
game.state.add("settings", settings);
game.state.add("skins", skins);
game.state.add("challenges", challenges);
game.state.add("newChallenge", newChallenge);

game.state.add("theGame", theGame);
game.state.start("Boot");
