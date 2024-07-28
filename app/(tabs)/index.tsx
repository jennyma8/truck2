import { Image, StyleSheet, Platform, View, FlatList, Text } from 'react-native';
import ParallaxScrollView from '@/components/ParallaxScrollView';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';

export default function HomeScreen() {
  return (
    <ParallaxScrollView
      headerBackgroundColor={{ light: '#A1CEDC', dark: '#1D3D47' }}
      headerImage={
        <Image
          source={require('@/assets/images/truck.jpg')}
          style={styles.reactLogo}
        />
      }>
      <ThemedView style={styles.titleContainer}>
        <ThemedText type="title">Trucker's Log Book</ThemedText>
      </ThemedView>
      <ThemedView style={styles.stepContainer}>
        <ThemedText>
Ensure compliance with HOS regulations enforced by the Federal Motor Carrier Safety Administration (FMCSA)

</ThemedText>

<ThemedText type="subtitle">Documentation and accountability </ThemedText>
<ThemedText>Log books act as a documented trail of a driver's activities, providing crucial information about their driving and working hours. This documentation can be essential in various scenarios, including:  



 </ThemedText>
 <ThemedText>- Audits.</ThemedText>
 <ThemedText>- Accident investigations.</ThemedText>
 <ThemedText>- Legal proceedings.</ThemedText>

      </ThemedView>
    </ParallaxScrollView>
  );
}

const styles = StyleSheet.create({
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  stepContainer: {
    gap: 8,
    marginBottom: 8,
  },
  reactLogo: {
    height: 250,
    width: 360,
   
  },
});
