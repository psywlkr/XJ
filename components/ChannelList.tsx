import React from 'react';
import { 
  View, Text, SectionList, TouchableOpacity, StyleSheet,
  Image, ActivityIndicator
} from 'react-native';
import { useIPTV } from '../context/IPTVContext';
import { useNavigation } from '@react-navigation/native';
import { Channel } from '../types';

const defaultLogo = require('../assets/icon.png'); 

const ChannelList = () => {
  const { channels, playStream, isLoading, error } = useIPTV();
  const navigation = useNavigation();

  const handleChannelPress = (channel: Channel) => {
    console.log('CLIC SUR CHAÎNE:', channel.name); 
    playStream({ url: channel.url, id: channel.id });
    navigation.navigate('Player');
  };
    
  const groupedData = React.useMemo(() => {
    if (channels.length === 0) return [];
    
    // 1. On crée un objet pour regrouper (ex: { "France HD": [...], "Films": [...] })
    const groups = channels.reduce((acc, channel) => {
      const groupTitle = channel.group || 'Inconnu'; // Utilise 'Inconnu' si pas de groupe
      if (!acc[groupTitle]) {
        acc[groupTitle] = [];
      }
      acc[groupTitle].push(channel);
      return acc;
    }, {} as Record<string, Channel[]>);

    
    return Object.keys(groups).sort().map(title => ({ 
      title: title,
      data: groups[title]
    }));
  }, [channels]);
  
  // Rendu d'un item (une chaîne)
  const renderItem = ({ item }: { item: Channel }) => (
    <TouchableOpacity 
      style={styles.channelItem} 
      onPress={() => handleChannelPress(item)}
    >
      <Image 
        style={styles.logo}
        source={item.logo ? { uri: item.logo } : defaultLogo}
        defaultSource={defaultLogo}
        resizeMode="contain"
      />
      <View style={styles.channelInfo}>
        <Text style={styles.channelName}>{item.name}</Text>
      </View>
    </TouchableOpacity>
  );

  // Rendu de l'en-tête de section (ex: "France HD")
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
  
  if (error) {
    return (
      <View style={[styles.container, styles.centered]}>
        <Text style={styles.errorText}>Erreur: {error}</Text>
      </View>
    );
  }

  if (channels.length === 0) {
    return (
      <View style={[styles.container, styles.centered]}>
        <Text style={styles.emptyText}>Aucune chaîne trouvée dans ce profil.</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* On remplace FlatList par SectionList */}
      <SectionList
        sections={groupedData}
        renderItem={renderItem}
        renderSectionHeader={renderSectionHeader}
        keyExtractor={(item) => item.id + item.url}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
        stickySectionHeadersEnabled={true} // En-têtes collants
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000', // Deep black
  },
  // Style pour l'en-tête (ex: "France HD")
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
  errorText: {
    color: '#FF3B30',
  },
  emptyText: {
    color: '#FFD700', // Gold text
    textAlign: 'center',
    fontWeight: '500',
  },
  channelItem: {
    flexDirection: 'row',
    padding: 10,
    alignItems: 'center',
  },
  logo: {
    width: 50,
    height: 50,
    marginRight: 15,
    backgroundColor: '#1A1A1A',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#333',
  },
  channelInfo: {
    flex: 1,
  },
  channelName: {
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

export default ChannelList;