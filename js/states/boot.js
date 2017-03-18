var boot = {
    init: function() {
        console.log('Init boot state...');

        // add plugin to phaser
        game.plugins.add(new Phaser.Plugin.Isometric(game));

        // set world bounds
        game.world.setBounds(0, 0, game.settings.width * 2, game.settings.height);

        // set physics
        game.physics.startSystem(Phaser.Plugin.Isometric.ISOARCADE);

        // set scale mode
        game.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;

        //set middle point of the world
        game.iso.anchor.setTo(0.5, 0);
    },

    create: function() {
        game.state.start('load');
    }
};