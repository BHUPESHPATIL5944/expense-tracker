import {formatCurrency} from '@/lib/formatters';
export default function TransactionItme({transaction, onClick}){
return(
    <button
         onClick={() => onClick(transaction)}
      className="w-full flex items-center justify-between py-3 text-left"
    >
      <div className="flex items-center gap-3">
        <div
          className="w-10 h-10 rounded-full flex items-center justify-center text-white font-semibold shrink-0"
          style={{ backgroundColor: transaction.category?.color || '#3b82f6' }}
        >
          {transaction.category?.name?.[0] || '?'}
        </div>
        <div>
          <p className="text-sm font-medium text-gray-900">{transaction.category?.name}</p>
          {transaction.note && <p className="text-xs text-gray-400">{transaction.note}</p>}
        </div>
      </div>
      <div className="text-right">
        <p className={`font-semibold text-sm ${transaction.type === 'INCOME' ? 'text-green-600' : 'text-gray-900'}`}>
          {transaction.type === 'INCOME' ? '+' : '-'}{formatCurrency(transaction.amount)}
        </p>
        <p className="text-xs text-gray-400">
          {new Date(transaction.date).toLocaleDateString('en-IN', { day: '2-digit', month: 'short' })}
        </p>
      </div>
    </button>
)
}