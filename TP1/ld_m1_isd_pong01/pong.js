const ball = { x : 0, y : 0, width: 20, height: 20, speed_x : 0, speed_y : 0, display : null };
const player1 = { score: 0, x : 0, y : 0, width: 20, height: 140, display: null };
const player2 = { score: 0, x : 0, y : 0, width: 20, height: 140, display: null };
const wall1 = { x : 0, y : 0, width: 1000, height : 20, display: null };
const wall2 = { x : 0, y : 0, width: 1000, height : 20, display: null };

const r = 5;

let to_play = 1;

function init_ball () {
    /* A COMPLÉTER */
    ball.y = 290;
    if (to_play == 1) {
        ball.x = 120;
    } else {
        ball.x = 1000 - 120 - ball.width;
    }
    ball.display = document.getElementById("ball");
};


function init_players() {
    player1.x = 80;
    player1.y = 230;
    player1.display = document.getElementById("player1");

    player2.x = 1000 - player1.x - player2.width;
    player2.y = 230;
    player2.display = document.getElementById("player2");
}

function init_walls() {
    wall1.x = 0;
    wall1.y = 0;
    wall1.display = document.getElementById("wall1");

    wall2.x = 0;
    wall2.y = 600;
    wall2.display = document.getElementById("wall2");
}

init_ball();
init_players();
init_walls();

/* A COMPLÉTER */
function draw(o) {
    o.display.style.left = o.x + "px";
    o.display.style.top = o.y + "px";
    o.display.style.width = o.width + "px";
    o.display.style.height = o.height + "px";
}

function launch() {
    let angle = Math.PI/3 * Math.random();
    angle *= Math.round(Math.random()) ? 1 : -1;
    ball.speed_x = r * Math.cos(angle);
    ball.speed_y = r * Math.sin(angle);
    if (to_play == 2)
        ball.speed_x = -ball.speed_x;
    to_play = 0;
}

function keyboard(e) {
    switch(e.keyCode) {
        case 69: //touche 'e'
            if (player1.y > wall1.height)
                player1.y -= 10;
            break;
        case 68: //touche 'd'
            if (player1.y + player1.height < wall2.y)
                player1.y += 10;
            break;
        case 79: //touche 'o'
            if (player2.y > wall1.height)
                player2.y -= 10;
            break;
        case 76: //touche 'l'
            if (player2.y + player2.height < wall2.y)
                player2.y += 10;
            break;
        case 72: //touche 'h'
            if (to_play != 0)
                launch();
            break;
    }
}

document.addEventListener("keydown", keyboard);

function update_ball() {
    ball.x += ball.speed_x;
    ball.y += ball.speed_y;

    let center_x = ball.x + ball.width / 2;
    let center_y = ball.y + ball.height / 2;

    if (center_y < wall1.height || center_y > wall2.y - wall2.height)
        ball.speed_y = -ball.speed_y;
    
    if (center_x < player1.x + player1.width) {
        if (center_y >= player1.y && center_y <= player1.y + player1.height) {
            ball.speed_x = -ball.speed_x;
        } else {
            return 2;
        }
    }
    if (center_x > player2.x) {
        if (center_y >= player2.y && center_y <= player2.y + player2.height) {
            ball.speed_x = -ball.speed_x;
        } else {
            return 1;
        }
    }

    return 0;
}

function update() {
    result = update_ball();
    if (result != 0) {
        ball.speed_x = 0;
        ball.speed_y = 0;
        init_players();
        if (result == 1) {
            player1.score++;
            to_play = 2;
        }
        else {
            player2.score++;
            to_play = 1;
        }
        document.getElementById("score").innerHTML = `Score: ${player1.score} - ${player2.score}`
        init_ball();
    } 
    draw(ball);
    draw(wall1);
    draw(wall2);
    draw(player1);
    draw(player2);
}

setInterval(update, 1000/60);