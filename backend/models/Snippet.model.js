import mongoose from "mongoose";

const SnippetSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Snippet title is required"],
      trim: true,
    },
    description: {
      type: String,
      trim: true,
    },

    code: {
      type: String,
      required: [true, "Code content is required"],
      trim: true,
    },
    language: {
      type: String,
      required: true,
      default: "javascript",
    },
    tags: {
      type: [String],
      default: [],
    },
    visibility: {
      type: String,
      enum: ["public", "private"],
      default: "private",
      required: true,
    },
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true },
);

export const SnippetModel = mongoose.model("Snippet", SnippetSchema);
