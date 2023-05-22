const { User, Thought } = require('../models');

module.exports = {
    // Get all users
    getUsers(req, res) {
        User.find({})
        .populate({
            path: 'thoughts',
            select: '-__v'
        })
        .populate({
            path: 'friends',
            select: '-__v'
        })
        .then((users) => res.json(users))
        .catch((err) => res.status(500).json(err));
    },

    // Get a user by id
    getUserById(req, res) {
    User.findOne({ _id: req.params.userId })
        .populate({
            path: 'thoughts',
            select: '-__v'
        })
        .populate({
            path: 'friends',
            select: '-__v'
        })
        .select('-__v')
        .then((user) =>
        !user
        ? res.status(404).json({ message: 'No user with that ID' })
        : res.json(user)
        )
    .catch((err) => res.status(500).json(err));
},

  // Create a user
    createUser(req, res) {
        User.create(req.body)
        .then((user) => res.json(user))
        .catch((err) => {
            console.log(err);
            return res.status(500).json(err);
    });
},

  // Update an user
    updateUser(req, res) {
    User.findOneAndUpdate(
        { _id: req.params.userId },
        { $set: req.body },
        { runValidators: true, new: true }
    )
    .then((user) =>
        !user
            ? res.status(404).json({ message: 'No user with that id' })
            : res.json(user)
    )
    .catch((err) => res.status(500).json(err));
    },



  // Delete a user
    deleteUser(req, res) {
    User.findOneAndDelete({ _id: req.params.userId })
        .then((user) =>
            !user
                ? res.status(404).json({ message: 'No user with that ID' })
                : Thought.deleteMany({ username: user.username })
        )
        .then(() => res.json({ message: 'User and thoughts deleted!' }))
        .catch((err) => res.status(500).json(err));
},

    // Add friend to friend's list 
    addFriend({ params }, res) {
        User.findOneAndUpdate(
            { _id: params.userId },
            { $push: { friends: params.friendId }},
            { new: true, runValidators: true }
        )
        .populate({
            path: 'friends',
            select: ('-__v')
        })
        .select('-__v')
        .then(user => {
            if (!user) {
                res.status(404).json({ message: 'No User found with that id.' });
                return;
            }
            res.json(user);
            })
            .catch(err => res.json(err));
        
    },

    // Delete friend from friend's list 
    deleteFriend({ params }, res) {
        User.findOneAndUpdate(
            { _id: params.userId }, 
            { $pull: { friends: params.friendId }},
            { new: true }
        )
        .populate({
            path: 'friends', 
            select: '-__v'
        })
        .select('-__v')
        .then(user => {
            if(!user) {
                res.status(404).json({ message: 'No User found with that id.'});
                return;
            }
            res.json(user);
        })
        .catch(err => res.status(400).json(err));
    }

};