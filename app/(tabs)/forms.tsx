import React, { useState } from 'react';
import Ionicons from '@expo/vector-icons/Ionicons';
import { StyleSheet, Image, Platform, TextInput, Button, Alert, View} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import * as Print from 'expo-print';
import * as Sharing from 'expo-sharing';

import { Collapsible } from '@/components/Collapsible';
import ParallaxScrollView from '@/components/ParallaxScrollView';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';

export default function TabTwoScreen() {
  const [companyName, setCompanyName] = useState('');
  const [driverName, setDriverName] = useState('');
  const [gstHstNumber, setGstHstNumber] = useState('');
  const [trip, setTrip] = useState('');
  const [layoverHours, setLayoverHours] = useState('');
  const [pickupDropCount, setPickupDropCount] = useState('');
  const [waitingTimeHours, setWaitingTimeHours] = useState('');
  const [startKm, setStartKm] = useState('');
  const [endKm, setEndKm] = useState('');
  const [image, setImage] = useState(null);

  const ratePerMile = 0.63;
  const layoverRate = 85;
  const pickupDropRate = 150;
  const waitingTimeRate = 20;
  const gstRate = 0.05;
  const qstRate = 0.09975;
  const earningsKm = parseInt(endKm) - parseInt(startKm);
  const earningsMiles = earningsKm * 0.621371;

  const calculateEarnings = () => {

    const earnings = earningsMiles * ratePerMile;

    const layoverEarnings = layoverHours * layoverRate;
    const pickupDropEarnings = pickupDropCount * pickupDropRate;
    const waitingTimeEarnings = waitingTimeHours * waitingTimeRate;

    const totalEarnings = earnings + layoverEarnings + pickupDropEarnings + waitingTimeEarnings;

    const gstAmount = totalEarnings * gstRate;
    const qstAmount = totalEarnings * qstRate;

    return {
      earnings: earnings.toFixed(2),
      gst: gstAmount.toFixed(2),
      qst: qstAmount.toFixed(2),
      total: (totalEarnings + gstAmount + qstAmount).toFixed(2),
    };
  };

  const handleSubmit = () => {
    // Handle form submission here
    console.log('Form submitted!');
  };

  const earningsData = calculateEarnings();

  const pickImage = async () => {
    // No permissions request is necessary for launching the image library
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    console.log(result);

    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }
  };

  const generatePDF = async () => {
    try {
      const htmlContent = `
        <h1>Time Sheet</h1>
        <p>Company Name: ${companyName}</p>
        <p>Driver Name: ${driverName}</p>
        <p>GST/HST #: ${gstHstNumber}</p>
        <p>Rate per Mile: $0.63</p>
        <p>Layover: ${layoverHours}</p>
        <p>Pickup/Drop: ${pickupDropCount}</p>
        <p>Waiting Time (Hours): ${waitingTimeHours}</p>
        <p>Trip #: ${trip}</p>
        <p>Start (km): ${startKm}</p>
        <p>End (km): ${endKm}</p>
        <p>Miles:${earningsMiles} </p>
        <p>Earnings: ${earningsData.earnings}</p>
        <p>GST: ${earningsData.gst}</p>
        <p>QST: ${earningsData.qst}</p>
        <p>Total Earnings: ${earningsData.total}</p>
      `;
      const { uri } = await Print.printToFileAsync({ html: htmlContent });

      await Sharing.shareAsync(uri);
    } catch (error) {
      console.error('Error generating PDF:', error);
      Alert.alert('Error', 'Failed to generate PDF. Please try again later.');
    }
  };
  return (
    <ParallaxScrollView
      headerBackgroundColor={{ light: '#D0D0D0', dark: '#353636' }}
      headerImage={<Ionicons size={310} name="code-slash" style={styles.headerImage} />}>
      <ThemedView style={styles.titleContainer}>
        <ThemedText type="title">Forms</ThemedText>
      </ThemedView>
      <ThemedText>Please submit your timesheet to accounting after every trip.</ThemedText>
      <Collapsible title="My Company">
        <TextInput
          style={styles.input}
          placeholder="Company Name"
          value={companyName}
          onChangeText={text => setCompanyName(text)}
        />
        <TextInput
          style={styles.input}
          placeholder="Driver Name"
          value={driverName}
          onChangeText={text => setDriverName(text)}
        />
        <TextInput
          style={styles.input}
          placeholder="GST/HST #"
          value={gstHstNumber}
          onChangeText={text => setGstHstNumber(text)}
        />
      </Collapsible>
      <Collapsible title="My Rate">
        <ThemedText>
        Rate per mile = 0.63</ThemedText>
        <ThemedText>Layover Rate = 85</ThemedText>
        <ThemedText>Pickup/Drop Rate = 150</ThemedText>
        <ThemedText>Waiting Time Rate = 20
        </ThemedText>
      </Collapsible>
      <Collapsible title="My Trip">
      <TextInput
          style={styles.input}
          placeholder="Trip #"
          value={trip}
          onChangeText={text => setTrip(text)}
        />
        <TextInput
          style={styles.input}
          placeholder="Start (km)"
          value={startKm}
          onChangeText={text => setStartKm(text)}
          keyboardType="numeric"
        />
        <TextInput
          style={styles.input}
          placeholder="End (km)"
          value={endKm}
          onChangeText={text => setEndKm(text)}
          keyboardType="numeric"
        />
        <TextInput
          style={styles.input}
          placeholder="Layover"
          value={layoverHours}
          onChangeText={text => setLayoverHours(text)}
          keyboardType="numeric"
        />
        <TextInput
          style={styles.input}
          placeholder="Pickup/Drop"
          value={pickupDropCount}
          onChangeText={text => setPickupDropCount(text)}
          keyboardType="numeric"
        />
        <TextInput
          style={styles.input}
          placeholder="Waiting Time (hours)"
          value={waitingTimeHours}
          onChangeText={text => setWaitingTimeHours(text)}
          keyboardType="numeric"
        />
      </Collapsible>
      <Collapsible title="My Expenses">
        <ThemedText>
          Upload all your expenses (customs crossing, fuel, food, hotel, etc.)
        </ThemedText>
        <View style={styles.container}>
      
      
      <View style={styles.container}>
      <Button title="Upload an image" onPress={pickImage} />
      {image && <Image source={{ uri: image }} style={styles.image} />}
    </View>
    </View>
      </Collapsible>
    </ParallaxScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  image: {
    width: 200,
    height: 200,
  },
  headerImage: {
    color: '#808080',
    bottom: -90,
    left: -35,
    position: 'absolute',
  },
  input: {
    marginBottom: 10,
    padding: 10,
    borderColor: 'gray',
    borderWidth: 1,
    borderRadius: 5,
  },
  titleContainer: {
    flexDirection: 'row',
    gap: 8,
  },
});
