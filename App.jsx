import React, { useState, useEffect } from "react";
import { IconButton, Button } from "@chakra-ui/button";
import { useColorMode } from "@chakra-ui/color-mode";
import { Input, Text } from "@chakra-ui/react";
import { MoonIcon, SunIcon } from "@chakra-ui/icons";
import { VStack, Flex, Spacer } from "@chakra-ui/layout";
import { Heading, Box, Image } from "@chakra-ui/react";
import NavBar from "./components/NavBar";
import WeatherCard from "./components/WeatherCard";

function App() {
  const { colorMode, toggleColorMode } = useColorMode();
  const isDark = colorMode === "dark";
  const [location, setLocation] = useState("");
  const [chosenLocation, setChosenLocation] = useState("");
  const [weatherData, setWeatherData] = useState(null);
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
        // Handle errors, e.g., display an error message to the user
      });
    console.log(weatherData);
    formattedData = {
      "Location": location,
      "Temperature": weatherData.main.temp,
      "Feels like": weatherData.main.feels_like,
      "Min Temperature": weatherData.main.temp_min,
      "Max Temperature": weatherData.main.temp_max,
      "Pressure": weatherData.main.humidity,
      "Weather": weatherData.weather[0].description,
      "Wind speed": weatherData.wind.speed,
      "Wind Direction": weatherData.wind.deg,
      "Cloudiness": weatherData.clouds.all,
    };
  };

  return (
    <div className="App">
      <NavBar />
      <Heading px="50px" py="50px">
        A weather forecast app
      </Heading>
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
        />
        <Button onClick={handleSubmit}>Submit</Button>
        <Button
          my="3"
          colorScheme="teal"
          variant="outline"
          onClick={() => fetchWeatherData("Tempe")}
        >
          Use current location
        </Button>
        <Heading>Your Location: {chosenLocation}</Heading>
        {weatherData && (
          <Box>
            <Text>Temperature: {weatherData.main.temp}°C</Text>
            <Text>Feels Like: {weatherData.main.feels_like}°C</Text>
            <Text>Max Temperature: {weatherData.main.temp_max}°C</Text>
            <Text>Humidity: {weatherData.main.humidity}%</Text>
            <Text>Pressure: {weatherData.main.pressure} hPa</Text>
            <Text>Weather: {weatherData.weather[0].description}</Text>
            <Text>Wind Speed: {weatherData.wind.speed} m/s</Text>
            <Text>Wind Direction: {weatherData.wind.deg}°</Text>
            <Text>Cloudiness: {weatherData.clouds.all}%</Text>
            <Text>
              Sunrise:{" "}
              {new Date(weatherData.sys.sunrise * 1000).toLocaleTimeString()}
            </Text>
            <Text>
              Sunset:{" "}
              {new Date(weatherData.sys.sunset * 1000).toLocaleTimeString()}
            </Text>

            <WeatherCard data={formattedData}> </WeatherCard>
          </Box>
        )}
      </Box>
    </div>
  );
}

export default App;
