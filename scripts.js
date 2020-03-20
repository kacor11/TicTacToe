const createPlayer = function(name, icon, human) {
    const getName = () => name;
    const getIcon = () => icon;
    const getScore = () => score;
    const isHuman = () => human;
    return {getName, getIcon, isHuman};
    
}
let playerOne
let playerTwo

const gameBoard = (function() {
    const _boardState = [[0,0,0],
                      [0,0,0],   
                      [0,0,0]];

    const getBoardState = () => _boardState;
    const checkRow = function(board) {
        for(let i = 0; i < 3; i++) {        
             if (board[i].indexOf(0) == -1 && board[i][0] === board[i][1] && board[i][1] === board[i][2] ) {
                return true                 
            } 
        }   
    }
    const checkColumn = function(board) {
        for(let i = 0; i < 3; i++) {        
             if (board[0][i] !== 0 && board[1][i] !== 0 && board[2][i] !== 0 && board[0][i] === board[1][i] && board[1][i] === board[2][i] ) {
                return true                  
            } 
        }   
    }
    const checkDiag = function(board) {
            if ((board[1][1] !== 0 && board[0][0] === board[1][1] && board[1][1] === board[2][2])) {
                return true
            }
            if ((board[1][1] !== 0 && board[0][2] === board[1][1] && board[1][1] === board[2][0])) {
                return true
            }
    }
    const movesLeft = (board) => {
        if (([].concat(...board).indexOf(0) != -1)) {
            return true
        }
    }
    const winnerFound = function () {
        if (checkRow(displayControler._tempBoard)|| checkColumn(displayControler._tempBoard) || checkDiag(displayControler._tempBoard)) {
            return true
        }
        else {
            return false
        }
    }

    const _newBoardState = [[0,0,0],
    [0,0,0],   
    [0,0,0]];
    let newBoardState = function () { 
        for(let i = 0; i < 3; i++) {
            for(let j = 0; j < 3; j++) {
                _newBoardState[i][j] = 0
            }
        }
        return _newBoardState
    }
return {getBoardState, winnerFound, movesLeft, _boardState, newBoardState};  
})();

const  displayControler = (function() {
    let _currentPlayer = null;
    let _playerOne = null;
    let _playerTwo = null;
    let _tempBoard = gameBoard.getBoardState()


    const getCurrentPlayer = () => {
        return _currentPlayer;
    };
    const renderButtons = function() {
        buttonDiv = document.querySelector('.playerbuttons')
        aiButton = document.createElement('button')
        vsButton = document.createElement('button')
        resetButton = document.createElement('button')
        aiButton.innerText = 'play vs AI'
        resetButton.innerText = 'Reset'
        aiButton.classList.add('playai')
        resetButton.classList.add('reset')
        vsButton.classList.add('playhuman')
        vsButton.innerText = 'play vs Human'
        buttonDiv.appendChild(aiButton)
        buttonDiv.appendChild(vsButton)
        buttonDiv.appendChild(resetButton)
    }

    const renderBoard = function() {
        gameBox = document.querySelector('.gamebox')        
        for (i = 0; i < _tempBoard.length; i++) {
            for (j = 0; j < _tempBoard[i].length; j++) {
                let div = document.createElement('div');
                let p = document.createElement('p');
                p.innerText = _tempBoard[i][j];
                div.appendChild(p);
                div.classList.add('boxDiv');
                div.classList.add('row-number'+i)
                div.setAttribute('data-Number', [i,j]);
                gameBox.appendChild(div);
            };
        };
    };

    const selectOponent = function() {
        let aiButton = document.querySelector('.playai')
        let humanButton = document.querySelector('.playhuman')
        aiButton.addEventListener('click', () => {
            playerOne = createPlayer('Player One', 'x', true)
            playerTwo = createPlayer('Computer', 'o', false)
            aiButton.style.visibility = 'hidden'
            humanButton.style.visibility = 'hidden'
            setCurrentPlayer()
            getPlayerMove()
            
        })
        humanButton.addEventListener('click', () => {
            playerOne = createPlayer('Player One', 'x', true)
            playerTwo = createPlayer('Player Two', 'o', true)
            aiButton.style.visibility = 'hidden'
            humanButton.style.visibility = 'hidden'
            setCurrentPlayer()      
            getPlayerMove()              
        })
        
    }
    const renderWinner = function() {
        let winnerDiv = document.querySelector('.winnerbox')
        let p = document.createElement('p')
            if(gameBoard.winnerFound()) { 
        p.innerText = `${_currentPlayer.getName()} won!`        
            } else {
                p.innerText = 'Game is a Draw!'
            }
        winnerDiv.appendChild(p)
    }
    const setCurrentPlayer = () => {
        _currentPlayer = playerOne;
        _playerOne = playerOne;
        _playerTwo = playerTwo;
        };
    const swapCurrentPlayer = () => {
        _currentPlayer === playerOne ? _currentPlayer = _playerTwo : _currentPlayer = _playerOne;
    };   

    const updateBoardState = function(div) {
        let x = div.getAttribute('data-number').split(',')[0]
        let y = div.getAttribute('data-number').split(',')[1]
        _tempBoard[x][y] = _currentPlayer.getIcon()
    }
    const getPlayerMove = function() {
        let boxes = document.querySelectorAll('.boxDiv');
        boxes.forEach(box => box.addEventListener('click', () => {
            if(box.firstElementChild.innerText === '0' && !gameBoard.winnerFound()) {
                box.firstElementChild.innerText = _currentPlayer.getIcon();
                updateBoardState(box)
                makeMove()               
            };
        }));
    };    

    const getComputerMove = function () {
        let row = aiLogic.findBestMove(_tempBoard).bestMoveRow;
        let column = aiLogic.findBestMove(_tempBoard).bestMoveColumn;
        _tempBoard[row][column] = _currentPlayer.getIcon();
        let box = document.querySelector(`[data-number="${row},${column}"]`)
        box.firstElementChild.innerText = _currentPlayer.getIcon()
        makeMove()
        }   

    const makeMove = function () {             
        if (gameBoard.movesLeft(_tempBoard) && !gameBoard.winnerFound()) {
            swapCurrentPlayer()
         _currentPlayer.isHuman() ? getPlayerMove() : getComputerMove() 
         
        } else {
            renderWinner()
        }    
    }

    const resetGame = function () {
        let resetBtn = document.querySelector('.reset')
        resetBtn.addEventListener('click', () => {
            _currentPlayer = null;
            _playerOne = null;
            _playerTwo = null;
            _tempBoard = gameBoard.newBoardState();
            let btns = document.querySelector('.playerbuttons')
            let gamebox = document.querySelector('.gamebox')
            let winbox = document.querySelector('.winnerbox')
            btns.innerHTML = ''
            gamebox.innerHTML = ''
            winbox.innerHTML = ''
            renderButtons()
            renderBoard(); 
            selectOponent();
            resetGame();
        })
    }

    renderButtons()
    renderBoard(); 
    selectOponent();
    resetGame()
    
return {_tempBoard, makeMove}    
})();

const aiLogic = (function() {
    const evaluate = function (board) {
        for(let i = 0; i < 3; i++) {        
            if (board[i].indexOf(0) == -1 && board[i][0] === board[i][1] && board[i][1] === board[i][2] ) {
                if(playerTwo.getIcon() === board[i][0]) {
                return 10
                }
                else if(playerOne.getIcon() === board[i][0]) {
                return - 10
                }
            } 
        }     
        for(let i = 0; i < 3; i++) {        
            if (board[0][i] !== 0 && board[0][i] === board[1][i] && board[1][i] === board[2][i] ) {
                if(playerTwo.getIcon() === board[0][i]) {
                return 10
                }
                else if(playerOne.getIcon() === board[0][i]) {
                return - 10
                }            
            } 
        }        
        if ((board[1][1] !== 0 && board[0][0] === board[1][1] && board[1][1] === board[2][2])) {
            if(playerTwo.getIcon() === board[1][1]) {
            return 10
            }
            else if(playerOne.getIcon() === board[1][1]) {
            return - 10
            }
        }
        if ((board[1][1] !== 0 && board[0][2] === board[1][1] && board[1][1] === board[2][0])) {
            if(playerTwo.getIcon() === board[1][1]) {
            return 10
            }
            else if(playerOne.getIcon() === board[1][1]) {
            return - 10
            }
        }
    return 0    
    } 

    const minMax = function (board, depth, isMax) {
        let score = evaluate(board)
        
        if (score === 10) {
            return score;
        } 

        if (score === -10) {
            return score;
        }

        if(!gameBoard.movesLeft(board)) {
            return 0
        }

        if (isMax) {
            let best = -1000;
            for(let i = 0; i < 3; i++){
                for(let j = 0; j < 3; j++) {
                    if (board[i][j] == 0) {
                        board[i][j] = playerTwo.getIcon()

                        best = Math.max(best, minMax(board,depth + 1, !isMax))
                        board[i][j] = 0


                    }
                }
            }
            return best - depth
        }  else {
            let best = 1000;
            for(let i = 0; i < 3; i++){
                for(let j = 0; j < 3; j++) {
                    if (board[i][j] == 0) {
                        board[i][j] = playerOne.getIcon()

                        best = Math.min(best, minMax(board,depth+1, !isMax))

                        board[i][j] = 0


                    }
                }
            }
            return best + depth
        }
    }
    const findBestMove = function(board) {
        let bestVal = -1000;
        let bestMoveRow = -1;
        let bestMoveColumn = -1;

        for(let i = 0; i < 3; i++){
            for(let j = 0; j < 3; j++) {
                if (board[i][j] == 0) {
                    board[i][j] = playerTwo.getIcon()

                    let moveVal = minMax(board, 0, false)

                    board[i][j] = 0


                    if (moveVal > bestVal) {
                        bestMoveRow = i;
                        bestMoveColumn = j;
                         bestVal = moveVal

                    }
                }
            }
        }
    return {bestVal, bestMoveColumn, bestMoveRow};
    }
return {findBestMove, minMax, evaluate,}
})()