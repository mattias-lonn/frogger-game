let playerScore = 0,
    playerDeaths = 0,
    playerLifes = 3;

// Enemies our player must avoid
class Enemy {
    constructor(y, x, direction, type) {
        this.sprite = 'images/enemy-bug.png';
        this.y = y;
        this.x = -100;
        this.direction = direction;
        this.type = type;
        this.speed = Math.floor((Math.random() * 200) + 100);
    }

    // Update the enemy's position, required method for game
    // Parameter: dt, a time delta between ticks

    update(dt) {

        if (this.direction === 'left') {
            if (this.x <= 505) {
                this.x += this.speed * dt;
            } else {
                this.x = -100;
            }
        }

        if (this.direction === 'right') {
            if (this.type === 'shark') {
                this.sprite = 'images/shark-fin.png';
            } else {
                this.sprite = 'images/enemy-bug-right.png';
            }
            if (this.x >= -101) {
                this.x -= this.speed * dt;
            } else {
                this.x = 500;
            }
        }

    }

    // Draw the enemy on the screen
    render() {
        ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
    }
}


class Ghost {
    constructor(y, x) {
        this.sprite = 'images/char-boy-dead.png';
        this.y = y;
        this.x = x;
        this.speed = 200;
    }

    update(dt) {

        if (this.y >= 0) {
            this.y -= this.speed * dt;
        } else {
            allEnemies.pop(); // Make sure the angel doesn't kill our memory
        }

    }

    // Draws the angel on the screen
    render() {
        ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
    }
}

// Player is defined here
class Player {
    constructor() {
        this.sprite = 'images/char-boy.png';
        this.x = 200;
        this.y = 400;
    }

    update(dt) {


        const self = this;
        const key = this.pressedKey;

        // Moves the player & checks if the player is offscreen		
        if (key === 'l' && this.x > 0) {
            this.x -= 100;
        } else if (key === 'r' && this.x < 400) {
            this.x += 100;
        } else if (key === 'u' && this.y > 0) {
            this.y -= 85;
        } else if (key === 'd' && this.y < 400) {
            this.y += 90;
        } else if (key === 'q' && this.y > 0 && this.x > 0) { // Move up and left
            this.y -= 90;
            this.x -= 100;
        } else if (key === 'e' && this.y > 0 && this.x < 400) { // Move up and right
            this.y -= 90;
            this.x += 100;
        }

        this.pressedKey = '';


        allEnemies.forEach(enemy => {
            if (self.x >= enemy.x - 80 && self.x <= enemy.x + 80) {
                if (self.y >= enemy.y - 70 && self.y <= enemy.y + 70) {
                    self.died();
                }
            }
        });
		
        // if player reaches water, position gets reseted
        if (this.y < 0) {
            playerScore++;
            $('#player-score').html(playerScore);

			// Gains a life for every + 5 in score
            if (playerScore % 5 === 0) {
                playerLifes++;
                $('#player-life').html("&#10084; ".repeat(playerLifes));
            }

            this.reset();
        }
    }



    render() {
        ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
    }

    handleInput(e) {
        this.pressedKey = e;
    }



    reset() {
        this.sprite = 'images/char-boy.png';
        this.x = 200;
        this.y = 400;
    }


    died() {

        playerDeaths++;
        playerLifes--;

		// If the player gets Game Over
        if (playerLifes === 0) {
            $('#player-life').html('&#9785;');
            $('.message').html('Game Over! <br> <button class="new">Play Again!</button>');
            $('.fade-bg').fadeToggle('slow', 'linear');

            $('.new').click(function() {
                playerScore = 0;
                playerDeaths = 0;
                playerLifes = 3;

                $('#player-score').html(playerScore);
                $('#player-life').html("&#10084; &#10084; &#10084;");
                $('.fade-bg').fadeToggle('slow', 'linear');
            });
        }
		
		// Player loses one life
		else if (playerLifes > 0) {
            $('#player-life').html("&#10084; ".repeat(playerLifes));
        }

		// If player dies, player becomes an angel
        allEnemies.push(new Ghost(this.y, this.x));
        this.x = 200;
        this.y = 400;
    }

}

const player = new Player();
const allEnemies = [];

// Adds ours enemies
allEnemies.push(new Enemy(230, 50, 'left'));
allEnemies.push(new Enemy(145, 140, 'right'));
allEnemies.push(new Enemy(60, 230, 'left'));
allEnemies.push(new Enemy(-20, 50, 'right', 'shark'));


// This listens for key presses and sends the keys to your
// Player.handleInput() method. Added "upleft", "upright"
document.addEventListener('keyup', function(e) {
    var allowedKeys = {
        37: 'l',
        38: 'u',
        39: 'r',
        40: 'd',
        65: 'l',
        87: 'u',
        68: 'r',
        83: 'd',
        81: 'q',
        69: 'e'
    };

    player.handleInput(allowedKeys[e.keyCode]);
});