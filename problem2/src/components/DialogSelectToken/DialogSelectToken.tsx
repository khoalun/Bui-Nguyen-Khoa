import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  Loading,
  TokenImage,
} from "@components";
import { useGetTokensPrice } from "@hooks/price";
import { DialogSelectTokenProps } from "@types";
import React, { useMemo } from "react";
import { twMerge } from "tailwind-merge";

export function DialogSelectToken(props: DialogSelectTokenProps) {
  const { renderTrigger, selected, onChangeToken } = props;
  const [dialogOpen, setIsDialogOpen] = React.useState(false);
  const [searchQuery, setSearchQuery] = React.useState("");
  const tokenData = useGetTokensPrice();
  
  // Format giá token
  const formatTokenPrice = (price: number): string => {
    if (!price || isNaN(price)) return "0.00";
    return price.toLocaleString('en-US', { 
      minimumFractionDigits: 2,
      maximumFractionDigits: 2 
    });
  };

  // Xử lý tìm kiếm token
  const handleSearchInput = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(event.target.value);
  };

  // Xử lý chọn token
  const handleTokenSelect = (token: string) => {
    if (onChangeToken) {
      onChangeToken(token);
      setIsDialogOpen(false);
    }
  };

  // Lọc danh sách token
  const filteredTokens = useMemo(() => {
    if (!tokenData.data) return [];
    
    return tokenData.data.filter((token) => {
      // Kiểm tra token hợp lệ
      if (!token.currency || !token.price) return false;
      
      // Tìm kiếm theo tên token
      return token.currency.toLowerCase().includes(searchQuery.toLowerCase());
    });
  }, [tokenData.data, searchQuery]);
 
  return (
    <Dialog
      open={dialogOpen}
      onOpenChange={(open) => {
        setIsDialogOpen(open);
        if (!open) setSearchQuery("");
      }}
    >
      <DialogTrigger className="flex-shrink-0">
        {renderTrigger}
      </DialogTrigger>

      <DialogContent className="w-full max-w-md bg-white border-2 border-emerald-100 rounded-lg">
        <DialogHeader className="px-4 pt-4">
          <DialogTitle className="text-xl font-bold text-emerald-800 mb-4">
            Select a token
          </DialogTitle>

          <div className="relative">
            <input
              type="text"
              className="w-full h-11 bg-emerald-50/50 rounded-lg px-4 
                        border-2 border-emerald-100 transition-all
                        placeholder:text-emerald-400 text-emerald-700
                        focus:border-emerald-300 focus:outline-none"
              placeholder="Search tokens..."
              onChange={handleSearchInput}
              value={searchQuery}
            />
          </div>

          <div className="mt-4">
            {tokenData.isLoading && (
              <div className="flex justify-center py-8">
                <Loading className="text-3xl text-emerald-500" />
              </div>
            )}

            {!tokenData.isLoading && !tokenData.error && filteredTokens.length === 0 && (
              <div className="text-center py-8">
                <p className="text-emerald-600">
                  No tokens found matching "{searchQuery}"
                </p>
              </div>
            )}

            {filteredTokens.length > 0 && (
              <ul className="space-y-2 max-h-[50vh] overflow-y-auto pr-2">
                {filteredTokens.map((token) => (
                  <li key={token.currency}>
                    <button
                      onClick={() => handleTokenSelect(token.currency)}
                      className={twMerge(
                        "w-full p-3 rounded-lg transition-all",
                        "flex items-center gap-3 hover:bg-emerald-50",
                        selected === token.currency 
                          ? "bg-emerald-100 border-2 border-emerald-200" 
                          : "border-2 border-transparent"
                      )}
                    >
                      <TokenImage 
                        className="w-8 h-8" 
                        token={token.currency} 
                      />
                      <div className="flex-1 text-left">
                        <div className="font-medium text-emerald-800">
                          {token.currency}
                        </div>
                        <div className="text-sm text-emerald-600">
                          ${formatTokenPrice(token.price)}
                        </div>
                      </div>
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
}