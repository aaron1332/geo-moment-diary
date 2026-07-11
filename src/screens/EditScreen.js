import React, { useState } from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, Image, ScrollView, Alert, KeyboardAvoidingView, Platform, StatusBar } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import MapView, { Marker } from 'react-native-maps';
import { LinearGradient } from 'expo-linear-gradient';
import { updateMoment } from '../database/db';

export default function EditScreen({ route, navigation }) {
  const { moment } = route.params;

 
  const parseInitialPhotos = () => {
    if (!moment.photo_path) return [];
    try {
      const parsed = JSON.parse(moment.photo_path);
      return Array.isArray(parsed) ? parsed : [moment.photo_path];
    } catch (e) {
      return [moment.photo_path];
    }
  };

  const [title, setTitle] = useState(moment.title || '');
  const [content, setContent] = useState(moment.content || '');
  const [images, setImages] = useState(parseInitialPhotos());
  const [saving, setSaving] = useState(false);

  
  const [latitude, setLatitude] = useState(moment.latitude);
  const [longitude, setLongitude] = useState(moment.longitude);

  const takePhotoHandler = async () => {
    try {
      const { status } = await ImagePicker.requestCameraPermissionsAsync();
      if (status !== 'granted') return Alert.alert('Izin Ditolak', 'Aplikasi memerlukan izin kamera.');
      let result = await ImagePicker.launchCameraAsync({ allowsEditing: true, quality: 0.7 });
      if (!result.canceled) setImages([...images, result.assets[0].uri]);
    } catch (error) {
      Alert.alert('Error', 'Gagal membuka kamera.');
    }
  };

  const removePhoto = (indexToRemove) => setImages(images.filter((_, index) => index !== indexToRemove));

  const updateMomentHandler = async () => {
    if (!title.trim() && !content.trim()) {
      return Alert.alert('Peringatan', 'Catatan tidak boleh kosong sepenuhnya.');
    }
    const finalTitle = title.trim() ? title : 'Catatan Jurnal';
    const photoDataString = JSON.stringify(images);

    try {
      setSaving(true);
      await updateMoment(moment.id, finalTitle, content, photoDataString, latitude, longitude);
      navigation.goBack();
    } catch (error) {
      Alert.alert('Error', 'Gagal memperbarui catatan.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <LinearGradient colors={['#FFFFFF', '#F0F8FF', '#74ACDF']} start={{ x: -0.2, y: -0.2 }} end={{ x: 1, y: 1 }} style={styles.container}>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={{ flex: 1 }}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()}><Text style={styles.cancelBtn}>Batal</Text></TouchableOpacity>
          <Text style={styles.headerTitle}>Edit Jurnal</Text>
          <TouchableOpacity onPress={updateMomentHandler} disabled={saving}>
            <Text style={styles.saveBtn}>{saving ? 'Menyimpan...' : 'Simpan'}</Text>
          </TouchableOpacity>
        </View>

        <ScrollView showsVerticalScrollIndicator={false} style={styles.scrollArea}>
          <View style={styles.locationContainer}>
            <Text style={styles.locationText}>📍 Lokasi Awal Tercatat</Text>
            <View style={styles.miniMapWrapper}>
              <MapView
                style={styles.miniMap}
                initialRegion={{ latitude, longitude, latitudeDelta: 0.005, longitudeDelta: 0.005 }}
                scrollEnabled={false}
                zoomEnabled={false}
              >
                <Marker coordinate={{ latitude, longitude }} pinColor="#74ACDF" />
              </MapView>
            </View>
            <Text style={styles.coordsHint}>{latitude.toFixed(5)}, {longitude.toFixed(5)}</Text>
          </View>

          <View style={styles.titleRow}>
            <TextInput style={styles.inputTitle} placeholder="Tambahkan Judul..." placeholderTextColor="#A0AAB5" value={title} onChangeText={setTitle} />
            <TouchableOpacity style={styles.cameraIconBtn} onPress={takePhotoHandler}><Text style={styles.cameraIconText}>📷</Text></TouchableOpacity>
          </View>

          <TextInput style={styles.inputContent} placeholder="Tulis ceritamu di sini..." placeholderTextColor="#8CA1B6" value={content} onChangeText={setContent} multiline />

          {images.length > 0 && (
            <View style={styles.galleryContainer}>
              <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                {images.map((uri, index) => (
                  <View key={index} style={styles.imageWrapper}>
                    <Image source={{ uri }} style={styles.photoThumb} />
                    <TouchableOpacity style={styles.deletePhotoBtn} onPress={() => removePhoto(index)}><Text style={styles.deletePhotoText}>✕</Text></TouchableOpacity>
                  </View>
                ))}
              </ScrollView>
            </View>
          )}
        </ScrollView>
      </KeyboardAvoidingView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 24, paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight + 20 : 50, paddingBottom: 15, backgroundColor: 'rgba(255,255,255,0.7)' },
  headerTitle: { fontSize: 16, fontWeight: '700', color: '#111827' },
  cancelBtn: { fontSize: 16, color: '#6B7280', fontWeight: '500' },
  saveBtn: { fontSize: 16, color: '#0056b3', fontWeight: '800' },
  scrollArea: { flex: 1, paddingHorizontal: 24, paddingTop: 20 },
  locationContainer: { marginBottom: 25 },
  locationText: { fontSize: 12, color: '#0056b3', fontWeight: '700', marginBottom: 8, letterSpacing: 0.5 },
  miniMapWrapper: { height: 100, width: '100%', borderRadius: 12, overflow: 'hidden', borderWidth: 1, borderColor: '#E5E7EB' },
  miniMap: { ...StyleSheet.absoluteFillObject },
  coordsHint: { fontSize: 11, color: '#6B7280', marginTop: 6 },
  titleRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 15 },
  inputTitle: { flex: 1, fontSize: 26, fontWeight: '700', color: '#111827', padding: 0 },
  cameraIconBtn: { backgroundColor: 'rgba(255,255,255,0.8)', padding: 10, borderRadius: 50, marginLeft: 10, elevation: 2 },
  cameraIconText: { fontSize: 20 },
  inputContent: { fontSize: 17, color: '#2C3E50', lineHeight: 28, minHeight: 150, padding: 0, textAlignVertical: 'top' },
  galleryContainer: { marginTop: 10, marginBottom: 40 },
  imageWrapper: { marginRight: 15, position: 'relative' },
  photoThumb: { width: 140, height: 180, borderRadius: 12, resizeMode: 'cover' },
  deletePhotoBtn: { position: 'absolute', top: 8, right: 8, backgroundColor: 'rgba(0,0,0,0.6)', width: 28, height: 28, borderRadius: 14, justifyContent: 'center', alignItems: 'center' },
  deletePhotoText: { color: '#FFF', fontSize: 14, fontWeight: 'bold' }
});
