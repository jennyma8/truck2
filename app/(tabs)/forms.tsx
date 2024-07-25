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
      const today = new Date();
    const formattedDate = today.toLocaleDateString(); // Format date as needed

      const htmlContent = `
        <html>
      <head>
        <style>
          body {
            font-family: Arial, sans-serif;
            padding: 20px;
          }
          h1 {
            color: #333;
          }
          p {
            font-size: 14px;
            color: #666;
          }
          .section-title {
            font-weight: bold;
            margin-top: 20px;
            font-size: 16px;
            color: #000;
          }
          .styled-table {
            border-collapse: collapse;
            margin: 25px 0;
            font-size: 0.9em;
            font-family: sans-serif;
            min-width: 400px;
            box-shadow: 0 0 20px rgba(0, 0, 0, 0.15);
          }
          .styled-table thead tr {
            background-color: #009879;
            color: #ffffff;
            text-align: left;
          }
          .styled-table th,
          .styled-table td {
            padding: 12px 15px;
          }
          .styled-table tbody tr {
    border-bottom: 1px solid #dddddd;
}

.styled-table tbody tr:nth-of-type(even) {
    background-color: #f3f3f3;
}

.styled-table tbody tr:last-of-type {
    border-bottom: 2px solid #009879;
}
    .styled-table tbody tr.active-row {
    font-weight: bold;
    color: #009879;
    text-align: right;
}
    .center {
            text-align: center;
          }
            .logo {
         
              width: 100px;
              height: auto;
            }
              footer {
              position: absolute;
              bottom: 0;
              left: 0;
              width: 100%;
              text-align: right;
              padding: 10px;
              border-top: 1px solid #dddddd;
            }
      
        </style>
      </head>
      <body>
        
       
        <img src="data:image/jpeg;base64,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" class="logo" />
         <h1>DRIVER'S DAILY LOG</h1>
         <p class="section-title">Company Information</p>
        <p>Company Name: <b>${companyName}</b></p>
        <p>Driver Name: <b>${driverName}</b></p>
        <p>GST/HST #: <b>${gstHstNumber}</b></p>
        <p>Rate per Mile: <b>$0.63</b></p>

        <table class="styled-table">
          <thead>
            <tr>
              <th>Trip</th>
              <th>Layover</th>
              <th>Pickup/Drop</th>
              <th>Waiting Time (Hours)</th>
              <th>Start (km) </th>
              <th>End (km)</th>
              <th>Miles</th>
              <th>Earnings</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>${trip}</td>
              <td class="center">${layoverHours}</td>
              <td class="center">${pickupDropCount}</td>
              <td class="center">${waitingTimeHours}</td>
              <td>${startKm}</td>
              <td>${endKm}</td>
              <td>${earningsMiles}</td>
              <td>$${earningsData.earnings}</td>
            </tr>
            <tr class="active-row">
              <td colspan="8">GST: $${earningsData.gst}</td>
            </tr>
            <tr class="active-row" >
              <td colspan="8">QST: $${earningsData.qst}</td>
            </tr>
            <tr class="active-row">
              <td colspan="8">Total Earnings: $${earningsData.total}</td>
            </tr>
          </tbody>
        </table>
        <footer>I hereby certify that I have signed and submitted this form on ${formattedDate}</footer>
      </body>
      </html>
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
      <ThemedText>Please submit your trucker's log book to accounting after every trip.</ThemedText>
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
          placeholder="Trip"
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
      <Button title="Generate PDF & Share" onPress={generatePDF} />
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
