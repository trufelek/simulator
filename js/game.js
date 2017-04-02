// create game object
var game = new Phaser.Game('100%', '100%', Phaser.AUTO, 'game');

// game settings
game.settings = {
    background: '#669933',
    height: 700,
    width: 700,
    grid: 32,
    camera: {
        zone: 100,
        velocity: 4
    },
    gui: null
};

// game farm object
game.farm = {
    cages: [],
    incubators: [],
    slaughterhouse: null,
    foodStorage: null,
    storage: null,
    office: null,
    owner: null
};

// game states
game.state.add('boot', boot);
game.state.add('load', load);
game.state.add('create', create);

// start boot state
game.state.start('boot');