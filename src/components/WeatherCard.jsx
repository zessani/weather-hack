import React, { useState, useEffect } from "react";
import { Box, Text, Button } from "@chakra-ui/react";
import axios from "axios";

const WeatherCard = ({ data, transData, targetLanguage }) => {
  const [showFullInfo, setShowFullInfo] = useState(false);
  const [backgroundImage, setBackgroundImage] = useState("");

  const toggleFullInfo = () => {
    setShowFullInfo(!showFullInfo);
  };

  const fetchSunriseSunset = async (latitude, longitude) => {
    try {
      const response = await axios.get(
        `https://api.sunrise-sunset.org/json?lat=${latitude}&lng=${longitude}`
      );
      const { sunrise, sunset } = response.data.results;

      const currentTime = new Date().getTime();
      const sunriseTime = new Date(sunrise).getTime();
      const sunsetTime = new Date(sunset).getTime();

      const newBackgroundImage = setBackground(
        currentTime,
        sunriseTime,
        sunsetTime,
        data.weather[0].description
      );
      setBackgroundImage(newBackgroundImage);
    } catch (error) {
      console.error("Error fetching sunrise and sunset times:", error);
    }
  };

  const setBackground = (
    currentTime,
    sunriseTime,
    sunsetTime,
    weatherDescription
  ) => {
    let newBackgroundImage = "";

    const isDaytime = currentTime >= sunriseTime && currentTime < sunsetTime;

    if (isDaytime) {
      if (
        weatherDescription.includes("clear sky") ||
        weatherDescription.includes("sunny")
      ) {
        newBackgroundImage =
          "url('https://www.vmcdn.ca/f/files/sudbury/uploadedImages/SUMMER_sunWater.jpg;w=660')"; // Image for clear sunny day
      } else if (
        weatherDescription.includes("partly cloudy") ||
        weatherDescription.includes("haze") ||
        weatherDescription.includes("smoke") ||
        weatherDescription.includes("few clouds")
      ) {
        newBackgroundImage =
          "url('https://arizonaoddities.com/wp-content/uploads/2012/06/Clouds.jpg')"; // Image for partly cloudy day
      } else if (weatherDescription.includes("cloud")) {
        newBackgroundImage =
          "url('https://img.freepik.com/premium-photo/blue-sky-background-with-clouds_538646-10263.jpg')"; // Image for cloudy day
      } else if (
        weatherDescription.includes("rain") ||
        weatherDescription.includes("shower")
      ) {
        newBackgroundImage =
          "url('https://i.pinimg.com/736x/9b/40/54/9b40542ed2d19df7530b331e0e5d0a03.jpg')"; // Image for rainy day
      }
    } else {
      if (
        weatherDescription.includes("clear sky") ||
        weatherDescription.includes("dark")
      ) {
        newBackgroundImage =
          "url('https://wallpapercave.com/wp/wp5569646.jpg')"; // Image for clear night sky
      } else if (
        weatherDescription.includes("partly cloudy") ||
        weatherDescription.includes("few clouds")
      ) {
        newBackgroundImage =
          "url('https://img.freepik.com/premium-photo/night-sky-sea-background-full-moon_568886-839.jpg')"; // Image for partly cloudy night
      } else if (weatherDescription.includes("cloud")) {
        newBackgroundImage =
          "url('https://live.staticflickr.com/8372/8593604572_4ac513bcb2_b.jpg')"; // Image for cloudy night
      } else if (
        weatherDescription.includes("rain") ||
        weatherDescription.includes("shower")
      ) {
        newBackgroundImage =
          "url('https://img.freepik.com/free-vector/realistic-clouds-with-falling-rain_1017-33597.jpg')"; // Image for rainy night
      }
    }

    return newBackgroundImage;
  };

  useEffect(() => {
    fetchSunriseSunset(data.coord.lat, data.coord.lon);
  }, [data.coord.lat, data.coord.lon]);

  const backgroundStyle = {
    backgroundImage: backgroundImage,
    backgroundSize: "cover",
    backgroundRepeat: "no-repeat",
    backgroundPosition: "center",
  };

  return (
    <Box
      borderWidth="1px"
      borderRadius="lg"
      p={4}
      mt={4}
      style={backgroundStyle}
    >
      <Text>
        {transData.temp[targetLanguage]}: {data.main.temp}°C
      </Text>
      <Text>
        {transData.feels_like[targetLanguage]}: {data.main.feels_like}°C
      </Text>
      {showFullInfo && (
        <>
          <Text>
            {transData.max_temp[targetLanguage]}: {data.main.temp_max}°C
          </Text>
          <Text>
            {transData.min_temp[targetLanguage]}: {data.main.temp_min}°C
          </Text>
          <Text>
            {transData.humidity[targetLanguage]}: {data.main.humidity}%
          </Text>
          <Text>
            {transData.pressure[targetLanguage]}: {data.main.pressure} hPa
          </Text>
          <Text>
            {transData.wind_speed[targetLanguage]}: {data.wind.speed} m/s
          </Text>
          <Text>
            {transData.wind_direction[targetLanguage]}: {data.wind.deg}°
          </Text>
          <Text>
            {transData.haze[targetLanguage]}: {data.clouds.all}%
          </Text>
          <Text>
            {transData.sunrise[targetLanguage]}:{" "}
            {new Date(data.sys.sunrise * 1000).toLocaleTimeString()}
          </Text>
          <Text>
            {transData.sunset[targetLanguage]}:{" "}
            {new Date(data.sys.sunset * 1000).toLocaleTimeString()}
          </Text>
        </>
      )}
      <Button mt={2} colorScheme="yellow" onClick={toggleFullInfo}>
        {showFullInfo ? "Show Less" : "Show More"}
      </Button>
    </Box>
  );
};

export default WeatherCard;
