import { DialogSelectToken } from "@components/DialogSelectToken";
import { TokenImage } from "@components/TokenImage";
import { Down } from "@components/icons";
import { TokenInputProps } from "@types";
import { twMerge } from "tailwind-merge";


export function InputToken({
  label,
  selectedToken,
  onChangeToken, 
  inputProps,
  priceAmount, 
  disabled,
}: TokenInputProps) {
  return (
    <div className={twMerge(
      "bg-gradient-to-br from-emerald-50 to-white rounded-xl p-4",
    )}>
      <div className="flex items-center justify-between mb-2">
        <label className="text-sm font-medium text-emerald-700">
          {label}
        </label>

        <DialogSelectToken
          selected={selectedToken}
          onChangeToken={onChangeToken} 
          renderTrigger={
            <button 
              type="button"
              disabled={disabled}
              className="flex items-center gap-2 px-3 py-1.5 rounded-lg
                       bg-white hover:bg-emerald-50 transition-all
                       border-2 border-emerald-100"
            >
               <TokenImage token={selectedToken} className="w-5 h-5" />
              <span className="font-medium text-emerald-700">{selectedToken}</span>
              <Down className="w-4 h-4 text-emerald-400" />
            </button>
          }
        />
      </div>

      <input
        type="text"
        placeholder="0.00"
        disabled={disabled}
        {...inputProps}
        className="w-full bg-transparent text-2xl font-medium text-emerald-800
                  placeholder:text-emerald-300 focus:outline-none"
      />

      {priceAmount && (
        <div className="mt-1.5 text-sm text-emerald-600">
          ≈ ${Number(priceAmount).toLocaleString('en-US', { minimumFractionDigits: 2 })}
        </div>
      )}
    </div>
  );
}