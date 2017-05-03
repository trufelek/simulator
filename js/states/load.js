var load = {
    init: function() {
        console.log('Init load state...');
    },

    preload: function() {
        //load assets
        for(var asset_key in simulator.assets) {
            if(simulator.assets.hasOwnProperty(asset_key)) {
                var asset = simulator.assets[asset_key];

                switch(asset.type) {
                    case 'image':
                        game.load.image(asset_key, asset.path);
                    break;
                }
            }
        }
    },

    create: function() {
        // start create state
        game.state.start('create');
    }
};