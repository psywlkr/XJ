import React from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet } from 'react-native';
import { RouteProp, useRoute, useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../App';
import { Season } from '../types';

type SeasonScreenRouteProp = RouteProp<RootStackParamList, 'Season'>;
type SeasonScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Season'>;

const SeasonScreen = () => {
  const route = useRoute<SeasonScreenRouteProp>();
  const navigation = useNavigation<SeasonScreenNavigationProp>();
  
  const { series } = route.params;

  const handleSeasonPress = (season: Season) => {
    navigation.navigate('Episode', { season: season });
  };

  const renderItem = ({ item }: { item: Season }) => (
    <TouchableOpacity 
      style={styles.item}
      onPress={() => handleSeasonPress(item)}
    >
      <Text style={styles.name}>{item.name}</Text>
      <Text style={styles.count}>{item.episodes.length} Épisode(s)</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={series.seasons}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#000000' }, // Deep black
  item: { padding: 15 },
  name: { color: '#FFD700', fontSize: 16, fontWeight: '500' }, // Gold text
  count: { color: '#B8860B', fontSize: 12, marginTop: 4 }, // Darker gold
  separator: { height: 1, backgroundColor: '#1A1A1A' },
});

export default SeasonScreen;