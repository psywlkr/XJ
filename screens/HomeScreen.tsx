import React from 'react';
import { View, StyleSheet, Text, Platform, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import { useIPTV } from '../context/IPTVContext';
import { Picker } from '@react-native-picker/picker';
import { IPTVProfile } from '../types';

import PlaylistManager from '../components/PlaylistManager';
import ChannelList from '../components/ChannelList';
import MovieList from '../components/MovieList';
import SeriesList from '../components/SeriesList';

const Tab = createMaterialTopTabNavigator();

const MediaTabs = () => {
  const { channels, movies, series, isLoading } = useIPTV();
  
  if (isLoading) {
    return (
      <View style={styles.centeredContainer}>
        <ActivityIndicator size="large" color="#FFD700" />
      </View>
    );
  }

  const totalCount = channels.length + movies.length + series.length;
    
  if (totalCount === 0) {
    return (
      <View style={styles.centeredContainer}>
        <Text style={styles.emptyText}>Ce profil est vide ou n'a pas pu être analysé.</Text>
      </View>
    );
  }
  
  return (
    <Tab.Navigator
      screenOptions={{
        tabBarActiveTintColor: '#FFD700', // Gold for active tabs
        tabBarInactiveTintColor: '#888',
        tabBarIndicatorStyle: { backgroundColor: '#FFD700', height: 3, shadowColor: '#FFD700', shadowOpacity: 0.8, shadowRadius: 8 }, // Gold indicator with glow
        tabBarStyle: { backgroundColor: '#000000', borderTopWidth: 1, borderTopColor: '#333' }, // Deep black background
        tabBarScrollEnabled: true,
      }}
    >
      {channels.length > 0 && (
        <Tab.Screen
          name="Chaînes"
          component={ChannelList}
          options={{ title: `Chaînes (${channels.length})` }}
        />
      )}
      {movies.length > 0 && (
        <Tab.Screen
          name="Films"
          component={MovieList}
          options={{ title: `Films (${movies.length})` }}
        />
      )}
      {series.length > 0 && (
        <Tab.Screen
          name="Séries"
          component={SeriesList}
          options={{ title: `Séries (${series.length})` }}
        />
      )}
    </Tab.Navigator>
  );
};

const HomeScreen = () => {
  const { currentProfile, unloadProfile, profiles, loadProfile } = useIPTV();

  const onProfileChange = (profileId: string | null) => {
    if (!profileId) {
      unloadProfile();
      return;
    }
    const selectedProfile = profiles.find(p => p.id === profileId);
    if (selectedProfile && selectedProfile.id !== currentProfile?.id) {
      console.log("Changement de profil via le menu...", selectedProfile.name);
      loadProfile(selectedProfile);
    }
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {currentProfile ? (
        <View style={styles.container}>
          <View style={styles.header}>
            <Picker
              selectedValue={currentProfile.id}
              onValueChange={(itemValue) => onProfileChange(itemValue)}
              style={styles.picker}
              dropdownIconColor="#FFD700"
            >
              {profiles.map((profile: IPTVProfile) => (
                <Picker.Item
                  key={profile.id}
                  label={profile.name}
                  value={profile.id}
                  color={Platform.OS === 'android' ? '#000' : '#FFD700'}
                />
              ))}
              <Picker.Item
                key="logout"
                label="Gérer les profils (Déconnexion)"
                value={null}
                color={Platform.OS === 'android' ? '#555' : '#888'}
              />
            </Picker>
          </View>
          <MediaTabs />
        </View>
      ) : (
        <PlaylistManager />
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000', // Deep black
  },
  header: {
    backgroundColor: '#0A0A0A', // Slightly lighter black for contrast
    paddingHorizontal: Platform.OS === 'ios' ? 0 : 10,
    borderBottomWidth: 2,
    borderBottomColor: '#FFD700', // Gold border
    shadowColor: '#FFD700',
    shadowOpacity: 0.3,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
  },
  picker: {
    height: 50,
    width: '100%',
    color: '#FFD700', // Gold text
    backgroundColor: '#0A0A0A',
  },
  centeredContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    color: '#FFD700', // Gold text
    fontSize: 16,
    fontWeight: '500',
  }
});

export default HomeScreen;