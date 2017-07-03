/*
 Events Class
*/
function Events() {
    this.events = [
        {name: 'intervention', penalty: 10000, icon: 'event_intervention', title: 'Interwencja Otwartych klatek!', message: 'W związku z ostatnimi wydarzeniami na fermie pojawiły się Otwarte Klatki!'},
        {name: 'epidemic', penalty: 1000, icon: 'event_disease', title: 'W pawilonie wybuchła epidemia!', message: 'Chore lisy mogą zarazić pozostałe jeśli nie zareagujesz w porę.'},
        {name: 'escape', penalty: 100, icon: 'event_escape', title: 'Z jednej z twoich klatek uciekły lisy!', message: 'Jeżeli zapomnisz o karmieniu swoich lisów, to może się powtórzyć.'},
        {name: 'disease', penalty: 100, icon: 'event_disease', title: 'W jednej z twoich klatek zachorowały lisy!', message: 'Pamiętaj, im więcej zwierząt w pawilonie tym łatwiej o choroby.'},
        {name: 'inspection', penalty: 1000, icon: 'event_inspection', title: 'Niespodziewana kontrola weterynaryjna!', message: 'Płacisz karę za nielegalne przerabianie odpadów na karmę.'},
        {name: 'protests', penalty: 1000, icon: 'event_protests', title: 'Protesty lokalnych społeczności!', message: 'Miejscowi narzekają na przykry zapach! Płacisz karę za zalegające odpady.'}
    ];

    this.probability = [0.0, 0.0, 0.0, 0.0, 0.0, 0.0];

    this.event = null;

    this.popup = null;
    this.sound = game.add.audio('event');

    this.message = {
        font: 'bold 16px Arial',
        fill: '#000000',
        wordWrap: true,
        wordWrapWidth: 400,
        align: 'center'
    };

    this.heading = {
        font: 'bold 18px Arial',
        fill: '#E95052',
        wordWrap: false,
        align: 'center'
    };

    // create timer loop
    game.time.events.loop(Phaser.Timer.SECOND * 30, this.randomEvents, this);
    game.time.events.loop(250, this.updateProbabilities, this);
}

Events.prototype.randomEventsTest = function() {
    this.test = {escape: 0, disease: 0, intervention: 0, inspection: 0};

    for(var i = 0; i < 10000; i++) {
        var item = this.getRandomEvent();
        if(item) {
            ++ this.test[item.name];
        }
    }

    console.log(this.test);
};

Events.prototype.randomEvents = function() {
    if(!this.event) {
        var event = this.getRandomEvent();
    }

    if(event) {
        this.event = event;
        var ok = false;

        switch(this.event.name) {
            case 'escape':
                // choose random cage
                var miserableCages = Cage.miserable.filter(function(cage) {
                    return cage.state.sick == false;
                });

                if(miserableCages.length) {
                    var randomHungryCage =  Math.round(this.random(0, miserableCages.length - 1));
                    var hungryCage = miserableCages[randomHungryCage];

                    // empty cage
                    hungryCage.escapeFromCage();

                    // event can happen
                    ok = true;
                }

                break;

            case 'disease':
                // filter crowded pavilions but not epidemic ones
                var crowdedPavilions = Pavilion.crowded.filter(function(pavilion) {
                    return pavilion.state.epidemic == false;
                });

                if(crowdedPavilions.length) {
                    // choose random crowded pavilion
                    var randomCrowdedPavilion = Math.round(this.random(0, crowdedPavilions.length - 1));
                    var crowdedPavilion = crowdedPavilions[randomCrowdedPavilion];

                    // choose random cage from crowded pavilion
                    var randomSickCage = Math.round(this.random(0, crowdedPavilion.fullCages.length - 1));
                    var sickCage = crowdedPavilion.fullCages[randomSickCage];

                    if(!sickCage.state.sick) {
                        // make cage sick
                        sickCage.sick();

                        // event can happen
                        ok = true;
                    }
                }

                break;

            case 'epidemic':
                // choose random sick cage
                var randomEpidemicCage = Math.round(this.random(0, Cage.sick.length - 1));
                var epidemicCage = Cage.sick[randomEpidemicCage];

                // update sick cage pavilion
                var epidemicPavilion = epidemicCage.pavilion;

                if(epidemicPavilion.fullCages.length != epidemicPavilion.sickCages.length) {
                    epidemicPavilion.state.epidemic = true;
                    Pavilion.epidemic.push(epidemicPavilion);

                    // make all cages in pavilion sick
                    for(var c in epidemicPavilion.fullCages) {
                        if(epidemicPavilion.fullCages.hasOwnProperty(c)) {
                            if(!epidemicPavilion.fullCages[c].state.sick) {
                                epidemicPavilion.fullCages[c].sick();
                            }
                        }
                    }

                    game.time.events.add(Phaser.Timer.SECOND * 20, this.epidemicCoundtown, this, epidemicPavilion);

                    // event can happen
                    ok = true;
                }

                break;

            case 'inspection':
                // event can happen
                ok = true;

                // clear recycled stats
                simulator.farm.carcassStorage.stats.recycled = 0;

                break;

            default:
                // event can happen
                ok = true;
        }

        if(ok) {
            //increase probability of intervention
            if(this.probability[0] < 1) {
                this.probability[0] += 0.2;
            }

            // penalty
            simulator.farm.owner.cash -= this.event.penalty;
            simulator.gui.showPenalty(this.event.penalty);

            this.sound.play();
            this.showEventMessage();

        } else {
            // if event can't happen, cancel it
            var index = this.events.indexOf(this.event);
            this.probability[index] = 0.0;
            this.event = null;
        }

    }
};

Events.prototype.updateProbabilities = function() {
    // epidemic probability
    if(Cage.sick.length && !Pavilion.epidemic.length) {
        if(this.probability[1] < 1) {
            this.probability[1] += 0.005;
            this.probability[1] = +this.probability[1].toFixed(3);
        }
    } else {
        this.probability[1] = 0;
    }

    // escape probability
    if(Cage.miserable.length) {
        if(this.probability[2] < 1) {
            this.probability[2] += 0.005;
            this.probability[2] = +this.probability[2].toFixed(3);
        }
    } else {
        this.probability[2] = 0;
    }

    // disease probability
    if(Pavilion.crowded.length) {
        if(this.probability[3] < 1) {
            this.probability[3] += 0.01;
            this.probability[3] = +this.probability[3].toFixed(3);
        }
    } else {
        this.probability[3] = 0;
    }

    // inspection probability
    if(simulator.farm.carcassStorage.stats.recycled > 0) {
        if(this.probability[4] < 1) {
            this.probability[4] += 0.01;
            this.probability[4] = +this.probability[4].toFixed(3);
        }
    } else {
        this.probability[4] = 0;
    }

    // protests probability
    if(simulator.farm.carcassStorage.state.full) {
        if(this.probability[5] < 1) {
            this.probability[5] += 0.01;
            this.probability[5] = +this.probability[5].toFixed(3);
        }
    } else {
        this.probability[5] = 0;
    }
};

Events.prototype.showEventMessage = function() {
    // draw event message popup
    this.popup = game.add.graphics(game.width / 2 - 250, game.height / 2 - 125);
    this.popup.alpha = 0;
    this.popup.beginFill(0xFFFFFF, 0.9);
    this.popup.lineStyle(2, 0x000000, 1);
    this.popup.drawRect(0, 0, 500, 250);
    this.popup.endFill();
    this.popup.inputEnabled = true;
    this.popup.input.priorityID = 4;
    this.popup.fixedToCamera = true;

    // dra event icon
    var icon = this.popup.addChild(game.add.sprite(this.popup.width / 2, 75, this.event.icon, 0));
    icon.width = 120;
    icon.height = 100;
    icon.anchor.setTo(0.5);

    // display event title
    var heading = this.popup.addChild(game.add.text(this.popup.width / 2, 160, this.event.title, this.heading));
    heading.anchor.setTo(0.5);

    // display event message
    var text = this.popup.addChild(game.add.text(this.popup.width / 2, 200, this.event.message, this.message));
    text.anchor.setTo(0.5);


    // display close button
    var close = this.popup.addChild(game.add.sprite(this.popup.width - 55, 5, 'close', 0));
    close.width = 50;
    close.height = 50;
    close.inputEnabled = true;
    close.input.priorityID = 5;
    close.input.useHandCursor = true;
    close.events.onInputDown.add(function() {
        this.hideEventMessage();
    }, this);


    // show message
    game.add.tween(this.popup).to( { alpha: 1 }, 1000, Phaser.Easing.Linear.None, true, 0, 0, false);
};

Events.prototype.hideEventMessage = function() {
    if(this.event) {
        var index = this.events.indexOf(this.event);
        this.probability[index] = 0.0;
        this.event = null;
    }

    // hide message
    var tween = game.add.tween(this.popup).to( { alpha: 0 }, 1000, Phaser.Easing.Linear.None, true, 0, 0, false);
    tween.onComplete.add(function() {
        this.popup.destroy();
    }, this);
};

Events.prototype.getRandomEvent = function() {
    // get random number from 0 to 1
    var random = this.random(0, 1);
    var sum = 0;

    // for every event check probability
    for(var i = 0; i < this.events.length; i++) {
        sum += this.probability[i];
        sum = +sum.toFixed(2);

        if(random <= sum) {
            return this.events[i];
        }
    }
};

Events.prototype.random = function(min, max) {
    return Math.random() * (max - min) + min;
};

Events.prototype.gameOver = function() {
    // start game over state
    this.sound.play();

    var background, gameover, restart;

    // create game over screen
    background = game.add.graphics(0, 0);
    background.alpha = 0;
    background.beginFill(0x000000, 0.8);
    background.drawRect(0, 0, game.width, game.height);
    background.endFill();
    background.fixedToCamera = true;

    // fade in game over screen
    game.add.tween(background).to( { alpha: 1 }, 2000, Phaser.Easing.Linear.None, true, 0, 0, false);

    this.sound.onStop.add(function() {
        // create logo and buttons
        gameover = game.add.sprite(game.width / 2, game.height / 2 - 50, 'gameover');
        gameover.anchor.setTo(0.5);

        restart = game.add.sprite(game.width / 2, game.height / 2 + 150, 'restart_hover');
        restart.anchor.setTo(0.5);
        restart.inputEnabled = true;
        restart.input.useHandCursor = true;

        // pause game
        game.paused = true;
    }, this);

    game.input.onDown.add(function(event) {
        if(restart) {
            var x = restart.x - restart.width / 2;
            var y = restart.y - restart.height / 2;
            var w = restart.width;
            var h = restart.height;

            if(event.x > x && event.x < x + w && event.y > y && event.y < y + h) {
                // unpause game
                game.paused = false;

                // restart current state
                game.state.restart();
            }
        }

    }, self);
};

Events.prototype.epidemicCoundtown = function(epidemicPavilion) {
    if(epidemicPavilion.sickCages.length) {
        var cages = epidemicPavilion.sickCages;

        //make all cages in pavilion sick
        for(var c in cages) {
            if(cages.hasOwnProperty(c)) {
                var cage =  epidemicPavilion.sickCages[c];
                cage.dieFromSickness();

                if(c == epidemicPavilion.sickCages.length - 1) {
                    // update pavilion state
                    epidemicPavilion.sickCages = [];
                    epidemicPavilion.updateState();
                }
            }
        }
    }
};