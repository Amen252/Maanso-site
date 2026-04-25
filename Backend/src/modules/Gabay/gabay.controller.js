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
    const gabays = await Gabay.find().populate('author', 'username');
    res.status(200).json(gabays);
  } catch (error) {
    res.status(500).json({ message: "Error fetching gabays", error: error.message });
  }
};

export const getGabayById = async (req, res) => {
  try {
    const gabay = await Gabay.findById(req.params.id).populate('author', 'username');
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
