var extension = 10;

async function importPattern(character) {
    try {
        const response = await fetch(`assets/patterns/${character}.json`);

        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const jsonData = await response.json();
        
        const maze = Maze.fromJSON(jsonData);
        return maze;
    } catch (error) {
        console.error(`Error fetching character pattern: ${error}`);
    }
}

function makeRow(charMazesList, start, end, lineWidth) {
    const charsMaze = combineHorizontally(charMazesList);

    const leftPadding = Math.floor((lineWidth - charsMaze.cols) / 2);
    const rightPadding = lineWidth - charsMaze.cols - leftPadding;
    const leftMazeSize = { rows: charsMaze.rows, cols: leftPadding };
    const rightMazeSize = { rows: charsMaze.rows, cols: rightPadding };

    let leftMaze, rightMaze;

    if (start.i < end.i) {
        const leftMazeStart = start;
        const leftMazeEnd = { j: charsMaze.startCell().j, i: leftMazeSize.cols - 1 };

        leftMaze = randomPattern(leftMazeSize, leftMazeStart, leftMazeEnd);

        const rightMazeStart = { j: charsMaze.endCell().j, i: 0 };
        const rightMazeEnd = { j: end.j, i: end.i - leftMazeSize.cols - charsMaze.cols };

        rightMaze = randomPattern(rightMazeSize, rightMazeStart, rightMazeEnd);
    }

    if (start.i > end.i) {
        const leftMazeStart = { j: charsMaze.startCell().j, i: leftMazeSize.cols - 1 };
        const leftMazeEnd = end;

        leftMaze = randomPattern(leftMazeSize, leftMazeEnd, leftMazeStart);

        const rightMazeStart = { j: start.j, i: start.i - leftMazeSize.cols - charsMaze.cols };
        const rightMazeEnd = { j: charsMaze.endCell().j, i: 0 };

        rightMaze = randomPattern(rightMazeSize, rightMazeEnd, rightMazeStart);
    }

    const row = combineHorizontally([leftMaze, charsMaze, rightMaze]);

    if (start.i > end.i) {
        const tmp = row.startCell();
        row.setStart(row.endCell().i, row.endCell().j);
        row.setEnd(tmp.i, tmp.j);
    }

    return row;
}

function rBFS(maze, reduced = 10 / 16) {
    const n = maze.rows;
    const m = maze.cols;
    let queue = [];
    const visitedPath = new Set();

    if (maze.solutionCells.length === 0) {
        queue.push(maze.startCell());
        visitedPath[`${maze.start.i},${maze.start.j}`] = true;
    } else {
        for (const cell of maze.solutionCells) {
            queue.push(maze.cellAt(cell.i, cell.j));
            visitedPath.add(`${cell.i}-${cell.j}`);
        }
    }

    console.log(queue.length);

    shuffle(queue, true);
    const savedQueue = queue.splice(0, Math.floor(reduced * queue.length));
    queue = queue.slice(Math.floor(reduced * queue.length));

    console.log(queue.length);

    const parent = new Map();
    while (visitedPath.size < n * m) {
        while (queue.length > 0) {
            const cur = queue.shift();
            visitedPath.add(`${cur.i}-${cur.j}`);

            const neighbours = maze.getNeighbors(cur);
            shuffle(neighbours, true);

            let hasUnvisitedNeighbor = false;
            for (const cell of neighbours) {
                const cellKey = `${cell.i}-${cell.j}`;
                if (!visitedPath.has(cellKey)) {
                    cur.removeWall(cell);
                    queue.push(cell);
                    visitedPath.add(cellKey);
                    parent.set(cellKey, cur);
                    hasUnvisitedNeighbor = true;
                    break;
                }
            }

            if (!hasUnvisitedNeighbor && visitedPath.size < n * m) {
                const curKey = `${cur.i}-${cur.j}`;
                if (parent.has(curKey)) {
                    queue.push(parent.get(curKey));
                }
            }
        }

        if (visitedPath.size < n * m && savedQueue.length > 0) {
            queue.push(savedQueue.shift());
        }
    }

    return maze;
}

async function generateMazeWithTextSolution(inputText) {
    const inputTextArr = formatInput(inputText);

    const charMazesLists = [];
    for (const line of inputTextArr) {
        const charMazes = [];
        for (const character of line) {
            const maze = await importPattern(character);
            charMazes.push(maze);
        }
        charMazesLists.push(charMazes);
    }

    const lineWidth = Math.max(
        ...charMazesLists.map(charMazes =>
            charMazes.reduce((acc, charMaze) => acc + charMaze.cols, 0)
        )
    ) + extension;
    const lineHeight = charMazesLists[0][0].rows;

    let maze;

    if (inputTextArr.length === 1) {
        const start = { j: 0, i: 0 };
        const end = { j: lineHeight - 1, i: lineWidth - 1 };
        maze = makeRow(charMazesLists[0], start, end, lineWidth);
    } else {
        const mazesList = [];

        const firstStart = { j: 0, i: 0 };
        const firstEnd = {
            j: lineHeight - 1,
            i: lineWidth - Math.floor(Math.random() * (extension / 2 - 1)) - 1,
        };
        const firstRow = makeRow(charMazesLists[0], firstStart, firstEnd, lineWidth);
        mazesList.push(firstRow);

        let currEnd = firstEnd;
        for (let i = 1; i < charMazesLists.length - 1; i++) {
            let currStart, currRow;
            currStart = { j: 0, i: currEnd.i };

            if (i % 2 !== 0) {
                currEnd = {
                    j: lineHeight - 1,
                    i: Math.floor(Math.random() * (extension / 2 - 2)),
                };
            } else {
                currEnd = {
                    j: lineHeight - 1,
                    i: lineWidth - Math.floor(Math.random() * (extension / 2 - 1)) - 1,
                };
            }

            currRow = makeRow(charMazesLists[i], currStart, currEnd, lineWidth);
            mazesList.push(currRow);
        }

        const lastStart = { j: 0, i: currEnd.i };
        const lastEnd = {
            j: lineHeight - 1,
            i: inputTextArr.length % 2 === 1 ? lineWidth - 1 : 0,
        };

        const lastRow = makeRow(charMazesLists[charMazesLists.length - 1], lastStart, lastEnd, lineWidth);
        mazesList.push(lastRow);

        maze = combineVertically(mazesList);
    }

    maze = rBFS(maze);

    return maze;
}