class Cell {
    constructor(i, j) {
        this.i = i;
        this.j = j;
        this.walls = [true, true, true, true];
        this.visited = false;
    }

    removeWall(neighbor) {
        let x = this.i - neighbor.i;
        let y = this.j - neighbor.j;

        if (x === 1) {
            this.walls[1] = false;
            neighbor.walls[3] = false;
        } else if (x === -1) {
            this.walls[3] = false;
            neighbor.walls[1] = false;
        }

        if (y === 1) {
            this.walls[0] = false;
            neighbor.walls[2] = false;
        } else if (y === -1) {
            this.walls[2] = false;
            neighbor.walls[0] = false;
        }
    }

    addWall(neighbor) {
        let x = this.i - neighbor.i;
        let y = this.j - neighbor.j;

        if (x === 1) {
            this.walls[1] = true;
            neighbor.walls[3] = true;
        } else if (x === -1) {
            this.walls[3] = true;
            neighbor.walls[1] = true;
        }

        if (y === 1) {
            this.walls[0] = true;
            neighbor.walls[2] = true;
        } else if (y === -1) {
            this.walls[2] = true;
            neighbor.walls[0] = true;
        }
    }

    highlight(p, cellSize, color = [255, 0, 0]) {
        let x = this.i * cellSize + cellSize / 2;
        let y = this.j * cellSize + cellSize / 2;
        p.fill(color[0], color[1], color[2]);
        p.noStroke();
        p.ellipse(x, y, cellSize / 2, cellSize / 2);
    }

    show(p, cellSize) {
        let x = this.i * cellSize;
        let y = this.j * cellSize;

        p.stroke(255);
        p.strokeWeight(4);
        if (this.walls[0]) {
            p.line(x, y, x + cellSize, y);
        }
        if (this.walls[1]) {
            p.line(x, y, x, y + cellSize);
        }
        if (this.walls[2]) {
            p.line(x, y + cellSize, x + cellSize, y + cellSize);
        }
        if (this.walls[3]) {
            p.line(x + cellSize, y + cellSize, x + cellSize, y);
        }
    }
}
