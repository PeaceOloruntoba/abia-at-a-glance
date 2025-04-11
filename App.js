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
import { Video } from "expo-av";

export default function App() {
  const [currentLocationIndex, setCurrentLocationIndex] = useState(0);
  const [showDidYouKnow, setShowDidYouKnow] = useState(false);
  const [timerActive, setTimerActive] = useState(false);
  const [countdown, setCountdown] = useState(null);
  const [showHint, setShowHint] = useState(false);
  const hintPosition = useRef(new Animated.ValueXY({ x: 50, y: 50 })).current;
  const [showQuestionModal, setShowQuestionModal] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState(null);
  const [score, setScore] = useState(0);
  const questionTimeout = useRef(null);
  const lgaLevels = ["Level 🌟", "Level 🏞️", "Level 🗺️", "Level 📍"];
  const [lgaLevelIndex, setLgaLevelIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [gameEnded, setGameEnded] = useState(false);
  const [locationsVisited, setLocationsVisited] = useState(0);
  const [showQuitModal, setShowQuitModal] = useState(false);

  const locations = [
    {
      lga: "Isuikwuato",
      name: "Isi-Uzu Waterfall",
      visual: require("./assets/isiuzu.jpg"),
      fact: "A powerful site of spiritual cleansing, known for granting fertility and reversing misfortunes. Guns are forbidden, and no one is ever allowed to fall there.",
      didYouKnow: "Locals believe in its spiritual power to cleanse and bless.",
    },
    {
      lga: "Isuikwuato",
      name: "Iyi Uhia",
      visual: require("./assets/iyiuhia.jpg"),
      fact: "A stunning stream nestled between rocky plains, perfect for swimming and melon washing.",
      didYouKnow:
        "This stream is appreciated for its natural beauty and recreational use, without specific spiritual ties.",
    },
    {
      lga: "Isuikwuato",
      name: "Okpu Chukwu",
      visual: require("./assets/okpuchukwu.jpg"),
      fact: "A once-sacred cave believed to have housed Chukwu Okike Abiama before he departed for Arochukwu. Served as a wartime refuge.",
      didYouKnow:
        "Features seven openings and a vast central chamber. Some say a tiger now calls it home.",
    },
    {
      lga: "Isuikwuato",
      name: "Nne-Oche River",
      visual: require("./assets/nneoche.jpg"),
      fact: "A sacred river where no indigene dares to eat its fish, but outsiders may. Fish can only be hunted if they leave the water.",
      didYouKnow:
        "This tradition highlights a unique relationship between the local people and the river.",
    },
    {
      lga: "Bende",
      name: "Omenuko Building",
      visual: require("./assets/omenuko.jpg"),
      fact: "Once a colonial office, this wooden structure served as a holding center for enslaved people before their transport to Arochukwu.",
      didYouKnow:
        "This site stands as a stark reminder of the transatlantic slave trade.",
    },
    {
      lga: "Bende",
      name: "The Armoury & Ulo Ishi Prison",
      visual: require("./assets/placeholder-image.png"),
      fact: "More than just storage for colonial weapons, these sites witnessed brutal punishments of rebellious captives who were confined and flogged.",
      didYouKnow:
        "These locations echo with the pain and resilience of those who resisted colonial rule.",
    },
    {
      lga: "Bende",
      name: "Ulochukwu Cave",
      visual: require("./assets/placeholder-image.png"),
      fact: "A divine wonder in Alayi, home to over 3,000 bats and a river flowing with both hot and cold water. Only the pure-hearted can enter without consequence.",
      didYouKnow:
        "The unique thermal properties of the river and the large bat population contribute to its mystique.",
    },
    {
      lga: "Bende",
      name: "The Sacred Oba Tree of Ukwueke",
      visual: require("./assets/placeholder-image.png"),
      fact: "A powerful symbol of justice, untouched by outsiders. It is believed that no true indigene of Ukwueke dies by accident.",
      didYouKnow:
        "This tree holds deep cultural significance and is revered by the local community.",
    },
    {
      lga: "Bende",
      name: "Ojukwu’s Bunker (Methodist College)",
      visual: require("./assets/placeholder-image.png"),
      fact: "A hidden Civil War stronghold where General Ojukwu stored ammunition and strategized.",
      didYouKnow:
        "This bunker serves as a historical landmark of the Nigerian Civil War.",
    },
    {
      lga: "Bende",
      name: "Akoli Imenyi",
      visual: require("./assets/akoli.jpg"),
      fact: "A tranquil escape into nature, with rustic palm-frond lodges, a natural fish pond, and a live turtle—a perfect retreat for serenity seekers.",
      didYouKnow: "Offers a peaceful environment to connect with nature.",
    },
    {
      lga: "Ukwa East",
      name: "Azumili Blue River (Nne Obu)",
      visual: require("./assets/placeholder-image.png"),
      fact: "Famous for its mesmerizing blue hue, which transforms into a vibrant green during the rainy season.",
      didYouKnow: "A true marvel of nature showcasing seasonal color changes.",
    },
    {
      lga: "Ukwa East",
      name: "Obeka Blue River",
      visual: require("./assets/placeholder-image.png"),
      fact: "Serves as a natural boundary between Abia State and Akwa Ibom, offering visitors a scenic and serene view.",
      didYouKnow: "Its blue waters provide a picturesque natural border.",
    },
    {
      lga: "Ukwa East",
      name: "Owo Okoato Ohanbela",
      visual: require("./assets/placeholder-image.png"),
      fact: "Home to a legendary mango tree where enslaved people once made their final wishes before being taken away. King Jaja of Opobo was also captured here.",
      didYouKnow:
        "This historic site bears witness to both the slave trade and the capture of a significant historical figure.",
    },
    {
      lga: "Ukwa East",
      name: "Akwete Beach",
      visual: require("./assets/placeholder-image.png"),
      fact: "A hidden gem offering a breathtaking coastal experience with traditional thatch huts for relaxation.",
      didYouKnow:
        "Provides a tranquil coastal getaway with local architectural charm.",
    },
    {
      lga: "Ukwa East",
      name: "Akwete Weaving Institute",
      visual: require("./assets/placeholder-image.png"),
      fact: "Unveils the intricate process of weaving the unique Akwete fabric, a proud symbol of Abia’s cultural heritage.",
      didYouKnow:
        "The craft empowers young girls in Akwete, preserving a centuries-old tradition.",
    },
    {
      lga: "Umuahia North",
      name: "Iyi Ama",
      visual: require("./assets/placeholder-image.png"),
      fact: "A female river that diminished in size after the sacred crocodile dwelling within it was killed. Fishing is strictly prohibited.",
      didYouKnow:
        "Its source emerges from a stone, and it remains a revered site.",
    },
    {
      lga: "Umuahia North",
      name: "Iyi Ocha Umuagu",
      visual: require("./assets/placeholder-image.png"),
      fact: "A sacred meeting point where three rivers from three different villages converge. Villagers sought refuge here during the war. Fishing is forbidden at their confluence.",
      didYouKnow:
        "While fishing is permitted in the individual rivers, the meeting point is considered sacred.",
    },
    {
      lga: "Umuahia North",
      name: "Iyi Umuchima",
      visual: require("./assets/placeholder-image.png"),
      fact: "A breathtaking river deeply intertwined with the Ekpe tradition. Only inducted members are allowed near its waters during sacred rites.",
      didYouKnow:
        "Women and uninitiated men are strictly prohibited from approaching this site during these times.",
    },
    {
      lga: "Umuahia North",
      name: "Nwagbara Agomuo’s Compound",
      visual: require("./assets/placeholder-image.png"),
      fact: "Tells the story of the first warrant chief in Ibeku, who played a significant role in the transatlantic slave trade. Home to the first storey building in Umuahia.",
      didYouKnow:
        "The first storey building was constructed by the British colonial government.",
    },
    {
      lga: "Umuahia North",
      name: "Ojukwu Bunker (Umuahia North)",
      visual: require("./assets/placeholder-image.png"),
      fact: "An underground bunker built in just 90 days, serving as a safe haven for General Odumegwu Ojukwu after the fall of Enugu during the Nigerian Civil War.",
      didYouKnow: "It had multiple exit routes, showcasing strategic planning.",
    },
    {
      lga: "Umuahia North",
      name: "National War Museum",
      visual: require("./assets/placeholder-image.png"),
      fact: "Houses an extensive collection of ammunition and equipment used during the Nigeria-Biafra War.",
      didYouKnow:
        "One of the escape tunnels from Ojukwu’s bunker leads directly to the museum.",
    },
    {
      lga: "Ikwuano",
      name: "Ntugbo Oloko Magistrate and Customary Court",
      visual: require("./assets/placeholder-image.png"),
      fact: "The first court built in the entire Southeast region, bearing witness to the Aba Women’s Riot of 1929 where brave women stood against colonial oppression.",
      didYouKnow:
        "Many of the women involved in the Aba Women’s Riot were tried here.",
    },
    {
      lga: "Umunneochie",
      name: "Iyi Aja in Umuobasi Mbala",
      visual: require("./assets/placeholder-image.png"),
      fact: "A mysterious river filled with sand. It is not the water but the sand that sinks people and then throws them back up.",
      didYouKnow: "This unusual phenomenon adds to the river's intrigue.",
    },
    {
      lga: "Umunneochie",
      name: "Nwokoro Ukwu (Giant of Alakuku) in Mbala Isiochi",
      visual: require("./assets/placeholder-image.png"),
      fact: "The tallest man in Africa, standing at 11.6 feet tall. Born in the 1920s and passed in 1958.",
      didYouKnow:
        "He never married but left behind a star fruit tree in his compound, still thriving today. His grave in Okigwe is uniquely chained.",
    },
    {
      lga: "Umunneochie",
      name: "Nkoro Cave in Akporo Achara Isiochi",
      visual: require("./assets/placeholder-image.png"),
      fact: "A breathtaking natural wonder discovered by Nnanyi Okorie, featuring a stunning passage of water.",
      didYouKnow:
        "The water passage inside the cave makes it a remarkable sight.",
    },
    {
      lga: "Umunneochie",
      name: "Iyi Okoro Aho in Amuda Isiochi",
      visual: require("./assets/placeholder-image.png"),
      fact: "A waterfall discovered by ancient hunters in search of water. It has a separate spring water source that locals drink from to this day.",
      didYouKnow: "The spring water source adds to its local significance.",
    },
    {
      lga: "Umunneochie",
      name: "Isi Imo in Umuako Isiochi",
      visual: require("./assets/placeholder-image.png"),
      fact: "Believed to be the origin of the Imo River. A three-day festival is held in its honor every February.",
      didYouKnow: "The river is also renowned for its healing properties.",
    },
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
    }, 5000);
  }, []);

  useEffect(() => {
    const nextIndex = (lgaLevelIndex + 1) % lgaLevels.length;
    setLgaLevelIndex(nextIndex);
  }, [currentLGA]);

  const generateQuestion = () => {
    const possibleQuestions = [
      `What Local Government Area is ${currentItemName} located in?`,
      `According to the fact, what is a notable feature of ${currentItemName}?`,
      currentDidYouKnow
        ? `True or False: ${currentDidYouKnow}`
        : `True or False: There's something interesting about ${currentItemName}.`,
    ];
    const randomIndex = Math.floor(Math.random() * possibleQuestions.length);
    const question = possibleQuestions[randomIndex];

    let correctAnswer;
    let options;

    if (question.includes("Local Government Area")) {
      correctAnswer = currentLGA;
      const otherLGAs = [...new Set(locations.map((loc) => loc.lga))].filter(
        (lga) => lga !== currentLGA
      );
      const incorrectLGA1 =
        otherLGAs[Math.floor(Math.random() * otherLGAs.length)] ||
        "Unknown LGA";
      const incorrectLGA2 =
        otherLGAs.filter((lga) => lga !== incorrectLGA1)[
          Math.floor(Math.random() * (otherLGAs.length - 1))
        ] || "Another Unknown LGA";
      options = [correctAnswer, incorrectLGA1, incorrectLGA2].sort(
        () => Math.random() - 0.5
      );
    } else if (question.includes("notable feature")) {
      correctAnswer = currentFact.split(".")[0];
      const otherFacts = locations
        .filter((loc) => loc.fact !== currentFact)
        .map((loc) => loc.fact.split(".")[0]);
      const incorrectFact1 =
        otherFacts[Math.floor(Math.random() * otherFacts.length)] ||
        "Interesting detail";
      const incorrectFact2 =
        otherFacts.filter((fact) => fact !== incorrectFact1)[
          Math.floor(Math.random() * (otherFacts.length - 1))
        ] || "Another detail";
      options = [correctAnswer, incorrectFact1, incorrectFact2].sort(
        () => Math.random() - 0.5
      );
    } else if (question.includes("True or False")) {
      correctAnswer = currentDidYouKnow ? "True" : "True";
      options = ["True", "False"].sort(() => Math.random() - 0.5);
    }

    return {
      question,
      options,
      correctAnswer,
    };
  };

  const goToPrevious = () => {
    setCurrentLocationIndex((prevIndex) =>
      prevIndex > 0 ? prevIndex - 1 : locations.length - 1
    );
    setShowDidYouKnow(false);
    setTimerActive(false);
    setCountdown(null);
    startInitialTimer();
    setShowQuestionModal(false);
    clearTimeout(questionTimeout.current);
  };

  const goToNext = () => {
    const nextIndex =
      currentLocationIndex < locations.length - 1
        ? currentLocationIndex + 1
        : 0;
    const nextLGA = locations[nextIndex]?.lga || "";
    if (nextLGA !== currentLGA) {
      toast.success(`Moving to ${nextLGA} LGA`, { type: "success" });
    }
    setCurrentLocationIndex(nextIndex);
    setShowDidYouKnow(false);
    setTimerActive(false);
    setCountdown(null);
    startInitialTimer();
    setShowQuestionModal(false);
    clearTimeout(questionTimeout.current);
    setLocationsVisited((prevCount) => prevCount + 1);
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
      toast.info("Next in 5...", { type: "info" });
    }, 20000);
  };

  useEffect(() => {
    let timer;

    if (countdown > 0) {
      timer = setTimeout(() => {
        setCountdown((prevCountdown) => {
          if (prevCountdown === 1) {
            toast.info("Next in 1...", { type: "info" });
          }
          return prevCountdown - 1;
        });
      }, 1000);
    } else if (countdown === 0) {
      goToNext();
    }

    return () => clearTimeout(timer);
  }, [countdown]);

  useEffect(() => {
    startInitialTimer();
  }, []);

  useEffect(() => {
    if (locationsVisited > totalLocations && totalLocations > 0) {
      setGameEnded(true);
    }
  }, [locationsVisited, totalLocations]);

  const handleHintPress = () => {
    setShowHint(true);
    Animated.loop(
      Animated.sequence([
        Animated.timing(hintPosition, {
          toValue: { x: 100, y: 150 },
          duration: 1000,
          useNativeDriver: false,
        }),
        Animated.timing(hintPosition, {
          toValue: { x: 200, y: 250 },
          duration: 1200,
          useNativeDriver: false,
        }),
        Animated.timing(hintPosition, {
          toValue: { x: 50, y: 300 },
          duration: 900,
          useNativeDriver: false,
        }),
        Animated.timing(hintPosition, {
          toValue: { x: 150, y: 100 },
          duration: 1100,
          useNativeDriver: false,
        }),
        Animated.timing(hintPosition, {
          toValue: { x: 50, y: 50 },
          duration: 1000,
          useNativeDriver: false,
        }),
      ]),
      { iterations: 3 }
    ).start(() => {
      setShowHint(false);
      const question = generateQuestion();
      setCurrentQuestion(question);
      setShowQuestionModal(true);
      startQuestionTimer();
    });
  };

  const startQuestionTimer = () => {
    clearTimeout(questionTimeout.current);
    questionTimeout.current = setTimeout(() => {
      setShowQuestionModal(false);
      toast.error("Time's up!", { duration: 2000 });
      goToNext();
    }, 15000);
  };

  const handleAnswer = (selectedAnswer) => {
    clearTimeout(questionTimeout.current);
    setShowQuestionModal(false);
    if (selectedAnswer === currentQuestion.correctAnswer) {
      setScore((prevScore) => prevScore + 5);
      toast.success("Correct! +5 points", { duration: 2000 });
    } else {
      setScore((prevScore) => prevScore - 2);
      toast.error("Wrong! -2 points", { duration: 2000 });
    }
    goToNext();
  };

  const handleSkipQuestion = () => {
    clearTimeout(questionTimeout.current);
    setShowQuestionModal(false);
    toast.warning("Skipped", { duration: 2000 });
    goToNext();
  };

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
          source={require("./assets/splash_video.mp4")}
          style={styles.fullScreen}
          isMuted={true}
          shouldPlay
          isLooping
          resizeMode="cover"
          onError={(error) => console.error("Video Error (Splash):", error)}
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
          source={require("./assets/end_video.mp4")}
          style={styles.fullScreen}
          isMuted={true}
          shouldPlay
          isLooping
          resizeMode="cover"
          onError={(error) => console.error("Video Error (End):", error)}
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
    backgroundColor: "rgba(0,0,0,0.5)",
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
