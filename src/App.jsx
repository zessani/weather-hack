import React, { useState, useEffect } from "react";
import { IconButton, Button } from "@chakra-ui/button";
import { useColorMode } from "@chakra-ui/color-mode";
import { Input, Text } from "@chakra-ui/react";
import { MoonIcon, SunIcon } from "@chakra-ui/icons";
import { VStack, Flex, Spacer, HStack } from "@chakra-ui/layout";
import { Heading, Box, Image } from "@chakra-ui/react";
import {
  Grid,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
} from "@chakra-ui/react";
import NavBar from "./components/NavBar";
import WeatherCard from "./components/WeatherCard";
import { collection, getDoc, getDocs } from "@firebase/firestore";
import { db } from "./firebase";
function App() {
  const { colorMode, toggleColorMode } = useColorMode();
  const isDark = colorMode === "dark";
  const [location, setLocation] = useState("");
  const [chosenLocation, setChosenLocation] = useState("");
  const [weatherData, setWeatherData] = useState(null);
  const [translatedData, setTranslatedData] = useState({});

  let formattedData = {};
  const handleSubmit = () => {
    location ? fetchWeatherData(location) : alert("Choose your location");
  };

  const fetchWeatherData = (city) => {
    const apiKey = "e64dd4bdc513ab2dfe35907d029c8e6f";
    fetch(
      `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}`
    )
      .then((response) => response.json())

      .then((data) => {
        data.main.temp = (data.main.temp - 273.15).toFixed(2);
        data.main.feels_like = (data.main.feels_like - 273.15).toFixed(2);
        data.main.temp_min = (data.main.temp_min - 273.15).toFixed(2);
        data.main.temp_max = (data.main.temp_max - 273.15).toFixed(2);

        setWeatherData(data);
        setChosenLocation(city);
        setLocation("");
      })
      .catch((error) => {
        console.error(error);
        alert(error); // Handle errors, e.g., display an error message to the user
      });
    formattedData = {
      Location: location,
      Temperature: weatherData.main.temp,
      "Feels like": weatherData.main.feels_like,
      "Min Temperature": weatherData.main.temp_min,
      "Max Temperature": weatherData.main.temp_max,
      Pressure: weatherData.main.humidity,
      Weather: weatherData.weather[0].description,
      "Wind speed": weatherData.wind.speed,
      "Wind Direction": weatherData.wind.deg,
      Cloudiness: weatherData.clouds.all,
    };
  };

  const fetchTranslation = async () => {
    await getDocs(collection(db, "translations")).then((querySnapshot) => {
      const newData = querySnapshot.docs.map((doc) => ({
        ...doc.data(),
        id: doc.id,
      }));
      setTranslatedData({ ...newData[0].translated });
      console.log(translatedData);
    });
  };

  useEffect(() => {
    fetchTranslation();
  }, []);

  /*en,es,de,fr,vi,ja,zh  */
  const languages = [
    { id: "fr", name: "French" },
    { id: "de", name: "German" },
    { id: "es", name: "Spanish" },
    { id: "ja", name: "Japanese" },
    { id: "vi", name: "Vietnamese" },
    { id: "zh", name: "Chinese" },
  ];

  return (
    <div className="App">
      <NavBar />
      <HStack my='-10' mx='50'>
        <Image
          src="https://firebase.google.com/static/downloads/brand-guidelines/SVG/logo-built_white.svg"
          boxSize="300px"
        />{" "}
      </HStack>
      <Grid templateColumns="repeat(2, 1fr)" gap={3}>
        <Box
          mx="50"
          justifyContent="center"
          alignItems="center"
          alignContent="center"
          maxW="600"
        >
          <Input
            placeholder="What location do you want to know the weather of?"
            maxW="500px"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
          ></Input>
          <Button mx="1" my="1" borderRadius="10px" onClick={handleSubmit}>
            Submit
          </Button>
          <Button
            my="3"
            colorScheme="yellow"
            variant="outline"
            onClick={() => {
              fetchWeatherData("Tempe");
            }}
          >
            Use current location
          </Button>
          <Heading>Your Location: {chosenLocation}</Heading>
          {weatherData && (
            <WeatherCard
              data={weatherData}
              transData={translatedData}
              targetLanguage="en"
            ></WeatherCard>
          )}
        </Box>
        <Box py="95">
          <Tabs>
            <TabList>
              {languages.map((language) => (
                <Tab key={language.id} id={`tab-${language.id}`}>
                  {language.name}
                </Tab>
              ))}
            </TabList>
            <TabPanels>
              {languages.map((language) => (
                <TabPanel key={language.id} id={`tabpanel-${language.id}`}>
                  {/* Display translated text for the selected language here */}
                  {weatherData && (
                    <WeatherCard
                      data={weatherData}
                      transData={translatedData}
                      targetLanguage={language.id}
                    ></WeatherCard>
                  )}
                </TabPanel>
              ))}
            </TabPanels>
          </Tabs>
        </Box>
      </Grid>
    </div>
  );
}

export default App;
