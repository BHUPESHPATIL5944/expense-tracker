import { useState, useEffect, useRef } from 'react';
import { useInfiniteQuery, useMutation, useQueryClient, useQuery } from '@tanstack/react-query';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogCancel,
  AlertDialogAction,
} from '@/components/ui/alert-dialog';
import { getCategories, getTransaction, deleteTransaction } from '@/features/transaction/transactionApi.js';
import TransactionItem from '@/features/transaction/TransactionItem';
import TransactionFilters from '@/features/transaction/TransactionFilters';
import TransactionForm from '@/features/transaction/TransactionForm';
import TransactionItemSkeleton from '@/features/transaction/TransactionItemSkeleton';
import  {Button}  from '@/components/ui/button';
import { toast } from 'sonner';

export default function TransactionsPage() {
  const [filters, setFilters] = useState({});
  const [selectedTx, setSelectedTx] = useState(null); // transaction being edited, or null when adding new
  const [showForm, setShowForm] = useState(false);
  const queryClient = useQueryClient();
  const observerTarget = useRef(null);

  const { data: categories } = useQuery({
    queryKey: ['categories'],
    queryFn: getCategories,
  });

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
  } = useInfiniteQuery({
    queryKey: ['transactions', filters],
    queryFn: ({ pageParam }) => getTransaction({ pageParam, filters }),
    initialPageParam: undefined,
    getNextPageParam: (lastPage) => (lastPage.hasNextPage ? lastPage.nextCursor : undefined),
  });

  const deleteMutation = useMutation({
    mutationFn: deleteTransaction,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['transactions'] });
      queryClient.invalidateQueries({ queryKey: ['dashboard-summary'] });
      toast.success('Transaction deleted');
      setSelectedTx(null);
      setShowForm(false);
    },
    onError: () => toast.error('Failed to delete transaction'),
  });

  // Intersection Observer: watches the bottom marker div, fetches next page when it scrolls into view
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasNextPage && !isFetchingNextPage) {
          fetchNextPage();
        }
      },
      { threshold: 1 }
    );

    const target = observerTarget.current;
    if (target) observer.observe(target);
    return () => {
      if (target) observer.unobserve(target);
    };
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

  const allTransactions = data?.pages.flatMap((page) => page.transactions) || [];

  return (
    <div className="p-4">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-xl font-bold text-gray-900">Entries</h1>
        <Button
          size="sm"
          onClick={() => {
            setSelectedTx(null);
            setShowForm(true);
          }}
        >
          + Add
        </Button>
      </div>

      <TransactionFilters filters={filters} onChange={setFilters} categories={categories} />

      <div className="bg-white rounded-3xl p-4 mt-4 divide-y divide-gray-100">
        {isLoading ? (
          <>
            {[1, 2, 3, 4, 5].map((i) => (
              <TransactionItemSkeleton key={i} />
            ))}
          </>
        ) : allTransactions.length === 0 ? (
          <p className="text-center text-gray-400 py-8">No transactions found</p>
        ) : (
          allTransactions.map((tx) => (
            <TransactionItem
              key={tx.id}
              transaction={tx}
              onClick={(tx) => {
                setSelectedTx(tx);
                setShowForm(true);
              }}
            />
          ))
        )}

        {/* Invisible marker element — triggers loading the next page when scrolled into view */}
        <div ref={observerTarget} className="h-4" />
        {isFetchingNextPage && (
          <p className="text-center text-gray-400 py-2 text-sm">Loading more...</p>
        )}
      </div>

      {/* Add / Edit dialog */}
      <Dialog open={showForm} onOpenChange={setShowForm}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{selectedTx ? 'Edit Transaction' : 'Add Transaction'}</DialogTitle>
          </DialogHeader>

          <TransactionForm transaction={selectedTx} onSuccess={() => setShowForm(false)} />

          {/* Delete confirmation, only shown when editing an existing transaction */}
          {selectedTx && (
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="destructive" className="w-full">
                  Delete
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Delete this transaction?</AlertDialogTitle>
                  <AlertDialogDescription>
                    This can't be undone. The transaction will be permanently removed.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction onClick={() => deleteMutation.mutate(selectedTx.id)}>
                    Delete
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}