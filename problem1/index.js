const calculateSumWithLoop = function (n) {
    let sum = 0;
    // Simple loop
    for (let i = 1; i <= n; i++) {
      sum += i;
    }
    return sum;
  };

  
  const calculateSumWithFormula = function(n) {
    return (n * (n + 1)) / 2;
};


const calculateSumWithWhileLoop = function(n) {
    // Using while loop
    let sum = 0;
    let i = 1;
    while (i <= n) {
        sum += i;
        i++;
    }
    return sum;
};


  console.log(calculateSumWithLoop(5));
  console.log(calculateSumWithFormula(5));
  console.log(calculateSumWithWhileLoop(5));