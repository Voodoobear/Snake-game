window.onload = function() {
    let canvasWidth = 900;
    let canvasHeight = 600;
    blockSize = 30;
    let ctx;
    let delay = 120;
    let snakee;
    let applee;
    let widthInBlocks = canvasWidth / blockSize;
    let heightInBlocks = canvasHeight / blockSize;
    let score;

    init();
    
    function init() {
        let canvas = document.createElement('canvas'); // Creating a Canvas, to work into
        canvas.width = 900;
        canvas.height = 600;
        canvas.style.border = "15px solid gray";
        canvas.style.margin = "50px auto";
        canvas.style.display = "block";
        canvas.style.backgroundColor = "#ddd";
        document.body.appendChild(canvas);
        ctx = canvas.getContext('2d');
        snakee = new Snake([[6,4],[5,4],[4,4]], "right");
        applee = new Apple([10, 10]);
        score = 0;
        refreshCanvas();
    }

    function refreshCanvas() {
        snakee.advance();

        if(snakee.checkCollision()) {
            gameOver();
        } else {

            if(snakee.isEatingApple(applee)) {
                score++;
                snakee.ateApple = true;
                do {
                    applee.setNewPosition();
                }
                while(applee.isOnSnake(snakee))
            }
            ctx.clearRect(0, 0, canvasWidth, canvasHeight);// Rectangle : 100 on 50, placed at 30 px from top and 30 px from the left
            drawScore();
            snakee.draw();
            applee.draw();
            setTimeout(refreshCanvas, delay);
        }

    }

    function gameOver() {
        ctx.save();
        ctx.font = "bold 70px sans-serif";
        ctx.fillStyle = "#000";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.strokeStyle = "#fff";
        ctx.lineWidth = 5;
        let centerX = canvasWidth / 2;
        let centerY = canvasHeight / 2;
        ctx.fillText("Game Over", centerX, centerY - 180);
        ctx.strokeText("Game Over", centerX, centerY - 180);

        ctx.font = "bold 30px sans-serif";
        ctx.strokeText = 
        ctx.fillText("Appuyez sur la touche espace pour rejouer!", 5, 30);
        ctx.restore();
    }

    function restart() {
        snakee = new Snake([[6,4],[5,4],[4,4]], "right");
        applee = new Apple([10, 10]);
        score = 0;
        refreshCanvas();
    }

    function drawScore() {
        ctx.save();
        ctx.font = "bold 100px sans-serif";
        ctx.fillStyle = "gray";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        let centerX = canvasWidth / 2;
        let centerY = canvasHeight / 2;
        ctx.fillText(score.toString(), centerX, centerY);
        ctx.restore();
    }

    function drawBlock(ctx, position)
    {
        let x = position[0] * blockSize;
        let y = position[1] * blockSize;
        ctx.fillRect(x, y, blockSize, blockSize);
    }

    function Snake(body, direction) {
        this.body = body;
        this.direction = direction;
        this.ateApple = false;
        this.draw = function() {
            ctx.save();
            ctx.fillStyle = "#ff0000";
            for(let i = 0; i < this.body.length; i++) {
                drawBlock(ctx, this.body[i]);
            }
            ctx.restore();
        };

        this.advance = function() {
            let nextPosition = this.body[0].slice();
            switch(this.direction) {
                case "left":
                    nextPosition[0] -= 1;
                break;
                case "right":
                    nextPosition[0] += 1;
                break;
                case "down":
                    nextPosition[1] += 1;
                break;
                case "up":
                    nextPosition[1] -= 1;
                break;
                default:
                    throw("Invalid Direction");
            }
            this.body.unshift(nextPosition);
            if(!this.ateApple) {
                this.body.pop();
            } else {
                this.ateApple = false;
            }
        };
        
        this.setDirection = function (newDirection) {
            let allowedDirection;
            switch(this.direction) {
                case "left":
                case "right":
                    allowedDirection = ["up", "down"];
                break;
                case "up":
                case "down":
                    allowedDirection = ["left", "right"];
                break;
                default:
                    throw("Invalid Direction");
            }
            if(allowedDirection.indexOf(newDirection) > -1) {
                this.direction = newDirection;
            }
        };

        this.checkCollision = function() {
            let wallCollision = false;
            let snakeCollision = false;
            let head = this.body[0];
            let rest = this.body.slice(1);
            let snakeX = head[0];
            let snakeY = head[1];
            let minX = 0;
            let minY = 0;
            let maxX = widthInBlocks -1;
            let maxY = heightInBlocks -1;
            let isNotBetweenHorizontalWalls = snakeX < minX || snakeX > maxX;
            let isNotBetweenVerticalWalls = snakeY < minY || snakeY > maxY;

            if(isNotBetweenHorizontalWalls ||  isNotBetweenVerticalWalls) {
                wallCollision = true;
            }

            for(let i = 0; i < rest.length; i++) {
                if(snakeX === rest[i][0] && snakeY === rest[i][1]) {
                    snakeCollision = true;
                }
            }

            return wallCollision || snakeCollision;
        };

        this.isEatingApple = function(appleToEat) {
            let head = this.body[0];
            if(head[0] === appleToEat.position[0] && head[1] === appleToEat.position[1]) {
                return true;
            } else {
                return false;
            }
        };
    } 

    function Apple(position) {
        this.position = position;
        this.draw = function() {
            ctx.save();
            ctx.fillStyle = "#33cc33";
            ctx.beginPath();
            let radius = blockSize / 2;
            let x = this.position[0] * blockSize + radius;
            let y = this.position[1] * blockSize + radius;
            ctx.arc(x, y, radius, 0, Math.PI*2, true);
            ctx.fill();
            ctx.restore();
        };

        this.setNewPosition = function() {
            let newX = Math.round(Math.random() * (widthInBlocks - 1));
            let newY = Math.round(Math.random() * (heightInBlocks - 1));
            this.position = [newX, newY];
        };

        this.isOnSnake = function(snakeToCheck) {
            let isOnSnake = false;

            for(let i = 0; i > snakeToCheck.body.length; i++) {
                if(this.position[0] === snakeToCheck.body[i][0] && this.position[1] === snakeToCheck.body[i][1]) {
                    isOnSnake = true;
                }
            }

            return isOnSnake;
        };
    }

    this.document.onkeydown = function handleKeyDown(e) {
        let key = e.keyCode;
        let newDirection;
        switch(key) {
            case 37:
                newDirection = "left";
            break;
            case 38:
                newDirection = "up";
            break;
            case 39:
                newDirection = "right";
            break;
            case 40:
                newDirection = "down";
            break;
            case 32:
                restart();
                return;
            default:
                return;
        }
        snakee.setDirection(newDirection);
    }
    
}