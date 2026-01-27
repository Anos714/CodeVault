import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import Editor from "@monaco-editor/react";
import {
  ArrowLeft,
  Save,
  Type,
  Code2,
  Globe,
  Lock,
  FileText,
  Tag,
} from "lucide-react";
import { toast } from "react-hot-toast";
import Loader from "../../components/loader/Loader";
import {
  getSnippetById,
  updateSnippet,
} from "../../store/thunks/snippet.thunk";

const LANGUAGES = [
  "javascript",
  "python",
  "java",
  "cpp",
  "csharp",
  "php",
  "ruby",
  "go",
  "rust",
  "sql",
  "html",
  "css",
  "json",
  "typescript",
  "yaml",
];

const EditSnippet = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { snippet, loading } = useSelector((state) => state.snippet);

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    language: "javascript",
    code: "",
    visibility: "private",
    tags: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (id) {
      dispatch(getSnippetById(id));
    }
  }, [id, dispatch]);

  useEffect(() => {
    if (snippet) {
      setFormData({
        title: snippet.title || "",
        description: snippet.description || "",
        language: snippet.language || "javascript",
        code: snippet.code || "",
        visibility: snippet.visibility || "private",
        tags: snippet.tags ? snippet.tags.join(", ") : "",
      });
    }
  }, [snippet]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleEditorChange = (value) => {
    setFormData({ ...formData, code: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    const payload = {
      ...formData,
      tags: formData.tags
        .split(",")
        .map((tag) => tag.trim())
        .filter((t) => t),
    };

    try {
      await dispatch(updateSnippet({ id, data: payload })).unwrap();
      toast.success("Snippet updated successfully!");
      navigate(`/snippet/${id}`);
    } catch (error) {
      toast.error(error || "Failed to update snippet");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading && !snippet) return <Loader />;

  return (
    <div className="min-h-screen bg-[#020617] py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors group"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            Cancel & Back
          </button>
          <h1 className="text-2xl font-bold text-white">Edit Snippet</h1>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
            <div className="md:col-span-6 space-y-2">
              <label className="text-sm font-medium text-slate-400 flex items-center gap-2">
                <Type className="w-4 h-4" /> Title
              </label>
              <input
                type="text"
                name="title"
                required
                value={formData.title}
                onChange={handleChange}
                placeholder="e.g. Connect MongoDB with Mongoose"
                className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-all placeholder:text-slate-600"
              />
            </div>

            <div className="md:col-span-3 space-y-2">
              <label className="text-sm font-medium text-slate-400 flex items-center gap-2">
                <Code2 className="w-4 h-4" /> Language
              </label>
              <div className="relative">
                <select
                  name="language"
                  value={formData.language}
                  onChange={handleChange}
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-cyan-500 appearance-none cursor-pointer"
                >
                  {LANGUAGES.map((lang) => (
                    <option key={lang} value={lang}>
                      {lang.charAt(0).toUpperCase() + lang.slice(1)}
                    </option>
                  ))}
                </select>
                <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none">
                  <span className="text-slate-500 text-xs">▼</span>
                </div>
              </div>
            </div>

            <div className="md:col-span-3 space-y-2">
              <label className="text-sm font-medium text-slate-400 flex items-center gap-2">
                {formData.visibility === "public" ? (
                  <Globe className="w-4 h-4" />
                ) : (
                  <Lock className="w-4 h-4" />
                )}
                Visibility
              </label>
              <select
                name="visibility"
                value={formData.visibility}
                onChange={handleChange}
                className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-cyan-500 appearance-none cursor-pointer"
              >
                <option value="public">Public (Everyone)</option>
                <option value="private">Private (Only Me)</option>
              </select>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-400 flex items-center gap-2">
              <FileText className="w-4 h-4" /> Description
            </label>
            <textarea
              name="description"
              rows="3"
              value={formData.description}
              onChange={handleChange}
              placeholder="Explain what this code does..."
              className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-cyan-500 transition-all placeholder:text-slate-600 resize-none"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-400 flex items-center gap-2">
              <Tag className="w-4 h-4" /> Tags (comma separated)
            </label>
            <input
              type="text"
              name="tags"
              value={formData.tags}
              onChange={handleChange}
              placeholder="react, hooks, frontend"
              className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-cyan-500 transition-all placeholder:text-slate-600"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-400">Code</label>
            <div className="rounded-lg overflow-hidden border border-slate-700 bg-[#1e1e1e] shadow-xl">
              <Editor
                height="500px"
                language={formData.language}
                value={formData.code}
                theme="vs-dark"
                onChange={handleEditorChange}
                options={{
                  minimap: { enabled: false },
                  fontSize: 16,
                  wordWrap: "on",
                  padding: { top: 20 },
                  scrollBeyondLastLine: false,
                }}
              />
            </div>
          </div>

          <div className="flex items-center justify-end gap-4 pt-6">
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="px-6 py-3 rounded-lg text-slate-300 hover:text-white hover:bg-slate-800 transition-all"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-8 py-3 bg-cyan-600 hover:bg-cyan-500 text-white rounded-lg font-medium shadow-lg shadow-cyan-500/20 transition-all flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? (
                "Updating..."
              ) : (
                <>
                  <Save className="w-4 h-4" /> Update Snippet
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditSnippet;
