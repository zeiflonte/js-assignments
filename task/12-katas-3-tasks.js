'use strict';

/**
 * Returns true if word occurrs in the specified word snaking puzzle.
 * Each words can be constructed using "snake" path inside a grid with top, left, right and bottom directions.
 * Each char can be used only once ("snake" should not cross itself).
 *
 * @param {array} puzzle
 * @param {array} searchStr
 * @return {bool}
 *
 * @example
 *   var puzzle = [ 
 *      'ANGULAR',
 *      'REDNCAE',
 *      'RFIDTCL',
 *      'AGNEGSA',
 *      'YTIRTSP',
 *   ]; 
 *   'ANGULAR'   => true   (first row)
 *   'REACT'     => true   (starting from the top-right R adn follow the ↓ ← ← ↓ )
 *   'UNDEFINED' => true
 *   'RED'       => true
 *   'STRING'    => true
 *   'CLASS'     => true
 *   'ARRAY'     => true   (first column)
 *   'FUNCTION'  => false
 *   'NULL'      => false 
 */
function findStringInSnakingPuzzle(puzzle, searchStr) {
    let IsInPosArr = (posArr, pos) => {
       for (let arrPos of posArr)
           if ((arrPos[0] == pos[0]) && (arrPos[1] == pos[1])) return true;
       return false;
   }

   let IsHere = (puzzle, word, curLetterNum, curPos) => {
       if (curLetterNum == word.length - 1) {
           if ((puzzle[curPos[0]][curPos[1]] == word[curLetterNum]) && (!IsInPosArr(wasInRow, [curPos[0], curPos[1]]))) {
               return true;
           } else return false;
       } else {
           if ((puzzle[curPos[0]][curPos[1]] == word[curLetterNum]) && (!IsInPosArr(wasInRow, [curPos[0], curPos[1]]))) {
               let result = false;
               wasInRow.push([curPos[0], curPos[1]]);
               if (curPos[0] > 0)
                   result = result || IsHere(puzzle, word, curLetterNum + 1, [curPos[0] - 1, curPos[1]]);
               if (curPos[1] < puzzle[curPos[0]].length - 1)
                   result = result || IsHere(puzzle, word, curLetterNum + 1, [curPos[0], curPos[1] + 1]);
               if (curPos[0] < puzzle.length - 1)
                   result = result || IsHere(puzzle, word, curLetterNum + 1, [curPos[0] + 1, curPos[1]]);
               if (curPos[1] > 0)
                   result = result || IsHere(puzzle, word, curLetterNum + 1, [curPos[0], curPos[1] - 1]);
               wasInRow.pop();
               return result;
           } else return false;
       }
   }
   
   let result = false;
   let wasInRow = new Array();
   for (let i = 0; i < puzzle.length; i++)
       for (let j = 0; j < puzzle[i].length; j++)
            result = result || IsHere(puzzle, searchStr, 0, [i, j]);
            
   return result;
}

/**
 * Returns all permutations of the specified string.
 * Assume all chars in the specified string are different.
 * The order of permutations does not matter.
 * 
 * @param {string} chars
 * @return {Iterable.<string>} all posible strings constructed with the chars from the specfied string
 *
 * @example
 *    'ab'  => 'ab','ba'
 *    'abc' => 'abc','acb','bac','bca','cab','cba'
 */
function* getPermutations(chars) {
   function permute(chars) {
        if (chars.length == 1) {
            return chars;
        } else if (chars.length == 2) {
            return [chars, chars[1] + chars[0]];
        } else {
            const permutations = [];
            chars.split('').forEach((char, index, array) => {
                let sub = [].concat(array);
                sub.splice(index, 1);
                permute(sub.join('')).forEach((permutation) => permutations.push(char + permutation));
            });
            return permutations;
        }
    }
    for (let permutation of permute(chars)) {
        yield permutation;
    }
}


/**
 * Returns the most profit from stock quotes.
 * Stock quotes are stores in an array in order of date.
 * The stock profit is the difference in prices in buying and selling stock.
 * Each day, you can either buy one unit of stock, sell any number of stock units you have already bought, or do nothing. 
 * Therefore, the most profit is the maximum difference of all pairs in a sequence of stock prices.
 * 
 * @param {array} quotes
 * @return {number} max profit
 *
 * @example
 *    [ 1, 2, 3, 4, 5, 6]   => 15  (buy at 1,2,3,4,5 and then sell all at 6)
 *    [ 6, 5, 4, 3, 2, 1]   => 0   (nothing to buy)
 *    [ 1, 6, 5, 10, 8, 7 ] => 18  (buy at 1,6,5 and sell all at 10)
 */
function getMostProfitFromStockQuotes(quotes) {
   let sum = 0;
   quotes.forEach((value, index) => sum += quotes.slice(index).sort((a, b) => b - a)[0] - value);
   return sum;
}


/**
 * Class representing the url shorting helper.
 * Feel free to implement any algorithm, but do not store link in the key\value stores.
 * The short link can be at least 1.5 times shorter than the original url.
 * 
 * @class
 *
 * @example
 *    
 *     var urlShortener = new UrlShortener();
 *     var shortLink = urlShortener.encode('https://en.wikipedia.org/wiki/URL_shortening');
 *     var original  = urlShortener.decode(shortLink); // => 'https://en.wikipedia.org/wiki/URL_shortening'
 * 
 */
function UrlShortener() {
    this.urlAllowedChars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ"+
                           "abcdefghijklmnopqrstuvwxyz"+
                           "0123456789-_.~!*'();:@&=+$,/?#[]";
}

UrlShortener.prototype = {

    encode: function (url) {
        var res = '';
        for (let i = 0; i * 2 < url.length; i++) {
            res += String.fromCodePoint(url.codePointAt(2 * i) * 256 + (url.codePointAt(2 * i + 1) || 0))
        }
        return res;
    },

    decode: function (code) {
        var res = '';
        for (let i = 0; i < code.length; i++) {
            let c = code.codePointAt(i);
            res += String.fromCodePoint(c / 256 | 0) + (c % 256 ? String.fromCodePoint(c % 256) : '');
        }
        return res;
    }
}


module.exports = {
    findStringInSnakingPuzzle: findStringInSnakingPuzzle,
    getPermutations: getPermutations,
    getMostProfitFromStockQuotes: getMostProfitFromStockQuotes,
    UrlShortener: UrlShortener
};
