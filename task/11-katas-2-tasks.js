'use strict';

/**
 * Returns the bank account number parsed from specified string.
 *
 * You work for a bank, which has recently purchased an ingenious machine to assist in reading letters and faxes sent in by branch offices.
 * The machine scans the paper documents, and produces a string with a bank account that looks like this:
 *
 *    _  _     _  _  _  _  _
 *  | _| _||_||_ |_   ||_||_|
 *  ||_  _|  | _||_|  ||_| _|
 *
 * Each string contains an account number written using pipes and underscores.
 * Each account number should have 9 digits, all of which should be in the range 0-9.
 *
 * Your task is to write a function that can take bank account string and parse it into actual account numbers.
 *
 * @param {string} bankAccount
 * @return {number}
 *
 * Example of return :
 *
 *   '    _  _     _  _  _  _  _ \n'+
 *   '  | _| _||_||_ |_   ||_||_|\n'+     =>  123456789
 *   '  ||_  _|  | _||_|  ||_| _|\n'
 *
 *   ' _  _  _  _  _  _  _  _  _ \n'+
 *   '| | _| _|| ||_ |_   ||_||_|\n'+     => 23056789
 *   '|_||_  _||_| _||_|  ||_| _|\n',
 *
 *   ' _  _  _  _  _  _  _  _  _ \n'+
 *   '|_| _| _||_||_ |_ |_||_||_|\n'+     => 823856989
 *   '|_||_  _||_| _||_| _||_| _|\n',
 *
 */
function parseBankAccount(bankAccount) {
    const numbers = {
        ' _ | ||_|': 0,
        '     |  |': 1,
        ' _  _||_ ': 2,
        ' _  _| _|': 3,
        '   |_|  |': 4,
        ' _ |_  _|': 5,
        ' _ |_ |_|': 6,
        ' _   |  |': 7,
        ' _ |_||_|': 8,
        ' _ |_| _|': 9
    };
    let res = bankAccount.split('\n').slice(0, 3).map(item => item.match(/.../g));
    return +res[0].map((item, index) => numbers[item + res[1][index] + res[2][index]]).join("");
}


/**
 * Returns the string, but with line breaks inserted at just the right places to make sure that no line is longer than the specified column number.
 * Lines can be broken at word boundaries only.
 *
 * @param {string} text
 * @param {number} columns
 * @return {Iterable.<string>}
 *
 * @example :
 *
 *  'The String global object is a constructor for strings, or a sequence of characters.', 26 =>  'The String global object',
 *                                                                                                'is a constructor for',
 *                                                                                                'strings, or a sequence of',
 *                                                                                                'characters.'
 *
 *  'The String global object is a constructor for strings, or a sequence of characters.', 12 =>  'The String',
 *                                                                                                'global',
 *                                                                                                'object is a',
 *                                                                                                'constructor',
 *                                                                                                'for strings,',
 *                                                                                                'or a',
 *                                                                                                'sequence of',
 *                                                                                                'characters.'
 */
function* wrapText(text, columns) {
    if (text.length < columns){
        yield text;
        return;
    }
    let num = 0;
    let prevNum = 0;
    let str = "";
    while ((num != -1) && (num <= columns)) {
        prevNum = num;
        num = text.indexOf(' ', num + 1);
    }
    str = text.slice(0, prevNum);
    yield str;
    yield* wrapText(text.slice(prevNum + 1), columns);
}


/**
 * Returns the rank of the specified poker hand.
 * See the ranking rules here: https://en.wikipedia.org/wiki/List_of_poker_hands.
 *
 * @param {array} hand
 * @return {PokerRank} rank
 *
 * @example
 *   [ '4♥','5♥','6♥','7♥','8♥' ] => PokerRank.StraightFlush
 *   [ 'A♠','4♠','3♠','5♠','2♠' ] => PokerRank.StraightFlush
 *   [ '4♣','4♦','4♥','4♠','10♥' ] => PokerRank.FourOfKind
 *   [ '4♣','4♦','5♦','5♠','5♥' ] => PokerRank.FullHouse
 *   [ '4♣','5♣','6♣','7♣','Q♣' ] => PokerRank.Flush
 *   [ '2♠','3♥','4♥','5♥','6♥' ] => PokerRank.Straight
 *   [ '2♥','4♦','5♥','A♦','3♠' ] => PokerRank.Straight
 *   [ '2♥','2♠','2♦','7♥','A♥' ] => PokerRank.ThreeOfKind
 *   [ '2♥','4♦','4♥','A♦','A♠' ] => PokerRank.TwoPairs
 *   [ '3♥','4♥','10♥','3♦','A♠' ] => PokerRank.OnePair
 *   [ 'A♥','K♥','Q♥','2♦','3♠' ] =>  PokerRank.HighCard
 */
const PokerRank = {
    StraightFlush: 8,
    FourOfKind: 7,
    FullHouse: 6,
    Flush: 5,
    Straight: 4,
    ThreeOfKind: 3,
    TwoPairs: 2,
    OnePair: 1,
    HighCard: 0
}

function getPokerHandRank(hand) {
    const getShape = card => card[card.length - 1];
    const rankToNum = rank => isNaN(parseInt(rank)) ? (11 + ['J', 'Q', 'K', 'A'].indexOf(rank)) : parseInt(rank);
    const getRank = card => rankToNum(card.length == 3 ? card.slice(0, 2) : card[0]);
    const isSameShape = cards => cards.every(card => getShape(card) == getShape(cards[0]));

    function countRanks(cards) {
        const counters = Array.from({length: 13}, elem => 0);
        for (let card of cards) {
            counters[getRank(card) - 2]++;
        }
        return counters;
    }

    function isStraight (cards) {
        const sorted = cards.map(card => getRank(card)).sort((a, b) => a - b);
        if (sorted[0] == '2' && sorted[sorted.length - 1] == '14') {
            sorted.unshift(sorted.pop());
        }
        for (let i = 1; i < sorted.length; i++) {
            const diff = sorted[i] - sorted[i - 1];
            if (diff != 1 && diff != -12) {
                return false;
            }
        }
        return true;
    }
    const ranks = countRanks(hand);
    switch(true) {
        case (isStraight(hand) && isSameShape(hand)):
            return PokerRank.StraightFlush;
        case (ranks.indexOf(4) != -1):
            return PokerRank.FourOfKind;
        case (ranks.indexOf(3) != -1 && ranks.indexOf(2) != -1):
            return PokerRank.FullHouse;
        case isSameShape(hand):
            return PokerRank.Flush;
        case isStraight(hand):
            return PokerRank.Straight;
        case ranks.indexOf(3) != -1:
            return PokerRank.ThreeOfKind;
        case ranks.indexOf(2) != -1 && ranks.lastIndexOf(2) != ranks.indexOf(2):
            return PokerRank.TwoPairs;
        case ranks.indexOf(2) != -1:
            return PokerRank.OnePair;
        default:
            return PokerRank.HighCard;
    }
}


/**
 * Returns the rectangles sequence of specified figure.
 * The figure is ASCII multiline string comprised of minus signs -, plus signs +, vertical bars | and whitespaces.
 * The task is to break the figure in the rectangles it is made of.
 *
 * NOTE: The order of rectanles does not matter.
 * 
 * @param {string} figure
 * @return {Iterable.<string>} decomposition to basic parts
 * 
 * @example
 *
 *    '+------------+\n'+
 *    '|            |\n'+
 *    '|            |\n'+              '+------------+\n'+
 *    '|            |\n'+              '|            |\n'+         '+------+\n'+          '+-----+\n'+
 *    '+------+-----+\n'+       =>     '|            |\n'+     ,   '|      |\n'+     ,    '|     |\n'+
 *    '|      |     |\n'+              '|            |\n'+         '|      |\n'+          '|     |\n'+
 *    '|      |     |\n'               '+------------+\n'          '+------+\n'           '+-----+\n'
 *    '+------+-----+\n'
 *
 *
 *
 *    '   +-----+     \n'+
 *    '   |     |     \n'+                                    '+-------------+\n'+
 *    '+--+-----+----+\n'+              '+-----+\n'+          '|             |\n'+
 *    '|             |\n'+      =>      '|     |\n'+     ,    '|             |\n'+
 *    '|             |\n'+              '+-----+\n'           '+-------------+\n'
 *    '+-------------+\n'
 */
function* getFigureRectangles(figure) {
   let a = figure.split('\n');
    let answer = [];
    let check = function bar(n, m) {
        let i;
        let j;
        for (i = m;; i++) {
            if (a[n - 1][i] == undefined || a[n - 1][i] == ' ' || a[n] == undefined) return;
            if (a[n][i] != ' ') break;
        }
        let w = i;
        for (j = n;; j++) {
            if (a[j] == undefined || a[j][w] == ' ') return;
            if (a[j][w - 1] != ' ') break;
        }
        let h = j;
        for (i = w - 1;; i--) {
            if (a[h][i] == undefined || a[h][i] == ' ' || a[h - 1] == undefined) return;
            if (a[h - 1][i] != ' ') break;
        }
        if (i + 1 != m) return;
        for (j = h - 1;; j--) {
            if (a[j] == undefined || a[j][m - 1] == ' ') return;
            if (a[j][m] != ' ') break;
        }
        if (j + 1 != n) return;
        n = h - n;
        m = w - m;
        answer.push('+' + '-'.repeat(m) + '+\n' + ('|' + ' '.repeat(m) + '|\n').repeat(n) + '+' + '-'.repeat(m) + '+\n');
    }

    a.pop();
    a.forEach((v, i) => v.split('').forEach((v, j) => {
        if (v == '+') check(i + 1, j + 1);
    }));
    for (let index = 0; index < answer.length; index++) {
        yield answer[index];       
    }
}


module.exports = {
    parseBankAccount : parseBankAccount,
    wrapText: wrapText,
    PokerRank: PokerRank,
    getPokerHandRank: getPokerHandRank,
    getFigureRectangles: getFigureRectangles
};
