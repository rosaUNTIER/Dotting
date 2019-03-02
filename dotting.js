let canvas = document.getElementById("game");
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let ctx = canvas.getContext("2d");
let x = 0;
let y = canvas.height/2;
let speed = 5;

class Bubble{
    constructor({x = 0, y = 0, radius = 5, up = false, right = false, down = false, left = false, speed = 15, color = "#000"}){
        this.x = x;
        this.y = y;
        this.r = radius;
        console.log(up);
        this.up = up;
        this.down = down;
        this.left = left;
        this.right = right;
        this.speed = speed;
        this.color = color;
    }
    move(){
        if(this.up == true){
            this.y -= this.speed;
        }
        if(this.down == true){
            this.y += this.speed;
        }
        if(this.left == true){
            this.x -= this.speed;
        }
        if(this.right == true){
            this.x += this.speed;
        }
    }
    draw(){
        if(this.x > canvas.width){
            this.x = 0;
        }
        if(this.x < 0){
            this.x = canvas.width;
        }
        if(this.y > canvas.height){
            this.y = 0;
        }
        if(this.y < 0){
            this.y = canvas.height;
        }
        ctx.beginPath();
        //ctx.rect(this.x - (this.r/2), this.y - (this.r/2), this.r, this.r);
        ctx.arc(this.x, this.y, this.r, 0, 2*Math.PI);
        ctx.fillStyle = this.color;
        ctx.fill();
        ctx.closePath();
    }
    setDirection(dir){
        this.up = false;
        this.down = false;
        this.left = false;
        this.right = false;
        dir.map((x) => {
            if(x == "up"){
                this.up = true;
            }
            if(x == "down"){
                this.down = true;
            }
            if(x == "left"){
                this.left = true;
            }
            if(x == "right"){
                this.right = true;
            }
        })
    }
    distanceFrom(bubble){
        let dx = Math.abs(this.x - bubble.x);
        let dy = Math.abs(this.y - bubble.y);
        let dist = Math.sqrt(dx * dx + dy * dy);
        return(dist);
    }

}
let MyBubble = new Bubble({
    x: canvas.width/2,
    y: canvas.height/2,
    color: "rgb(255, 0,0)"
});
let Opponent = initOpponents(1000);
let killedBubbles = [];
let score = 0;

function draw(){
    ctx.beginPath();
    ctx.rect(0, 0, canvas.clientWidth, canvas.clientHeight);
    ctx.fillStyle = "#ddd";
    ctx.fill();
    ctx.closePath();

    killedBubbles = Opponent.filter((bubble) => bubble.distanceFrom(MyBubble) <= (bubble.r + MyBubble.r));
    killedBubbles.forEach(() => {
        score++;
        document.getElementById("score").innerHTML = score;
        if(MyBubble.r < 1000005) {MyBubble.r++;};
        if(MyBubble.r > 80 && MyBubble.speed > 7){MyBubble.speed--;}
    });
    Opponent = Opponent.filter((bubble) => bubble.distanceFrom(MyBubble) > (bubble.r + MyBubble.r));
    Opponent.forEach((bubble) => bubble.move());
    if(Opponent.length == 0){
        MyBubble.r = 5;
        Opponent = initOpponents(1000);
    }
    Opponent.forEach((bubble) => bubble.draw())
    MyBubble.move();
    MyBubble.draw();
    console.log(Opponent.length + score);




    window.requestAnimationFrame(draw);
}




document.addEventListener("keydown", keyDown, true);
document.addEventListener("keyup", keyUp, true);

function keyDown(e){
    let dir = [];
    if(e.key == "ArrowUp"){
        MyBubble.up = true;
    }
    if(e.key == "ArrowDown"){
        MyBubble.down = true;
    }
    if(e.key == "ArrowLeft"){
        MyBubble.left = true;
    }
    if(e.key == "ArrowRight"){
        MyBubble.right = true;
    }
}
function keyUp(e){
    if(e.key == "ArrowUp"){
        MyBubble.up = false;
    }
    if(e.key == "ArrowDown"){
        MyBubble.down = false;
    }
    if(e.key == "ArrowLeft"){
        MyBubble.left = false;
    }
    if(e.key == "ArrowRight"){
        MyBubble.right = false;
    }
}

function draw_dot(x,y){
    ctx.beginPath();
    ctx.arc(x, y, 5, 0, 2*Math.PI);
    ctx.fillStyle = "#000";
    ctx.fill();
    ctx.closePath();
}
function initOpponents(number){
    return(
    Array.apply(null, Array(number)).map(() => {
        let tmp_up = false;
        let tmp_right = false;
        let tmp_down = false;
        let tmp_left = false;
        if(Math.random() < 0.3){
            tmp_up = true;
        }else if(Math.random() < 0.5){
            tmp_down = true;
        }
        if(Math.random() < 0.3){
            tmp_right = true;
        }else if(Math.random() <0.5){
            tmp_left = true;
        }

        return(new Bubble({
        x: Math.random() * canvas.width, 
        y: Math.random() * canvas.height, 
        radius: Math.random() * 15 + 3,
        up: tmp_up,
        down: tmp_down,
        left: tmp_left,
        right: tmp_right,
        speed: Math.random()*10}))
    })
    )
}

draw();