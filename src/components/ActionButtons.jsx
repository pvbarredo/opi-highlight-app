export default function ActionButtons({ onSaveCSV, onImportCSV, onEmailCSV, onSubmit }) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      <button
        onClick={onSaveCSV}
        className="px-6 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors font-medium shadow-sm"
      >
        Save CSV
      </button>
      <button
        onClick={onImportCSV}
        className="px-6 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors font-medium shadow-sm"
      >
        Import CSV
      </button>
      <button
        onClick={onEmailCSV}
        className="px-6 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors font-medium shadow-sm"
      >
        Email CSV
      </button>
      <button
        onClick={onSubmit}
        className="px-6 py-3 bg-red-700 text-white rounded-lg hover:bg-red-800 transition-colors font-medium shadow-sm"
      >
        Submit
      </button>
    </div>
  );
}
