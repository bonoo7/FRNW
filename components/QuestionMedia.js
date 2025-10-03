import React from 'react';
import { Audio, Video } from 'expo-av';
import { View, StyleSheet, TouchableOpacity, Text, Platform, Modal } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { WebView } from 'react-native-webview';

const QuestionMedia = ({ questionVideo, answerVideo, isAnswerRevealed, style }) => {
  const [showMedia, setShowMedia] = React.useState(false);
  const [sound, setSound] = React.useState();
  const [isAudio, setIsAudio] = React.useState(false);
  const [modalVisible, setModalVisible] = React.useState(false);

  // تحديد المصدر المناسب
  const mediaSource = isAnswerRevealed ? answerVideo : questionVideo;

  React.useEffect(() => {
    // تنظيف الصوت عند إلغاء المكون
    return sound ? () => { sound.unloadAsync(); } : undefined;
  }, [sound]);

  if (!mediaSource) return null;

  // تحديد نوع الملف (صوت أو فيديو أو يوتيوب) بناءً على الامتداد أو الرابط
  const isAudioFile = typeof mediaSource === 'string' && (mediaSource.endsWith('.mp3') || mediaSource.endsWith('.wav') || mediaSource.endsWith('.ogg'));
  const isYoutube = typeof mediaSource === 'string' && (
    mediaSource.includes('youtube.com') || mediaSource.includes('youtu.be')
  );

  // استخراج ID فيديو يوتيوب من الرابط
  const getYoutubeId = (url) => {
    // يدعم youtube.com و youtu.be
    let id = null;
    try {
      if (url.includes('youtube.com')) {
        const urlObj = new URL(url);
        id = urlObj.searchParams.get('v');
      } else if (url.includes('youtu.be')) {
        id = url.split('youtu.be/')[1]?.split(/[?&]/)[0];
      }
    } catch (e) {}
    return id;
  };

  const handlePlay = async () => {
    if (isAudioFile) {
      setIsAudio(true);
      const { sound } = await Audio.Sound.createAsync(
        typeof mediaSource === 'string' ? { uri: mediaSource } : mediaSource
      );
      setSound(sound);
      await sound.playAsync();
    } else {
      setModalVisible(true);
      setShowMedia(true);
    }
  };

  const handleClose = async () => {
    setModalVisible(false);
    setShowMedia(false);
    if (sound) {
      try {
        const status = await sound.getStatusAsync();
        if (status.isLoaded) {
          await sound.stopAsync();
          await sound.unloadAsync();
        }
      } catch (e) {
        // تجاهل الخطأ إذا لم يكن الصوت محملاً
      }
    }
  };

  return (
    <View style={[styles.container, style]}>
      <TouchableOpacity onPress={handlePlay} style={styles.playButton}>
        <MaterialIcons name={isAudioFile ? "volume-up" : isYoutube ? "ondemand-video" : "play-circle-outline"} size={48} color="#2196F3" />
        <Text style={styles.playText}>{isAudioFile ? 'تشغيل الصوت' : isYoutube ? 'تشغيل يوتيوب' : 'تشغيل الفيديو'}</Text>
      </TouchableOpacity>
      {/* نافذة منبثقة (Modal) للميديا */}
      <Modal
        visible={modalVisible}
        transparent={true}
        onRequestClose={handleClose}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <TouchableOpacity onPress={handleClose} style={styles.closeButton}>
              <MaterialIcons name="close" size={28} color="#fff" />
            </TouchableOpacity>
            {showMedia && isYoutube && (
              Platform.OS === 'web' ? (
                <div style={{ width: 480, height: 270, borderRadius: 8, backgroundColor: '#000' }}>
                  <iframe
                    width="480"
                    height="270"
                    src={`https://www.youtube.com/embed/${getYoutubeId(mediaSource)}?autoplay=1&modestbranding=1&showinfo=0&rel=0&controls=1`}
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    title="YouTube Video"
                    style={{ borderRadius: 8, display: 'block' }}
                  />
                </div>
              ) : (
                <WebView
                  style={{ width: 480, height: 270, borderRadius: 8, backgroundColor: '#000' }}
                  javaScriptEnabled={true}
                  source={{ uri: `https://www.youtube.com/embed/${getYoutubeId(mediaSource)}?autoplay=1&modestbranding=1&showinfo=0&rel=0&controls=1` }}
                  allowsFullscreenVideo
                />
              )
            )}
            {showMedia && !isAudioFile && !isYoutube && (
              <View style={{ borderRadius: 8, backgroundColor: '#000', alignItems: 'center', justifyContent: 'center' }}>
                <Video
                  source={typeof mediaSource === 'string' ? { uri: mediaSource } : mediaSource}
                  rate={1.0}
                  volume={1.0}
                  isMuted={false}
                  resizeMode="contain"
                  shouldPlay
                  useNativeControls
                  style={{ width: 320, height: 180, borderRadius: 8, backgroundColor: '#000' }}
                  onError={e => console.error('Video error:', e)}
                />
              </View>
            )}
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    marginTop: 12,
    marginBottom: 12,
  },
  playButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 8,
  },
  playText: {
    fontSize: 18,
    marginLeft: 8,
    color: '#2196F3',
    fontWeight: 'bold',
  },
  modalOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    backgroundColor: 'rgba(0,0,0,0.7)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#222',
    borderRadius: 10,
    padding: 0,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  closeButton: {
    position: 'absolute',
    top: 8,
    right: 8,
    zIndex: 2,
    backgroundColor: 'rgba(0,0,0,0.5)',
    borderRadius: 16,
    padding: 4,
  },
});

export default QuestionMedia;
