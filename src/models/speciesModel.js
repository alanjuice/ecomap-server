const mongoose = require('mongoose');

const speciesSchema = new mongoose.Schema({
  common_name: { type: String, required: true },
  scientific_name: { type: String, required: true },
  taxonomy_class: { type: String, default: null },
  conservation_status: { type: String, default: null },
  image: { type: String, required: true },
});

speciesSchema.pre('findOneAndDelete', async function(next) {
  try {
    const species = await this.model.findOne(this.getQuery());
    if (species) {
      await mongoose.model('Occurrence').deleteMany({ speciesId: species._id });
    }
    next();
  } catch (error) {
    next(error);
  }
});

const Species = mongoose.model('Species', speciesSchema);
module.exports = Species;
