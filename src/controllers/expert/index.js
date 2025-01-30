const {addNewExpert,loginexpert,getExpertDetails,forgotPassword,verifyOtp,resetPassword}=require('./expert');
const {getUpload,getlistUpload,getUploadById} = require('./getupload');
const {addSpecies, getSpecies,getSpeciesById, updateSpecies, deleteSpecies } = require('./species');
const {saveOccurrence,getOccurrence, getOccurrenceById} = require("./occurance")
const {countAllDocuments} = require("./count")
const {getGeoJSONData,speciesMap} = require("./heatmap")

module.exports={addNewExpert,loginexpert,getExpertDetails,forgotPassword,verifyOtp,resetPassword,
    getUpload,getlistUpload,getUploadById,
    addSpecies, getSpecies, getSpeciesById, updateSpecies, deleteSpecies,
    saveOccurrence,getOccurrence, getOccurrenceById,
    countAllDocuments,
    getGeoJSONData,speciesMap};