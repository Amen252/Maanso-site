import Gabay from './gabay.model.js';
import defineAbilitiesFor from '../../config/ability.js';

export const createGabay = async (req, res) => {
  try {
    const ability = defineAbilitiesFor(req.user);

    if (ability.cannot('create', 'Gabay')) {
      return res.status(403).json({ message: "You don't have permission to create poems." });
    }

    const gabay = new Gabay({
      ...req.body,
      author: req.user._id
    });

    await gabay.save();
    res.status(201).json({ message: "Gabay created successfully", gabay });
  } catch (error) {
    res.status(500).json({ message: "Error creating gabay", error: error.message });
  }
};

export const getAllGabays = async (req, res) => {
  try {
    const gabays = await Gabay.find()
      .populate('author', 'username')
      .populate('comments.author', 'username');
    res.status(200).json(gabays);
  } catch (error) {
    res.status(500).json({ message: "Error fetching gabays", error: error.message });
  }
};

export const getGabayById = async (req, res) => {
  try {
    const gabay = await Gabay.findById(req.params.id)
      .populate('author', 'username')
      .populate('comments.author', 'username');
    if (!gabay) return res.status(404).json({ message: "Gabay not found" });
    res.status(200).json(gabay);
  } catch (error) {
    res.status(500).json({ message: "Error fetching gabay", error: error.message });
  }
};

export const updateGabay = async (req, res) => {
  try {
    const gabay = await Gabay.findById(req.params.id);
    if (!gabay) return res.status(404).json({ message: "Gabay not found" });

    const ability = defineAbilitiesFor(req.user);

    if (ability.cannot('update', gabay)) {
      return res.status(403).json({ message: "You don't have permission to update this gabay." });
    }

    Object.assign(gabay, req.body);
    await gabay.save();

    res.status(200).json({ message: "Gabay updated successfully", gabay });
  } catch (error) {
    res.status(500).json({ message: "Error updating gabay", error: error.message });
  }
};

export const deleteGabay = async (req, res) => {
  try {
    const gabay = await Gabay.findById(req.params.id);
    if (!gabay) return res.status(404).json({ message: "Gabay not found" });

    const ability = defineAbilitiesFor(req.user);

    if (ability.cannot('delete', gabay)) {
      return res.status(403).json({ message: "You don't have permission to delete this gabay." });
    }

    await gabay.deleteOne();
    res.status(200).json({ message: "Gabay deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting gabay", error: error.message });
  }
};

// Toggle a like on a Gabay (poem)
export const toggleLike = async (req, res) => {
  try {
    const gabay = await Gabay.findById(req.params.id);
    if (!gabay) return res.status(404).json({ message: "Gabay not found" });

    const userId = req.user._id;
    const isLiked = gabay.likes.includes(userId);

    if (isLiked) {
      // Unlike
      gabay.likes = gabay.likes.filter(id => id.toString() !== userId.toString());
    } else {
      // Like
      gabay.likes.push(userId);
    }

    await gabay.save();

    res.status(200).json({
      success: true,
      message: isLiked ? "Unliked successfully" : "Liked successfully",
      likesCount: gabay.likes.length,
      isLiked: !isLiked
    });
  } catch (error) {
    res.status(500).json({ message: "Error toggling like", error: error.message });
  }
};

// Add a comment to a Gabay (poem)
export const addComment = async (req, res) => {
  const { content } = req.body;
  if (!content || !content.trim()) {
    return res.status(400).json({ message: "Comment content is required" });
  }

  try {
    const gabay = await Gabay.findById(req.params.id);
    if (!gabay) return res.status(404).json({ message: "Gabay not found" });

    const newComment = {
      author: req.user._id,
      content: content.trim()
    };

    gabay.comments.push(newComment);
    await gabay.save();

    // Populate the newly added comment's author details
    const populatedGabay = await Gabay.findById(req.params.id)
      .populate('comments.author', 'username');

    const addedComment = populatedGabay.comments[populatedGabay.comments.length - 1];

    res.status(201).json({
      success: true,
      message: "Comment added successfully",
      comment: addedComment
    });
  } catch (error) {
    res.status(500).json({ message: "Error adding comment", error: error.message });
  }
};

// Delete a comment
export const deleteComment = async (req, res) => {
  const { id, commentId } = req.params;

  try {
    const gabay = await Gabay.findById(id);
    if (!gabay) return res.status(404).json({ message: "Gabay not found" });

    const comment = gabay.comments.id(commentId);
    if (!comment) return res.status(404).json({ message: "Comment not found" });

    // Authorization: only the comment author, poem author, or an Admin can delete a comment
    const isCommentAuthor = comment.author.toString() === req.user._id.toString();
    const isPoemAuthor = gabay.author.toString() === req.user._id.toString();
    const isAdmin = req.user.role === 'Admin';

    if (!isCommentAuthor && !isPoemAuthor && !isAdmin) {
      return res.status(403).json({ message: "You are not authorized to delete this comment" });
    }

    gabay.comments.pull(commentId);
    await gabay.save();

    res.status(200).json({
      success: true,
      message: "Comment deleted successfully"
    });
  } catch (error) {
    res.status(500).json({ message: "Error deleting comment", error: error.message });
  }
};
