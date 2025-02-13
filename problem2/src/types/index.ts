export interface TokenPrice {
  currency: string;
  price: number;
  date: string;
}

export interface TokenDetails extends TokenPrice {
  name: string;
  icon: string;
  balance?: string;
}

export interface TokenInputProps {
  label: string;
  selectedToken: string;
  onChangeToken: (token: string) => void;
  inputProps: {
    value: string;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  };
  priceAmount?: string;
  disabled?: boolean;
  className?: string;
  error?: string;
}




export interface DialogSelectTokenProps {
  selected?: string;
  onChangeToken?: (token: string) => void;
  renderTrigger: React.ReactNode;
  className?: string;
}