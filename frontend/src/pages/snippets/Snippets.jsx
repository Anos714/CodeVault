import React, { useState } from "react";
import {
  Search,
  Code2,
  User,
  Calendar,
  X,
  Copy,
  Check,
  Loader2,
} from "lucide-react";

const INITIAL_SNIPPETS = [
  {
    id: 1,
    title: "React UseOnClickOutside Hook",
    language: "javascript",
    author: "admin_user",
    date: "2024-03-10",
    description:
      "A custom hook to detect clicks outside a specific element. Useful for modals and dropdowns.",
    code: `import { useEffect } from "react";\n\nfunction useOnClickOutside(ref, handler) {\n  useEffect(() => {\n    const listener = (event) => {\n      if (!ref.current || ref.current.contains(event.target)) {\n        return;\n      }\n      handler(event);\n    };\n    document.addEventListener("mousedown", listener);\n    document.addEventListener("touchstart", listener);\n    return () => {\n      document.removeEventListener("mousedown", listener);\n      document.removeEventListener("touchstart", listener);\n    };\n  }, [ref, handler]);\n}`,
  },
  {
    id: 2,
    title: "Python File Reader",
    language: "python",
    author: "py_master",
    date: "2024-03-12",
    description:
      "Simple function to safely read a file and handle errors if the file does not exist.",
    code: `def read_file_safely(file_path):\n    try:\n        with open(file_path, 'r') as file:\n            return file.read()\n    except FileNotFoundError:\n        return "Error: File not found."\n    except Exception as e:\n        return f"An error occurred: {e}"`,
  },
  {
    id: 3,
    title: "CSS Glassmorphism",
    language: "css",
    author: "design_pro",
    date: "2024-03-15",
    description:
      "Modern glassmorphism effect using backdrop-filter for blurred background.",
    code: `.glass-card {\n  background: rgba(255, 255, 255, 0.1);\n  box-shadow: 0 4px 30px rgba(0, 0, 0, 0.1);\n  backdrop-filter: blur(10px);\n  -webkit-backdrop-filter: blur(10px);\n  border: 1px solid rgba(255, 255, 255, 0.3);\n  border-radius: 16px;\n}`,
  },
  {
    id: 4,
    title: "Debounce Function",
    language: "javascript",
    author: "js_ninja",
    date: "2024-03-18",
    description:
      "Classic debounce implementation to limit the rate at which a function fires.",
    code: `function debounce(func, wait) {\n  let timeout;\n  return function executedFunction(...args) {\n    const later = () => {\n      clearTimeout(timeout);\n      func(...args);\n    };\n    clearTimeout(timeout);\n    timeout = setTimeout(later, wait);\n  };\n}`,
  },
];

const Snippets = () => {
  const [snippets, setSnippets] = useState(INITIAL_SNIPPETS);
  const [selectedSnippet, setSelectedSnippet] = useState(null);
  const [copied, setCopied] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleCopy = (code) => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleLoadMore = async () => {
    setIsLoading(true);

    // Simulating Server Delay
    await new Promise((resolve) => setTimeout(resolve, 1500));

    // Mocking new data from server
    const moreSnippets = [
      {
        id: snippets.length + 1,
        title: `Dynamic Snippet ${snippets.length + 1}`,
        language: "javascript",
        author: "new_user",
        date: "2024-03-20",
        description:
          "This is a dynamically loaded snippet to demonstrate server-side pagination.",
        code: `console.log("Loaded snippet ${snippets.length + 1}");`,
      },
      {
        id: snippets.length + 2,
        title: `Dynamic Snippet ${snippets.length + 2}`,
        language: "python",
        author: "backend_dev",
        date: "2024-03-21",
        description:
          "Another dynamically loaded snippet appearing after the button click.",
        code: `print("Loaded snippet ${snippets.length + 2}")`,
      },
    ];

    setSnippets((prev) => [...prev, ...moreSnippets]);
    setIsLoading(false);
  };

  return (
    <div className="min-h-screen w-full bg-gray-950 text-white p-6 sm:p-8 pb-20">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6 mb-12">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-white">
              Public Snippets
            </h1>
            <p className="mt-2 text-gray-400">
              Explore and share useful code snippets with the community.
            </p>
          </div>

          <div className="relative w-full md:w-96">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search snippets or languages..."
              className="block w-full rounded-xl border-0 bg-[#090d22] py-3 pl-10 pr-4 text-white ring-1 ring-white/10 placeholder:text-gray-500 focus:ring-2 focus:ring-indigo-500 transition-all"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {snippets.length > 0 ? (
            snippets.map((snippet) => (
              <div
                key={snippet.id}
                onClick={() => setSelectedSnippet(snippet)}
                className="group relative flex flex-col justify-between rounded-xl bg-[#090d22] p-6 shadow-lg ring-1 ring-white/10 hover:ring-indigo-500/50 hover:shadow-indigo-500/10 transition-all duration-300 cursor-pointer transform hover:-translate-y-1"
              >
                <div>
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-2">
                      <span
                        className={`inline-flex items-center rounded-md px-2 py-1 text-xs font-medium ring-1 ring-inset ${
                          snippet.language === "javascript"
                            ? "bg-yellow-400/10 text-yellow-400 ring-yellow-400/20"
                            : snippet.language === "python"
                              ? "bg-blue-400/10 text-blue-400 ring-blue-400/20"
                              : snippet.language === "css"
                                ? "bg-pink-400/10 text-pink-400 ring-pink-400/20"
                                : "bg-gray-400/10 text-gray-400 ring-gray-400/20"
                        }`}
                      >
                        {snippet.language}
                      </span>
                    </div>
                    <Code2 className="h-5 w-5 text-gray-500 group-hover:text-indigo-400 transition-colors" />
                  </div>

                  <h3 className="text-xl font-semibold text-white group-hover:text-indigo-300 transition-colors">
                    {snippet.title}
                  </h3>
                  <p className="mt-3 text-sm text-gray-400 line-clamp-2">
                    {snippet.description}
                  </p>
                </div>

                <div className="mt-6 flex items-center justify-between text-xs text-gray-500 border-t border-white/5 pt-4">
                  <div className="flex items-center gap-1.5">
                    <User className="h-3.5 w-3.5" />
                    <span>{snippet.author}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Calendar className="h-3.5 w-3.5" />
                    <span>{snippet.date}</span>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="col-span-full text-center py-20">
              <Code2 className="h-12 w-12 text-gray-600 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-white">
                No snippets found
              </h3>
              <p className="text-gray-400">Try adjusting your search query.</p>
            </div>
          )}
        </div>

        {/* Load More Button */}
        <div className="flex justify-center w-full">
          <button
            onClick={handleLoadMore}
            disabled={isLoading}
            className="flex items-center gap-2 rounded-lg bg-indigo-600 px-6 py-3 text-sm font-semibold text-white shadow-md hover:bg-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:ring-offset-2 focus:ring-offset-gray-900 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
          >
            {isLoading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Loading...
              </>
            ) : (
              "Load More Snippets"
            )}
          </button>
        </div>
      </div>

      {selectedSnippet && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
          <div className="relative w-full max-w-3xl rounded-xl bg-[#0b0f29] ring-1 ring-white/10 shadow-2xl flex flex-col max-h-[90vh]">
            <div className="flex items-center justify-between p-6 border-b border-white/10">
              <div>
                <h2 className="text-2xl font-bold text-white">
                  {selectedSnippet.title}
                </h2>
                <p className="text-sm text-gray-400 mt-1">
                  By{" "}
                  <span className="text-indigo-400">
                    @{selectedSnippet.author}
                  </span>{" "}
                  • {selectedSnippet.date}
                </p>
              </div>
              <button
                onClick={() => setSelectedSnippet(null)}
                className="rounded-lg p-2 hover:bg-white/10 transition-colors"
              >
                <X className="h-6 w-6 text-gray-400" />
              </button>
            </div>

            <div className="p-6 overflow-y-auto">
              <p className="text-gray-300 mb-6">
                {selectedSnippet.description}
              </p>

              <div className="relative group">
                <div className="flex items-center justify-between bg-black/30 px-4 py-2 rounded-t-lg border border-white/10 border-b-0">
                  <span className="text-xs text-gray-400 uppercase font-mono">
                    {selectedSnippet.language}
                  </span>
                  <button
                    onClick={() => handleCopy(selectedSnippet.code)}
                    className="flex items-center gap-1.5 text-xs text-gray-400 hover:text-white transition-colors"
                  >
                    {copied ? (
                      <Check className="h-3.5 w-3.5 text-green-400" />
                    ) : (
                      <Copy className="h-3.5 w-3.5" />
                    )}
                    {copied ? "Copied!" : "Copy code"}
                  </button>
                </div>

                <pre className="overflow-x-auto rounded-b-lg border border-white/10 bg-black/30 p-4 text-sm font-mono text-gray-300">
                  <code>{selectedSnippet.code}</code>
                </pre>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Snippets;
