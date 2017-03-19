// create game object
var game = new Phaser.Game('100%', '100%', Phaser.AUTO, 'game');

// game settings
game.settings = {
    background: '#000',
    height: 700,
    width: 700,
    grid: 32,
    camera: {
        zone: 100,
        velocity: 4
    }
}

// game states
game.state.add('boot', boot);
game.state.add('load', load);
game.state.add('play', play);

game.state.start('boot');