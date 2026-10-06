import { useState } from "react";
import { deleteExpense } from "../api";

export default function ExpenseList({ expenses, onDeleted }) {
  const [deletingId, setDeletingId] = useState(null);

  const handleDelete = async (id) => {
    setDeletingId(id);
    try {
      await deleteExpense(id);
      onDeleted();
    } finally {
      setDeletingId(null);
    }
  };

  if (expenses.length === 0) {
    return (
      <div className="bg-white rounded-2xl shadow p-8 text-center text-gray-400 text-sm">
        No expenses yet. Add one above!
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl shadow overflow-hidden">
      <h2 className="text-lg font-semibold text-gray-800 px-6 pt-6 pb-3">
        All Expenses
      </h2>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-gray-50 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
              <th className="px-6 py-3">Date</th>
              <th className="px-6 py-3">Category</th>
              <th className="px-6 py-3">Description</th>
              <th className="px-6 py-3 text-right">Amount</th>
              <th className="px-6 py-3"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {expenses.map((exp) => (
              <tr key={exp.id} className="hover:bg-gray-50 transition-colors">
                <td className="px-6 py-3 text-gray-600 whitespace-nowrap">
                  {new Date(exp.date + "T00:00:00").toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                    year: "numeric",
                  })}
                </td>
                <td className="px-6 py-3">
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-50 text-indigo-700">
                    {exp.category}
                  </span>
                </td>
                <td className="px-6 py-3 text-gray-500 max-w-xs truncate">
                  {exp.description || "—"}
                </td>
                <td className="px-6 py-3 text-right font-medium text-gray-800 whitespace-nowrap">
                  ₹{exp.amount.toFixed(2)}
                </td>
                <td className="px-6 py-3 text-right">
                  <button
                    onClick={() => handleDelete(exp.id)}
                    disabled={deletingId === exp.id}
                    className="text-red-400 hover:text-red-600 disabled:opacity-40 transition-colors text-xs font-medium"
                  >
                    {deletingId === exp.id ? "Deleting…" : "Delete"}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
