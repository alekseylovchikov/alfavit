var game = new Phaser.Game(640, 360, Phaser.AUTO);

var GameState = {
    preload: function() {
        // load arrow
        this.load.image('arrow', 'assets/img/arrow.png');

        // load all images
        for (let i = 1; i <= 33; i++) {
            this.load.image(i.toString(), `assets/img/${i}.png`);
        }

        // load all sounds
        for (let i = 1; i <= 33; i++) {
            this.load.audio(i.toString(), `assets/sounds/${i}.ogg`);
        }
    },
    create: function() {
        // config for canvas
        this.game.stage.backgroundColor = '#fff';
        this.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
        this.scale.pageAlignHorizontally = true;
        this.scale.pageAlignVertically = true;

        const MAIN_STYLE = {
            font: '40px Arial',
            fill: '#5ec591'
        };

        var letters = [
            { key: '1', text: 'А - Аист', sound: '1' },
            { key: '2', text: 'Б - Бабочка, Белка', sound: '2' },
            { key: '3', text: 'В - Ваза, Ветка', sound: '3' },
            { key: '4', text: 'Г - Голубь, Гитара', sound: '4' },
            { key: '5', text: 'Д - Дыня, Дятел', sound: '5' },
            { key: '6', text: 'Е - Енот', sound: '6' },
            { key: '7', text: 'Е - Еж', sound: '7' },
            { key: '8', text: 'Ж - Журавль', sound: '8' },
            { key: '9', text: 'З - Зеркало, Зонт', sound: '9' },
            { key: '10', text: 'И - Индюк', sound: '10' },
            { key: '11', text: 'Й - Йод, Йогурт', sound: '11' },
            { key: '12', text: 'К - Карась, Кенгуру', sound: '12' },
            { key: '13', text: 'Л - Ласточка, Лебедь', sound: '13' },
            { key: '14', text: 'М - Мак, Мяч', sound: '14' },
            { key: '15', text: 'Н - Ножницы, Нитки', sound: '15' },
            { key: '16', text: 'О - Окунь', sound: '16' },
            { key: '17', text: 'П - Пушка, Пирамидка', sound: '17' },
            { key: '18', text: 'Р - Рак, Репа', sound: '18' },
            { key: '19', text: 'С - Сорока, Синица', sound: '19' },
            { key: '20', text: 'Т - Труба, Телевизор', sound: '20' },
            { key: '21', text: 'У - Утка', sound: '21' },
            { key: '22', text: 'Ф - Флаг, Фиалка', sound: '22' },
            { key: '23', text: 'Х - Хлеб, Хижина', sound: '23' },
            { key: '24', text: 'Ц - Цапля', sound: '24' },
            { key: '25', text: 'Ч - Чайка', sound: '25' },
            { key: '26', text: 'Ш - Шар', sound: '26' },
            { key: '27', text: 'Щ - Щетка', sound: '27' },
            { key: '28', text: 'Ъ - Твердый знак', sound: '28' },
            { key: '29', text: 'Ы', sound: '29' },
            { key: '30', text: 'Ь - Мягкий знак', sound: '30' },
            { key: '31', text: 'Э - Этажерка', sound: '31' },
            { key: '32', text: 'Ю - Юла', sound: '32' },
            { key: '33', text: 'Я - Яблоко', sound: '33' }
        ];

        this.letters = this.game.add.group();
        var letter = '';

        letters.map(el => {
            letter = this.letters.create(-1000, this.game.world.centerY, el.key);
            letter.anchor.setTo(0.5);
            letter.customParams = { text: el.text, sound: this.game.add.audio(el.sound) };

            letter.inputEnabled = true;
            letter.input.pixelPerfectClick = true;
            letter.events.onInputDown.add(this.animatePlanet, this);
        });

        this.currentLetter = this.letters.next();
        this.currentLetter = this.letters.previous();
        this.currentLetter.position.set(this.game.world.centerX, this.game.world.centerY);

        this.showText(this.currentLetter);

        // add right arrow
        this.rightArrow = this.game.add.sprite(580, this.game.world.centerY, 'arrow');
        this.rightArrow.anchor.setTo(0.5);
        this.rightArrow.customParams = { direction: 1 };

        // action right
        this.rightArrow.inputEnabled = true;
        this.rightArrow.input.pixelPerfectClick = true;
        this.rightArrow.events.onInputDown.add(this.switchPlanet, this);

        // add left arrow
        this.leftArrow = this.game.add.sprite(60, this.game.world.centerY, 'arrow');
        this.leftArrow.anchor.setTo(0.5);
        this.leftArrow.scale.x = -1;
        this.leftArrow.customParams = { direction: -1 };

        // actions left
        this.leftArrow.inputEnabled = true;
        this.leftArrow.input.pixelPerfectClick = true;
        this.leftArrow.events.onInputDown.add(this.switchPlanet, this);

        this.text = this.game.add.text(this.game.world.centerY, 0, "Учим алфавит вместе", MAIN_STYLE);
    },
    update: function() {
        this.text.x = (this.game.world.width - this.text.width) / 2;
    },
    switchPlanet: function(sprite, event) {

        if (this.isMoving) {
            return false;
        }

        this.isMoving = true;

        this.letterText.visible = false;

        var newLetter, endX;

        if (sprite.customParams.direction > 0) {
            newLetter = this.letters.next();
            newLetter.x = -newLetter.width / 2;
            endX = 640 + this.currentLetter.width / 2;
        } else {
            newLetter = this.letters.previous();
            newLetter.x = 640 + newLetter.width / 2;
            endX = -this.currentLetter.width / 2;
        }

        var newLetterMovement = this.game.add.tween(newLetter);
        newLetterMovement.to({ x: this.game.world.centerX }, 1000);
        newLetterMovement.onComplete.add(function() {
            this.isMoving = false;
            this.showText(newLetter);
        }, this);
        newLetterMovement.start();

        var currentLetterMovement = this.game.add.tween(this.currentLetter);
        currentLetterMovement.to({ x: endX }, 1000);
        currentLetterMovement.start();

        this.currentLetter = newLetter;
    },
    animatePlanet: function(sprite, event) {
        this.letterText.visible = true;
        sprite.customParams.sound.play();
    },
    showText: function(letter) {
        if (!this.letterText) {
            this.letterText = this.game.add.text(this.game.width / 2, this.game.height * .95, '');
            this.letterText.anchor.setTo(0.5);
            this.letterText.visible = false;
        }

        this.letterText.setText(letter.customParams.text);
        this.letterText.addColor('#e03c8c', 0);
    }
};

game.state.add('GameState', GameState);
game.state.start('GameState');