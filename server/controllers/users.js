import User from "../models/User.js";

// Read
export const getUser = async (req,res) => {
    try{
        const {id} = req.params;
        const user = await User.findById(id);
        res.status(200).json(user);
    } catch(err){
        res.status(404).json({error:err.message});
    }
}

export const getUsersFriends = async(req,res) => {
    try{
        const {id} = req.params;
        const user = await User.findById(id);
        const friends = await Promise.all(
            user.friends.map((id)=>User.findById(id))
        )
        const formattedFriends = friends.map(
            ({ _id, firstName, lastName, occupation, location, picturePath }) => {
            return { _id, firstName, lastName, occupation, location, picturePath };
            }
        )
        res.status(200).json(formattedFriends);
    } catch(err){
        res.status(404).json({error:err.message});
    }
}


// update
export const addRemoveFriend = async (req, res) => {
  try {
    const { id, friendId } = req.params;

    const user = await User.findById(id);
    const friend = await User.findById(friendId);

    if (!user || !friend) {
      return res.status(404).json({ error: "User or friend not found." });
    }

    if (user.friends.includes(friendId.toString())) {
      user.friends = user.friends.filter((fid) => fid.toString() !== friendId.toString());
      friend.friends = friend.friends.filter((fid) => fid.toString() !== id.toString());
    } else {
      user.friends.push(friendId);
      friend.friends.push(id);
    }

    await Promise.all([user.save(), friend.save()]);

    const friends = await User.find({ _id: { $in: user.friends } });

    const formattedFriends = friends.map(
      ({ _id, firstName, lastName, occupation, location, picturePath }) => ({
        _id,
        firstName,
        lastName,
        occupation,
        location,
        picturePath,
      })
    );

    res.status(200).json(formattedFriends);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
