import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Editor from "@monaco-editor/react";
import { Light as SyntaxHighlighter } from "react-syntax-highlighter";
import { atomOneDark } from "react-syntax-highlighter/dist/esm/styles/hljs";
import { toast } from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import {
  Code,
  Type,
  FileText,
  Hash,
  Eye,
  Edit3,
  Globe,
  Lock,
  ArrowBigLeft,
  ArrowLeft,
} from "lucide-react";
import { useDispatch } from "react-redux";
import { snippetSchema } from "../../utils/snippet";
import { addSnippet } from "../../store/thunks/snippet.thunk";

const AddSnippet = () => {
  const [language, setLanguage] = useState("javascript");
  const [isPreview, setIsPreview] = useState(false);
  const [codeValue, setCodeValue] = useState("// Write your code here...");

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(snippetSchema),
    defaultValues: {
      title: "",
      language: "javascript",
      code: "// Write your code here...",
      tags: "",
      visibility: "private",
    },
  });

  const currentVisibility = watch("visibility");

  useEffect(() => {
    register("code");
    setValue("code", "// Write your code here...");
  }, [register, setValue]);

  const handleEditorChange = (value) => {
    setCodeValue(value);
    setValue("code", value, { shouldValidate: true });
  };

  const onSubmit = async (data) => {
    const toastId = toast.loading("Saving snippet...");
    try {
      const formattedData = {
        ...data,
        tags: data.tags ? data.tags.split(",").map((tag) => tag.trim()) : [],
      };

      await dispatch(addSnippet(formattedData)).unwrap();

      toast.success("Snippet added successfully!", { id: toastId });
      navigate("/snippets");
    } catch (error) {
      toast.error(error?.message || "Failed to add snippet", { id: toastId });
    }
  };

  const labelStyle =
    "block text-sm font-medium text-gray-400 mb-2 flex items-center gap-2";
  const inputStyle =
    "w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all";

  return (
    <div className="min-h-screen bg-[#020617] py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h2
            onClick={() => navigate("/snippets")}
            className="text-sm text-white flex gap-2 pb-2 cursor-pointer"
          >
            <ArrowLeft /> Back to Library
          </h2>
          <h2 className="text-3xl font-bold text-white">Create New Snippet</h2>
          <p className="text-slate-400 mt-2">
            Save your code logic for future use.
          </p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className={labelStyle}>
                <Type className="w-4 h-4 text-cyan-500" /> Title
              </label>
              <input
                {...register("title")}
                type="text"
                placeholder="e.g. JWT Authentication Middleware"
                className={inputStyle}
              />
              {errors.title && (
                <p className="text-red-400 text-xs mt-1">
                  {errors.title.message}
                </p>
              )}
            </div>

            <div>
              <label className={labelStyle}>
                <Code className="w-4 h-4 text-cyan-500" /> Language
              </label>
              <select
                {...register("language")}
                onChange={(e) => {
                  setLanguage(e.target.value);
                  setValue("language", e.target.value);
                }}
                className={inputStyle}
              >
                <option value="javascript">JavaScript</option>
                <option value="typescript">TypeScript</option>
                <option value="python">Python</option>
                <option value="java">Java</option>
                <option value="cpp">C++</option>
                <option value="html">HTML</option>
                <option value="css">CSS</option>
                <option value="sql">SQL</option>
              </select>
            </div>
          </div>

          <div>
            <label className={labelStyle}>
              <FileText className="w-4 h-4 text-cyan-500" /> Description
            </label>
            <textarea
              {...register("description")}
              rows="3"
              placeholder="Explain what this snippet does..."
              className={inputStyle}
            />
            {errors.description && (
              <p className="text-red-400 text-xs mt-1">
                {errors.description.message}
              </p>
            )}
          </div>

          <div className="border border-slate-700 rounded-xl overflow-hidden bg-[#1e1e1e]">
            <div className="flex items-center justify-between px-4 py-2 bg-slate-900 border-b border-slate-700">
              <span className="text-sm text-slate-400 font-mono">
                Editor ({language})
              </span>
              <button
                type="button"
                onClick={() => setIsPreview(!isPreview)}
                className="flex items-center gap-2 text-xs bg-slate-800 hover:bg-slate-700 text-white px-3 py-1.5 rounded-md transition-colors"
              >
                {isPreview ? (
                  <>
                    <Edit3 className="w-3 h-3" /> Edit Mode
                  </>
                ) : (
                  <>
                    <Eye className="w-3 h-3" /> Preview Mode
                  </>
                )}
              </button>
            </div>

            <div className="h-[400px]">
              {isPreview ? (
                <SyntaxHighlighter
                  language={language}
                  style={atomOneDark}
                  customStyle={{
                    height: "100%",
                    margin: 0,
                    padding: "1.5rem",
                    fontSize: "14px",
                    backgroundColor: "#0d1117",
                  }}
                  showLineNumbers={true}
                >
                  {codeValue}
                </SyntaxHighlighter>
              ) : (
                <Editor
                  height="100%"
                  language={language}
                  theme="vs-dark"
                  value={codeValue}
                  onChange={handleEditorChange}
                  options={{
                    minimap: { enabled: false },
                    fontSize: 14,
                    scrollBeyondLastLine: false,
                    automaticLayout: true,
                    padding: { top: 16, bottom: 16 },
                  }}
                />
              )}
            </div>
          </div>
          {errors.code && (
            <p className="text-red-400 text-xs">{errors.code.message}</p>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className={labelStyle}>
                <Hash className="w-4 h-4 text-cyan-500" /> Tags (comma
                separated)
              </label>
              <input
                {...register("tags")}
                type="text"
                placeholder="react, hooks, auth"
                className={inputStyle}
              />
            </div>

            <div>
              <label className={labelStyle}>
                {currentVisibility === "public" ? (
                  <Globe className="w-4 h-4 text-cyan-500" />
                ) : (
                  <Lock className="w-4 h-4 text-cyan-500" />
                )}
                Visibility
              </label>

              <div className="grid grid-cols-2 gap-4">
                <div
                  onClick={() => setValue("visibility", "public")}
                  className={`cursor-pointer border rounded-lg p-3 flex items-center gap-3 transition-all ${
                    currentVisibility === "public"
                      ? "bg-cyan-500/10 border-cyan-500"
                      : "bg-slate-900 border-slate-700 hover:border-slate-600"
                  }`}
                >
                  <div
                    className={`p-2 rounded-full ${currentVisibility === "public" ? "bg-cyan-500 text-white" : "bg-slate-800 text-slate-400"}`}
                  >
                    <Globe className="w-4 h-4" />
                  </div>
                  <div>
                    <p
                      className={`text-sm font-semibold ${currentVisibility === "public" ? "text-white" : "text-slate-300"}`}
                    >
                      Public
                    </p>
                    <p className="text-xs text-slate-500">Everyone can see</p>
                  </div>
                  <input
                    type="radio"
                    value="public"
                    {...register("visibility")}
                    className="hidden"
                  />
                </div>

                <div
                  onClick={() => setValue("visibility", "private")}
                  className={`cursor-pointer border rounded-lg p-3 flex items-center gap-3 transition-all ${
                    currentVisibility === "private"
                      ? "bg-cyan-500/10 border-cyan-500"
                      : "bg-slate-900 border-slate-700 hover:border-slate-600"
                  }`}
                >
                  <div
                    className={`p-2 rounded-full ${currentVisibility === "private" ? "bg-cyan-500 text-white" : "bg-slate-800 text-slate-400"}`}
                  >
                    <Lock className="w-4 h-4" />
                  </div>
                  <div>
                    <p
                      className={`text-sm font-semibold ${currentVisibility === "private" ? "text-white" : "text-slate-300"}`}
                    >
                      Private
                    </p>
                    <p className="text-xs text-slate-500">Only you can see</p>
                  </div>
                  <input
                    type="radio"
                    value="private"
                    {...register("visibility")}
                    className="hidden"
                  />
                </div>
              </div>
            </div>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-semibold py-3.5 rounded-lg shadow-lg shadow-cyan-500/20 transition-all transform active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {isSubmitting ? "Creating Snippet..." : "Save Snippet"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddSnippet;
