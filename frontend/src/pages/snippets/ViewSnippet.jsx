import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { Light as SyntaxHighlighter } from "react-syntax-highlighter";
import { atomOneDark } from "react-syntax-highlighter/dist/esm/styles/hljs";
import {
  ArrowLeft,
  Copy,
  Check,
  Trash2,
  Edit,
  Calendar,
  Globe,
  Lock,
  User,
  Tag,
} from "lucide-react";
import { toast } from "react-hot-toast";
import Loader from "../../components/loader/Loader";
import {
  getSnippetById,
  deleteSnippet,
} from "../../store/thunks/snippet.thunk";

const ViewSnippet = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { snippet, loading } = useSelector((state) => state.snippet);
  const { user } = useSelector((state) => state.auth);

  const [copied, setCopied] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    if (id) {
      dispatch(getSnippetById(id));
    }
  }, [id, dispatch]);

  const handleCopy = () => {
    if (!snippet?.code) return;
    navigator.clipboard.writeText(snippet.code);
    setCopied(true);
    toast.success("Code copied to clipboard!");
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDelete = async () => {
    if (window.confirm("Are you sure you want to delete this snippet?")) {
      setIsDeleting(true);
      try {
        await dispatch(deleteSnippet(id)).unwrap();
        toast.success("Snippet deleted successfully");
        navigate("/snippets");
      } catch (error) {
        toast.error(error || "Failed to delete snippet");
        setIsDeleting(false);
      }
    }
  };

  if (loading || !snippet) return <Loader />;

  const isOwner =
    user?.user?._id === snippet?.owner?._id ||
    user?.user?._id === snippet?.owner?._id;

  return (
    <div className="min-h-screen bg-[#020617] py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-slate-400 hover:text-white mb-8 transition-colors group"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          Back to Library
        </button>

        <div className="flex flex-col md:flex-row md:items-start justify-between gap-6 mb-8">
          <div className="flex-1">
            <div className="flex flex-wrap items-center gap-3 mb-4">
              <h1 className="text-3xl md:text-4xl font-bold text-white leading-tight">
                {snippet.title}
              </h1>
              <span
                className={`px-3 py-1 rounded-full text-xs font-medium border flex items-center gap-1 ${
                  snippet.visibility === "public"
                    ? "bg-cyan-500/10 text-cyan-400 border-cyan-500/20"
                    : "bg-purple-500/10 text-purple-400 border-purple-500/20"
                }`}
              >
                {snippet.visibility === "public" ? (
                  <Globe className="w-3 h-3" />
                ) : (
                  <Lock className="w-3 h-3" />
                )}
                {snippet.visibility}
              </span>
            </div>

            <div className="flex flex-wrap items-center gap-4 text-sm text-slate-400">
              <span className="flex items-center gap-1.5 bg-slate-900 px-3 py-1.5 rounded-lg border border-slate-800">
                <User className="w-4 h-4 text-cyan-500" />
                {snippet.owner?.username || "Unknown Author"}
              </span>
              <span className="flex items-center gap-1.5 bg-slate-900 px-3 py-1.5 rounded-lg border border-slate-800">
                <Calendar className="w-4 h-4 text-cyan-500" />
                {new Date(snippet.createdAt).toLocaleDateString()}
              </span>
              <span className="flex items-center gap-1.5 bg-slate-900 px-3 py-1.5 rounded-lg border border-slate-800 uppercase font-mono text-cyan-400">
                {snippet.language}
              </span>
            </div>
          </div>

          {isOwner && (
            <div className="flex items-center gap-3 w-full md:w-auto">
              <button
                onClick={() => navigate(`/snippet/edit/${id}`)}
                className="flex items-center justify-center gap-2 px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-lg border border-slate-700 transition-all flex-1 md:flex-none"
              >
                <Edit className="w-4 h-4" /> Edit
              </button>
              <button
                onClick={handleDelete}
                disabled={isDeleting}
                className="flex items-center justify-center gap-2 px-4 py-2 bg-red-500/10 hover:bg-red-500/20 text-red-500 rounded-lg border border-red-500/20 transition-all flex-1 md:flex-none disabled:opacity-50"
              >
                <Trash2 className="w-4 h-4" />
                {isDeleting ? "Deleting..." : "Delete"}
              </button>
            </div>
          )}
        </div>

        <div className="bg-slate-900/50 p-6 rounded-xl border border-slate-800 mb-8 backdrop-blur-sm">
          <h3 className="text-lg font-semibold text-white mb-3 flex items-center gap-2">
            Description
          </h3>
          <p className="text-slate-300 leading-relaxed whitespace-pre-wrap">
            {snippet.description}
          </p>

          {snippet.tags && snippet.tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-6 pt-6 border-t border-slate-800/50">
              {snippet.tags.map((tag, idx) => (
                <span
                  key={idx}
                  className="text-xs text-slate-400 bg-slate-950 px-3 py-1.5 rounded-full border border-slate-800 flex items-center gap-1"
                >
                  <Tag className="w-3 h-3" /> {tag}
                </span>
              ))}
            </div>
          )}
        </div>

        <div className="rounded-xl overflow-hidden border border-slate-700 bg-[#1e1e1e] shadow-2xl relative group">
          <div className="flex items-center justify-between px-4 py-3 bg-slate-900 border-b border-slate-700">
            <div className="flex gap-2">
              <div className="w-3 h-3 rounded-full bg-red-500/50" />
              <div className="w-3 h-3 rounded-full bg-yellow-500/50" />
              <div className="w-3 h-3 rounded-full bg-green-500/50" />
            </div>
            <button
              onClick={handleCopy}
              className="flex items-center gap-2 text-xs text-slate-400 hover:text-white transition-colors bg-slate-800 px-3 py-1.5 rounded-md border border-slate-700 hover:border-slate-600"
            >
              {copied ? (
                <Check className="w-3 h-3 text-green-400" />
              ) : (
                <Copy className="w-3 h-3" />
              )}
              {copied ? "Copied!" : "Copy Code"}
            </button>
          </div>

          <div className="relative">
            <SyntaxHighlighter
              language={snippet.language.toLowerCase()}
              style={atomOneDark}
              customStyle={{
                margin: 0,
                padding: "1.5rem",
                fontSize: "15px",
                lineHeight: "1.6",
                backgroundColor: "#0d1117",
                minHeight: "200px",
              }}
              showLineNumbers={true}
              wrapLines={true}
              lineProps={{
                style: { wordBreak: "break-all", whiteSpace: "pre-wrap" },
              }}
            >
              {snippet.code}
            </SyntaxHighlighter>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ViewSnippet;
