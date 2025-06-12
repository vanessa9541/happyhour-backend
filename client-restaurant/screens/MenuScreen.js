import React, { useEffect, useState } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity,
  ScrollView, Image, SafeAreaView, Platform, StatusBar, Dimensions, FlatList
} from 'react-native';
import { Video } from 'expo-av';
import { useNavigation } from '@react-navigation/native';
import io from 'socket.io-client';
import { MaterialIcons } from '@expo/vector-icons'; // Pour l'icône panier

const socket = io('https://happyhour-backend.onrender.com'); // adapte ton IP locale

const MenuScreen = () => {
  const navigation = useNavigation();
  const [meals, setMeals] = useState([]);
  const [promotions, setPromotions] = useState([]);
  const [selectedMeals, setSelectedMeals] = useState([]);

  useEffect(() => {
    // Récupérer la liste initiale des repas depuis le serveur
    fetch('https://happyhour-backend.onrender.com/api/meals') // adapte selon ta route API backend
      .then(res => res.json())
      .then(data => setMeals(data))
      .catch(err => console.error('Erreur fetch meals:', err));

    // Connexion socket et écoute des événements
    socket.on('connect', () => {
      console.log('🟢 Connecté au socket pour les repas/promo');
    });

    socket.on('mealAdded', (meal) => {
      setMeals((prev) => [...prev, meal]);
    });

    socket.on('mealDeleted', (deletedMeal) => {
      setMeals((prev) => prev.filter(m => m._id !== deletedMeal._id));
    });

    socket.on('mealUpdated', (updatedMeal) => {
      setMeals((prev) => prev.map(m => m._id === updatedMeal._id ? updatedMeal : m));
    });

    socket.on('promotionAdded', (promo) => {
      setPromotions((prev) => [...prev, promo]);
    });

    // Nettoyage des listeners au démontage
    return () => {
      socket.off('mealAdded');
      socket.off('mealDeleted');
      socket.off('mealUpdated');
      socket.off('promotionAdded');
    };
  }, []);

  const addToCart = (meal) => {
    setSelectedMeals([
      ...selectedMeals,
      {
        ...meal,
        image: meal.image || meal.imageUrl || (meal.images && meal.images[0]) || ``,
      }
    ])
  };

  // Correction new Set
  const categories = [...new Set(meals.map(m => m.category))];

  return (
    <View style={{ flex: 1 }}>
      {/* Entête jaune */}
      <SafeAreaView style={styles.header}>
        <Text style={styles.headerTitle}>HAPPY HOUR</Text>

        <View style={styles.cartContainer}>
          <MaterialIcons name="shopping-cart" size={28} color="black" />
          {selectedMeals.length > 0 && (
            <View style={styles.cartBadge}>
              <Text style={styles.cartBadgeText}>{selectedMeals.length}</Text>
            </View>
          )}
          <TouchableOpacity
            style={styles.cartButton}
            onPress={() => navigation.navigate('Commande', { selectedMeals })}
          >
            <Text style={styles.cartButtonText}>Votre commande</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>

      <ScrollView style={styles.container}>
        {categories.map(category => (
          <View key={category} style={styles.section}>
            <Text style={styles.sectionTitle}>{category}</Text>

            {/* FlatList horizontale pour les repas */}
            <FlatList
              data={meals.filter(meal => meal.category === category)}
              keyExtractor={meal => meal._id}
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={{ paddingLeft: 15, paddingRight: 5 }}
              renderItem={({ item: meal }) => (
                <View style={[styles.mealCard, { width: 220, marginRight: 5 }]}>
                  <Text style={styles.mealName}>{meal.name}</Text>
                  <Text style={styles.price}>{meal.price} FCFA</Text>

                  {meal.imageUrl && (
                    <Image
                      source={{ uri: meal.imageUrl }}
                      style={styles.image}
                      resizeMode="cover"
                      onError={e => console.log("Erreur image:", e.nativeEvent.error)}
                    />
                  )}

                  {meal.videoUrl && (
                    <Video
                      source={{ uri: meal.videoUrl }}
                      style={styles.video}
                      useNativeControls
                      volume={0.0}
                      shouldPlay
                      isLooping
                      isMuted={true}
                      resizeMode="cover"
                      onError={e => console.log("Erreur vidéo:", e)}
                    />
                  )}

                  <TouchableOpacity style={styles.button} onPress={() => addToCart(meal)}>
                    <Text style={styles.buttonText}>Ajouter</Text>
                  </TouchableOpacity>
                </View>
              )}
            />
          </View>
        ))}
      </ScrollView>
    </View>
  );
};

const windowWidth = Dimensions.get('window').width;

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    backgroundColor: '#FFD800', // jaune vif
    paddingVertical: 15,
    paddingHorizontal: 15,
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 15,
    alignItems: 'center',
    justifyContent: 'space-between',
    width: windowWidth,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: 'black',
    flex: 1,
    textAlign: 'center',
  },
  cartContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    minWidth: 70,
  },
  cartBadge: {
    position: 'absolute',
    top: -5,
    right: 5,
    backgroundColor: 'red',
    borderRadius: 10,
    paddingHorizontal: 6,
    paddingVertical: 1,
    zIndex: 10,
  },
  cartBadgeText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 12,
  },
  cartButton: {
    marginTop: 4,
    backgroundColor: '#333',
    borderRadius: 8,
    paddingVertical: 4,
    paddingHorizontal: 8,
  },
  cartButtonText: {
    color: 'white',
    fontSize: 12,
  },

  container: {
    padding: 15,
    backgroundColor: '#f5f5f5',
    flex: 1,
  },
  section: { marginBottom: 30 },
  sectionTitle: { fontSize: 20, fontWeight: 'bold', marginBottom: 10 },
  mealCard: {
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 10,
    elevation: 2,
    // Pour s'assurer que les cartes sont assez larges pour le scroll horizontal
  },
  mealName: { fontSize: 18, fontWeight: '600' },
  price: { fontSize: 16, color: '#666', marginBottom: 5 },
  image: {
    width: 200,
    height: 200,
    marginTop: 10,
    borderRadius: 5,
  },
  video: {
    width: 180,
    height: 180,
    marginTop: 5,
    borderRadius: 5,
  },
  button: {
    backgroundColor: '#333',
    padding: 5,
    marginTop: 5,
    borderRadius: 10,
    alignItems: 'center'
  },
  buttonText: { color: '#fff', fontSize: 16 }
});

export default MenuScreen;

