import { StyleSheet, Text, View, Pressable, Image } from "react-native";
import React, { useContext } from "react";
import { UserType } from "../UserContext";
import { useNavigation } from "@react-navigation/native";

export default function Text1({ item, pedidoRequests, setPedidoRequests  }) {
  const StyleSheet = StyleSheet.create({});
  const { userId, setUserId } = useContext(UserType);
  const navigation = useNavigation();
  const acceptRequest = async (pedidoRequestId) => {
    try {
      const response = await fetch(
        "http://localhost:3005/pedido-request/accept",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            senderId: pedidoRequestId,
            recepientId: userId,
          }),
        }
      );

      if (response.ok) {
        setPedidoRequests(
          pedidoRequests.filter((request) => request._id !== pedidoRequestId)
        );
        navigation.navigate("Chats");
      }
    } catch (err) {
      console.log("error acceptin the pedido request", err);
    }
  };
  return (
    <Pressable
      style={{
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        marginVertical: 10,
      }}
    >
      <Image
        style={{ width: 50, height: 50, borderRadius: 25 }}
        source={{ uri: item.image }}
      />

      <Text
        style={{ fontSize: 15, fontWeight: "bold", marginLeft: 10, flex: 1 }}
      >
        {item?.name} sent you a pedido request!!
      </Text>

      <Pressable
        onPress={() => acceptRequest(item._id)}
        style={{ backgroundColor: "#0066b2", padding: 10, borderRadius: 6 }}
      >
        <Text style={{ textAlign: "center", color: "white" }}>Accept</Text>
      </Pressable>
    </Pressable>
  );
};



