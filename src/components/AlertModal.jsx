export default function AlertModal({ show, title, message, type, onConfirm, onClose }) {
  if (!show) return null;

  const isWarning = type === 'warning';
  const isConfirm = type === 'confirm';
  const showTwoButtons = isWarning || isConfirm;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full" onClick={(e) => e.stopPropagation()}>
        <div className="p-6">
          <h3 className={`text-xl font-bold mb-3 ${
            isWarning ? 'text-yellow-600' : 'text-gray-700'
          }`}>
            {title}
          </h3>
          <p className="text-gray-600 whitespace-pre-line mb-6">
            {message}
          </p>
          <div className="flex gap-3 justify-end">
            {showTwoButtons ? (
              <>
                <button
                  onClick={onClose}
                  className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors font-medium"
                >
                  Cancel
                </button>
                <button
                  onClick={onConfirm}
                  className={`px-4 py-2 text-white rounded-lg transition-colors font-medium ${
                    isWarning 
                      ? 'bg-yellow-500 hover:bg-yellow-600' 
                      : 'bg-red-700 hover:bg-red-800'
                  }`}
                >
                  {isWarning ? 'Proceed Anyway' : 'Confirm'}
                </button>
              </>
            ) : (
              <button
                onClick={onClose}
                className="px-4 py-2 bg-red-700 text-white rounded-lg hover:bg-red-800 transition-colors font-medium"
              >
                OK
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
