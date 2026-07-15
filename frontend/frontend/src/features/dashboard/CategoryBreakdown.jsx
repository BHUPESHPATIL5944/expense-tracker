import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts'
import { formatCurrency } from '@/lib/formatters'

export default function CategoryBreakDown({ breakdown }) {
    if (!breakdown?.length) {
        return <p className="text-gray-400 text-sm text-center py-8">No expense yet this month</p>
    }
    return (
        <div className="bg-white rounded-3xl p-4">
            <h3 className="font-semibold text-green-900 mb-3">Category Breakdown</h3>
            <div className="h-48">
                <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                        <Pie
                            data={breakdown}
                            dataKey="total"
                            nameKey="categoryName"
                            innerRadius={50}
                            outerRadius={80}
                            paddingAngle={2}
                        >
                            {breakdown.map((entry, index) => (
                                <Cell key={entry.categoryId} fill={entry.color || '#3b82f6'} />
                            ))}
                        </Pie>
                    </PieChart>
                </ResponsiveContainer>
            </div>
             <div className="space-y-2 mt-2">
        {breakdown.map((item) => (
          <div key={item.categoryId} className="flex items-center justify-between text-sm">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full" style={{ backgroundColor: item.color || '#3b82f6' }} />
              <span className="text-gray-700">{item.categoryName}</span>
            </div>
            <span className="font-medium text-gray-900">{formatCurrency(item.total)}</span>
          </div>
        ))}
      </div>
        </div>
    )
}



