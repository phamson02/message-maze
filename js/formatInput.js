function toChar(strLine) {
    const charsList = [];
    const words = strLine.split(' ');

    for (const word of words) {
        for (const char of word) {
            charsList.push(char, 'sep');
        }
        charsList.pop();
        charsList.push('space');
    }
    charsList.pop();
    return charsList;
}

function formatInput(message) {
    const wordsList = message.toUpperCase().split(' ');
    const wordsLength = wordsList.map(word => word.length);
    const numWords = wordsList.length;
    const linesList = [];
    const maxLine = 14;
    let count = 0;
    let currentLine = [];

    if (numWords === 1) {
        return [toChar(wordsList[0])];
    } else {
        for (let i = 0; i < numWords; i++) {
            count = count + wordsLength[i] + 1;

            if (count <= maxLine) {
                currentLine.push(wordsList[i]);
            } else if (wordsList[i].length >= maxLine) {
                if (i !== 0 && wordsList[i - 1].length < maxLine) {
                    linesList.push(currentLine);
                }
                linesList.push([wordsList[i]]);
                count = 0;
            } else {
                linesList.push(currentLine);
                currentLine = [wordsList[i]];
                count = wordsLength[i];
            }

            if (i === numWords - 1 && count === maxLine) {
                linesList.push(currentLine);
            }

            if (i === numWords - 1 && count < maxLine) {
                if (wordsList[i].length < maxLine) {
                    linesList.push(currentLine);
                }
            }
        }

        const joinedLines = linesList.map(line => line.join(' '));
        return joinedLines.map(line => toChar(line));
    }
}

