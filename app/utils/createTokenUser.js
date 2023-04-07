const createTokenUser = (user) => {
  return {
    name: user.name,
    userId: user._id,
    role: user.role,
    email: user.email,
    organizer: user.organizer,
  };
};

// create token untuk participant
const createTokenParticipant = (participant) => {
  return {
    lastName: participant.lastName,
    participantId: participant._id, // participantId samain dengan auth.js
    firstName: participant.firstName,
    email: participant.email,
  };
};

module.exports = { createTokenUser, createTokenParticipant };
