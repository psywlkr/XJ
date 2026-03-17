import React from 'react';
import { 
  View, Text, SectionList, TouchableOpacity, StyleSheet,
  Image, ActivityIndicator
} from 'react-native';
import { useIPTV } from '../context/IPTVContext';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../App';
import { Series } from '../types';

const defaultLogo = require('../assets/icon.png'); 

type SeriesListNavigationProp = StackNavigationProp<RootStackParamList, 'Home'>;

const SeriesList = () => {
  const { series, isLoading } = useIPTV();
  const navigation = useNavigation<SeriesListNavigationProp>();

  const handleSeriesPress = (series: Series) => {
    navigation.navigate('Season', { series: series });
  };

  const groupedData = React.useMemo(() => {
    if (series.length === 0) return [];
    
    const groups = series.reduce((acc, series) => {
      const groupTitle = series.group || 'Inconnu';
      if (!acc[groupTitle]) {
        acc[groupTitle] = [];
      }
      acc[groupTitle].push(series);
      return acc;
    }, {} as Record<string, Series[]>);

    return Object.keys(groups).sort().map(title => ({
      title: title,
      data: groups[title]
    }));
  }, [series]);

  const renderItem = ({ item }: { item: Series }) => (
    <TouchableOpacity 
      style={styles.item} 
      onPress={() => handleSeriesPress(item)}
    >
      <Image 
        style={styles.logo}
        source={item.cover ? { uri: item.cover } : defaultLogo}
        defaultSource={defaultLogo}
        resizeMode="contain"
      />
      <View style={styles.info}>
        <Text style={styles.name}>{item.name}</Text>
        <Text style={styles.count}>{item.seasons.length} Saison(s)</Text>
      </View>
    </TouchableOpacity>
  );

  const renderSectionHeader = ({ section: { title } }: { section: { title: string } }) => (
    <Text style={styles.header}>{title}</Text>
  );

  if (isLoading) {
    return (
      <View style={[styles.container, styles.centered]}>
        <ActivityIndicator size="large" color="#FFD700" />
      </View>
    );
  }
  if (series.length === 0) {
    return (
      <View style={[styles.container, styles.centered]}>
        <Text style={styles.emptyText}>Aucune série trouvée.</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <SectionList
        sections={groupedData}
        renderItem={renderItem}
        renderSectionHeader={renderSectionHeader}
        keyExtractor={(item) => item.id}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
        stickySectionHeadersEnabled={true}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#000000' }, // Deep black
  header: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFD700', // Gold text
    backgroundColor: '#0A0A0A', // Slightly lighter black
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#FFD700', // Gold border
    textShadowColor: 'rgba(255, 215, 0, 0.3)',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 5,
  },
  centered: { justifyContent: 'center', alignItems: 'center', flex: 1 },
  emptyText: { color: '#FFD700', textAlign: 'center', fontWeight: '500' }, // Gold text
  item: { flexDirection: 'row', padding: 10, alignItems: 'center' },
  logo: {
    width: 50,
    height: 75,
    marginRight: 15,
    backgroundColor: '#1A1A1A',
    borderRadius: 4,
    borderWidth: 1,
    borderColor: '#333',
  },
  info: { flex: 1 },
  name: { color: '#FFD700', fontSize: 16, fontWeight: '500' }, // Gold text
  count: { color: '#B8860B', fontSize: 12, marginTop: 4 }, // Darker gold for secondary text
  separator: { height: 1, backgroundColor: '#1A1A1A', marginLeft: 75 },
});

export default SeriesList;