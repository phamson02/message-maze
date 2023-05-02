function shuffle(array, inPlace = false) {
    const result = inPlace ? array : array.slice();
    for (let i = result.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [result[i], result[j]] = [result[j], result[i]];
    }

    return result;
}

function generateRandomSteps(start, end, maxVars) {
    const dx = end.j - start.j;
    const dy = end.i - start.i;
    const varX = Math.floor(Math.random() * (maxVars[0] + 1));
    const varY = Math.floor(Math.random() * (maxVars[1] + 1));

    const steps = new Array(Math.abs(dx)).fill(dx > 0 ? { i: 0, j: 1 } : { i: 0, j: -1 })
        .concat(new Array(Math.abs(dy)).fill(dy > 0 ? { i: 1, j: 0 } : { i: -1, j: 0 }))
        .concat(new Array(varX).fill({ i: 0, j: 1 }))
        .concat(new Array(varX).fill({ i: 0, j: -1 }))
        .concat(new Array(varY).fill({ i: 1, j: 0 }))
        .concat(new Array(varY).fill({ i: -1, j: 0 }));

    shuffle(steps, true);

    return steps;
}

function randomPattern(size, start, end, retryCount = 0) {
    if (start.i < 0 || start.i >= size.cols || start.j < 0 || start.j >= size.rows) {
        throw new Error('Invalid start coordinates: ' + JSON.stringify(start) + ' ' + JSON.stringify(size));
    }

    if (end.i < 0 || end.i >= size.cols || end.j < 0 || end.j >= size.rows) {
        throw new Error('Invalid end coordinates: ' + JSON.stringify(end) + ' ' + JSON.stringify(size));
    }

    const steps = retryCount < 3
        ? generateRandomSteps(start, end, [Math.floor(size.rows / 3), Math.floor(size.cols / 3)])
        : generateRandomSteps(start, end, [0, 0]);

    const maze = new Maze(size.cols, size.rows);
    maze.setStart(start.i, start.j);
    maze.setEnd(end.i, end.j);

    let currentCell = maze.startCell();
    maze.solutionCells.push({i: currentCell.i, j: currentCell.j});
    const seq = [];
    let nMove = 0;
    const threshold = steps.length;

    while (steps.length > 0) {
        if (currentCell.i === maze.end.i && currentCell.j === maze.end.j) {
            break;
        }

        nMove++;
        seq.push(currentCell);
        if (nMove > threshold && (new Set(seq.slice(-threshold))).size === 1) {
            return randomPattern(size, start, end, retryCount + 1);
        }

        const { i: dI, j: dJ } = steps.shift();
        const nextCellCoords = { i: currentCell.i + dI, j: currentCell.j + dJ };
        let go = false;

        if (maze.grid[nextCellCoords.j] && maze.grid[nextCellCoords.j][nextCellCoords.i]) {
            const nextCell = maze.grid[nextCellCoords.j][nextCellCoords.i];
            if (!maze.solutionCells.some(cell => cell.i === nextCell.i && cell.j === nextCell.j)) {
                go = true;
                currentCell.removeWall(nextCell);
                currentCell = nextCell;
                maze.solutionCells.push({i: currentCell.i, j: currentCell.j});
            }
        }

        if (!go) {
            steps.push({ i: dI, j: dJ });
        }
    }

    return maze;
}