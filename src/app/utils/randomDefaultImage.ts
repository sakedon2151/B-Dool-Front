const generateRandomSeed = () => {
  return Math.random().toString(36).substring(2, 15);
};

export const getRandomProfileImage = () => {
  return `https://api.dicebear.com/9.x/thumbs/svg?seed=${generateRandomSeed()}`;
};

export const getRandomWorkspaceImage = () => {
  return `https://api.dicebear.com/9.x/shapes/svg?seed=${generateRandomSeed()}`;
};