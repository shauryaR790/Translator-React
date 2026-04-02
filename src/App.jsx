import React, { useState } from 'react';
import axios from 'axios';

const App = () => {
  // 1. State definitions
  const [inputText, setInputText] = useState('');
  const [resultText, setResultText] = useState('');
  const [targetLanguage, setTargetLanguage] = useState('gu'); 
  const [isLoading, setIsLoading] = useState(false);

  // 2. Translation Logic
  const handleTranslate = async () => {
    if (!inputText) return;
    setIsLoading(true);

    const options = {
      method: 'POST',
      url: 'https://aibit-translator.p.rapidapi.com/api/v1/translator/text',
      headers: {
        'content-type': 'application/json',
        'X-RapidAPI-Key': '4d3ac955a2msh5a1f83a2eb0e60bp1b3132jsn8c6ef6fe3f9f',
        'X-RapidAPI-Host': 'aibit-translator.p.rapidapi.com'
      },
      data: {
        from: 'en',
        to: targetLanguage,
        text: inputText,
        provider: 'google'
      }
    };

    try {
      const response = await axios.request(options);
      console.log("API Response:", response.data); 
      
      // We are checking every possible place the text could be
      const translated = response.data.trans || 
                         response.data.translated_text || 
                         response.data.text || 
                         (response.data.data && response.data.data.translations && response.data.data.translations[0].translatedText);
                         
      if (translated) {
        setResultText(translated);
      } else {
        // If it still fails, this will show you the raw data so you can see the key name
        setResultText("Key not found. Response: " + JSON.stringify(response.data).substring(0, 50));
      }
    } catch (error) {
      console.error("Translation Error:", error);
      setResultText("API Error. Check Console.");
    } finally {
      setIsLoading(false);
    }};// <--- Fixed the missing closing brace here!

  // 3. UI Layout
  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-6 font-sans">
      <div className="max-w-4xl w-full bg-white rounded-3xl shadow-2xl overflow-hidden flex flex-col md:flex-row">
        
        {/* Left Side: Input */}
        <div className="p-8 flex-1 border-b md:border-b-0 md:border-r border-gray-100">
          <h2 className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-4">English</h2>
          <textarea
            className="w-full h-64 text-xl text-gray-800 outline-none resize-none placeholder-gray-300"
            placeholder="Enter text to translate..."
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
          />
        </div>

        {/* Right Side: Output */}
        <div className="p-8 flex-1 bg-gray-50">
          <div className="flex justify-between items-center mb-4">
            <select 
              className="bg-transparent font-bold text-blue-600 outline-none cursor-pointer uppercase tracking-widest text-sm"
              value={targetLanguage}
              onChange={(e) => setTargetLanguage(e.target.value)}
            >
              <option value="gu">Gujarati</option>
              <option value="hi">Hindi</option>
              <option value="es">Spanish</option>
              <option value="fr">French</option>
              <option value="ja">Japanese</option>
            </select>
          </div>
          <div className="h-64 text-xl text-gray-700">
            {isLoading ? (
              <div className="animate-pulse flex space-x-2 pt-2">
                <div className="h-3 w-3 bg-blue-400 rounded-full"></div>
                <div className="h-3 w-3 bg-blue-400 rounded-full"></div>
                <div className="h-3 w-3 bg-blue-400 rounded-full"></div>
              </div>
            ) : (
              <p>{resultText || <span className="text-gray-300">Translation will appear here</span>}</p>
            )}
          </div>
        </div>
      </div>

      {/* Floating Action Button */}
      <button
        onClick={handleTranslate}
        disabled={isLoading}
        className="fixed bottom-10 right-10 bg-blue-600 text-white px-8 py-4 rounded-full font-bold shadow-lg hover:bg-blue-700 transition-all active:scale-95 disabled:bg-gray-400"
      >
        {isLoading ? "Translating..." : "Translate"}
      </button>
    </div>
  );
};

export default App;