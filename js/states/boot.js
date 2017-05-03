var boot = {
    init: function() {
        console.log('Init boot state...');

        // add plugin to phaser
        game.plugins.add(new Phaser.Plugin.Isometric(game));

        // set physics
        game.physics.startSystem(Phaser.Plugin.Isometric.ISOARCADE);

        // set scale mode
        game.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;

        //set middle point of the world
        game.iso.anchor.setTo(0.5, 0);
    },

    preload: function() {
        // download json settings
        this.load.text('data', 'assets/data/data.json');

        // download json map
        this.load.text('map', 'assets/data/map.json');
    },

    create: function() {
        // save json data content
        var text = game.cache.getText('data');
        var map = game.cache.getText('map');

        simulator.data = JSON.parse(text);
        simulator.map = JSON.parse(map).map;
        simulator.assets = simulator.data.assets;
        simulator.settings = simulator.data.settings;

        // start load state
        game.state.start('load');
    }
};