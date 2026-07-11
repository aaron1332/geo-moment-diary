import React, { useState, useCallback } from 'react';
import { StyleSheet, Text, View, FlatList, Image, TouchableOpacity, ActivityIndicator, StatusBar, Platform } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';
import { getAllMoments } from '../database/db';


const parseIndonesianDate = (dateStr) => {
  try {
    const parts = dateStr.split(', ');
    const dateParts = parts[1].split(' ');
    const day = parseInt(dateParts[0]);
    const months = ['Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni', 'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'];
    const month = months.indexOf(dateParts[1]);
    const year = parseInt(dateParts[2]);
    return new Date(year, month, day);
  } catch (e) {
    return new Date(0); 
  }
};

export default function HomeScreen({ navigation }) {
  const [moments, setMoments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('Semua'); 

  useFocusEffect(
    useCallback(() => { fetchMoments(); }, [])
  );

  const fetchMoments = async () => {
    try {
      const data = await getAllMoments();
      setMoments(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const filteredMoments = moments.filter(item => {
    if (filter === 'Semua') return true;
    
    if (filter === 'Hari Ini') {
      const today = new Date().toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });
      return item.date === today;
    }

    if (filter === 'Minggu Ini') {
      const momentDate = parseIndonesianDate(item.date);
      const today = new Date();
      momentDate.setHours(0,0,0,0);
      today.setHours(0,0,0,0);
      const diffTime = Math.abs(today - momentDate);
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      return diffDays <= 7 && momentDate <= today;
    }
    
    if (filter === 'Bulan Ini') {
      const thisMonth = new Date().toLocaleDateString('id-ID', { month: 'long', year: 'numeric' });
      return item.date.includes(thisMonth);
    }
    return true;
  });

  const renderCard = ({ item }) => {
    let thumbnailUri = null;
    if (item.photo_path) {
      try {
        const parsedPhotos = JSON.parse(item.photo_path);
        if (parsedPhotos.length > 0) thumbnailUri = parsedPhotos[0];
      } catch (e) { thumbnailUri = item.photo_path; }
    }

    return (
      <TouchableOpacity activeOpacity={0.8} style={styles.card} onPress={() => navigation.navigate('Detail', { moment: item })}>
        {thumbnailUri ? (
          <Image source={{ uri: thumbnailUri }} style={styles.cardImage} />
        ) : (
          <View style={styles.cardPlaceholder}><Text style={styles.placeholderText}>Tidak ada foto</Text></View>
        )}
        <View style={styles.cardBody}>
          <Text style={styles.cardDate}>{item.date}</Text>
          <Text style={styles.cardTitle} numberOfLines={1}>{item.title || "Catatan Tanpa Judul"}</Text>
        </View>
      </TouchableOpacity>
    );
  };

  if (loading) return <View style={styles.center}><ActivityIndicator size="large" color="#74ACDF" /></View>;

  return (
    <LinearGradient 
      colors={['#FFFFFF', '#F0F8FF', '#74ACDF']} 
      start={{ x: -0.2, y: -0.2 }} 
      end={{ x: 1, y: 1 }}
      style={styles.container}
    >
      <View style={styles.notchPadding} />
      <View style={styles.header}>
        <Text style={styles.greetingText}>Ada cerita apa hari ini?</Text>
      </View>

      <View style={styles.filterContainer}>
        <FlatList 
          horizontal
          showsHorizontalScrollIndicator={false}
          data={['Semua', 'Hari Ini', 'Minggu Ini', 'Bulan Ini']}
          keyExtractor={(item) => item}
          renderItem={({ item: opsi }) => (
            <TouchableOpacity 
              style={[styles.filterChip, filter === opsi && styles.filterChipActive]}
              onPress={() => setFilter(opsi)}
            >
              <Text style={[styles.filterText, filter === opsi && styles.filterTextActive]}>{opsi}</Text>
            </TouchableOpacity>
          )}
        />
      </View>

      <View style={styles.listWrapper}>
        {filteredMoments.length === 0 ? (
          <View style={styles.center}><Text style={styles.emptyText}>Tidak ada memori di periode ini.</Text></View>
        ) : (
          <FlatList
            data={filteredMoments}
            keyExtractor={(item) => item.id.toString()}
            renderItem={renderCard}
            contentContainerStyle={styles.listContainer}
            showsVerticalScrollIndicator={false}
          />
        )}
      </View>

      <TouchableOpacity activeOpacity={0.9} style={styles.fab} onPress={() => navigation.navigate('Input')}>
        <Text style={styles.fabText}>📸 Abadikan Momen</Text>
      </TouchableOpacity>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  notchPadding: { paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight + 10 : 40 },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  header: { paddingHorizontal: 24, paddingBottom: 15 },
  greetingText: { fontSize: 26, fontWeight: '800', color: '#111827', letterSpacing: -0.5 },
  filterContainer: { paddingHorizontal: 24, marginBottom: 15 },
  filterChip: { paddingVertical: 6, paddingHorizontal: 16, backgroundColor: 'rgba(255,255,255,0.7)', borderRadius: 20, marginRight: 10, borderWidth: 1, borderColor: '#E5E7EB' },
  filterChipActive: { backgroundColor: '#74ACDF', borderColor: '#74ACDF', elevation: 2 },
  filterText: { fontSize: 13, fontWeight: '600', color: '#4B5563' },
  filterTextActive: { color: '#FFFFFF' },
  listWrapper: { flex: 1 },
  listContainer: { paddingHorizontal: 20, paddingBottom: 100 },
  card: { backgroundColor: 'rgba(255, 255, 255, 0.95)', borderRadius: 16, marginBottom: 20, overflow: 'hidden', borderWidth: 1, borderColor: '#E5E7EB', elevation: 2 },
  cardImage: { width: '100%', height: 180, resizeMode: 'cover' },
  cardPlaceholder: { width: '100%', height: 120, backgroundColor: 'rgba(116, 172, 223, 0.1)', justifyContent: 'center', alignItems: 'center' },
  placeholderText: { color: '#74ACDF', fontSize: 13, fontWeight: '500' },
  cardBody: { padding: 16 },
  cardDate: { fontSize: 12, color: '#74ACDF', fontWeight: '700', marginBottom: 6 },
  cardTitle: { fontSize: 18, fontWeight: '700', color: '#1F2937' },
  fab: { position: 'absolute', bottom: 30, alignSelf: 'center', backgroundColor: '#74ACDF', paddingVertical: 16, paddingHorizontal: 32, borderRadius: 30, shadowColor: '#74ACDF', shadowOffset: { width: 0, height: 6 }, shadowOpacity: 0.3, shadowRadius: 8, elevation: 6 },
  fabText: { color: '#FFFFFF', fontSize: 15, fontWeight: '700' },
  emptyText: { fontSize: 15, color: '#4B5563', fontWeight: '500' }
});