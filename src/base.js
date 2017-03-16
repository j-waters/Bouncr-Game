var v = {
	version: "oops. I don't know.",
	speed: 5,
	gameWidth: 720,
	gameHeight: 1280,
	playGames: true,
	backgroundColour: "#ffffff",
	playerColour: "#000000",
	obstacleColour: "#ff0000",
	backgroundEffect: null,
	backEffectGroup: null,
	removedAds: false,
	distance: 0,
	score: 0,
	startTime: null,
	plays: {"classic": 0, "moving":0, "clone":0, "patience":0, "tilt":0, "veil":0, "chance":0},
	stats: {fps: {list:[], average:null, max:null, min:null}, 
			time: {"classic": {list:[], total:0}, "moving":{list:[], total:0}, "clone":{list:[], total:0}, "patience":{list:[], total:0}, "tilt":{list:[], total:0}, "veil":{list:[], total:0}, "chance":{list:[], total:0}}},
	gameEnd: false,
	gameEndTarget: null,
	obstacles: null,
	highScore: {"classic": 0, "moving":0, "clone":0, "patience":0, "tilt":0, "veil":0, "chance":0},
	mobile: false,
	scroll: 0,
	mode: "classic",
	themeOrder: 0,
	themes: {"0": {name: "Default", player: "#000000", background: "#ffffff", obstacle: "#ff0000", unlock: ["score", 0], mode:"classic"},
			"1": {name: "Negative", player: "#ffffff", background: "#000000", obstacle: "#0000ff", unlock: ["score", 10], mode:"classic"},
			"2": {name: "Ice", player: "#0000ff", background: "#00ffff", obstacle: "#ffffff", unlock: ["score", 25], mode:"classic"},
			"3": {name: "Magma", player: "#640000", background: "#ff0000", obstacle: "#c4a460", unlock: ["plays", 25], mode:"classic"},
			"4": {name: "Earth", player: "#00FF00", background: "#654321", obstacle: "#228B22", unlock: ["plays", 50], mode:"classic"},
			"5": {name: "Candy", player: "#00ffff", background: "#FF00FF", obstacle: "#551A8B", unlock: ["score", 50], mode:"classic"},
			"6": {name: "Mountain", player: "#b8860b", background: "#add8e6", obstacle: "#a9a9a9", unlock: ["score", 20], mode:"moving"},
			"7": {name: "Moonlight", player: "#fafaff", background: "#000032", obstacle: "#fafad2", unlock: ["score", 25], mode:"veil", effect:"moon"},
			"8": {name: "Command", player: "#B40000", background: "#000000", obstacle: "#00F000", unlock: ["score", 25], mode:"clone", effect:"matrix"},
			"9": {name: "Ocean", player: "#fff5ee", background: "#1e90ff", obstacle: "#2e8b57", unlock: ["score", 25], mode:"patience", effect:"bubbles"},
			"10": {name: "Stars", player: "#FFD700", background: "#000000", obstacle: "#555555", unlock: ["score", 75], mode:"classic", effect: "stars"},
		},
	unlockedThemes: 0,
	modes: {"classic": {unlock: ["score", 0], mode: "classic"},
			"moving": {unlock: ["challenge", 3]},
			"clone": {unlock: ["challenge", 12]},
			"patience": {unlock: ["score", 60], mode: "classic"},
			"tilt": {unlock: ["score", 80], mode: "classic"},
			"veil": {unlock: ["challenge", 26]},
			"chance": {unlock: ["plays", 200], mode: "classic"}
		},
	unlockedModes: 0,
	completed: 0,
	challenges: [{description: "Play 5 games of classic mode", unlock: ["plays", 5], mode: "classic"},
				{description: "Score 20 in classic mode", unlock: ["score", 20], mode: "classic"},
				{description: "Score a total of 100 in classic mode", unlock: ["total", 100], mode: "classic"}, //3 -- moving
				
				{description: "Score 10 in moving mode", unlock: ["score", 10], mode: "moving"},
				
				{description: "Get 20 points without touching the sides in classic mode", unlock: ["sides", 20], mode: "classic"},
				{description: "Score 3 points without tapping the screen in classic mode", unlock: ["notouch", 3], mode: "classic"},
				{description: "Play a game using a different theme", unlock: ["theme", 1, "any"], mode: ""},
				
				{description: "Play 5 games of moving mode", unlock: ["plays", 5], mode: "moving"},
				{description: "Score 20 in moving mode", unlock: ["score", 20], mode: "moving"},
				{description: "Score a total of 100 in moving mode", unlock: ["total", 100], mode: "moving"},
				{description: "Get 10 points without touching the sides in moving mode", unlock: ["sides", 10], mode: "moving"},
				{description: "Score 3 points without tapping the screen in moving mode", unlock: ["notouch", 3], mode: "moving"}, //12 -- clone
				
				{description: "Play 15 games of classic mode", unlock: ["plays", 15], mode: "classic"},
				{description: "Score 30 in classic mode", unlock: ["score", 30], mode: "classic"},
				{description: "Score a total of 200 in classic mode", unlock: ["total", 200], mode: "classic"},
				{description: "Get 25 points without touching the sides in classic mode", unlock: ["sides", 25], mode: "classic"},
				{description: "Score 4 points without tapping the screen in classic mode", unlock: ["notouch", 4], mode: "classic"},
				
				{description: "Play 5 games of clone mode", unlock: ["plays", 5], mode: "clone"},
				{description: "Score 20 in clone mode", unlock: ["score", 20], mode: "clone"},
				{description: "Score a total of 100 in clone mode", unlock: ["total", 100], mode: "clone"},
				{description: "Get 10 points without touching the sides in clone mode", unlock: ["sides", 10], mode: "clone"},
				{description: "Score 3 points without tapping the screen in clone mode", unlock: ["notouch", 3], mode: "clone"},
				
				{description: "Play 20 games of classic mode", unlock: ["plays", 20], mode: "classic"},
				{description: "Score 40 in classic mode", unlock: ["score", 40], mode: "classic"}, //patience
				{description: "Score a total of 300 in classic mode", unlock: ["total", 300], mode: "classic"},
				{description: "Get 30 points without touching the sides in classic mode", unlock: ["sides", 30], mode: "classic"}, //26 -- veil
				{description: "Score 5 points without tapping the screen in classic mode", unlock: ["notouch", 5], mode: "classic"},
				
				{description: "Play 5 games of patience mode", unlock: ["plays", 5], mode: "patience"},
				{description: "Score 20 in patience mode", unlock: ["score", 20], mode: "patience"},
				{description: "Score a total of 100 in patience mode", unlock: ["total", 100], mode: "patience"},
				
				{description: "Play 5 games of veil mode", unlock: ["plays", 5], mode: "veil"},
				{description: "Score 20 in veil mode", unlock: ["score", 20], mode: "veil"},
				{description: "Score a total of 100 in veil mode", unlock: ["total", 100], mode: "veil"},
				{description: "Get 10 points without touching the sides in veil mode", unlock: ["sides", 10], mode: "veil"},
				
				{description: "Play 25 games of classic mode", unlock: ["plays", 25], mode: "classic"},
				{description: "Score 50 in classic mode", unlock: ["score", 50], mode: "classic"}, //tilt
				{description: "Score a total of 400 in classic mode", unlock: ["total", 400], mode: "classic"},
				
				{description: "Play 5 games of tilt mode", unlock: ["plays", 5], mode: "tilt"},
				{description: "Score 20 in tilt mode", unlock: ["score", 20], mode: "tilt"},
				{description: "Score a total of 100 in tilt mode", unlock: ["total", 100], mode: "tilt"},
				{description: "Get 10 points without touching the sides in tilt mode", unlock: ["sides", 10], mode: "tilt"},
				
				{description: "Play 5 games of chance mode", unlock: ["plays", 5], mode: "chance"},
				{description: "Score 20 in chance mode", unlock: ["score", 20], mode: "chance"},
				{description: "Score a total of 100 in chance mode", unlock: ["total", 100], mode: "chance"},
				
				//Copy --44 
				
				{description: "Score 60 in classic mode", unlock: ["score", 60], mode: "classic"},
				{description: "Score a total of 500 in classic mode", unlock: ["total", 500], mode: "classic"},
				
				{description: "Play 10 games of moving mode", unlock: ["plays", 10], mode: "moving"},
				{description: "Score 30 in moving mode", unlock: ["score", 30], mode: "moving"},
				{description: "Score a total of 200 in moving mode", unlock: ["total", 200], mode: "moving"},
				{description: "Get 20 points without touching the sides in moving mode", unlock: ["sides", 20], mode: "moving"},
				{description: "Score 4 points without tapping the screen in moving mode", unlock: ["notouch", 4], mode: "moving"},
				
				{description: "Play 10 games of clone mode", unlock: ["plays", 10], mode: "clone"},
				{description: "Score 30 in clone mode", unlock: ["score", 30], mode: "clone"},
				{description: "Score a total of 200 in clone mode", unlock: ["total", 200], mode: "clone"},
				{description: "Get 20 points without touching the sides in clone mode", unlock: ["sides", 20], mode: "clone"},
				{description: "Score 4 points without tapping the screen in clone mode", unlock: ["notouch", 4], mode: "clone"},
				
				{description: "Score 70 in classic mode", unlock: ["score", 70], mode: "classic"},
				{description: "Score a total of 600 in classic mode", unlock: ["total", 600], mode: "classic"},
				
				{description: "Play 10 games of patience mode", unlock: ["plays", 10], mode: "patience"},
				{description: "Score 30 in patience mode", unlock: ["score", 30], mode: "patience"},
				{description: "Score a total of 200 in patience mode", unlock: ["total", 200], mode: "patience"},
				
				{description: "Play 10 games of veil mode", unlock: ["plays", 10], mode: "veil"},
				{description: "Score 30 in veil mode", unlock: ["score", 30], mode: "veil"},
				{description: "Score a total of 200 in veil mode", unlock: ["total", 300], mode: "veil"},
				{description: "Get 20 points without touching the sides in veil mode", unlock: ["sides", 10], mode: "veil"},
				
				{description: "Play 30 games of classic mode", unlock: ["plays", 30], mode: "classic"},
				{description: "Score 80 in classic mode", unlock: ["score", 80], mode: "classic"},
				{description: "Score a total of 700 in classic mode", unlock: ["total", 700], mode: "classic"},
				
				{description: "Play 10 games of tilt mode", unlock: ["plays", 10], mode: "tilt"},
				{description: "Score 30 in tilt mode", unlock: ["score", 30], mode: "tilt"},
				{description: "Score a total of 200 in tilt mode", unlock: ["total", 200], mode: "tilt"},
				{description: "Get 20 points without touching the sides in tilt mode", unlock: ["sides", 20], mode: "tilt"},
				
				{description: "Play 10 games of chance mode", unlock: ["plays", 10], mode: "chance"},
				{description: "Score 30 in chance mode", unlock: ["score", 30], mode: "chance"},
				{description: "Score a total of 200 in chance mode", unlock: ["total", 200], mode: "chance"},
				
				{description: "Play 40 games of classic mode", unlock: ["plays", 40], mode: "classic"},
				{description: "Score 90 in classic mode", unlock: ["score", 90], mode: "classic"},
				{description: "Score a total of 800 in classic mode", unlock: ["total", 800], mode: "classic"},
		],
	challengeProg: 0,
	tempProg: 0,
};

FastClick.attach(document.body);

Raven.config('https://ef18ad107d404aac97eae15efb9e9988@sentry.io/142324').install()

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
game.state.add("mode", mode);

game.state.add("theGame", theGame);
game.state.start("Boot");
