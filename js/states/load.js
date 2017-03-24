var load = {
    init: function() {
        console.log('Init load state...');
    },

    preload: function() {
        //map elements
        game.load.image('ground', 'img/grid.png');
        game.load.image('cage', 'img/cage.png');
        game.load.image('incubator', 'img/incubator.png');
        game.load.image('office', 'img/office.png');
        game.load.image('foodstorage', 'img/foodstorage.png');
        game.load.image('storage', 'img/storage.png');
        game.load.image('slaugtherhouse', 'img/slaugtherhouse.png');
        game.load.image('tree1', 'img/tree1.png');
        game.load.image('tree2', 'img/tree2.png');

        // gui elements
        game.load.image('tooltip', 'img/gui/tooltip.png');
        game.load.image('tooltip_line', 'img/gui/line.png');
        game.load.image('action_line', 'img/gui/line2.png');
        game.load.image('bar', 'img/gui/bar.png');
        game.load.image('progress_bar', 'img/gui/progress.png');

        // icons
        game.load.image('clock_icon', 'img/icons/clock_icon.png');
        game.load.image('condition_icon', 'img/icons/condition_icon.png');
        game.load.image('food_icon', 'img/icons/food_icon.png');
        game.load.image('action_feed_icon', 'img/icons/action_feed_icon.png');
        game.load.image('action_kill_icon', 'img/icons/action_kill_icon.png');
        game.load.image('action_heal_icon', 'img/icons/action_heal_icon.png');
        game.load.image('action_buy_food', 'img/icons/action_buy_food.png');
    },

    create: function() {
        game.state.start('create');
    }
};