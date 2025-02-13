# Messy React

## Problem

```tsx

// PROBLEM 1: Poor Type Safety
interface WalletBalance {
  currency: string;
  amount: number;
 // blockchain is missing from interface but used in code!
}

interface FormattedWalletBalance {
  currency: string;
  amount: number;
  formatted: string;
}

// PROBLEM 2: Unsafe Type Usage
const getPriority = (blockchain: any): number  // using 'any' is bad practice


// PROBLEM 3: Logic Error in Filter
.filter((balance: WalletBalance) => {
  const balancePriority = getPriority(balance.blockchain);
  if (lhsPriority > -99) { // lhsPriority is undefined!
    if (balance.amount <= 0) { // logic seems reversed
      return true;
    }
  }
  return false;
})

// PROBLEM 4: Incomplete Sort Function
.sort((lhs: WalletBalance, rhs: WalletBalance) => {
  // Doesn't return 0 for equal values
  // Could cause unstable sorting
})


```

## Refactor code

```tsx
// Define specific blockchain types for better type safety
type BlockchainType = 'Osmosis' | 'Ethereum' | 'Arbitrum' | 'Zilliqa' | 'Neo';

interface WalletBalance {
  currency: string;
  amount: number;
  blockchain: BlockchainType; // Add blockchain with specific type
}

interface FormattedWalletBalance extends WalletBalance {
  formatted: string;
  usdValue: number; // Add USD value to avoid recalculation
}


// We can define the blockchain priority as an object, maybe can reuse somewhere else. Separate priorities into a config for better maintenance and reusability

const BLOCKCHAIN_PRIORITY: Record<BlockchainType, number> = {
  Osmosis: 100,   // Highest priority
  Ethereum: 50,   // Second priority
  Arbitrum: 30,   // Third priority
  Zilliqa: 20,    // Low priority
  Neo: 20,        // Same priority as Zilliqa
}

// Move getPriority outside component as it's a pure function
const getPriority = (blockchain: BlockchainType): number => {
  return BLOCKCHAIN_PRIORITY[blockchain] ?? -99; // Use ?? instead of || to handle 0
};

 const WalletPage: React.FC = () => {
  // Use custom hooks for data fetching
  const balances = useWalletBalances();
  const prices = usePrices();

  // Optimize performance with useMemo, only recalculate when balances or prices change
  const sortedBalances = useMemo(() => {
    if (!balances?.length) return [];

    return balances
      .filter(balance => {
        // Filter valid balances: priority > -99 and amount > 0
        const priority = getPriority(balance.blockchain);
        return priority > -99 && balance.amount > 0;
      })
      .sort((a, b) => {
        // Sort by priority in descending order
        return getPriority(b.blockchain) - getPriority(a.blockchain);
      })
      .map(balance => ({
        ...balance,
        // Format numbers and calculate USD value in a single map
        formatted: balance.amount.toFixed(2),
        usdValue: Number.isFinite(prices[balance.currency])
          ? balance.amount * (prices[balance.currency] || 0)
          : 0
      }));
  }, [balances, prices]);

   // Handle loading state
  if (!balances || !prices) {
    return <div>Loading...</div>;
  }

  // Handle empty state
  if (sortedBalances.length === 0) {
    return <div>No balances found</div>;
  }

  return (
    <div>
      {sortedBalances.map((balance) => (
        // Use composite key to avoid duplicates
        <WalletRow
          key={`${balance.blockchain}-${balance.currency}`}
          amount={balance.amount}
          usdValue={balance.usdValue}
          formattedAmount={balance.formatted}
        />
      ))}
    </div>
  );
};


// Optimize WalletRow performance with React.memo
const WalletRow = memo<{
  amount: number;
  usdValue: number;
  formattedAmount: string;
}>(({ amount, usdValue, formattedAmount }) => (
  <div className="wallet-row">
    <span>{formattedAmount}</span>
    <span>${usdValue.toFixed(2)}</span>
  </div>
));

// Optional: Add error boundary for better error handling
class WalletErrorBoundary extends React.Component {
  state = { hasError: false };

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  render() {
    if (this.state.hasError) {
      return <div>Something went wrong</div>;
    }
    return this.props.children;
  }
}

// Usage with error boundary
const WalletPageWithErrorBoundary = () => (
  <WalletErrorBoundary>
    <WalletPage />
  </WalletErrorBoundary>
);
```
