export const messageTone = () => {
  const audioElement = new Audio(
    "https://commondatastorage.googleapis.com/codeskulptor-assets/week7-brrring.m4a"
  );
  audioElement.play();
};
