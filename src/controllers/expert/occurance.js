const Occurrence = require("../../models/occurenceModel")
const Upload = require("../../models/uploadModel")

async function getOccurrencesOfExpert(req, res) {
  const user = req.user; // Retrieved from middleware
      if (!user) {
        return res.status(401).json({ error: 'Unauthorized.' });
      }

  try {
    const occurrences = await Occurrence.find({ expertId: user.id }).populate('spotId speciesId expertId userId');
    
    if (occurrences.length === 0) {
      return res.status(404).json({ message: 'No occurrences found for this user' });
    }

    res.status(200).json(occurrences);
  } catch (error) {
    res.status(500).json({ message: 'Error retrieving occurrences', error });
  }
}

async function getOccurrenceById(req, res) {
    const { id } = req.params;
  
    try {
      const occurrence = await Occurrence.findById(id)
        .populate('spotId')
        .populate('speciesId')
        .populate('userId', 'name email')
        .populate('expertId', 'name email');
      
      if (!occurrence) {
        return res.status(404).json({ message: 'Occurrence not found' });
      }
      res.json(occurrence);
    } catch (error) {
      res.status(500).json({ message: 'Error retrieving occurrence details', error });
    }
  }
  async function getOccurrence(req, res) {
    try {
        const { searchTerm, startDate, endDate, sortBy } = req.query;
        const query = {};

        if (startDate || endDate) {
            query.createdAt = {};
            if (startDate) query.createdAt.$gte = new Date(startDate);
            if (endDate) query.createdAt.$lte = new Date(endDate);
        }

        const sortOption = {};
        if (sortBy == "recent") {
            sortOption.createdAt = -1;
        } else if (sortBy == "oldest") {
            sortOption.createdAt = 1;
        }

        const occurrences = await Occurrence.find(query)
            .populate({
                path: "spotId",
                select: "image",
            })
            .populate({
                path: "speciesId",
                select: "common_name",
                match: searchTerm
                    ? { common_name: { $regex: searchTerm, $options: "i" } }
                    : null,
            })
            .sort(sortOption)
            .exec();

        const filteredOccurrences = occurrences.filter(
            (o) => o.speciesId !== null
        );

        if (filteredOccurrences.length === 0) {
            return res.status(200).json({
                message: "No occurrences found matching the criteria.",
            });
        }

        res.status(200).json(filteredOccurrences);
    } catch (error) {
        res.status(500).json({
            message: "Error retrieving occurrence details",
            error,
        });
    }
}

async function updateOccurrence(req, res) {
    try {
      const { id } = req.params;
      const updates = req.body;
      const user = req.user; // Retrieved from middleware
      if (!user) {
        return res.status(401).json({ error: 'Unauthorized.' });
      }
      
      const updatedOccurrence = await Occurrence.findByIdAndUpdate(id, updates, { new: true, runValidators: true });
      if (!updatedOccurrence) {
        return res.status(404).json({ message: 'Occurrence not found' });
      }
      res.status(200).json(updatedOccurrence);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }
  
  // Delete occurrence
  async function deleteOccurrence(req, res) {
    try {
      const { id } = req.params;
      const user = req.user; // Retrieved from middleware
      if (!user) {
        return res.status(401).json({ error: 'Unauthorized.' });
      }
      const deletedOccurrence = await Occurrence.findByIdAndDelete(id);
      if (!deletedOccurrence) {
        return res.status(404).json({ message: 'Occurrence not found' });
      }
      res.status(200).json({ message: 'Occurrence deleted successfully' });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }
  
  
  module.exports = { getOccurrencesOfExpert,getOccurrenceById,getOccurrence, updateOccurrence, deleteOccurrence };
  