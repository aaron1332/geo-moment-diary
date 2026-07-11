import React from 'react';
import { StyleSheet, Text, View, ScrollView, Image, TouchableOpacity, Alert, Dimensions, StatusBar, Platform } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import { LinearGradient } from 'expo-linear-gradient';
import { deleteMoment } from '../database/db';

const { width } = Dimensions.get('window');

export default function DetailScreen({ route, navigation }) {
  const { moment } = route.params;

  const handleDelete = () => {
    Alert.alert('Hapus Jejak', 'Yakin ingin menghapus cerita ini dari jurnal?', [
      { text: 'Batal', style: 'cancel' },
      { text: 'Hapus', style: 'destructive', onPress: async () => {
          await deleteMoment(moment.id);
          navigation.navigate('Home');
      }}
    ]);
  };

  let photos = [];
  if (moment.photo_path) {
    try {
      photos = JSON.parse(moment.photo_path);
      if (!Array.isArray(photos)) photos = [moment.photo_path]; 
    } catch (e) { photos = [moment.photo_path]; }
  }

  return (
    <LinearGradient colors={['#FFFFFF', '#F0F8FF', '#74ACDF']} start={{ x: -0.2, y: -0.2 }} end={{ x: 1, y: 1 }} style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Text style={styles.backBtnText}>← Kembali</Text>
        </TouchableOpacity>
        <View style={styles.headerActions}>
          <TouchableOpacity onPress={() => navigation.navigate('Edit', { moment })} style={styles.editBtnWrapper}>
            <Text style={styles.editBtnText}>Edit</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={handleDelete}>
            <Text style={styles.deleteBtnText}>Hapus</Text>
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        <View style={styles.textSection}>
          <Text style={styles.dateBadge}>{moment.date.toUpperCase()}</Text>
          <Text style={styles.titleText}>{moment.title || "Catatan Tanpa Judul"}</Text>
        </View>

        {photos.length > 0 && (
          <View style={styles.carouselWrapper}>
            <ScrollView horizontal pagingEnabled showsHorizontalScrollIndicator={false}>
              {photos.map((uri, index) => (
                <View key={index} style={styles.imageContainer}>
                  <Image source={{ uri }} style={styles.fullImage} />
                </View>
              ))}
            </ScrollView>
            {photos.length > 1 && (
              <View style={styles.swipeIndicator}>
                <Text style={styles.swipeText}>Geser {photos.length} Foto ↔</Text>
              </View>
            )}
          </View>
        )}

        {photos.length > 0 && (
          <View style={styles.pathSection}>
            <Text style={styles.pathLabel}>Path Penyimpanan di Device:</Text>
            {photos.map((uri, index) => (
              <Text key={index} style={styles.pathText} numberOfLines={1} ellipsizeMode="middle">
                {uri}
              </Text>
            ))}
          </View>
        )}

        <View style={styles.textSection}>
          <Text style={styles.contentText}>{moment.content}</Text>
        </View>

        <View style={styles.mapSection}>
          <View style={styles.mapHeader}>
            <Text style={styles.mapLabel}>📍 Titik Koordinat Terkunci</Text>
            <Text style={styles.coordsText}>{moment.latitude.toFixed(5)}, {moment.longitude.toFixed(5)}</Text>
          </View>
          
          <View style={styles.mapWrapper}>
            <MapView style={styles.map} initialRegion={{ latitude: moment.latitude, longitude: moment.longitude, latitudeDelta: 0.005, longitudeDelta: 0.005 }} scrollEnabled={false} zoomEnabled={false}>
              <Marker coordinate={{ latitude: moment.latitude, longitude: moment.longitude }} pinColor="#74ACDF" />
            </MapView>
          </View>
        </View>
      </ScrollView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 24, paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight + 20 : 50, paddingBottom: 15, backgroundColor: 'rgba(255,255,255,0.7)', zIndex: 10 },
  backBtn: { paddingVertical: 5, paddingRight: 15 },
  backBtnText: { fontSize: 16, color: '#0056b3', fontWeight: '800' },
  headerActions: { flexDirection: 'row', alignItems: 'center' },
  editBtnWrapper: { marginRight: 20 },
  editBtnText: { fontSize: 15, color: '#0056b3', fontWeight: '700' },
  deleteBtnText: { fontSize: 15, color: '#EF4444', fontWeight: '600' },
  scrollContent: { paddingBottom: 60 },
  textSection: { paddingHorizontal: 24, paddingTop: 20 },
  dateBadge: { fontSize: 11, color: '#0056b3', fontWeight: '800', letterSpacing: 1.5, marginBottom: 8 },
  titleText: { fontSize: 28, fontWeight: '800', color: '#111827', lineHeight: 36, marginBottom: 15 },
  carouselWrapper: { marginVertical: 15, position: 'relative' },
  imageContainer: { width: width, paddingHorizontal: 24 },
  fullImage: { width: '100%', height: 320, borderRadius: 16, resizeMode: 'cover' },
  swipeIndicator: { position: 'absolute', bottom: 15, alignSelf: 'center', backgroundColor: 'rgba(0,0,0,0.6)', paddingVertical: 6, paddingHorizontal: 12, borderRadius: 20 },
  swipeText: { color: '#FFFFFF', fontSize: 11, fontWeight: '700', letterSpacing: 1 },
  pathSection: { paddingHorizontal: 24, marginTop: 8, marginBottom: 4 },
  pathLabel: { fontSize: 11, fontWeight: '700', color: '#9CA3AF', marginBottom: 4, letterSpacing: 0.5 },
  pathText: { fontSize: 10, color: '#9CA3AF', marginBottom: 2, fontFamily: Platform.OS === 'android' ? 'monospace' : 'Courier' },
  contentText: { fontSize: 17, color: '#2C3E50', lineHeight: 28, textAlign: 'justify' },
  mapSection: { paddingHorizontal: 24, marginTop: 40, marginBottom: 20 },
  mapHeader: { marginBottom: 12 },
  mapLabel: { fontSize: 14, fontWeight: '700', color: '#111827', marginBottom: 2 },
  coordsText: { fontSize: 12, color: '#6B7280', fontWeight: '500' },
  mapWrapper: { height: 180, width: '100%', borderRadius: 16, overflow: 'hidden', borderWidth: 1, borderColor: '#E5E7EB' },
  map: { ...StyleSheet.absoluteFillObject },
});
