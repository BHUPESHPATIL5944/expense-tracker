import {formatCurrency} from '@/lib/formatters'

export default function RecentTransaction({transaction}){
    if (!transaction?.length) {
        return <p className="text-gray-400 text-sm text-centre py-8">
            No Transaction yet
        </p>
    }
    return(
         <div className="bg-white rounded-3xl p-4">
      <h3 className="font-semibold text-gray-900 mb-3">Latest Entries</h3>
      <div className="space-y-3">
        {transactions.map((tx) => (
          <div key={tx.id} className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div
                className="w-10 h-10 rounded-full flex items-center justify-center text-white font-semibold"
                style={{ backgroundColor: tx.category?.color || '#3b82f6' }}
              >
                {tx.category?.name?.[0] || '?'}
              </div>
              <div>
                <p className="text-sm font-medium text-gray-900">{tx.category?.name}</p>
                <p className="text-xs text-gray-400">
                  {new Date(tx.date).toLocaleDateString('en-IN', { day: '2-digit', month: 'short' })}
                </p>
              </div>
            </div>
            <p className={`font-semibold text-sm ${tx.type === 'INCOME' ? 'text-green-600' : 'text-gray-900'}`}>
              {tx.type === 'INCOME' ? '+' : '-'}{formatCurrency(tx.amount)}
            </p>
          </div>
        ))}
      </div>
    </div>
    )
}




