import React, { useCallback, useEffect, useState } from 'react';
import { StyleSheet, TextInput, View, Image, SafeAreaView, TouchableOpacity, Text, ScrollView } from 'react-native';
import { theme } from '../theme';
import { CakeIcon, CalendarDaysIcon, MagnifyingGlassIcon } from 'react-native-heroicons/outline';
import { MapPinIcon } from 'react-native-heroicons/solid';
import { debounce } from 'lodash';
import { fetchLocations, fetchWeatherForecast } from '../api/Weather';
import { weatherImages } from '../constants';
import * as Progress from 'react-native-progress';
import { getData, storeData } from '../constants/AsyncStorage';

const HomeScreen = () => {

  const [showSearch, toogleSearch] = useState('');
  const [locations, setLocations] = useState([]);
  const [weather, setWeather] = useState({});
  const [loading, setLoading] = useState(true);

  const handleLocation = (loc) => {
    console.log('Location: ', loc);  //get Search loc click country/city data
    setLocations([]);
    toogleSearch(false);
    setLoading(true);
    fetchWeatherForecast({
      cityName: loc.name,
      days: '7'
    }).then(data => {
      setWeather(data);
      setLoading(false);
      storeData('city', loc.name); 
      console.log('Got Forcosest Data', data)  // Country city forecast data
    })
  }

  const handleSearch = value => {
    //Fetch Loactions
    if (value.length > 2) {
      fetchLocations({ cityName: value }).then(data => {
        setLocations(data);
        console.log('get Locations', data);
      })
    }
  }

  useEffect(() => {
    fetchMyWeatherData();
  })

  const fetchMyWeatherData = async () => {

    let myCity = await getData('city');
    let cityName = 'Islamabad';
    if(myCity) cityName = myCity;

    fetchWeatherForecast({
      cityName,
      days: '7',
    }).then(data=>{
      setWeather(data);
      setLoading(false)
    })
  }

  const handleTextDebounce = useCallback(debounce(handleSearch, 1200), []);

  const { current, location } = weather;

  return (
    <View style={{ flex: 1, position: 'relative' }}>

      <Image source={require('../assets/images/bg.png')}
        style={{ width: '100%', height: '100%', position: 'absolute' }} blurRadius={70}></Image>

        {
          loading ? (
            <View style={{flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center'}}>
              {/* <Text style={{color: 'white', fontSize: 30, fontWeight: 'bold'}}>Loading...</Text> */}
              <Progress.CircleSnail thickness={10} size={140} color={'#0bb3b2'}></Progress.CircleSnail>
            </View>
          ) : (
            <SafeAreaView style={{ flex: 1 }}>

            {/* Search Section */}
            <View style={{ marginTop: 10, paddingHorizontal: 10, height: 40 }}>
              <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', borderRadius: 50, paddingHorizontal: 5, backgroundColor: showSearch ? theme.bgWhite(0.2) : 'transparent' }}>
    
                {
                  showSearch ? (
                    <TextInput placeholder='Search City' placeholderTextColor={'lightgrey'} style={{color: 'white'}} onChangeText={handleTextDebounce}></TextInput>
                  ) : null
                }
    
                <TouchableOpacity onPress={() => toogleSearch(!showSearch)} style={{ backgroundColor: theme.bgWhite(0.3), padding: 5, borderRadius: 20 }}>
                  <MagnifyingGlassIcon size={22} color={'white'}></MagnifyingGlassIcon>
                </TouchableOpacity>
              </View>
    
              {
                locations.length > 0 && showSearch ? (
                  <View style={{ position: 'absolute', width: '100%', backgroundColor: '#ccc7ba', marginTop: '13%', borderRadius: 10, alignSelf: 'center' }}>
                    {
                      locations.map((loc, index) => {
                        return (
                          <TouchableOpacity
                            onPress={() => handleLocation(loc)}
                            key={index}
                            style={{ flexDirection: 'row', alignItems: 'center', padding: 14, marginBottom: 5, paddingHorizontal: 10, borderBottomColor: 'black', borderBottomWidth: 1 }}>
                            <MapPinIcon size={20} color={'grey'}></MapPinIcon>
                            <Text style={{ color: 'black', paddingLeft: 3, fontWeight: '600' }}>{loc?.name}, {loc?.country}</Text>
                          </TouchableOpacity>
                        )
                      })
                    }
                  </View>
                ) : null
              }
    
            </View>
    
            {/* Forecast Section  */}
            <View style={{ alignItems: 'center', justifyContent: 'space-around', flex: 1 }}>
              {/* Locations */}
              <Text style={{ color: 'white', fontWeight: 'bold', fontSize: 20 }}>{location?.name}, <Text style={{ fontWeight: '700', color: 'grey', fontSize: 15 }}>{"" + location?.country}</Text></Text>
    
              {/* Weather Image  */}
              <View style={{ flexDirection: 'row', justifyContent: 'center' }}>
                <Image source={weatherImages[current?.condition?.text]} style={{ width: 155, height: 155 }}></Image>
                {/* source={{uri: 'https:' + current.condition.icon}} */}
              </View>
              {/* Degree Celcius */}
              <View style={{ alignItems: 'center' }}>
                <Text style={{ color: 'white', fontSize: 50, fontWeight: 'bold', textAlign: 'center' }}>{current?.temp_c}&#176;</Text>
                <Text style={{ color: 'white', fontSize: 20, fontWeight: 'bold', textAlign: 'center' }}>{current?.condition?.text}</Text>
              </View>
    
              {/* Other Stats */}
              <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                <View style={{ flexDirection: 'row', alignItems: 'center', marginHorizontal: 25 }}>
                  <Image source={require('../assets/icons/wind.png')} style={{ height: 21, width: 21 }}></Image>
                  <Text style={{ color: 'white', fontSize: 15, paddingLeft: 5 }}>{current?.wind_kph}km</Text>
                </View>
                <View style={{ flexDirection: 'row', alignItems: 'center', marginHorizontal: 25 }}>
                  <Image source={require('../assets/icons/drop.png')} style={{ height: 21, width: 21 }}></Image>
                  <Text style={{ color: 'white', fontSize: 15, paddingLeft: 5 }}>{current?.humidity}%</Text>
                </View>
                <View style={{ flexDirection: 'row', alignItems: 'center', marginHorizontal: 25 }}>
                  <Image source={require('../assets/icons/sun.png')} style={{ height: 21, width: 21 }}></Image>
                  <Text style={{ color: 'white', fontSize: 15, paddingLeft: 5 }}>{weather?.forecast.forecastday[0]?.astro?.sunrise}</Text>
                </View>
              </View>
    
            </View>
    
            {/* Forecast Session For Next Days */}
            <View style={{ marginBottom: 2, marginVertical: 5 }}>
              <View style={{ flexDirection: 'row', alignItems: 'center', marginVertical: 10, marginLeft: 10 }}>
                <CalendarDaysIcon size={20} color={'white'}></CalendarDaysIcon>
                <Text style={{ color: 'white', paddingLeft: 5 }}>Daily forecast</Text>
              </View>
              <ScrollView
                horizontal
                contentContainerStyle={{ paddingHorizontal: 15, paddingVertical: 10 }}
                showsHorizontalScrollIndicator={false}
              >
    
              {
                weather?.forecast?.forecastday?.map((item, index) => {
    
                  const date = new Date(item.date);
                  const options = { weekday: 'long' };
                  let dayName = date.toLocaleDateString('en-US', options);
                  dayName = dayName.split(',')[0];
    
                  return(
                    <View key={index} style={{ flex: 1, justifyContent: 'center', alignItems: 'center', width: 70, paddingVertical: 10, marginHorizontal: 10, borderRadius: 10, backgroundColor: theme.bgWhite(0.15) }}>
                    <Image source={weatherImages[item?.day?.condition?.text]} style={{ width: 30, height: 30 }}></Image>
                    <Text style={{ color: 'white', fontSize: 13 }}>{dayName}</Text>
                    <Text style={{ color: 'white' }}>{item?.day?.avgtemp_c}&#176;</Text>
                  </View>
                  )
                })
              }
    
              </ScrollView>
            </View>
          </SafeAreaView>
          )
        }

     

    </View>
  )
}

export default HomeScreen;

const styles = StyleSheet.create({})