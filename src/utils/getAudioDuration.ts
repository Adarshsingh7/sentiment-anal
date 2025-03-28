const getAudioDuration = async (audioBlob: Blob): Promise<string> => {
  const audio = new Audio();
  audio.src = URL.createObjectURL(audioBlob);

  return new Promise((resolve) => {
    audio.onloadedmetadata = () => {
      resolve(audio.duration.toString()); // Duration in seconds
      URL.revokeObjectURL(audio.src); // Clean up
    };
  });
};

export { getAudioDuration };
