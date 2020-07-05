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
    let largestSoFar = parseInt(store.largestSoFar);

    //If the number is less than the largest number encountered so far, then check in the store
    //Else compute using SOE
    if(num <= parseInt(largestSoFar)) {
      return store.checkStore(num);
    }
    else {
      let sieve = store.sieve.slice();
      let primes = store.primes.slice();
      return this.calculateGreatestPrimeInRangeSOE(num, primes, sieve, largestSoFar);
    }
  }

  calculateGreatestPrimeInRangeSOE(num, primes, sieve, largestSoFar) {
    //First largestSoFar indices of sieve are already computed. Start from largestSoFar + 1
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
      let l = Math.max(k * k, (Math.floor(largestSoFar / k) + 1) * k);
      for (; l <= num; l += k) {
        sieve[l] = false;
      }
    }

    // dump the numbers in primes
    for(let k = largestSoFar + 1; k < sieve.length; k++) {
      if(sieve[k]) {
        primes.push(k);
      }
    }
    // cache sieve and primes in the store.
    if(store.largestSoFar < num) {
      store.sieve = sieve;
      store.primes = primes;
      store.largestSoFar = num;
    }
    return primes.length ? primes[primes.length - 1] : -1;
  }
}

// singleton here
module.exports = new PrimeNumber();
