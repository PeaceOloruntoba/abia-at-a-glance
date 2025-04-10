import React, { useState, useEffect } from "react";
import { StyleSheet, Text, View, Image, TouchableOpacity } from "react-native";

export default function App() {
  const [currentLocationIndex, setCurrentLocationIndex] = useState(0);
  const [showDidYouKnow, setShowDidYouKnow] = useState(false);
  const [timerActive, setTimerActive] = useState(false); // To track if the 15s timer is done
  const [countdown, setCountdown] = useState(null); // Countdown value (5 to 0)

  const locations = [
    {
      image: require("./assets/placeholder-image.png"), // Replace with your actual image paths
      fact: "Key fact about Location 1",
      didYouKnow: "Bonus info about Location 1",
    },
    {
      image: require("./assets/another-image.png"), // Replace with your actual image paths
      fact: "Key fact about Location 2",
      didYouKnow: "Bonus info about Location 2",
    },
    // Add more locations here
  ];

  const goToPrevious = () => {
    setCurrentLocationIndex((prevIndex) =>
      prevIndex > 0 ? prevIndex - 1 : locations.length - 1
    );
    setShowDidYouKnow(false);
    setTimerActive(false); // Reset the 15s timer
    setCountdown(null); // Reset the countdown
    startInitialTimer(); // Start the 15s timer again
  };

  const goToNext = () => {
    setCurrentLocationIndex((prevIndex) =>
      prevIndex < locations.length - 1 ? prevIndex + 1 : 0
    );
    setShowDidYouKnow(false);
    setTimerActive(false); // Reset the 15s timer
    setCountdown(null); // Reset the countdown
    startInitialTimer(); // Start the 15s timer again
  };

  const handleDidYouKnowPress = () => {
    setShowDidYouKnow(true);
  };

  const startCountdown = () => {
    setCountdown(5);
  };

  const startInitialTimer = () => {
    setTimerActive(true);
    setTimeout(() => {
      setTimerActive(false);
      startCountdown();
    }, 15000); // 15000 milliseconds = 15 seconds
  };

  useEffect(() => {
    let timer;

    if (countdown > 0) {
      timer = setTimeout(() => {
        setCountdown((prevCountdown) => prevCountdown - 1);
      }, 1000);
    } else if (countdown === 0) {
      goToNext();
    }

    return () => clearTimeout(timer);
  }, [countdown]);

  useEffect(() => {
    startInitialTimer(); // Start the 15-second timer when the component mounts
  }, []);

  const currentLocation = locations[currentLocationIndex];

  return (
    <View style={styles.container}>
      {/* Image/Video Area */}
      <View style={styles.mediaContainer}>
        <Image
          source={currentLocation.image}
          style={styles.image}
          resizeMode="contain"
        />
        {/* If you have video, you might use a <Video> component here */}
      </View>

      {/* Information Text */}
      <View style={styles.infoContainer}>
        <Text style={styles.factText}>{currentLocation.fact}</Text>

        {/* "Did You Know?" Button */}
        {!showDidYouKnow && currentLocation.didYouKnow && (
          <TouchableOpacity
            style={styles.didYouKnowButton}
            onPress={handleDidYouKnowPress}
          >
            <Text style={styles.didYouKnowButtonText}>Did You Know?</Text>
          </TouchableOpacity>
        )}

        {/* "Did You Know?" Information */}
        {showDidYouKnow && currentLocation.didYouKnow && (
          <View style={styles.didYouKnowContainer}>
            <Text style={styles.didYouKnowText}>
              {currentLocation.didYouKnow}
            </Text>
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
          <Text>Previous</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navButton} onPress={goToNext}>
          <Text>Next</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f0f0f0",
    alignItems: "center",
    justifyContent: "space-around",
    padding: 20,
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
  },
  navButton: {
    backgroundColor: "#ddd",
    padding: 10,
    borderRadius: 5,
  },
  countdown: {
    fontSize: 20,
    fontWeight: "bold",
    marginTop: 10,
  },
});
