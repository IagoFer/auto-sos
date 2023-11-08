import React from "react";
import { Text, View, TouchableOpacity } from "react-native";
import MapView, { Marker } from "react-native-maps";

export function AcompanharRota() {
  return (
    <MapView
      style={{ flex: 1 }}
      initialRegion={{
        latitude: -3.8114824,
        longitude: -38.5602914,
        latitudeDelta: 0.0922,
        longitudeDelta: 0.0421,
      }}
    >
      <Marker coordinate={{ latitude: -3.8114824, longitude: -38.5602914 }} />
    </MapView>
  );
}
