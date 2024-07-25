import { Image, StyleSheet, Platform, View, FlatList, Text } from 'react-native';

import { HelloWave } from '@/components/HelloWave';
import ParallaxScrollView from '@/components/ParallaxScrollView';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';

export default function HomeScreen() {
  return (
    <ParallaxScrollView
      headerBackgroundColor={{ light: '#A1CEDC', dark: '#1D3D47' }}
      headerImage={
        <Image
          source={require('@/assets/images/partial-react-logo.png')}
          style={styles.reactLogo}
        />
      }>
      <ThemedView style={styles.titleContainer}>
        <ThemedText type="title">Welcome!</ThemedText>
        <HelloWave />
      </ThemedView>
      <ThemedView style={styles.stepContainer}>
        <ThemedText type="subtitle">Trucker's Log Book</ThemedText>
        
        <ThemedText type="subtitle">Hours of Service compliance </ThemedText>
        <ThemedText>
One of the main reasons for maintaining a log book is to ensure compliance with HOS regulations. These regulations, enforced by the Federal Motor Carrier Safety Administration (FMCSA), determine the number of hours a driver can drive and the minimum amount of rest required.  

By accurately recording their activities and breaks, drivers can prove their compliance with these important safety regulations, which helps prevent fatigue-related accidents and promotes road safety.  
</ThemedText>

<ThemedText type="subtitle">Documentation and accountability </ThemedText>
<ThemedText>Log books act as a documented trail of a driver's activities, providing crucial information about their driving and working hours. This documentation can be essential in various scenarios, including:  



 </ThemedText>
<View>
      <FlatList
        data={[
          {key: '- Audits.'},
          {key: '- Accident investigations. '},
          {key: '- Legal proceedings.'},
         
        ]}
        renderItem={({item}) => <Text>{item.key}</Text>}
      />
    </View>
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
    height: 178,
    width: 290,
    bottom: 0,
    left: 0,
    position: 'absolute',
  },
});
