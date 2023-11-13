import React, { useEffect, useState, useRef } from "react";
import { Text, View, TouchableOpacity } from "react-native";
import MapView, { Marker } from "react-native-maps";
import { useUser } from '../context/UserContext';

export function AcompanharRota() {
  const { userEmail, userPassword } = useUser();
  const [lat, setLat] = useState(-3.7732276693754225);
  const [lng, setLng] = useState(-38.56025726375297);
  const [lat2, setLat2] = useState(-3.7948098482365817);
  const [lng2, setLng2] = useState(-38.550558395860456);
  let currentAnnotationRef = useRef();

  useEffect(() => {
    async function loadPosistion(){
      try {
        const userData = {
          email: userEmail,
          password: userPassword,
        };

        console.log(userData)

        const numero = Math.random() * (10 - 1) + 1;

        

        // const res = await  fetch(
        //   `http://206.189.181.153:8080/sosAuto/companies?` +
        //     new URLSearchParams(userData),
        //   {
        //     method: 'GET',
        //     headers: {
        //       'Content-Type': 'application/json',
        //     },
        //   }
        // )

        // const resData = await res.json();

        // console.log(resData)

        console.log("loop")

      //  setLat(prev => prev*0.5);

        // setTimeout(() => loadPosistion(), 10000);
      } catch (error) {
        console.log(error)
       
      } finally {
        currentAnnotationRef.current = setTimeout(loadPosistion, 10000);
      }
    }

    currentAnnotationRef.current = setTimeout(loadPosistion, 0);

    return () => clearTimeout(currentAnnotationRef.current);
  }, []);

  useEffect(() => {

  }, [lat, lng, lat2, lng2]);

  return (
    <MapView
      style={{ flex: 1 }}
      initialRegion={{
        latitude: lat,
        longitude: lng,
        latitudeDelta: 0.0922,
        longitudeDelta: 0.0421,
      }}
    >
      <Marker coordinate={{ latitude: lat, longitude: lng }} />
      <Marker coordinate={{ latitude: lat2, longitude: lng2 }} />
    </MapView>
  );
}
