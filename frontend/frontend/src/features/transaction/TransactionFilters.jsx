import {Button} from '@/components/ui/button';
import {cn} from '@/lib/utils';

export default function TransactionFilters({filters,onChange,categories}){
    return(
         <div className="flex gap-2 overflow-x-auto pb-2 -mx-4 px-4">
      <button
        onClick={() => onChange({ ...filters, type: undefined })}
        className={cn(
          'px-3 py-1.5 rounded-full text-sm whitespace-nowrap border',
          !filters.type ? 'bg-blue-600 text-white border-blue-600' : 'border-gray-200 text-gray-600'
        )}
      >
        All
      </button>
      <button
        onClick={() => onChange({ ...filters, type: 'INCOME' })}
        className={cn(
          'px-3 py-1.5 rounded-full text-sm whitespace-nowrap border',
          filters.type === 'INCOME' ? 'bg-blue-600 text-white border-blue-600' : 'border-gray-200 text-gray-600'
        )}
      >
        Income
      </button>
      <button
        onClick={() => onChange({ ...filters, type: 'EXPENSE' })}
        className={cn(
          'px-3 py-1.5 rounded-full text-sm whitespace-nowrap border',
          filters.type === 'EXPENSE' ? 'bg-blue-600 text-white border-blue-600' : 'border-gray-200 text-gray-600'
        )}
      >
        Expense
      </button>
      {categories?.map((cat) => (
        <button
          key={cat.id}
          onClick={() => onChange({ ...filters, categoryId: filters.categoryId === cat.id ? undefined : cat.id })}
          className={cn(
            'px-3 py-1.5 rounded-full text-sm whitespace-nowrap border',
            filters.categoryId === cat.id ? 'bg-blue-600 text-white border-blue-600' : 'border-gray-200 text-gray-600'
          )}
        >
          {cat.name}
        </button>
      ))}
    </div>
    );
}


