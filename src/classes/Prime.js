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
    const sieve = [];
    const primes = [];
    let k;
    let l;
    sieve[1] = false;

    for (let k = 2; k <= num; k += 1) {
      sieve[k] = true;
    }

    for (let k = 2; k * k <= num; k += 1) {
      if (sieve[k] !== true) {
        continue;
      }
      for (let l = k * k; l <= num; l += k) {
        sieve[l] = false;
      }
    }

    // dump the numbers in primes
    sieve.forEach(function (value, key) {
      if (value) {
        this.push(key);
      }
    }, primes);
    return primes.length ? primes.pop() : -1;
  }
}

// singleton here
module.exports = new PrimeNumber();
