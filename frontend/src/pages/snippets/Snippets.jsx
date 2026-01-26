import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Code,
  Terminal,
  Calendar,
  ArrowRight,
  Lock,
  Globe,
  User,
  Layers,
  Search,
  Loader2,
} from "lucide-react";
import {
  getAllPublicSnippets,
  getAllUserSnippets,
} from "../../store/thunks/snippet.thunk";
import { clearSnippets } from "../../store/slices/snippet.slice";
import Loader from "../../components/loader/Loader";

const Snippets = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState("my");
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);

  const { snippets, loading, totalPages, currentPage } = useSelector(
    (state) => state.snippet,
  );

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      if (activeTab === "my") {
        dispatch(getAllUserSnippets({ page, search }));
      } else {
        dispatch(getAllPublicSnippets({ page, search }));
      }
    }, 500);

    return () => clearTimeout(delayDebounceFn);
  }, [dispatch, activeTab, page, search]);

  const handleTabChange = (tab) => {
    if (tab === activeTab) return;
    dispatch(clearSnippets());
    setActiveTab(tab);
    setPage(1);
    setSearch("");
  };

  const handleSearchChange = (e) => {
    setSearch(e.target.value);
    setPage(1);
  };

  const loadMore = () => {
    if (page < totalPages) {
      setPage((prev) => prev + 1);
    }
  };

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.1 },
    },
  };

  const item = {
    hidden: { y: 20, opacity: 0 },
    show: { y: 0, opacity: 1 },
  };

  if (loading && page === 1 && snippets.length === 0) return <Loader />;

  return (
    <div className="min-h-screen bg-[#020617] py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col xl:flex-row justify-between items-end mb-10 gap-6">
          <div>
            <h2 className="text-3xl font-bold text-white">Code Library</h2>
            <p className="text-slate-400 mt-2">
              {activeTab === "my"
                ? "Manage your private collection."
                : "Explore public snippets from the community."}
            </p>
          </div>

          <div className="flex flex-col md:flex-row items-center gap-4 w-full xl:w-auto">
            <div className="relative w-full md:w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
              <input
                type="text"
                value={search}
                onChange={handleSearchChange}
                placeholder="Search snippets..."
                className="w-full bg-slate-900 border border-slate-800 rounded-lg pl-10 pr-4 py-2.5 text-white text-sm focus:ring-1 focus:ring-cyan-500 focus:border-cyan-500 outline-none transition-all placeholder:text-slate-600"
              />
            </div>

            <div className="flex items-center gap-4 w-full md:w-auto">
              <div className="bg-slate-900 p-1 rounded-lg border border-slate-800 flex items-center flex-1 md:flex-none">
                <button
                  onClick={() => handleTabChange("my")}
                  className={`flex items-center justify-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-all flex-1 md:flex-none ${
                    activeTab === "my"
                      ? "bg-slate-800 text-white shadow-sm border border-slate-700"
                      : "text-slate-400 hover:text-white"
                  }`}
                >
                  <User className="w-4 h-4" /> My Snippets
                </button>

                <button
                  onClick={() => handleTabChange("public")}
                  className={`flex items-center justify-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-all flex-1 md:flex-none ${
                    activeTab === "public"
                      ? "bg-cyan-600 text-white shadow-lg shadow-cyan-500/20"
                      : "text-slate-400 hover:text-white"
                  }`}
                >
                  <Globe className="w-4 h-4" /> Public Library
                </button>
              </div>

              <button
                onClick={() => navigate("/snippets/add")}
                className="bg-slate-800 hover:bg-slate-700 text-white p-2.5 rounded-lg border border-slate-700 transition-all"
                title="Create New Snippet"
              >
                <Layers className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>

        {!loading && snippets?.length === 0 && (
          <div className="text-center py-20 bg-slate-900/50 rounded-2xl border border-slate-800 border-dashed">
            <Code className="w-16 h-16 text-slate-600 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-white">
              {search
                ? "No results found"
                : activeTab === "my"
                  ? "No snippets found"
                  : "No public snippets yet"}
            </h3>
            <p className="text-slate-400 mt-2">
              {search
                ? "Try adjusting your search query."
                : activeTab === "my"
                  ? "Create your first code snippet to get started."
                  : "Be the first to share a snippet with the world."}
            </p>
          </div>
        )}

        <motion.div
          key={activeTab}
          variants={container}
          initial="hidden"
          animate="show"
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {snippets?.map((snippet) => (
            <motion.div
              key={snippet._id}
              variants={item}
              whileHover={{ y: -5 }}
              onClick={() => navigate(`/snippet/${snippet._id}`)}
              className="bg-slate-900 border border-slate-800 rounded-xl p-6 cursor-pointer group hover:border-cyan-500/50 hover:shadow-lg hover:shadow-cyan-500/10 transition-all relative overflow-hidden"
            >
              <div className="flex justify-between items-start mb-4">
                <div className="p-2 bg-slate-800 rounded-lg group-hover:bg-cyan-500/20 group-hover:text-cyan-400 transition-colors text-slate-400">
                  <Terminal className="w-6 h-6" />
                </div>

                <div
                  className={`text-xs px-2 py-1 rounded-full border flex items-center gap-1 ${
                    snippet.visibility === "public"
                      ? "border-cyan-500/20 text-cyan-500 bg-cyan-500/10"
                      : "border-slate-700 text-slate-500 bg-slate-800"
                  }`}
                >
                  {snippet.visibility === "public" ? (
                    <Globe className="w-3 h-3" />
                  ) : (
                    <Lock className="w-3 h-3" />
                  )}
                  {snippet.visibility}
                </div>
              </div>

              <h3 className="text-xl font-bold text-white mb-2 line-clamp-1 group-hover:text-cyan-400 transition-colors">
                {snippet.title}
              </h3>

              <p className="text-slate-400 text-sm mb-4 line-clamp-2 h-10">
                {snippet.description}
              </p>

              <div className="flex items-center gap-3 mb-4">
                <span className="px-2.5 py-1 rounded-md text-xs font-medium bg-slate-800 text-cyan-400 border border-slate-700 font-mono">
                  {snippet.language}
                </span>
                {snippet.tags?.slice(0, 2).map((tag, idx) => (
                  <span key={idx} className="text-xs text-slate-500">
                    #{tag}
                  </span>
                ))}
              </div>

              <div className="flex items-center justify-between pt-4 border-t border-slate-800 mt-auto">
                <div className="flex items-center gap-2 text-xs text-slate-500">
                  {activeTab === "public" ? (
                    <>
                      <User className="w-3 h-3" />
                      {snippet.owner?.username || "Unknown Dev"}
                    </>
                  ) : (
                    <>
                      <Calendar className="w-3 h-3" />
                      {new Date(snippet.createdAt).toLocaleDateString()}
                    </>
                  )}
                </div>
                <ArrowRight className="w-4 h-4 text-slate-500 group-hover:text-cyan-400 group-hover:translate-x-1 transition-all" />
              </div>
            </motion.div>
          ))}
        </motion.div>

        {totalPages > currentPage && (
          <div className="mt-12 flex justify-center">
            <button
              onClick={loadMore}
              disabled={loading}
              className="bg-slate-800 hover:bg-slate-700 text-white px-8 py-3 rounded-lg border border-slate-700 transition-all flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" /> Loading...
                </>
              ) : (
                "Load More"
              )}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Snippets;
