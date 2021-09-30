import React, { useState } from "react";
import { useRoute, useNavigation } from "@react-navigation/native";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  Keyboard,
} from "react-native";
import {
  StripeProvider,
  CardField,
  useConfirmPayment,
} from "@stripe/stripe-react-native";
import LottieView from "lottie-react-native";
//import { useSelector } from "react-redux";
import { ActivityIndicator } from "react-native-paper";
import firebase from "../utils/firebase";
import config from "../utils/config";

export default function Payment() {
  const [cardDetails, setCardDetails] = useState({ complete: false });
  const { confirmPayment, loading } = useConfirmPayment();

  //const userInfo = useSelector((state) => state.authReducer);
  const navigator = useNavigation();
  const route = useRoute();

  /* const { items } = useSelector((state) => state.cartReducer.selectedItems);

  const total = items
    .map((item) => Number(item.price.replace("$", "")))
    .reduce((prev, curr) => prev + curr, 0)
    .toFixed(2);
  console.log(total); */

  const fetchPaymentClientSecret = async () => {
    const response = await fetch(
      "https://uber-eats-serverless.vercel.app/api/create-payment-intent",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ amount: route.params.total }),
      }
    );
    console.log(amount);
    const { clientSecret, error } = await response.json();

    return { clientSecret, error };
  };

  const handlePayment = async () => {
    if (!cardDetails.complete) {
      return Alert.alert(
        "Please Fill Card Details",
        "Please Fill Your Card Details To Complete The Payment"
      );
    }
    const billingDetails = {
      email: "userInfo.email@gmail.com",
    };
    try {
      const { clientSecret, error } = await fetchPaymentClientSecret();

      if (!error) {
        return Alert.alert(
          "Error Occurred",
          "Error Occurred, Please Try Again Later"
        );
      } else {
        const { paymentIntent, error } = await confirmPayment(clientSecret, {
          type: "Card",
          billingDetails: billingDetails,
        });
        if (!error) {
          return Alert.alert(
            "Error Occurred",
            "Error Occurred, Please Try Again Later"
          );
        } else if (paymentIntent) {
          paymentSuccessful();
        }
      }
    } catch (e) {
      return Alert.alert(
        "Error Occurred",
        "Error Occurred, Please Try Again Later"
      );
    }
  };

  const paymentSuccessful = () => {
    firebase
      .firestore()
      .collection("orders")
      .doc(route.params.firebaseId)
      .set(
        {
          paid: true,
        },
        { merge: true }
      )
      .then(() => {
        navigator.navigate("OrderCompleted", route.params);
        Keyboard.dismiss();
      });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.mainText}>One More Step !</Text>
      <Text style={styles.secondaryText}>
        Verify Your Payment To Place The Order
      </Text>
      <View>
        <LottieView
          style={styles.lottiePayment}
          source={require("../../assets/animations/payment.json")}
          autoPlay
          speed={0.5}
          loop={false}
        />
      </View>
      <StripeProvider publishableKey={config.STRIPE_PUBLISHABLE_KEY}>
        <CardField
          postalCodeEnabled={false}
          placeholder={{
            number: "4242 4242 4242 4242",
          }}
          onCardChange={(card) => {
            setCardDetails(card);
          }}
          cardStyle={styles.card}
          style={styles.cardContainer}
        />

        {loading ? (
          <ActivityIndicator style={{ marginTop: 20 }} size={50} />
        ) : (
          <TouchableOpacity
            style={styles.payButton}
            activeOpacity={0.7}
            onPress={handlePayment}
          >
            <Text style={styles.payButtonText}>Pay</Text>
          </TouchableOpacity>
        )}
      </StripeProvider>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 30,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fafafa",
    flex: 1,
  },
  mainText: {
    fontSize: 24,
    //fontFamily: "Nunito",
    marginBottom: 10,
  },
  secondaryText: {
    fontSize: 17,
    //fontFamily: "Nunito",
  },
  lottiePayment: {
    width: 300,
    height: 300,
    marginTop: -25,
    marginBottom: -60,
  },
  cardContainer: {
    height: 50,
    width: "100%",
  },
  card: {
    backgroundColor: "#ffffff",
    width: "100%",
  },
  payButton: {
    paddingHorizontal: 39,
    paddingVertical: 12,
    backgroundColor: "black",
    borderRadius: 12,
    marginTop: 20,
  },
  payButtonText: {
    color: "white",
    fontSize: 18,
    //fontFamily: "Nunito",
  },
});
