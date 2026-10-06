import { useState, useEffect, useCallback } from "react";
import ExpenseForm from "./components/ExpenseForm";
import ExpenseList from "./components/ExpenseList";
import Dashboard from "./components/Dashboard";
import { listExpenses, getSummary } from "./api";

export default function App() {
  const [expenses, setExpenses] = useState([]);
  const [summary, setSummary] = useState(null);
  const [error, setError] = useState("");

  const fetchAll = useCallback(async () => {
    setError("");
    try {
      const [expRes, sumRes] = await Promise.all([listExpenses(), getSummary()]);
      setExpenses(expRes.data);
      setSummary(sumRes.data);
    } catch {
      setError("Could not connect to the backend. Make sure it's running on port 8000.");
    }
  }, []);

  useEffect(() => {
    fetchAll();
  }, [fetchAll]);

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-indigo-600 shadow-md">
        <div className="max-w-5xl mx-auto px-4 py-4 flex items-center gap-3">
          <span className="text-2xl">💸</span>
          <h1 className="text-xl font-bold text-white tracking-tight">ExpenseBuddy</h1>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 py-8 space-y-6">
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 rounded-xl px-4 py-3 text-sm">
            {error}
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <ExpenseForm onAdded={fetchAll} />
            <ExpenseList expenses={expenses} onDeleted={fetchAll} />
          </div>
          <div>
            <Dashboard summary={summary} />
          </div>
        </div>
      </main>
    </div>
  );
}
