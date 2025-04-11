import React, { useState, useEffect, useRef } from "react";
import {
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity,
  Animated,
  Modal,
} from "react-native";
import { toast, Toaster } from "sonner-native";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import Video from "react-native-video"; // Import the video component

export default function App() {
  // ... your existing state variables ...
  const [showQuitModal, setShowQuitModal] = useState(false); // State for quit confirmation modal

  const locations = [
    // Your full locations data will go here
  ];

  const totalLocations = locations.length;
  const currentLGA = locations[currentLocationIndex]?.lga || "";
  const currentItemName = locations[currentLocationIndex]?.name || "";
  const currentFact = locations[currentLocationIndex]?.fact || "";
  const currentDidYouKnow = locations[currentLocationIndex]?.didYouKnow || "";
  const currentVisual = locations[currentLocationIndex]?.visual;
  const currentLGAWithLevel = `${lgaLevels[lgaLevelIndex]} - ${currentLGA}`;

  useEffect(() => {
    setTimeout(() => {
      setIsLoading(false);
    }, 5000); // Increased loading time for video to potentially load
  }, []);

  useEffect(() => {
    const nextIndex = (lgaLevelIndex + 1) % lgaLevels.length;
    setLgaLevelIndex(nextIndex);
  }, [currentLGA]);

  // ... your existing functions ...

  const handleQuit = () => {
    setShowQuitModal(true);
  };

  const confirmQuit = () => {
    setShowQuitModal(false);
    setGameEnded(true);
  };

  const cancelQuit = () => {
    setShowQuitModal(false);
  };

  if (isLoading) {
    return (
      <View style={styles.fullScreen}>
        <Video
          source={require("./assets/splash_video.mp4")} // Replace with your video path
          style={styles.fullScreen}
          muted={true}
          repeat={true}
          resizeMode="cover"
        />
        <View style={styles.splashContent}>
          <Text style={styles.splashTitle}>Abia at a Glance 🌟</Text>
          <Text style={styles.instructionsTitle}>How to Play:</Text>
          <Text style={styles.instructionsText}>
            Explore fascinating locations in Abia State. {"\n"}
            Tap 'Hint' for a fun fact and a quiz! {"\n"}
            Answer correctly to earn points. {"\n"}
            Use 'Previous' and 'Next' to navigate. {"\n"}
            Have fun discovering Abia!
          </Text>
        </View>
      </View>
    );
  }

  if (gameEnded) {
    return (
      <View style={styles.fullScreen}>
        <Video
          source={require("./assets/end_video.mp4")} // Replace with your video path
          style={styles.fullScreen}
          muted={true}
          repeat={true}
          resizeMode="cover"
        />
        <View style={styles.endContent}>
          <Text style={styles.endTitle}>That's all for now! 🎉</Text>
          <Text style={styles.finalScore}>Your Final Score: 🏆 {score}</Text>
          <Text style={styles.enticementText}>
            Intrigued? These amazing sites are waiting for your visit! {"\n"}
            Come and experience the beauty and history of Abia State firsthand.
          </Text>
          <TouchableOpacity
            style={styles.restartButton}
            onPress={() => {
              setGameEnded(false);
              setLocationsVisited(0);
              setCurrentLocationIndex(0);
              setScore(0);
              startInitialTimer();
            }}
          >
            <Text style={styles.restartButtonText}>Start Again 🔄</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  return (
    <>
      <GestureHandlerRootView style={{ flex: 1 }}>
        <SafeAreaProvider>
          <View style={styles.container}>
            {/* Score Display */}
            <View style={styles.scoreContainer}>
              <Text style={styles.scoreText}>Score: 🏆 {score}</Text>
            </View>

            {/* Floating LGA Level */}
            <View style={styles.lgaContainer}>
              <Text style={styles.lgaText}>{currentLGAWithLevel}</Text>
            </View>

            {/* Image/Video Area */}
            <View style={styles.mediaContainer}>
              {currentVisual && (
                <Image
                  source={currentVisual}
                  style={styles.image}
                  resizeMode="contain"
                />
              )}
            </View>

            {/* Animated Hint Text */}
            {showHint && (
              <Animated.View
                style={[hintPosition.getLayout(), styles.hintTextContainer]}
              >
                <Text style={styles.hintText}>{currentFact}</Text>
              </Animated.View>
            )}

            {/* Information Text */}
            <View style={styles.infoContainer}>
              <Text style={styles.factText}>{currentFact}</Text>

              {/* "Did You Know?" Button */}
              {!showDidYouKnow && currentDidYouKnow && (
                <TouchableOpacity
                  style={styles.didYouKnowButton}
                  onPress={handleDidYouKnowPress}
                >
                  <Text style={styles.didYouKnowButtonText}>Did You Know?</Text>
                </TouchableOpacity>
              )}

              {/* "Did You Know?" Information */}
              {showDidYouKnow && currentDidYouKnow && (
                <View style={styles.didYouKnowContainer}>
                  <Text style={styles.didYouKnowText}>{currentDidYouKnow}</Text>
                </View>
              )}

              {/* Countdown Timer */}
              {countdown !== null && (
                <Text style={styles.countdown}>{countdown}</Text>
              )}
            </View>

            {/* Navigation Buttons */}
            <View style={styles.navigationContainer}>
              <TouchableOpacity style={styles.navButton} onPress={goToPrevious}>
                <Text style={styles.navButtonText}>⬅️ Previous</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.navButton} onPress={goToNext}>
                <Text style={styles.navButtonText}>Next ➡️</Text>
              </TouchableOpacity>
            </View>

            {/* Floating Hint Button */}
            <TouchableOpacity
              style={styles.hintButton}
              onPress={handleHintPress}
            >
              <Text style={styles.hintButtonText}>Hint</Text>
            </TouchableOpacity>

            {/* Quit Button */}
            <TouchableOpacity style={styles.quitButton} onPress={handleQuit}>
              <Text style={styles.quitButtonText}>Quit</Text>
            </TouchableOpacity>

            {/* Question Modal */}
            <Modal
              visible={showQuestionModal}
              transparent={true}
              animationType="slide"
              onRequestClose={() => {
                setShowQuestionModal(false);
                handleSkipQuestion();
              }}
            >
              <View style={styles.modalOverlay}>
                <View style={styles.modalContainer}>
                  {currentQuestion && (
                    <>
                      <Text style={styles.modalQuestion}>
                        {currentQuestion.question}
                      </Text>
                      {currentQuestion.options.map((option, index) => (
                        <TouchableOpacity
                          key={index}
                          style={styles.modalOption}
                          onPress={() => handleAnswer(option)}
                        >
                          <Text style={styles.modalOptionText}>{option}</Text>
                        </TouchableOpacity>
                      ))}
                      <TouchableOpacity
                        style={styles.modalSkipButton}
                        onPress={handleSkipQuestion}
                      >
                        <Text style={styles.modalSkipText}>Skip</Text>
                      </TouchableOpacity>
                    </>
                  )}
                </View>
              </View>
            </Modal>

            {/* Quit Confirmation Modal */}
            <Modal
              visible={showQuitModal}
              transparent={true}
              animationType="fade"
            >
              <View style={styles.modalOverlay}>
                <View style={styles.quitModalContainer}>
                  <Text style={styles.quitModalText}>
                    Are you sure you want to quit?
                  </Text>
                  <View style={styles.quitModalButtons}>
                    <TouchableOpacity
                      style={styles.confirmQuitButton}
                      onPress={confirmQuit}
                    >
                      <Text style={styles.confirmQuitText}>Yes</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={styles.cancelQuitButton}
                      onPress={cancelQuit}
                    >
                      <Text style={styles.cancelQuitText}>No</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            </Modal>
          </View>
          <Toaster />
        </SafeAreaProvider>
      </GestureHandlerRootView>
    </>
  );
}

const styles = StyleSheet.create({
  fullScreen: {
    flex: 1,
    width: "100%",
    height: "100%",
    position: "absolute",
    top: 0,
    left: 0,
  },
  splashContent: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 40,
    backgroundColor: "rgba(0,0,0,0.5)", // Semi-transparent overlay for text
  },
  splashTitle: {
    fontSize: 48,
    fontWeight: "bold",
    color: "white",
    marginBottom: 20,
    textAlign: "center",
  },
  instructionsTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "white",
    marginBottom: 10,
    textAlign: "center",
  },
  instructionsText: {
    fontSize: 18,
    color: "white",
    textAlign: "center",
    lineHeight: 24,
  },
  endContent: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 40,
    backgroundColor: "rgba(0,0,0,0.6)", // Semi-transparent overlay
  },
  endTitle: {
    fontSize: 40,
    fontWeight: "bold",
    color: "white",
    marginBottom: 20,
    textAlign: "center",
  },
  finalScore: {
    fontSize: 28,
    color: "white",
    marginBottom: 30,
  },
  enticementText: {
    fontSize: 20,
    color: "white",
    textAlign: "center",
    marginBottom: 40,
    lineHeight: 26,
  },
  container: {
    flex: 1,
    backgroundColor: "#f0f0f0",
    padding: 20,
  },
  lgaContainer: {
    position: "absolute",
    top: 20,
    left: 0,
    right: 0,
    alignItems: "center",
    paddingVertical: 10,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    zIndex: 10,
  },
  lgaText: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
  },
  mediaContainer: {
    flex: 0.5,
    width: "100%",
    justifyContent: "center",
    alignItems: "center",
  },
  image: {
    width: "80%",
    height: "80%",
  },
  infoContainer: {
    flex: 0.4,
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
  },
  factText: {
    fontSize: 18,
    textAlign: "center",
    marginBottom: 10,
  },
  didYouKnowButton: {
    backgroundColor: "#a0c4ff",
    padding: 8,
    borderRadius: 5,
    marginTop: 10,
  },
  didYouKnowButtonText: {
    color: "white",
    fontWeight: "bold",
    textAlign: "center",
  },
  didYouKnowContainer: {
    backgroundColor: "#e0f2fe",
    padding: 10,
    borderRadius: 5,
    marginTop: 10,
  },
  didYouKnowText: {
    fontSize: 14,
    textAlign: "center",
  },
  navigationContainer: {
    flexDirection: "row",
    width: "100%",
    justifyContent: "space-around",
    marginTop: 20,
    paddingHorizontal: 20,
  },
  navButton: {
    backgroundColor: "#64b5f6", // A light blue
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    elevation: 3, // Add a slight shadow
  },
  navButtonText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 16,
  },
  countdown: {
    fontSize: 20,
    fontWeight: "bold",
    marginTop: 10,
  },
  hintButton: {
    position: "absolute",
    bottom: 20,
    right: 20,
    backgroundColor: "#ffb347",
    padding: 15,
    borderRadius: 30,
    elevation: 5,
    zIndex: 10,
  },
  hintButtonText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 16,
  },
  hintTextContainer: {
    position: "absolute",
    top: "50%", // Center vertically
    left: "10%",
    right: "10%",
    backgroundColor: "rgba(255, 255, 255, 0.8)",
    padding: 15,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: "#ccc",
    zIndex: 9,
    alignItems: "center", // Center text horizontally
  },
  hintText: {
    fontSize: 16,
    textAlign: "center",
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContainer: {
    backgroundColor: "white",
    padding: 20,
    borderRadius: 10,
    width: "80%",
    alignItems: "center",
  },
  modalQuestion: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 15,
    textAlign: "center",
  },
  modalOption: {
    backgroundColor: "#e0f7fa",
    padding: 12,
    borderRadius: 8,
    marginBottom: 10,
    width: "90%",
    alignItems: "center",
  },
  modalOptionText: {
    fontSize: 16,
  },
  modalSkipButton: {
    backgroundColor: "#ffcdd2",
    padding: 10,
    borderRadius: 5,
    marginTop: 15,
  },
  modalSkipText: {
    color: "black",
    fontWeight: "bold",
    fontSize: 16,
  },
  scoreContainer: {
    position: "absolute",
    top: 60, // Adjust as needed
    right: 20,
    backgroundColor: "rgba(0, 128, 0, 0.7)",
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
    zIndex: 11,
  },
  scoreText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 16,
  },
  quitButton: {
    position: "absolute",
    bottom: 20,
    left: 20,
    backgroundColor: "#f44336", // A red color
    padding: 15,
    borderRadius: 30,
    elevation: 5,
    zIndex: 10,
  },
  quitButtonText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 16,
  },
  quitModalContainer: {
    backgroundColor: "white",
    padding: 20,
    borderRadius: 10,
    width: "80%",
    alignItems: "center",
  },
  quitModalText: {
    fontSize: 18,
    marginBottom: 20,
    textAlign: "center",
  },
  quitModalButtons: {
    flexDirection: "row",
    justifyContent: "space-around",
    width: "80%",
  },
  confirmQuitButton: {
    backgroundColor: "#d32f2f",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
  },
  confirmQuitText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 16,
  },
  cancelQuitButton: {
    backgroundColor: "#4caf50",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
  },
  cancelQuitText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 16,
  },
});
