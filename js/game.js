// create game object
var game = new Phaser.Game('100%', '100%', Phaser.CANVAS, 'game');


// simulator object
var simulator = {};

// game farm object
simulator.farm = {
    cages: [],
    incubators: [],
    pavilions: [],
    skinningStations: [],
    killingStations: [],
    slaughterhouse: null,
    foodStorage: null,
    furStorage: null,
    carcassStorage: null,
    office: null,
    owner: null
};

// game states
game.state.add('boot', boot);
game.state.add('load', load);
game.state.add('create', create);

// start boot state
game.state.start('boot');