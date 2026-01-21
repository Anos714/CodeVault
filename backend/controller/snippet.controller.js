import { SnippetModel } from "../models/Snippet.model.js";
import { snippetSchema } from "../validations/snippet.validation.js";

export const getAllSnippets = async (req, res, next) => {
  try {
    const page = req.query.page || 1;
    const limit = req.query.limit || 10;
    const skip = (page - 1) * limit;

    let query = { visibility: "public" };

    if (req.query.search) {
      query = {
        ...query,
        $or: [
          { title: { $regex: req.query.search, $options: "i" } },
          { description: { $regex: req.query.search, $options: "i" } },
          { tags: { $regex: req.query.search, $options: "i" } },
        ],
      };
    }

    const publicSnippets = await SnippetModel.find(query)
      .populate({
        path: "owner",
        select: "username",
      })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const totalPublicSnippets = await SnippetModel.countDocuments(query);
    return res.status(200).json({
      success: true,
      data: publicSnippets,
      pagination: {
        totalItems: totalPublicSnippets,
        totalPages: Math.ceil(totalPublicSnippets / limit),
        currentPage: page,
        itemsPerPage: limit,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const getSingleSnippetDetail = async (req, res, next) => {
  try {
    const { id } = req.params;
    const snippetDetails = await SnippetModel.findById(id).populate({
      path: "owner",
      select: "username",
    });
    if (!snippetDetails) {
      res.status(404);
      throw new Error("Code snippet not found");
    }

    if (snippetDetails.visibility === "private") {
      const isOwner =
        req.user &&
        req.user._id.toString() === snippetDetails.owner._id.toString();

      if (!isOwner) {
        res.status(403);
        throw new Error("This snippet is private. You don't have access.");
      }
    }

    return res.status(200).json({
      success: true,
      data: snippetDetails,
    });
  } catch (error) {
    next(error);
  }
};

export const getUserSnippets = async (req, res, next) => {
  try {
    const page = req.query.page || 1;
    const limit = req.query.limit || 10;
    const skip = (page - 1) * limit;

    let query = { visibility: "private" };

    if (req.query.search) {
      query = {
        ...query,
        $or: [
          { title: { $regex: req.query.search, $options: "i" } },
          { description: { $regex: req.query.search, $options: "i" } },
          { tags: { $regex: req.query.search, $options: "i" } },
        ],
      };
    }

    const privateSnippets = await SnippetModel.find(query)
      .populate({
        path: "owner",
        select: "username",
      })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const totalPrivateSnippets = await SnippetModel.countDocuments(query);
    return res.status(200).json({
      success: true,
      data: privateSnippets,
      pagination: {
        totalItems: totalPrivateSnippets,
        totalPages: Math.ceil(totalPrivateSnippets / limit),
        currentPage: page,
        itemsPerPage: limit,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const addSnippet = async (req, res, next) => {
  try {
    const { error, value } = snippetSchema.validate(req.body);
    if (error) {
      return res.status(400).json({
        success: false,
        msg: error.details[0].message,
      });
    }

    const { title, description, code, language, tags, visibility } = value;
    const uniqueTags = tags ? [...new Set(tags)] : [];

    const snippet = await SnippetModel.create({
      title,
      description,
      code,
      language,
      tags: uniqueTags,
      visibility,
      owner: req.user._id,
    });

    return res.status(201).json({
      success: true,
      msg: "snippet added successfully",
      snippet,
    });
  } catch (error) {
    next(error);
  }
};

export const updateSnippet = async (req, res, next) => {
  try {
  } catch (error) {
    next(error);
  }
};

export const deleteSnippet = async (req, res, next) => {
  try {
  } catch (error) {
    next(error);
  }
};
