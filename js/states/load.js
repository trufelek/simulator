var load = {
    init: function() {
        console.log('Init load state...');
    },

    preload: function() {
        // show load screen
        this.loaderText = game.add.sprite(game.world.centerX, game.world.centerY - 25, 'loader_text');
        this.loaderText.anchor.setTo(0.5);

        this.loaderBar = game.add.sprite(game.world.centerX, game.world.centerY, 'loader');
        this.loaderBar.x = game.world.centerX - 200;

        game.load.setPreloadSprite(this.loaderBar);
        game.load.onLoadComplete.add(this.loadComplete, this);

        //load assets
        for(var asset_key in simulator.assets) {
            if(simulator.assets.hasOwnProperty(asset_key)) {
                var asset = simulator.assets[asset_key];

                switch(asset.type) {
                    case 'image':
                        game.load.image(asset_key, asset.path);
                    break;

                    case 'sound':
                        game.load.audio(asset_key, asset.path);
                    break;
                }
            }
        }
    },

    loadComplete : function() {
        // hide loading screen
        this.loaderText.destroy();
        this.loaderBar.destroy();

        // show home screen
        this.home = game.add.sprite(game.world.centerX, game.world.centerY - 50, 'home');
        this.home.anchor.setTo(0.5);

        this.start = game.add.sprite(game.world.centerX, game.world.centerY + 150, 'start');
        this.start.anchor.setTo(0.5);
        this.start.inputEnabled = true;
        this.start.input.useHandCursor = true;

        // start button interactions
        this.start.events.onInputOver.add(function() {
            this.start.loadTexture('start_hover', 0, false);
        }, this);

        this.start.events.onInputOut.add(function() {
            this.start.loadTexture('start', 0, false);
        }, this);

        this.start.events.onInputDown.add(this.startGame, this);
    },

    startGame: function() {
        // start create state
        game.state.start('create');
    }
};
