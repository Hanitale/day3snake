(function () {
    
    /* CONSTANTS */
    var ROWS = 10;
    var COLS = 13;
    var PAUSE_KEYCODE = 27; //escape
    var DEFAULT_KEYS = new Keys(37, 38, 39, 40); //Keycodes for left up right and down keys

    var GAME_INTERVAL = 120;

    /* initialize variables */
    var matrix;
    var snakes;
    var player1;
    var game;
    var is_running = false;

    //function to make a prototype of keys
    function Keys(leftKeycode, upKeycode, rightKeycode, downKeycode) {
        this.left = leftKeycode;
        this.up = upKeycode;
        this.right = rightKeycode;
        this.down = downKeycode;
    }

    Keys.prototype.hasKey = function (key) {
        return key == this.left || key == this.up || key == this.right || key == this.down;
    }

    //function to make a prototype of a snake segment
    function Segment(posX, posY) {
        this._posX = posX;
        this._posY = posY;
        this._direction = 'left'; // possible values: 'left', 'up', 'right', 'down' (default is 'left')
    }
       
    //function to make a prototype of snake
      function Snake(name, posX, posY, snakeLength, keys) {
        this._name = name;
        this._keys = keys;
        this._segments = [];                       //Array of squares/segments
        for (x = 0; x < snakeLength; x++) {
            this._segments.push(new Segment((posX+x) % COLS, posY));
        }
      }

      Snake.prototype.hasKey = function (key) {
          return this._keys.hasKey(key);
      }
      
      Snake.prototype.handleKeyPress = function (key) {           //  determines direction for head
         
          if (this._keys.left == key) {
              this._segments[0]._direction = 'left'
          }
          else if (this._keys.up == key) {
              this._segments[0]._direction = 'up'
          }
          else if (this._keys.right == key) {
              this._segments[0]._direction = 'right'
          }
          else if (this._keys.down == key) {
              this._segments[0]._direction = 'down'
          }
      }

     //create the player.
      player1 = new Snake('player1', 4, 6, 6, DEFAULT_KEYS);

    //moveTo just writes the value 
      Snake.prototype.moveTo = function () {
        console.log(this._name);
        console.log(this._posX);
        console.log(this._posY);
      }
   
      function gameLoop() {
          //move snake segments
          for (var i = 0; i < player1._segments.length; i++) {
              if (player1._segments[i]._direction == 'left') {
                  player1._segments[i]._posX = ((player1._segments[i]._posX - 1) + COLS) % COLS;
              }
              if (player1._segments[i]._direction == 'up') {
                  player1._segments[i]._posY = ((player1._segments[i]._posY - 1) + ROWS) % ROWS;
              }
              if (player1._segments[i]._direction == 'right') {
                  player1._segments[i]._posX = (player1._segments[i]._posX + 1) % COLS;
              }
              if (player1._segments[i]._direction == 'down') {
                  player1._segments[i]._posY = (player1._segments[i]._posY + 1) % ROWS;
              }
          }

          //update segments direction
          // skip the first segment
          for (var i = player1._segments.length - 1; i >= 1; i--) {
              player1._segments[i]._direction = player1._segments[i - 1]._direction
          }

          //draw the board
          draw();
      }
      
  

    //draws when document is ready
    $(document).ready(function () {
        draw();
    });

    

    /* function updates the matrix and the true falses*/
    function updateMatrix(ROWS, COLS, segments) {
        var matrix = [];
        for (var r = 0; r < ROWS; r++) {
            var cell = [];
            for (var c = 0; c < COLS; c++) {
                var is_segment = false;
                for (var i = 0; i < segments.length; i++) {
                    if (r == segments[i]._posY && c == segments[i]._posX) {
                        is_segment = true;
                    }
                }
                cell.push(is_segment);
            }
            matrix.push(cell);
        }
        return matrix;
    }

    /* function draws the matrix */
    function drawMatrix(ROWS, COLS, matrix) {
      // console.log('drawing'+ posX + ' ' + posY);
        var stage = $('#stage').html('');
        for (var r = 0; r < ROWS; r += 1) {
            var cell = $('<div class="row"></div>').appendTo(stage);
            for (var c = 0; c < COLS; c += 1) {
                var col = $('<div class="col"></div>').appendTo(cell);
                if (matrix[r][c] == true) {
                    col.addClass('yellow');
                    
                   
                }
            }
        }
    }
    //catches the button press direction, updates positions and calls movePixel

    $(window).on('keydown', function (e)
    {

        if (player1.hasKey(e.keyCode)) {     //checks if key belongs to the player
            if (!is_running) {               // if interval is running
                is_running = true;
                game = setInterval(gameLoop, GAME_INTERVAL);
            }
            player1.handleKeyPress(e.keyCode);          //goes to determine direction
        }

        if (e.keyCode == PAUSE_KEYCODE) {                  // pause option
            if (is_running) {
                is_running = false;
                clearInterval(game);
            }
            else {
                is_running = true;
                game = setInterval(gameLoop, GAME_INTERVAL);    //starts movement
            }

            

        }


        /* clearInterval(autoSnake);

        if (e.keyCode == 27) {
            clearInterval(autoSnake);
            
        }
        if (e.keyCode == 37) {//left
            autoSnake = setInterval(getSnakeDirection, MOVEMENT_INTERVAL, 'x', -1);
        }
        if (e.keyCode == 38) {//up
            autoSnake = setInterval(getSnakeDirection, MOVEMENT_INTERVAL, 'y', -1);
        }
        if (e.keyCode == 39) {//right
            autoSnake = setInterval(getSnakeDirection, MOVEMENT_INTERVAL, 'x', 1);
        }
        if (e.keyCode == 40) {//down
            autoSnake = setInterval(getSnakeDirection, MOVEMENT_INTERVAL, 'y', 1);
        }
        */
     });

    // function moveSnake defines new direction left/right/up/down and call movePixel with new coordinates
    function getSnakeDirection(p, s) {
        if (p == 'x')
           {
            posX = posX + s;
            }
        else
           {
            posY = posY + s;
            }
        movePixel(posX, posY);

    }

    // function movePixel checks new coordinates are within the limits and redraws the matrix
    
    function draw() {
        //if (posX == COLS) { posX = 0; }
        //if (posX < 0) { posX = COLS - 1; }
        //if (posY == ROWS) { posY = 0; }
        //if (posY < 0) { posY = ROWS - 1; }
        matrix = updateMatrix(ROWS, COLS, player1._segments);// updates it
        drawMatrix(ROWS, COLS, matrix); //draws it again   
        //console.log(posX + ' ' + posY);//talk to me
    }

    
  })()