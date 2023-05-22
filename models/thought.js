// Import necessary modules
const { Schema, model, Types } = require('mongoose');
const moment = require('moment');

// Defining the schema for the Reaction model - a subdocument of ThoughtSchema
const ReactionSchema = new Schema({
    reactionId: {
        type: Schema.Types.ObjectId,
        default: () => new Types.ObjectId()
    },
    reactionBody: {
        type: String,
        required: true,
        maxlength: 280
    },
    username: {
        type: String,
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now,
        // Define a getter function to format the date in a specific way
        get: (createdAtVal) => moment(createdAtVal).format('MMM DD, YYYY [at] hh:mm a')
    },
},
// Define options for the schema
{
    toJSON: {
        getters: true 
    },
    id: false,
});

// Defining the schema for the Thought model
const ThoughtSchema = new Schema({
    thoughtText: {
        type: String,
        required: true,
        maxlength: 280,
        minlength: 1
    },
    createdAt: {
        type: Date,
        default: Date.now,
        // Define a getter function to format the date in a specific way
        get: (createdAtVal) => moment(createdAtVal).format('MMM DD, YYYY [at] hh:mm a')
    },
    username: {
        type: String,
        required: true,
    },
     // Embed the Reaction schema as an array in the Thought schema
    reactions: [ReactionSchema]
},
{
    toJSON: {
        virtuals: true, // Enable virtual properties 
        getters: true 
    },
    id: false 
}
);

// Define a virtual property 'reactionCount' for the Thought model
ThoughtSchema.virtual('reactionCount').get(function() {
    return this.reactions.length;
});

// Create a mongoose model for the Thought schema and export it
const Thought = model('Thought', ThoughtSchema);
module.exports = Thought;