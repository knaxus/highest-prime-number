/**
 * THe cachedAnswers is a hash map which will store the calculation results
 * Say if the server has already calculated the result for a given number,
 * it should simply return the result instead of doing the calculation again and again
 * primes and sieve are arrays which will store the results from previous computations.
 */
const bounds = require('binary-search-bounds');
const store = {
    cachedAnswers:{},
    primes:[],
    //Both 0 and 1 are not primes, Hence the sieve values are set to false.
    sieve: [false, false],
    largestSoFar: 1,
    //checkStore gets the greatest number less than or equal to num using binary search
    //provided by bounds.
    checkStore: function(num) {
        var ind = bounds.le(this.primes, num);
        return ind != -1 ? this.primes[ind] : ind;
    }
};
module.exports = store;
