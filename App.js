import React, { useState } from "react";
import { StyleSheet, Text, View, Image, TouchableOpacity } from "react-native";

export default function App() {
  // We'll use state to manage the current location index later
  const [currentLocationIndex, setCurrentLocationIndex] = useState(0);

  // Placeholder data for now
  const locations = [
    {
      image: require("./assets/placeholder-image.png"), // Replace with your actual image paths
      fact: "Key fact about Location 1",
      didYouKnow: "Bonus info about Location 1",
    },
    {
      image: require("./assets/placeholder-image.png"), // Replace with your actual image paths
      fact: "Key fact about Location 2",
      didYouKnow: "Bonus info about Location 2",
    },
    // Add more locations here
  ];

  const currentLocation = locations[currentLocationIndex];

  const goToPrevious = () => {
    // Update index to go to the previous location
  };

  const goToNext = () => {
    // Update index to go to the next location
  };

  const showDidYouKnow = () => {
    // Logic to show the "Did You Know?" info
  };

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

        {/* "Did You Know?" Pop-up (initially hidden) */}
        {/* We'll add logic to show this later */}
        {/* <View style={styles.didYouKnowContainer}>
          <Text style={styles.didYouKnowText}>{currentLocation.didYouKnow}</Text>
        </View> */}

        {/* Countdown Timer (we'll add this later) */}
        {/* <Text style={styles.countdown}>5</Text> */}
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
    flex: 0.3,
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
  },
  factText: {
    fontSize: 18,
    textAlign: "center",
    marginBottom: 10,
  },
  didYouKnowContainer: {
    // Styles for the pop-up
    backgroundColor: "yellow",
    padding: 10,
    borderRadius: 5,
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
  },
});
