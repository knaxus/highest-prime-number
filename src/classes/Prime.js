const store = require('../store');
class PrimeNumber {
  isPrime(n) {
    for (let i = 2; i <= Math.sqrt(n); i += 1) {
      if (n % i === 0) {
        return false;
      }
    }
    return true;
  }

  calculateGreatestPrimeInRange(num) {
    const primes = [];
    for (let i = 2; i <= num; i += 1) {
      if (this.isPrime(i)) primes.push(i);
    }
    return primes.length ? primes.pop() : -1;
  }

  calculateGreatestPrimeInRangeEnhanced(num) {
    if(num <= store.largestSoFar) {
      return store.checkStore(num);
    }
    else {
      let sieve = store.sieve;
      let primes = store.primes;
      const largestSoFar = store.largestSoFar;
      return this.calculateGreatestPrimeInRangeSieve(num, sieve, primes, largestSoFar);
    }
  }

  calculateGreatestPrimeInRangeSieve(num, sieve, primes, largestSoFar) {
    for (let k = largestSoFar + 1; k <= num; k += 1) {
      sieve[k] = true;
    }

    for (let k = 2; k * k <= num; k += 1) {
      if (sieve[k] !== true) {
        continue;
      }
      //Since Sieve is already calculated for largestSoFar, this is done to avoid recomputation.
      //If K = 4 and largestSoFar = 25, then it's enough if we start computing from 28 instead of 16,
      // the next multiple of 4 from 25. 
      let l = Math.max(k * k, ((largestSoFar / k) + 1) * k);
      for (; l <= num; l += k) {
        sieve[l] = false;
      }
    }

    // dump the numbers in primes
    sieve.forEach(function (value, key) {
      if (value) {
        this.push(key);
      }
    }, primes);
    // cache sieve and primes in the store.
    store.sieve = sieve;
    store.primes = primes;
    store.largestSoFar = num;
    return primes.length ? primes.pop() : -1;
  }
}

// singleton here
module.exports = new PrimeNumber();
