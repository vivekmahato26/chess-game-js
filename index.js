const board = document.getElementById("board");

x = 1, y = 1;

for (let i = 1; i < 65; i++) {
    const box = document.createElement("div");
    const img = document.createElement("img");
    img.setAttribute("src", "#");
    img.classList.add("imgPiece")
    img.setAttribute("alt", "");
    box.appendChild(img);
    box.classList.add("box")
    board.appendChild(box);
    box.setAttribute("data-xIndex", x);
    box.setAttribute("data-yIndex", y);
    box.setAttribute("data-cords", `(${x},${y})`)
    // box.innerText = "(" + x + "," + y + ")";
    if ((x + y) % 2 == 0) {
        box.style.backgroundColor = "#2c3e50"
    } else {
        box.style.backgroundColor = "#ecf0f1";
    }
    x++;
    if (x > 8) {
        x = 1;
        y++;
    }

}

const showMoves = (piece) => {
    const moves = piece.moves;
    moves.forEach(m => {
        for (const box of boxes) {
            if (m.x == box.dataset.xindex && m.y == box.dataset.yindex) {
                if (box.dataset.color == piece.color) {
                    box.classList.add("cantKill")
                } else {
                    box.classList.add("canKill")
                }
                if (box.dataset.color == "" || box.dataset.color == null || box.dataset.color == undefined) {
                    box.classList.remove("canKill")
                    box.classList.add("possibleMove")
                }
            }
        }
    })
}

const resetPossibleMoves = (piece) => {
    const moves = piece.moves;
    moves.forEach(m => {
        for (const box of boxes) {
            if (m.x == box.dataset.xindex && m.y == box.dataset.yindex) {
                box.classList.remove("possibleMove")
                box.classList.remove("canKill")
                box.classList.remove("cantKill")
            }
        }
    })
}

class Piece {
    constructor(color, name, initialX, initialY, image) {
        this.color = color;
        this.name = name;
        this.initialPos = {
            x: initialX,
            y: initialY
        };
        this.currentPos = {
            x: initialX,
            y: initialY
        };
        this.image = image;
        this.moves = [];
    }
    static selectPiece = null;
    static dest = {};
    static turn = "white";
    static move = () => {
        const targetedElement = event.target;
        const selectedPiece = selectPiece(targetedElement);
        if (selectedPiece) {
            if (selectedPiece.color == Piece.turn) {
                Piece.selectPiece = selectedPiece;

            }
        } else {
            if (Piece.selectPiece) {
                Piece.dest.x = targetedElement.dataset.xindex;
                Piece.dest.y = targetedElement.dataset.yindex;
            }
            dispalyBoard();
        }

    }
}


class Pawn extends Piece {
    constructor(color, name, initialX, initialY, image) {
        super(color, name, initialX, initialY, image);
        this.initialMove = true;
    }
    getPossibleMoves = () => {
        if (this.moves.length) {
            showMoves(this);
            return;
        }
        if (this.color == "black") {
            if (this.initialMove) {
                this.moves.push({
                    x: this.currentPos.x,
                    y: this.currentPos.y + 2
                })
            }
            this.moves.push({
                x: this.currentPos.x,
                y: this.currentPos.y + 1
            })
            const box1 = document.querySelector(`div[data-cords="(${this.currentPos.x + 1},${this.currentPos.y + 1})"]`);
            const box2 = document.querySelector(`div[data-cords="(${this.currentPos.x - 1},${this.currentPos.y + 1})"]`);
            if (box1 && box1.dataset.color && box1.dataset.color != this.color) {
                this.moves.push({
                    x: this.currentPos.x + 1,
                    y: this.currentPos.y + 1
                })
            }
            if (box2 && box2.dataset.color && box2.dataset.color != this.color) {
                this.moves.push({
                    x: this.currentPos.x - 1,
                    y: this.currentPos.y + 1
                })
            }

        } else {
            if (this.initialMove) {
                this.moves.push({
                    x: this.currentPos.x,
                    y: this.currentPos.y - 2
                })
            }
            this.moves.push({
                x: this.currentPos.x,
                y: this.currentPos.y - 1
            })
            const box1 = document.querySelector(`div[data-cords="(${this.currentPos.x + 1},${this.currentPos.y - 1})"]`);
            const box2 = document.querySelector(`div[data-cords="(${this.currentPos.x - 1},${this.currentPos.y - 1})"]`);
            if (box1 && box1.dataset.color && box1.dataset.color != this.color) {
                this.moves.push({
                    x: this.currentPos.x + 1,
                    y: this.currentPos.y - 1
                })
            }
            if (box2 && box2.dataset.color && box2.dataset.color != this.color) {
                this.moves.push({
                    x: this.currentPos.x - 1,
                    y: this.currentPos.y - 1
                })
            }
        }
        showMoves(this)
    }
}
class Rook extends Piece {
    constructor(color, name, initialX, initialY, image) {
        super(color, name, initialX, initialY, image);
    }
    getPossibleMoves = () => {
        if (this.moves.length) {
            validateRookMovesArr(this);
            showMoves(this);
            return;
        }
        let x = 7, y = 7;
        while (x > 0) {
            let newX = this.currentPos.x + x;
            if (newX > 8) {
                newX -= 8;
            }
            this.moves.push({
                x: newX,
                y: this.currentPos.y
            });
            x--;
        }
        while (y > 0) {
            let newY = this.currentPos.y + y;
            if (newY > 8) {
                newY -= 8;
            }
            this.moves.push({
                x: this.currentPos.x,
                y: newY
            });
            y--;
        }
        let validatedMoves = validateRookMovesArr(this)
        this.moves = validatedMoves;
        showMoves(this)
    }
}
class Knight extends Piece {
    constructor(color, name, initialX, initialY, image) {
        super(color, name, initialX, initialY, image);
    }
    getPossibleMoves = () => {
        if (this.moves.length) {
            showMoves(this);
            return;
        }
        let newX, newY;
        newX = this.currentPos.x + 2;
        newY = this.currentPos.y - 1;
        if (newX > 0 && newX < 9 && newY > 0 && newY < 9) this.moves.push({ x: newX, y: newY });
        newX = this.currentPos.x + 2;
        newY = this.currentPos.y + 1
        if (newX > 0 && newX < 9 && newY > 0 && newY < 9) this.moves.push({ x: newX, y: newY });
        newX = this.currentPos.x - 2;
        newY = this.currentPos.y - 1
        if (newX > 0 && newX < 9 && newY > 0 && newY < 9) this.moves.push({ x: newX, y: newY });
        newX = this.currentPos.x - 2;
        newY = this.currentPos.y + 1
        if (newX > 0 && newX < 9 && newY > 0 && newY < 9) this.moves.push({ x: newX, y: newY });
        newX = this.currentPos.x + 1;
        newY = this.currentPos.y + 2
        if (newX > 0 && newX < 9 && newY > 0 && newY < 9) this.moves.push({ x: newX, y: newY });
        newX = this.currentPos.x - 1;
        newY = this.currentPos.y + 2
        if (newX > 0 && newX < 9 && newY > 0 && newY < 9) this.moves.push({ x: newX, y: newY });
        newX = this.currentPos.x + 1;
        newY = this.currentPos.y - 2
        if (newX > 0 && newX < 9 && newY > 0 && newY < 9) this.moves.push({ x: newX, y: newY });
        newX = this.currentPos.x - 1;
        newY = this.currentPos.y - 2
        if (newX > 0 && newX < 9 && newY > 0 && newY < 9) this.moves.push({ x: newX, y: newY });
        showMoves(this);
    }
}
class Bishop extends Piece {
    constructor(color, name, initialX, initialY, image) {
        super(color, name, initialX, initialY, image);
    }
    getPossibleMoves = () => {
        if (this.moves.length) {
            showMoves(this);
            return;
        }
        let x = 7;
        while (x > 0) {
            let newX = this.currentPos.x + x;
            let newY = this.currentPos.y + x
            if (newX > 0 && newX < 9 && newY > 0 && newY < 9) this.moves.push({ x: newX, y: newY });
            x--;
        }
        x = 1;
        while (x < 7) {
            let newX = this.currentPos.x - x;
            let newY = this.currentPos.y - x;
            if (newX > 0 && newX < 9 && newY > 0 && newY < 9) this.moves.push({ x: newX, y: newY });
            x++;
        }
        x = 7;
        while (x > 0) {
            let newX = this.currentPos.x - x;
            let newY = this.currentPos.y + x
            if (newX > 0 && newX < 9 && newY > 0 && newY < 9) this.moves.push({ x: newX, y: newY });
            x--;
        }
        x = 7;
        while (x > 0) {
            let newX = this.currentPos.x + x;
            let newY = this.currentPos.y - x;
            if (newX > 0 && newX < 9 && newY > 0 && newY < 9) this.moves.push({ x: newX, y: newY });
            x--;
        }
        let validatedMoves = validateBishopMovesArr(this)
        this.moves = validatedMoves;
        showMoves(this)
    }
}
class Queen extends Piece {
    constructor(color, name, initialX, initialY, image) {
        super(color, name, initialX, initialY, image);
    }
    getPossibleMoves = () => {
        if (this.moves.length) {
            showMoves(this);
            return;
        }
        let x = 7, y = 7;
        while (x > 0) {
            let newX = this.currentPos.x + x;
            if (newX > 8) {
                newX -= 8;
            }
            this.moves.push({
                x: newX,
                y: this.currentPos.y
            });
            x--;
        }
        while (y > 0) {
            let newY = this.currentPos.y + y;
            if (newY > 8) {
                newY -= 8;
            }
            this.moves.push({
                x: this.currentPos.x,
                y: newY
            });
            y--;
        }
        x = 7;
        while (x > 0) {
            let newX = this.currentPos.x + x;
            let newY = this.currentPos.y + x
            if (newX > 0 && newX < 9 && newY > 0 && newY < 9) this.moves.push({ x: newX, y: newY });
            x--;
        }
        x = 1;
        while (x < 7) {
            let newX = this.currentPos.x - x;
            let newY = this.currentPos.y - x;
            if (newX > 0 && newX < 9 && newY > 0 && newY < 9) this.moves.push({ x: newX, y: newY });
            x++;
        }
        x = 7;
        while (x > 0) {
            let newX = this.currentPos.x - x;
            let newY = this.currentPos.y + x
            if (newX > 0 && newX < 9 && newY > 0 && newY < 9) this.moves.push({ x: newX, y: newY });
            x--;
        }
        x = 7;
        while (x > 0) {
            let newX = this.currentPos.x + x;
            let newY = this.currentPos.y - x;
            if (newX > 0 && newX < 9 && newY > 0 && newY < 9) this.moves.push({ x: newX, y: newY });
            x--;
        }
        this.moves = [...validateBishopMovesArr(this), ...validateRookMovesArr(this)];
        showMoves(this)
    }
}
class King extends Piece {
    constructor(color, name, initialX, initialY, image) {
        super(color, name, initialX, initialY, image);
    }
    getPossibleMoves = () => {
        if (this.moves.length) {
            this.moves = validateKingsMoves(this);
            showMoves(this);
            return;
        }
        if (this.currentPos.x + 1 > 1 && this.currentPos.x + 1 < 9) this.moves.push({ x: this.currentPos.x + 1, y: this.currentPos.y });
        if (this.currentPos.x + 1 > 1 && this.currentPos.x + 1 < 9 && this.currentPos.y + 1 > 1 && this.currentPos.y + 1 < 9) this.moves.push({ x: this.currentPos.x + 1, y: this.currentPos.y + 1 });
        if (this.currentPos.x - 1 > 1 && this.currentPos.x - 1 < 9 && this.currentPos.y + 1 > 1 && this.currentPos.y + 1 < 9) this.moves.push({ x: this.currentPos.x - 1, y: this.currentPos.y + 1 });
        if (this.currentPos.x + 1 > 1 && this.currentPos.x + 1 < 9 && this.currentPos.y - 1 > 1 && this.currentPos.y - 1 < 9) this.moves.push({ x: this.currentPos.x + 1, y: this.currentPos.y - 1 });
        if (this.currentPos.y - 1 > 1 && this.currentPos.y - 1 < 9 && this.currentPos.x - 1 > 1 && this.currentPos.x - 1 < 9) this.moves.push({ x: this.currentPos.x - 1, y: this.currentPos.y - 1 });
        if (this.currentPos.y + 1 > 1 && this.currentPos.y + 1 < 9) this.moves.push({ x: this.currentPos.x, y: this.currentPos.y + 1 });
        if (this.currentPos.y - 1 > 1 && this.currentPos.y - 1 < 9) this.moves.push({ x: this.currentPos.x, y: this.currentPos.y - 1 });
        if (this.currentPos.x - 1 > 1 && this.currentPos.x - 1 < 9) this.moves.push({ x: this.currentPos.x - 1, y: this.currentPos.y });
        this.moves = validateKingsMoves(this);
        showMoves(this)
    }
}

const pb1 = new Pawn("black", "Black Pawn", 1, 2, "./media/b_pawn.svg")
const pb2 = new Pawn("black", "Black Pawn", 2, 2, "./media/b_pawn.svg")
const pb3 = new Pawn("black", "Black Pawn", 3, 2, "./media/b_pawn.svg")
const pb4 = new Pawn("black", "Black Pawn", 4, 2, "./media/b_pawn.svg")
const pb5 = new Pawn("black", "Black Pawn", 5, 2, "./media/b_pawn.svg")
const pb6 = new Pawn("black", "Black Pawn", 6, 2, "./media/b_pawn.svg")
const pb7 = new Pawn("black", "Black Pawn", 7, 2, "./media/b_pawn.svg")
const pb8 = new Pawn("black", "Black Pawn", 8, 2, "./media/b_pawn.svg")
const pw1 = new Pawn("white", "White Pawn", 1, 7, "./media/w_pawn.svg")
const pw2 = new Pawn("white", "White Pawn", 2, 7, "./media/w_pawn.svg")
const pw3 = new Pawn("white", "White Pawn", 3, 7, "./media/w_pawn.svg")
const pw4 = new Pawn("white", "White Pawn", 4, 7, "./media/w_pawn.svg")
const pw5 = new Pawn("white", "White Pawn", 5, 7, "./media/w_pawn.svg")
const pw6 = new Pawn("white", "White Pawn", 6, 7, "./media/w_pawn.svg")
const pw7 = new Pawn("white", "White Pawn", 7, 7, "./media/w_pawn.svg")
const pw8 = new Pawn("white", "White Pawn", 8, 7, "./media/w_pawn.svg")
const rb1 = new Rook("black", "Black Rook", 1, 1, "./media/b_rook.svg")
const rb2 = new Rook("black", "Black Rook", 8, 1, "./media/b_rook.svg")
const rw1 = new Rook("white", "White Rook", 1, 8, "./media/w_rook.svg")
const rw2 = new Rook("white", "White Rook", 8, 8, "./media/w_rook.svg")
const knb1 = new Knight("black", "Black Knight", 2, 1, "./media/b_knight.svg")
const knb2 = new Knight("black", "Black Knight", 7, 1, "./media/b_knight.svg")
const knw1 = new Knight("white", "White Kinght", 2, 8, "./media/w_knight.svg")
const knw2 = new Knight("white", "White Kinght", 7, 8, "./media/w_knight.svg")
const bb1 = new Bishop("black", "Black Bishop", 3, 1, "./media/b_bishop.svg")
const bb2 = new Bishop("black", "Black Bishop", 6, 1, "./media/b_bishop.svg")
const bw1 = new Bishop("white", "White Bishop", 3, 8, "./media/w_bishop.svg")
const bw2 = new Bishop("white", "White Bishop", 6, 8, "./media/w_bishop.svg")
const qb = new Queen("black", "Black Queen", 4, 1, "./media/b_queen.svg")
const kb = new King("black", "Black King", 5, 1, "./media/b_king.svg")
const qw = new Queen("white", "White Queen", 4, 8, "./media/w_queen.svg")
const kw = new King("white", "White King", 5, 8, "./media/w_king.svg")

let piecesArr = [pb1, pb2, pb3, pb4, pb5, pb6, pb7, pb8, pw1, pw2, pw3, pw4, pw5, pw6, pw7, pw8, rb1, rb2, knb1, knb2, bb1, bb2, qb, kb, rw1, rw2, knw1, knw2, bw1, bw2, qw, kw]
const boxes = document.querySelectorAll(".box");

const selectPiece = (target) => {
    console.log(target);
    for (const e of piecesArr) {
        if (target.classList.contains("box")) {
            if (target.dataset.xindex == e.currentPos.x && target.dataset.yindex == e.currentPos.y) {
                return e;
            }
        } else {
            if (target.parentElement.dataset.xindex == e.currentPos.x && target.parentElement.dataset.yindex == e.currentPos.y) {
                return e;
            }
        }
    }
    return null;
}

const dispalyBoard = () => {
    const selectedPiece = Piece.selectPiece;
    const dest = Piece.dest;
    const destPos = document.querySelector(`div[data-cords="(${dest.x},${dest.y})"]`);
    if (destPos.classList.contains("cantkill")) {
        alert("wrong move");
        return;
    }
    const validatedMove = selectedPiece.moves.filter(e => e.x == dest.x && e.y == dest.y);
    if (validatedMove.length) {

        if (destPos.classList.contains("cankill")) {
            piecesArr = piecesArr.filter(p => p.currentPos.x == dest.x && p.currentPos.y == dest.y);
            destPos.removeAttribute("data-name");
            destPos.removeAttribute("data-color");
            destPos.firstElementChild.setAttribute("src", "#");
            destPos.firstElementChild.classList.add("hideImg");
        }
        const currentPos = document.querySelector(`div[data-cords="(${selectedPiece.currentPos.x},${selectedPiece.currentPos.y})"]`);
        currentPos.removeAttribute("data-name", selectedPiece.name);
        currentPos.removeAttribute("data-color", selectedPiece.color);
        currentPos.firstElementChild.setAttribute("src", "#");
        currentPos.firstElementChild.classList.add("hideImg");
        destPos.setAttribute("data-name", selectedPiece.name);
        destPos.setAttribute("data-color", selectedPiece.color);
        destPos.firstElementChild.classList.remove("hideImg");
        destPos.firstElementChild.setAttribute("src", selectedPiece.image);
        if (selectedPiece.name.includes("Pawn")) {
            selectedPiece.initialMove = false;
        }
        Piece.selectPiece.currentPos.x = Piece.dest.x;
        Piece.selectPiece.currentPos.y = Piece.dest.y;
        Piece.turn = Piece.turn == "white" ? "black" : "white";
    }
    else {
        alert("Wrong move");
        return;
    }
}

piecesArr.forEach(p => {
    for (const box of boxes) {
        if (p.initialPos.x == box.dataset.xindex && p.initialPos.y == box.dataset.yindex) {
            box.firstElementChild.setAttribute("src", p.image);
            box.setAttribute("data-name", p.name);
            box.setAttribute("data-color", p.color);
            box.addEventListener("mouseenter", p.getPossibleMoves);
            box.addEventListener("mouseleave", () => resetPossibleMoves(p))
        }
    }
})

for (const box of boxes) {
    box.addEventListener("click", Piece.move)
    if (box.dataset.name == "" || box.dataset.name == null || box.dataset.name == undefined) {
        box.firstElementChild.classList.add("hideImg");
    }
}


const findDistance = (a, b) => {
    return Math.sqrt((Math.pow((a.x - b.x), 2) + Math.pow((a.y - b.y), 2)));
}

const filterDirections = (directions, piece) => {
    let newMoves = [];
    for (const dir in directions) {
        for (const d of directions[dir]) {
            const box = document.querySelector(`div[data-cords="(${d.x},${d.y})"]`);
            const color = box.dataset.color;
            if (color != "" && color != undefined && color != null) {
                // if(color == piece.color) break;
                newMoves.push(d);
                break;
            } else {
                newMoves.push(d);
            }
        }
    }
    return newMoves;
}

const validateRookMovesArr = (piece) => {
    let current = piece.currentPos;
    let moves = piece.moves;
    moves = moves.sort((a, b) => findDistance(a, current) - findDistance(b, current));
    let directions = {
        up: [],
        down: [],
        left: [],
        right: []
    }
    moves.forEach(m => {
        if (m.y > current.y && m.x == current.x) {
            directions.down = [...directions.down, m]
        }
        if (m.y < current.y && m.x == current.x) {
            directions.up = [...directions.up, m]
        }
        if (m.y == current.y && m.x > current.x) {
            directions.right = [...directions.right, m]
        }
        if (m.y == current.y && m.x < current.x) {
            directions.left = [...directions.left, m]
        }
    })

    return filterDirections(directions, piece);
}
const validateBishopMovesArr = (piece) => {
    let current = piece.currentPos;
    let moves = piece.moves;
    moves = moves.sort((a, b) => findDistance(a, current) - findDistance(b, current));
    let directions = {
        upRight: [],
        downRight: [],
        upLeft: [],
        downLeft: []
    }
    moves.forEach(m => {
        if (m.y > current.y && m.x > current.x) {
            directions.downRight = [...directions.downRight, m]
        }
        if (m.y < current.y && m.x > current.x) {
            directions.upRight = [...directions.upRight, m]
        }
        if (m.y < current.y && m.x < current.x) {
            directions.upLeft = [...directions.upLeft, m]
        }
        if (m.y > current.y && m.x < current.x) {
            directions.downLeft = [...directions.downLeft, m]
        }
    })
    return filterDirections(directions, piece);
}

const validateKingsMoves = (piece) => {
    const moves = piece.moves;
    const oppPieces = piecesArr.filter(e => e.color != piece.color);
    let newMoves = [];
    let x = 1;
    for (const m of moves) {
        for (const opp of oppPieces) {
            for (const om of opp.moves) {
                // console.log(om,m)
                if (!opp.name.includes("Pawn") && om.x != m.x && om.y != m.y) newMoves.push(m);
            }
            console.log(x++)
            if (opp.name.includes("Pawn")) {
                if (opp.color == "black" && piece.color == "white") {
                    if (opp.currentPos.x + 1 != m.x && opp.currentPos.y + 1 != m.y) {
                        newMoves.push(m)
                    }
                    if (opp.currentPos.x - 1 != m.x && opp.currentPos.y + 1 != m.y) {
                        newMoves.push(m)
                    }

                }
                if (opp.color == "white" && piece.color == "black") {
                    if (opp.currentPos.x - 1 != m.x && opp.currentPos.y - 1 != m.y) {
                        newMoves.push(m)
                    }
                    if (opp.currentPos.x + 1 != m.x && opp.currentPos.y - 1 != m.y) {
                        newMoves.push(m)
                    }

                }
            }
        }
    }
    return newMoves;
}




// test


//  rw2.currentPos.x = 4;
//  rw2.currentPos.y = 4;
