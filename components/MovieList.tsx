import React from 'react';
import { 
  View, Text, SectionList, TouchableOpacity, StyleSheet,
  Image, ActivityIndicator
} from 'react-native';
import { useIPTV } from '../context/IPTVContext';
import { useNavigation } from '@react-navigation/native';
import { Movie } from '../types';

const defaultLogo = require('../assets/icon.png'); 

const MovieList = () => {
  const { movies, playStream, isLoading } = useIPTV();
  const navigation = useNavigation();

  const handleMoviePress = (movie: Movie) => {
    console.log('CLIC SUR FILM:', movie.name); 
    playStream({ url: movie.streamUrl, id: movie.id });
    navigation.navigate('Player');
  };
  
  const groupedData = React.useMemo(() => {
    if (movies.length === 0) return [];
    
    const groups = movies.reduce((acc, movie) => {
      const groupTitle = movie.group || 'Inconnu';
      if (!acc[groupTitle]) {
        acc[groupTitle] = [];
      }
      acc[groupTitle].push(movie);
      return acc;
    }, {} as Record<string, Movie[]>);

    return Object.keys(groups).sort().map(title => ({
      title: title,
      data: groups[title]
    }));
  }, [movies]);
  
  const renderItem = ({ item }: { item: Movie }) => (
    <TouchableOpacity 
      style={styles.item} 
      onPress={() => handleMoviePress(item)}
    >
      <Image 
        style={styles.logo}
        source={item.cover ? { uri: item.cover } : defaultLogo}
        defaultSource={defaultLogo}
        resizeMode="contain"
      />
      <View style={styles.info}>
        <Text style={styles.name}>{item.name}</Text>
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

  if (movies.length === 0) {
    return (
      <View style={[styles.container, styles.centered]}>
        <Text style={styles.emptyText}>Aucun film trouvé dans ce profil.</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <SectionList
        sections={groupedData}
        renderItem={renderItem}
        renderSectionHeader={renderSectionHeader}
        keyExtractor={(item) => item.id + item.streamUrl}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
        stickySectionHeadersEnabled={true}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000', // Deep black
  },
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
  centered: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    color: '#FFD700', // Gold text
    textAlign: 'center',
    fontWeight: '500',
  },
  item: {
    flexDirection: 'row',
    padding: 10,
    alignItems: 'center',
  },
  logo: {
    width: 50,
    height: 75,
    marginRight: 15,
    backgroundColor: '#1A1A1A',
    borderRadius: 4,
    borderWidth: 1,
    borderColor: '#333',
  },
  info: {
    flex: 1,
  },
  name: {
    color: '#FFD700', // Gold text
    fontSize: 16,
    fontWeight: '500',
  },
  separator: {
    height: 1,
    backgroundColor: '#1A1A1A',
    marginLeft: 75,
  },
});

export default MovieList;