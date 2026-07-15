import {formatCurrency} from '@/lib/formatters'

export default function SummaryCard({summary}){
    const budgetPercent=summary.budgetUsedPercent??0;

    return(
         <div className="bg-blue-600 rounded-3xl p-6 text-white">
      <p className="text-blue-100 text-sm mb-1">Total Expenses</p>
      <h2 className="text-3xl font-bold mb-4">{formatCurrency(summary.totalExpense)}</h2>

      <div className="flex gap-3 mb-4">
        <div className="bg-blue-500/50 rounded-xl px-3 py-2 flex-1">
          <p className="text-xs text-blue-100">Income</p>
          <p className="font-semibold">{formatCurrency(summary.totalIncome)}</p>
        </div>
        <div className="bg-blue-500/50 rounded-xl px-3 py-2 flex-1">
          <p className="text-xs text-blue-100">Savings</p>
          <p className="font-semibold">{formatCurrency(summary.savings)}</p>
        </div>
      </div>
      {summary.budget && (
        <div>
          <div className="flex justify-between text-xs text-blue-100 mb-1">
            <span>You've spent {budgetPercent}% of your budget</span>
          </div>
          <div className="h-2 bg-blue-500/50 rounded-full overflow-hidden">
            <div
              className="h-full bg-white rounded-full"
              style={{ width: `${Math.min(budgetPercent, 100)}%` }}
            />
          </div>
        </div>
      )}
    </div>
    )


}



