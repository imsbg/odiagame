
import React, { useState, useEffect, useCallback } from 'react';
import { GoogleGenAI } from "@google/genai";
import { getInitialScene, getNextScene, generateImageFromPrompt } from './services/geminiService';
import { GameScene, GameState } from './types';
import StoryDisplay from './components/StoryDisplay';
import ImageDisplay from './components/ImageDisplay';
import Choices from './components/Choices';
import LoadingSpinner from './components/LoadingSpinner';
import ErrorMessage from './components/ErrorMessage';
import StartScreen from './components/StartScreen';
import RestartButton from './components/RestartButton';

const App: React.FC = () => {
  const [gameState, setGameState] = useState<GameState>('initial');
  const [currentStory, setCurrentStory] = useState<string>('');
  const [currentChoices, setCurrentChoices] = useState<string[]>([]);
  const [currentImagePrompt, setCurrentImagePrompt] = useState<string>('');
  const [currentImageUrl, setCurrentImageUrl] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [loadingMessage, setLoadingMessage] = useState<string>('');

  const [aiInstance, setAiInstance] = useState<GoogleGenAI | null>(null);

  useEffect(() => {
    const key = process.env.API_KEY;
    if (key) {
      try {
        const instance = new GoogleGenAI({ apiKey: key });
        setAiInstance(instance);
      } catch (e) {
        console.error("Failed to initialize GoogleGenAI:", e);
        setErrorMessage("API କ୍ଲାଏଣ୍ଟ ପ୍ରାରମ୍ଭ କରିବାରେ ବିଫଳ | API କି' ଯାଞ୍ଚ କରନ୍ତୁ |");
        setGameState('error');
      }
    } else {
      setErrorMessage("API କି ମିଳିଲା ନାହିଁ | කරුණාකර `process.env.API_KEY` සකසන්න |");
      setGameState('error');
    }
  }, []);

  const handleApiError = (error: any, defaultMessage: string) => {
    console.error(defaultMessage, error);
    const message = error instanceof Error ? error.message : String(error);
    setErrorMessage(message || defaultMessage);
    setGameState('error');
    setLoadingMessage('');
  };

  const fetchSceneAndUpdateState = async (scenePromise: Promise<GameScene>) => {
    try {
      const scene = await scenePromise;
      setCurrentStory(scene.story);
      setCurrentChoices(scene.choices);
      setCurrentImagePrompt(scene.image_prompt); // This will trigger image generation useEffect
      setErrorMessage(null);
      // Image generation will be handled by useEffect, gameState will transition there
    } catch (error) {
      handleApiError(error, "କାହାଣୀ ପାଇବାରେ ତ୍ରୁଟି |");
    }
  };

  const startGame = useCallback(async () => {
    if (!aiInstance) {
      setErrorMessage("API କ୍ଲାଏଣ୍ଟ ପ୍ରସ୍ତୁତ ନୁହେଁ |");
      setGameState('error');
      return;
    }
    setGameState('loading');
    setLoadingMessage("ପ୍ରାରମ୍ଭିକ କାହାଣୀ ତିଆରି କରୁଛି...");
    setCurrentImageUrl(null); // Clear previous image
    await fetchSceneAndUpdateState(getInitialScene(aiInstance));
  }, [aiInstance]);

  const handleChoice = useCallback(async (choice: string) => {
    if (!aiInstance) {
      setErrorMessage("API କ୍ଲାଏଣ୍ଟ ପ୍ରସ୍ତୁତ ନୁହେଁ |");
      setGameState('error');
      return;
    }
    setGameState('loading');
    setLoadingMessage("ପରବର୍ତ୍ତୀ କାହାଣୀ ତିଆରି କରୁଛି...");
    setCurrentImageUrl(null); // Clear previous image before fetching new one
    await fetchSceneAndUpdateState(getNextScene(aiInstance, currentStory, choice));
  }, [aiInstance, currentStory]);

  const restartGame = useCallback(() => {
    setCurrentStory('');
    setCurrentChoices([]);
    setCurrentImagePrompt('');
    setCurrentImageUrl(null);
    setErrorMessage(null);
    setLoadingMessage('');
    setGameState('initial');
  }, []);

  useEffect(() => {
    if (currentImagePrompt && aiInstance && (gameState === 'loading' || gameState === 'playing' || gameState === 'initial' && currentStory !== '')) {
      // The condition `gameState === 'loading'` means a scene was just fetched.
      // `gameState === 'playing'` might be if we allow re-generating image for current scene.
      // `gameState === 'initial' && currentStory !== ''` for the very first load after story is set.
      const generateEffectImage = async () => {
        setLoadingMessage("ଚିତ୍ର ତିଆରି କରୁଛି...");
        // Keep gameState as 'loading' if it was, or set to 'playing' if image is an update
        // This ensures loading spinner remains for the whole process (story + image)
        try {
          const imageUrl = await generateImageFromPrompt(aiInstance, currentImagePrompt);
          setCurrentImageUrl(imageUrl);
          setGameState('playing'); // Transition to playing only after image is loaded
        } catch (error) {
          console.error("Image generation failed:", error);
          setErrorMessage(error instanceof Error ? error.message : "ଚିତ୍ର ତିଆରି କରିବାରେ ଅଜ୍ଞାତ ତ୍ରୁଟି |");
          setCurrentImageUrl(null); // Explicitly set to null on error
          setGameState('playing'); // Still allow playing, but without image
        } finally {
          setLoadingMessage(''); // Clear loading message once image attempt is done
        }
      };
      generateEffectImage();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentImagePrompt, aiInstance]); // Removed gameState from deps to avoid loop with setLoadingMessage

  if (!aiInstance && gameState !== 'error') {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-900 p-4">
        <LoadingSpinner />
        <p className="mt-4 text-lg text-yellow-400">API କ୍ଲାଏଣ୍ଟ ପ୍ରାରମ୍ଭ କରୁଛି...</p>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-gray-900 via-purple-900 to-blue-900 p-4 selection:bg-purple-500 selection:text-white">
      <div className="w-full max-w-3xl bg-gray-800 bg-opacity-80 backdrop-blur-md shadow-2xl rounded-lg p-6 md:p-8">
        <header className="mb-6 text-center">
          <h1 className="text-3xl md:text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-pink-500 to-red-500">
            ଓଡ଼ିଆ ପାଠ ଦୁଃସାହସିକ ଖେଳ
          </h1>
        </header>

        {gameState === 'error' && errorMessage && (
          <ErrorMessage message={errorMessage} onClear={() => setErrorMessage(null)} />
        )}

        {gameState === 'initial' && !errorMessage && (
          <StartScreen onStart={startGame} />
        )}

        {(gameState === 'loading') && (
          <div className="text-center py-10">
            <LoadingSpinner />
            <p className="mt-4 text-xl text-purple-300 animate-pulse">{loadingMessage || "ଲୋଡ୍ କରୁଛି..."}</p>
          </div>
        )}
        
        {gameState === 'playing' && (
          <main className="space-y-6">
            <ImageDisplay imageUrl={currentImageUrl} altText={currentImagePrompt || "ଖେଳର ଦୃଶ୍ୟ"} isLoading={loadingMessage.includes("ଚିତ୍ର")} />
            <StoryDisplay story={currentStory} />
            {currentChoices.length > 0 && <Choices choices={currentChoices} onChoiceSelected={handleChoice} />}
            {errorMessage && !loadingMessage && <ErrorMessage message={errorMessage} onClear={() => setErrorMessage(null)} />}
          </main>
        )}
        
        {(gameState === 'playing' || gameState === 'error' || gameState === 'initial' && errorMessage) && (
          <div className="mt-8 text-center">
            <RestartButton onRestart={restartGame} />
          </div>
        )}
      </div>
       <footer className="mt-8 text-center text-sm text-gray-400">
        <p>Gemini & Imagen ସହିତ ନିର୍ମିତ</p>
      </footer>
    </div>
  );
};

export default App;
