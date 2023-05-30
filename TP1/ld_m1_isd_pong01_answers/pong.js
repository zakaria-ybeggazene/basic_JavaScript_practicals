'use strict';

/* Question 2 */
let ball = { x : 0, y : 0, width: 20, height: 20, speed_x : 0, speed_y : 0, display : null };
let player1 = { score: 0, x : 0, y : 0, width: 20, height: 140, display: null };
let player2 = { score: 0, x : 0, y : 0, width: 20, height: 140, display: null };
let wall1 = { x : 0, y : 0, width: 1000, height : 20, display: null };
let wall2 = { x : 0, y : 0, width: 1000, height : 20, display: null };


/* Question 4 */
let init_ball = function () {
    ball.display = document.getElementById("ball");
    if (ball.display == null)
        throw "Uninitialized document";
    ball.x = 120;
    ball.y = 290;
}

/* Question 6 */
let init_players = function () {
    player1.display = document.getElementById("player1");
    player2.display = document.getElementById("player2");

    if (! (player1.display && player2.display))
        throw "Uninitialized document";

    player1.x = 80;
    player2.x = 1000-80-20;
    player1.y = 230;
    player2.y = 230;
}

let init_walls = function () {
    wall1.display = document.getElementById("wall1");
    wall2.display = document.getElementById("wall2");
    if (! (wall1.display && wall2.display))
        throw "Uninitialized document";

    wall1.x = 0;
    wall1.y = 0;

    wall2.x = 0;
    wall2.y = 600 - wall2.height;
}

/* Question 7 */
function draw(o) {
    o.display.style.top = o.y + "px";
    o.display.style.left = o.x + "px";
    o.display.style.width = o.width + "px";
    o.display.style.height = o.height + "px";
}
let to_play = 1;

/* question 8 */
let keyboard = function (ev) {
    switch (ev.keyCode) {
    case 69: /* e */
        if (player1.y > 20) {
            player1.y = Math.max(20, player1.y - 10);
        }
        break;
    case 79: /* o */
        if (player2.y > 20) {
            player2.y = Math.max(20, player2.y - 10);
        }
        break;

    case 68: /* d */
        if (player1.y + player1.height < 600 - 20 ) {
            player1.y = Math.min(600 - 20 - player1.height, player1.y + 10);
        }
        break;
    case 76: /* l */
        if (player2.y + player2.height < 600 - 20 ) {
            player2.y = Math.min(600 - 20 - player2.height, player2.y + 10);
        }
        break;
    case 72: /* h */
        if (to_play != 0) {
            launch();
        }
        break;
    default:
    }
}
/* question 8 suite */
document.addEventListener("keydown", keyboard);

let update_ball = function () {
    /* question 10 */
    ball.x += ball.speed_x;
    ball.y += ball.speed_y;


    /* question 11 */
    let center_x = ball.x + ball.width / 2;
    let center_y = ball.y + ball.height / 2;

    if (center_y < 20 || center_y > 600 - 20) /* collision avec le mur du haut ou du bas*/
    {
        ball.speed_y = -ball.speed_y;
    };

    if (center_x < player1.x + player1.width) { /* collision avec le joueur 1 ? */

        if (center_y >= player1.y && center_y <= player1.y + player1.height) {
            ball.speed_x = -ball.speed_x;
        } else {
            return 2;
        }
    }

    if (center_x > player2.x) { /* collision avec le joueur 2 ? */

        if (center_y >= player2.y && center_y <= player2.y + player2.height) {
            ball.speed_x = -ball.speed_x;
        } else {
            return 1;
        }
    }

    return 0;

}
let update = function () {
    /* question 10 */
    let res = update_ball();


    /* question 12 */
    if (res != 0) {
        ball.speed_x = 0;
        ball.speed_y = 0;
	player1.y = 230;
	player2.y = 230;
        ball.y = 290;
    }

    if (res == 1) {
        player1.score++;
        to_play = 2;
        ball.x = 1000 - 120 - ball.width;
    }
    if (res == 2) {
        player2.score++;
        to_play = 1;
        ball.x = 120;
    }

    /* Question 9 */
    draw(ball);
    draw(player1);
    draw(player2);

}

init_ball();
init_walls();
init_players();
draw(wall1);
draw(wall2);

/* Question 9 suite */
setInterval(update, 1000 / 60);

/* Question 13 */
let launch = function () {
    let t = Math.random (); /* entre 0 et 1 */
    t = t * 2 * (Math.PI / 3);  /* entre 0 et 2pi/3 */
    t = t - (Math.PI / 3);

    ball.speed_y = 5*Math.sin(t);
    ball.speed_x = 5*Math.cos(t);
    if (to_play == 2)
        ball.speed_x = -ball.speed_x;
    to_play = 0;
}
