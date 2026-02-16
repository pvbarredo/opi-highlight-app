import { Lightbulb, X } from 'lucide-react';

export default function HowToUseModal({ show, onClose, language, onLanguageChange }) {
  if (!show) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={onClose}>
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
        <div className="sticky top-0 bg-white border-b border-gray-200 p-6 flex justify-between items-start">
          <div className="flex-1">
            <h2 className="text-2xl font-bold text-gray-700 flex items-start gap-2 mb-3">
              <Lightbulb className="text-red-700" size={28} />
              {language === 'english' ? 'How to Use' : 'Paano Gamitin'}
            </h2>
            <div className="flex gap-2">
              <button
                onClick={() => onLanguageChange('english')}
                className={`px-3 py-1 rounded text-xs font-medium transition-colors ${
                  language === 'english' 
                    ? 'bg-red-700 text-white' 
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                English
              </button>
              <button
                onClick={() => onLanguageChange('filipino')}
                className={`px-3 py-1 rounded text-xs font-medium transition-colors ${
                  language === 'filipino' 
                    ? 'bg-red-700 text-white' 
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                Filipino
              </button>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X size={24} />
          </button>
        </div>
        
        <div className="p-6 space-y-5">
          {language === 'english' ? (
            <>
              <div>
                <p className="font-semibold text-gray-700 mb-2 flex items-start gap-2">
                  <span className="text-xl">📅</span> Select Game Date
                </p>
                <p className="text-sm text-gray-600">Choose the date of the game you want to extract highlights from.</p>
              </div>

              <div>
                <p className="font-semibold text-gray-700 mb-2 flex items-start gap-2">
                  <span className="text-xl">📹</span> Camera Values
                </p>
                <ul className="list-disc list-inside space-y-1 ml-2 text-sm text-gray-600">
                  <li><strong>Cam1:</strong> Entrance camera</li>
                  <li><strong>Cam2:</strong> Opposite side of Cam1</li>
                  <li>For videos with multiple parts, use format: <code className="bg-gray-100 px-1.5 py-0.5 rounded text-red-700 font-mono">"Cam2 Part 1"</code></li>
                </ul>
              </div>

              <div>
                <p className="font-semibold text-gray-700 mb-2 flex items-start gap-2">
                  <span className="text-xl">⏱️</span> Timestamp Format
                </p>
                <p className="text-sm text-gray-600 mb-2">Enter the exact time when the play happens in format: <code className="bg-gray-100 px-1.5 py-0.5 rounded text-red-700 font-mono">HH:MM:SS</code></p>
                <p className="text-xs italic text-gray-500 mb-3">Example: "01:53:22" means 1 hour, 53 minutes, 22 seconds</p>
                
                <div className="bg-red-50 rounded-lg p-4 border border-red-200">
                  <p className="font-semibold text-gray-700 mb-3 text-sm flex items-start gap-2">
                    <span className="text-lg">⏰</span> Timing Rules:
                  </p>
                  <ul className="space-y-2 text-sm text-gray-600">
                    <li className="flex items-start gap-2">
                      <span className="text-red-700 font-bold">•</span>
                      <span><strong>Shoot/Score:</strong> When the ball goes through the net</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-red-700 font-bold">•</span>
                      <span><strong>Pass:</strong> When the receiver catches the ball</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-red-700 font-bold">•</span>
                      <span><strong>Rebound:</strong> When the rebounder secures the ball</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-red-700 font-bold">•</span>
                      <span><strong>Steal:</strong> When the player gains possession</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-red-700 font-bold">•</span>
                      <span><strong>Block:</strong> When contact is made with the ball</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-red-700 font-bold">•</span>
                      <span><strong>Good Move:</strong> When there's an impressive play, even without a score</span>
                    </li>
                  </ul>
                </div>
              </div>

              <div>
                <p className="font-semibold text-gray-700 mb-2 flex items-start gap-2">
                  <span className="text-xl">◀️ ▶️</span> Camera Side
                </p>
                <div className="text-sm text-gray-600 space-y-1">
                  <p><strong>Left (L):</strong> Closer side to the camera</p>
                  <p><strong>Right (R):</strong> Farther side from the camera</p>
                  <p className="text-xs italic text-gray-500 mt-2 flex items-center gap-1">
                    <span className="text-base">💡</span> Tip: The right side might offer a better angle for certain highlights!
                  </p>
                </div>
              </div>

              <div>
                <p className="font-semibold text-gray-700 mb-2 flex items-start gap-2">
                  <span className="text-xl">🎬</span> Action Buttons
                </p>
                <div className="space-y-3 text-sm text-gray-600">
                  <div>
                    <p className="font-medium text-gray-700 mb-1">💾 Save CSV</p>
                    <p>Downloads a CSV file containing all your highlight entries. Use this to save your work and keep a backup of your data.</p>
                  </div>
                  <div>
                    <p className="font-medium text-gray-700 mb-1">📂 Import CSV</p>
                    <p>Upload a previously saved CSV file to quickly restore your entries. The file must be in the same format as the one you saved.</p>
                  </div>
                  <div>
                    <p className="font-medium text-gray-700 mb-1">📧 Email CSV</p>
                    <p>Opens your email app (on desktop or mobile) with the CSV data ready to send to <strong>pvbarredo@gmail.com</strong>. Perfect for quick submissions!</p>
                  </div>
                  <div>
                    <p className="font-medium text-gray-700 mb-1">✅ Submit</p>
                    <p>Opens your email app with a formatted message containing all your highlight data, ready to submit to <strong>pvbarredo@gmail.com</strong>.</p>
                  </div>
                </div>
              </div>
            </>
          ) : (
            <>
              <div>
                <p className="font-semibold text-gray-700 mb-2 flex items-start gap-2">
                  <span className="text-xl">📅</span> Piliin ang Petsa ng Laro
                </p>
                <p className="text-sm text-gray-600">Piliin ang petsa ng laro kung saan kukunin ang mga highlight.</p>
              </div>

              <div>
                <p className="font-semibold text-gray-700 mb-2 flex items-start gap-2">
                  <span className="text-xl">📹</span> Valores ng Camera
                </p>
                <ul className="list-disc list-inside space-y-1 ml-2 text-sm text-gray-600">
                  <li><strong>Cam1:</strong> Camera sa entrance</li>
                  <li><strong>Cam2:</strong> Kabilang side ng Cam1</li>
                  <li>Para sa mga video na may maraming bahagi, gamitin ang format: <code className="bg-gray-100 px-1.5 py-0.5 rounded text-red-700 font-mono">"Cam2 Part 1"</code></li>
                </ul>
              </div>

              <div>
                <p className="font-semibold text-gray-700 mb-2 flex items-start gap-2">
                  <span className="text-xl">⏱️</span> Format ng Timestamp
                </p>
                <p className="text-sm text-gray-600 mb-2">I-enter ang eksaktong oras kung kailan nangyari ang play sa format: <code className="bg-gray-100 px-1.5 py-0.5 rounded text-red-700 font-mono">HH:MM:SS</code></p>
                <p className="text-xs italic text-gray-500 mb-3">Halimbawa: "01:53:22" ay nangangahulugang 1 oras, 53 minuto, 22 segundo</p>
                
                <div className="bg-red-50 rounded-lg p-4 border border-red-200">
                  <p className="font-semibold text-gray-700 mb-3 text-sm flex items-start gap-2">
                    <span className="text-lg">⏰</span> Mga Panuntunan sa Timing:
                  </p>
                  <ul className="space-y-2 text-sm text-gray-600">
                    <li className="flex items-start gap-2">
                      <span className="text-red-700 font-bold">•</span>
                      <span><strong>Shoot/Score:</strong> Kapag dumaan ang bola sa net</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-red-700 font-bold">•</span>
                      <span><strong>Pass:</strong> Kapag nahawakan ng receiver ang bola</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-red-700 font-bold">•</span>
                      <span><strong>Rebound:</strong> Kapag nakuha ng rebounder ang bola</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-red-700 font-bold">•</span>
                      <span><strong>Steal:</strong> Kapag nakuha ng player ang hawak ng bola</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-red-700 font-bold">•</span>
                      <span><strong>Block:</strong> Kapag tumama ang kamay sa bola</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-red-700 font-bold">•</span>
                      <span><strong>Magandang Galaw:</strong> Kapag may kahanga-hangang play, kahit walang puntos</span>
                    </li>
                  </ul>
                </div>
              </div>

              <div>
                <p className="font-semibold text-gray-700 mb-2 flex items-start gap-2">
                  <span className="text-xl">◀️ ▶️</span> Side ng Camera
                </p>
                <div className="text-sm text-gray-600 space-y-1">
                  <p><strong>Left (L):</strong> Mas malapit na side sa camera</p>
                  <p><strong>Right (R):</strong> Mas malayong side mula sa camera</p>
                  <p className="text-xs italic text-gray-500 mt-2 flex items-center gap-1">
                    <span className="text-base">💡</span> Tip: Ang right side ay maaaring magbigay ng mas magandang anggulo para sa ilang highlight!
                  </p>
                </div>
              </div>

              <div>
                <p className="font-semibold text-gray-700 mb-2 flex items-start gap-2">
                  <span className="text-xl">🎬</span> Mga Action Buttons
                </p>
                <div className="space-y-3 text-sm text-gray-600">
                  <div>
                    <p className="font-medium text-gray-700 mb-1">💾 Save CSV</p>
                    <p>Mag-download ng CSV file na naglalaman ng lahat ng iyong highlight entries. Gamitin ito para i-save ang iyong trabaho at mag-backup ng data.</p>
                  </div>
                  <div>
                    <p className="font-medium text-gray-700 mb-1">📂 Import CSV</p>
                    <p>Mag-upload ng dating na-save na CSV file para mabilis na maibalik ang iyong mga entries. Ang file ay dapat nasa parehong format ng iyong na-save.</p>
                  </div>
                  <div>
                    <p className="font-medium text-gray-700 mb-1">📧 Email CSV</p>
                    <p>Bubuksan ang iyong email app (sa desktop o mobile) na may CSV data na handa nang ipadala sa <strong>pvbarredo@gmail.com</strong>. Perpekto para sa mabilis na submission!</p>
                  </div>
                  <div>
                    <p className="font-medium text-gray-700 mb-1">✅ Submit</p>
                    <p>Bubuksan ang iyong email app na may nakaformat na mensahe na naglalaman ng lahat ng iyong highlight data, handa nang isumite sa <strong>pvbarredo@gmail.com</strong>.</p>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
