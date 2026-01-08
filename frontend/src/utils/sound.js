export const playSound = (src, volume = 0.5) => {
  const sound = new Audio(src);
  sound.volume = volume;
  sound.play();
};

export const loopSound = (src, volume = 0.2) => {
  const sound = new Audio(src);
  sound.loop = true;
  sound.volume = volume;
  sound.play();
  return sound;
};