const { Thought, User } = require('../models');

module.exports = {
    // get all thoughts
    getAllThoughts(req, res) {
        Thought.find({})
            .then((thoughts) => res.json(thoughts))
            .catch((err) => {
                console.log(err);
                res.status(400).json(err);
            }
            );
    },

    // get one thought by id
    getThoughtById({ params }, res) {
        Thought.findOne({ _id: params.id })
            .then((thought) => {
                // if no thought is found, send 404
                if (!thought) {
                    res.status(404).json({ message: 'No thought found with this id!' });
                    return;
                }
                res.json(thought);
            }
            )
            .catch((err) => {
                console.log(err);
                res.status(400).json(err);
            }
            );
    },

    // createThought
    createThought({ params, body}, res) {
        Thought.create(body)
            .then(({ _id }) => {
                return User.findOneAndUpdate(
                    { _id: params.userId },
                    { $push: { thoughts: _id }},
                    { new: true, runValidators: true }
                );
            })
            .then((thought) =>
            !thought
            ? res.status(404).json({ message: 'No thought with that ID' })
            : res.json(thought)
            )
            .catch(err => res.json(err)); 
    },

    //Update a Thought
    updateThought(req, res) {
        Thought.findOneAndUpdate(
            { _id: req.params.thoughtId },
            { $set: req.body },
            { runValidators: true, new: true }
        )
        .populate({
            path: 'reactions',
            select: '-__v'
        })
        .then((thought) =>
            !thought
                ? res.status(404).json({ message: 'No thought with that id' })
                : res.json(thought)
        )
        .catch((err) => res.status(500).json(err));
        },
    

    // Delete a Thought and remove from the user
    deleteThought(req, res) {
        Thought.findOneAndDelete({ _id: req.params.thoughtId })
        .then((thought) => {
            if (!thought) {
            return res.status(404).json({ message: 'That Thought does not exist' });
            }
            return User.findOneAndUpdate(
            { thoughts: req.params.thoughtId },
            { $pull: { thoughts: req.params.thoughtId } },
            { new: true }
            );
        })
        .then((user) => {
            if (!user) {
            return res.status(404).json({
                message: 'Thought deleted, but no users found',
            });
            }
            return res.json({ message: 'Thought successfully deleted!' });
        })
        .catch((err) => {
            console.log(err);
            res.status(500).json(err);
        });
    },
    
    // Create a reaction
    addReaction(req, res) {
        Thought.findOneAndUpdate(
        { _id: req.params.thoughtId },
        { $push: { reactions: req.body } },
        { runValidators: true, new: true }
        )
        .populate({
            path: 'reactions',
            select: '-__v'
        })
        .then((thought) =>
        !thought
        ? res.status(404).json({ message: 'No thought with that ID' })
        : res.json(thought)
        )
        .catch((err) => res.status(500).json(err));
    },


    // Find a reaction by ID and delete
    deleteReaction( req, res) {
        Thought.findOneAndUpdate(
        { _id: req.params.thoughtId },
        { $pull: { reactions: { _id: req.params.reactionId } } },
        { runValidators: true, new: true }

        )
        .then((thought) =>
        !thought
        ? res.status(404).json({ message: 'No thought with that ID' })
        : res.json(thought)
        )
        .catch((err) => res.status(500).json(err));
    },
    };
    