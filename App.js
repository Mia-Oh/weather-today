import { useEffect, useState } from 'react';
import reactDom from 'react-dom';
import { View } from 'react-native';

import * as Location from 'expo-location';
import { ActivityIndicator } from 'react-native-web';

import { Fontisto } from '@expo/vector-icons';
import { styled } from 'styled-components/native';

  

  const icons = {
    Clouds:"cloudy",
    Clear:"day-sunny",
    Atmosphere:"cloudy-gusts",
    Snow:"snow",
    Rain:"rains",
    Drizzle:"drizzle",
    Thunderstorm:"ligthning"
  }

const CloudsImage = require('./assets/cloudy.png');
const ClearImage = require('./assets/day-sunny.png');
const AtmosphereImage = require('./assets/cloudy-gusts.png');
const SnowImage = require('./assets/snow.png');
const RainImage = require('./assets/rains.png');
const DrizzleImage = require('./assets/drizzle.png');
const ThunderstormImage = require('./assets/ligthning.png');

const Layout = styled.View`
  flex: 1;

`;

const ImgBackground = styled.ImageBackground`
  flex: 1;
`

const Header = styled.View`
  flex: 0.5;
`

const StyledRegion = styled.View`
  flex: 1;
  justify-content: center;
  align-items: center;
`;

const RegionCountryText = styled.Text`
  font-size: 35px;
  color: white;
  text-shadow: 1px 5px 5px #0009;
`;

const RegionCityText = styled(RegionCountryText)`
  font-size: 55px;
`;


const StyledTemperature = styled.View`
  flex: 1;
  justify-content: center;
  align-items: center;

`;

const TempText = styled(RegionCityText)`
  font-size: 75px;
  font-weight: 600;
  text-shadow: 1px 5px 5px #0009;
`;

const StyledWeather = styled.View`
  flex: 2;  
  flex-direction: row;
  justify-content: center;
  margin-top: 50px;
`;

const StyledDescription = styled.View`
  margin-left: 30px;
`
const WeatherMainText = styled.Text`
  font-size: 40px;
  color: white;
  text-shadow: 1px 5px 5px #0009;
`;

const WeatherSubText = styled(WeatherMainText)`
  font-size: 35px;
`


const StyledIcon = styled.View`
  
`;
 
const App = () => {

  const [isOk, setIsOk] = useState(true);
  const [cityName, setCityName] = useState("Loading")
  const [countryName, setCountryName] = useState("loading")
  const [weather, setWeather] = useState(null)
  const [temperature, setTemperature] = useState(0)

  const ask = async () => {
    const { granted } = await Location.requestForegroundPermissionsAsync();
    if(!granted){
      setIsOk(false)
    }
    // 위도, 경도
    const {coords:{latitude, longitude}} = await Location.getCurrentPositionAsync({accuracy:5})
    const location = await Location.reverseGeocodeAsync(
      {latitude, longitude},
      {useGooleMaps:false}
    )
    setCityName(location[0]?.city)
    setCountryName(location[0]?.country)
    
    const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${APIkey}`)
    const json = await response.json();
    setWeather(json?.weather[0])
    setTemperature((json?.main?.temp - 273).toFixed(1))
  }

  
  
  useEffect(() => {
    ask();
  }, [])

  return (
    <Layout>
      <ImgBackground source={
        weather?.main === 'Clouds' ? CloudsImage : 
        weather?.main === 'Clear' ? ClearImage :
        weather?.main === 'Atmosphere' ? AtmosphereImage :
        weather?.main === 'Snow' ? SnowImage :
        weather?.main === 'Rain' ? RainImage :
        weather?.main === 'Drizzle' ? DrizzleImage :
        weather?.main === 'Thunderstorm' ? ThunderstormImage :
        null
        }> 
        <Header></Header>
        <StyledRegion>
          <RegionCountryText>{countryName}</RegionCountryText>
          <RegionCityText>{cityName}</RegionCityText>
        </StyledRegion>
        { weather?.description === null ? 
          <View>
            <ActivityIndicator 
              size="large"
            />
          </View> : <View></View>
        }
        <StyledTemperature>
          <TempText>{temperature}°</TempText>
        </StyledTemperature> 
        <StyledWeather>
          <StyledIcon>
            <Fontisto name={icons[weather?.main]} size={100} color="white" />
          </StyledIcon>
          <StyledDescription> 
            <WeatherMainText>{weather?.main}</WeatherMainText>
            <WeatherSubText>{weather?.description}</WeatherSubText>
          </StyledDescription>
        </StyledWeather>
      </ImgBackground>
    </Layout>      
  );
  }

export default App;