import React from 'react';
import { View, StyleSheet, Text } from 'react-native';
import { Video, ResizeMode } from 'expo-av'; 
import { useIPTV } from '../context/IPTVContext';

const VideoPlayer = () => {
  
  // On lit 'currentStream' au lieu de 'currentChannel'
  const { currentStream } = useIPTV();
    
  const videoRef = React.useRef(null);

  return (
    <View style={styles.container}>
      {/* On vérifie 'currentStream' */}
      {currentStream ? (
        <Video
          // On utilise la 'key' de 'currentStream'
          key={currentStream.id} 
          ref={videoRef}
          style={styles.video}
          // On utilise l'URL de 'currentStream'
          source={{ uri: currentStream.url }} 
              
          useNativeControls 
          
          resizeMode={ResizeMode.CONTAIN}
          shouldPlay // Démarre la lecture automatiquement
          isMuted={false}
          volume={1.0}
        />
      ) : (
        <View style={styles.placeholder}>
          <Text style={styles.placeholderText}>Aucune chaîne sélectionnée</Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#000000', // Deep black
  },
  video: {
    width: '100%',
    height: '100%',
  },
  placeholder: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  placeholderText: {
    color: '#FFD700', // Gold text
    fontSize: 18,
    fontWeight: '600',
    textShadowColor: 'rgba(255, 215, 0, 0.5)', // Gold glow effect
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 10,
  },
});

export default VideoPlayer;