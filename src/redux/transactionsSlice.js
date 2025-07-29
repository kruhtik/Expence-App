import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

// Transaction categories
const EXPENSE_CATEGORIES = [
  'Food & Dining',
  'Shopping',
  'Transportation',
  'Housing',
  'Bills & Utilities',
  'Entertainment',
  'Healthcare',
  'Education',
  'Gifts & Donations',
  'Travel',
  'Other Expenses'
];

const INCOME_CATEGORIES = [
  'Salary',
  'Freelance',
  'Investments',
  'Gifts',
  'Rental',
  'Other Income'
];

export const CATEGORIES = {
  expense: EXPENSE_CATEGORIES,
  income: INCOME_CATEGORIES
};

// Async Thunks
export const fetchTransactions = createAsyncThunk(
  'transactions/fetch',
  async (userId, { rejectWithValue }) => {
    try {
      const snapshot = await db.collection('transactions')
        .where('userId', '==', userId)
        .orderBy('date', 'desc')
        .get();
      return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const addTransaction = createAsyncThunk(
  'transactions/add',
  async (transaction, { rejectWithValue }) => {
    try {
      const docRef = await db.collection('transactions').add(transaction);
      return { id: docRef.id, ...transaction };
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const updateTransaction = createAsyncThunk(
  'transactions/update',
  async ({ id, ...updates }, { rejectWithValue }) => {
    try {
      await db.collection('transactions').doc(id).update(updates);
      return { id, ...updates };
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const deleteTransaction = createAsyncThunk(
  'transactions/delete',
  async (id, { rejectWithValue }) => {
    try {
      await db.collection('transactions').doc(id).delete();
      return id;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Slice
const transactionsSlice = createSlice({
  name: 'transactions',
  initialState: { 
    items: [], 
    loading: false, 
    error: null,
    categories: CATEGORIES 
  },
  reducers: {
    clearTransactions: (state) => {
      state.items = [];
      state.loading = false;
      state.error = null;
    }
  },
  extraReducers: builder => {
    // Fetch Transactions
    builder
      .addCase(fetchTransactions.pending, (state) => { 
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTransactions.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
      })
      .addCase(fetchTransactions.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // Add Transaction
      .addCase(addTransaction.fulfilled, (state, action) => {
        state.items = [action.payload, ...state.items];
      })
      
      // Update Transaction
      .addCase(updateTransaction.fulfilled, (state, action) => {
        const index = state.items.findIndex(t => t.id === action.payload.id);
        if (index !== -1) {
          state.items[index] = { ...state.items[index], ...action.payload };
        }
      })
      
      // Delete Transaction
      .addCase(deleteTransaction.fulfilled, (state, action) => {
        state.items = state.items.filter(t => t.id !== action.payload);
      });
  },
});

// Selectors
import { createSelector } from '@reduxjs/toolkit';

// Base selectors
const selectTransactionsState = state => state.transactions;
const selectAllTransactions = state => state.transactions.items;

// Memoized selectors
export const selectTransactions = createSelector(
  [selectAllTransactions],
  transactions => transactions
);

export const selectExpenses = createSelector(
  [selectAllTransactions],
  transactions => transactions.filter(t => t.type === 'expense')
);

export const selectIncomes = createSelector(
  [selectAllTransactions],
  transactions => transactions.filter(t => t.type === 'income')
);

export const selectCategories = createSelector(
  [selectTransactionsState],
  transactions => transactions.categories
);

export const selectLoading = createSelector(
  [selectTransactionsState],
  transactions => transactions.loading
);

export const selectError = createSelector(
  [selectTransactionsState],
  transactions => transactions.error
);

// Create a memoized selector for getting categories by type
export const makeSelectCategoriesByType = () => 
  createSelector(
    [selectCategories, (_, type) => type],
    (categories, type) => categories[type] || []
  );

export const { clearTransactions } = transactionsSlice.actions;

export default transactionsSlice.reducer;