import { useState } from "react";
import axios from "axios";

const BASE_URL = 'https://log-parsing-and-alerting-system-production.up.railway.app';
// const BASE_URL = "http://localhost:3000";
const App = () => {
  const [activeTab, setActiveTab] = useState("logAnalyzer");
  const [file, setFile] = useState(null);
  const [logResult, setLogResult] = useState("");
  const [urlResult, setUrlResult] = useState("");
  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(false);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleUpload = async () => {
    if (!file) {
      alert("Please select a file");
      return;
    }

    const formData = new FormData();
    formData.append("logfile", file);

    setLoading(true);
    try {
      const response = await axios.post(`${BASE_URL}/analyze`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setLogResult(response.data.alerts.join("\n"));
    } catch (error) {
      console.error("Error uploading file:", error);
      setLogResult("Failed to analyze the log file.");
    } finally {
      setLoading(false);
    }
  };

  const handleUrlScan = async () => {
    setLoading(true);
    try {
      const response = await axios.post(`${BASE_URL}/scan`, { targetUrl: url });
      setUrlResult(response.data.vulnerabilities.join("\n"));
    } catch (error) {
      console.error("Error scanning URL:", error);
      setUrlResult("Failed to scan the URL.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-gray-900 to-gray-700 text-white p-6">
      <div className="bg-gray-800 shadow-xl rounded-lg p-6 w-full max-w-md">
        <h1 className="text-3xl font-bold text-center mb-6">Security Tools</h1>

        {/* Tab Navigation */}
        <div className="flex justify-center mb-4 gap-5">
          <button
            className={`px-4 py-2 rounded-lg ${
              activeTab === "logAnalyzer"
                ? "bg-gray-700"
                : "bg-gray-600 hover:bg-gray-500"
            }`}
            onClick={() => setActiveTab("logAnalyzer")}
          >
            System Monitor
          </button>
          <button
            className={`px-4 py-2 rounded-lg ${
              activeTab === "webScanner"
                ? "bg-gray-700"
                : "bg-gray-600 hover:bg-gray-500"
            }`}
            onClick={() => setActiveTab("webScanner")}
          >
            WebScanCrawler
          </button>
        </div>

        {/* Log Analyzer Tab */}
        {activeTab === "logAnalyzer" && (
          <div className="flex flex-col items-center space-y-4">
            <div className="space-y-2 text-center">
              <div className="text-gray-300 text-sm">
                (Please select a log file that is utf-8 encoded)
              </div>
              <div className="text-gray-300 text-sm">
                ( For eg.: .txt, .log files )
              </div>
            </div>
            <label className="cursor-pointer bg-gray-700 hover:bg-gray-600 transition px-4 py-2 rounded-lg text-sm">
              Select Log File
              <input
                type="file"
                onChange={handleFileChange}
                className="hidden"
              />
            </label>

            {file && <p className="text-sm text-gray-300">{file.name}</p>}
            <button
              onClick={handleUpload}
              className={`px-6 py-2 rounded-lg text-lg font-medium transition ${
                loading
                  ? "bg-gray-500 cursor-not-allowed"
                  : "bg-blue-500 hover:bg-blue-400"
              }`}
              disabled={loading}
            >
              {loading ? "Analyzing..." : "Analyze"}
            </button>
          </div>
        )}

        {/* Web URL Scanner Tab */}
        {activeTab === "webScanner" && (
          <div className="flex flex-col items-center space-y-4">
            <div className="space-y-2 text-center">
              <div className="text-gray-300 text-sm">
                (Please enter the full web url)
              </div>
              <div className="text-gray-300 text-sm">
                (For eg.: https://example.com/)
              </div>
            </div>
            <input
              type="text"
              placeholder="Enter URL to scan"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              className="w-full px-4 py-2 rounded-lg bg-gray-700 text-white"
            />
            <button
              onClick={handleUrlScan}
              className={`px-6 py-2 rounded-lg text-lg font-medium transition ${
                loading
                  ? "bg-gray-500 cursor-not-allowed"
                  : "bg-green-500 hover:bg-green-400"
              }`}
              disabled={loading}
            >
              {loading ? "Scanning..." : "Scan URL"}
            </button>
          </div>
        )}
      </div>

      {/* Results */}
      {activeTab === "logAnalyzer" && logResult && (
        <div className="mt-6 bg-gray-900 text-green-400 p-4 rounded-lg w-full max-w-4xl shadow-lg overflow-auto max-h-80 border border-green-500">
          <h2 className="text-lg font-semibold mb-2">Analysis Results:</h2>
          <pre className="whitespace-pre-wrap break-words">{logResult}</pre>
        </div>
      )}

      {activeTab === "webScanner" && urlResult && (
        <div className="mt-6 bg-gray-900 text-green-400 p-4 rounded-lg w-full max-w-4xl shadow-lg overflow-auto max-h-80 border border-green-500">
          <h2 className="text-lg font-semibold mb-2">Scan Results:</h2>
          <pre className="whitespace-pre-wrap break-words">{urlResult}</pre>
        </div>
      )}
    </div>
  );
};

export default App;
