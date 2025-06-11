import React, { useState } from 'react';
import {
  View, Text, StyleSheet, FlatList, TextInput, TouchableOpacity, Image
} from 'react-native';
import api from '../api';

const CommandeScreen = ({ route, navigation }) => {
  const { selectedMeals = [] } = route.params || {};

  // On gère maintenant selectedMeals dans un state local pour suppression
  const [meals, setMeals] = useState(selectedMeals);
  console.log('Menu recu dans commande:', selectedMeals);
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [note, setNote] = useState('');

  // Total recalculé à chaque modification de meals, en tenant compte de quantity si existante
  const total = meals.reduce((acc, item) => acc + ((item.price || 0) * (item.quantity || 1)), 0);

  // Fonction pour supprimer un repas par son id (ou index si pas d'id)
  const removeMeal = (id, index) => {
    if (id) {
      setMeals(meals.filter(m => m._id !== id && m.id !== id));
    } else {
      // Si pas d'id, suppression par index
      const updatedMeals = [...meals];
      updatedMeals.splice(index, 1);
      setMeals(updatedMeals);
      setSelectedMeals(updatedMeals);
    }
  };

  // Validation simple avant envoi
  const validateForm = () => {
    if (!name.trim() || !phone.trim() || !address.trim()) {
      alert('Merci de remplir le nom, téléphone et adresse.');
      return false;
    }
    if (meals.length === 0) {
      alert('Veuillez sélectionner au moins un repas.');
      return false;
    }
    return true;
  };

  const handleSendOrder = async () => {
    if (!validateForm()) return;

    const order = {
      customerName: name,
      phoneNumber: phone,
      address,
      note,
      totalPrice: total,
      meals: meals.map(item => ({
        name: item.name,
        price: item.price,
        quantity: item.quantity || 1,
        image: (item.images && item.images[0]) || item.image || '',
        video: item.video || ''
      })),
      createdAt: new Date()
    };

    try {
      await api.post('/api/orders', order);
      alert("Commande envoyée avec succès !");
      navigation.navigate('Accueil');
    } catch (error) {
      console.error("Erreur lors de l'envoi de la commande :", error.response || error.message || error);
      alert("Erreur lors de l'envoi de la commande : " + (error.response?.data?.message || error.message || "Erreur inconnue"));
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Votre commande</Text>

      <FlatList
        data={meals}
        extraData={meals}
        keyExtractor={(item, index) => (item._id || item.id ? (item._id || item.id) + '-' + index : index.toString())}
        horizontal
        renderItem={({ item, index }) => (
          <View style={styles.mealItem}>
            <View>
              {item.image ? (
                <Image source={{ uri: item.image }} style={styles.image} />
              ) : (
                <View style={[styles.image, styles.placeholder]}>
                  <Text style={{ fontSize: 10, color: '#aaa' }}>Pas d’image</Text>
                </View>
              )}
              {/* Petite croix en haut à droite pour supprimer */}
              <TouchableOpacity
                style={styles.deleteButton}
                onPress={() => removeMeal(item._id || item.id, index)}
              >
                <Text style={styles.deleteButtonText}>×</Text>
              </TouchableOpacity>
            </View>
            <Text>{item.name}</Text>
            <Text>{item.price} FCFA</Text>
          </View>
        )}
      />

      <Text style={styles.total}>Total: {total} FCFA</Text>

      <TextInput
        style={styles.input}
        placeholder="Commentaires (ex: pas de piment)"
        value={note}
        onChangeText={setNote}
      />
      <TextInput
        style={styles.input}
        placeholder="Nom"
        value={name}
        onChangeText={setName}
      />
      <TextInput
        style={styles.input}
        placeholder="Téléphone"
        value={phone}
        onChangeText={setPhone}
        keyboardType="phone-pad"
      />
      <TextInput
        style={styles.input}
        placeholder="Adresse de livraison"
        value={address}
        onChangeText={setAddress}
      />

      <View style={styles.buttonGroup}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.buttonText}>Modifier ma commande</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.orderButton, meals.length === 0 && { opacity: 0.5 }]}
          onPress={handleSendOrder}
          disabled={meals.length === 0} // Désactive si plus de repas
        >
          <Text style={styles.buttonText}>Commander</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { padding: 20, backgroundColor: '#fff', flex: 1 },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 20 },
  mealItem: { marginRight: 10, alignItems: 'center' },
  image: { width: 80, height: 80, borderRadius: 10 },
  placeholder: {
    backgroundColor: '#eee',
    justifyContent: 'center',
    alignItems: 'center'
  },
  deleteButton: {
    position: 'absolute',
    top: 2,
    right: 2,
    backgroundColor: 'rgba(0,0,0,0.5)',
    borderRadius: 12,
    width: 24,
    height: 24,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1,
  },
  deleteButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 18,
    lineHeight: 18,
    textAlign: 'center',
  },
  total: { fontSize: 18, marginVertical: 10 },
  input: {
    borderWidth: 1, borderColor: '#ccc',
    borderRadius: 10, padding: 10,
    marginVertical: 5
  },
  buttonGroup: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20
  },
  backButton: {
    backgroundColor: '#999',
    padding: 15,
    borderRadius: 10,
    flex: 1,
    marginRight: 10
  },
  orderButton: {
    backgroundColor: '#28a745',
    padding: 15,
    borderRadius: 10,
    flex: 1,
    opacity: 1
  },
  buttonText: { color: '#fff', textAlign: 'center' }
});

export default CommandeScreen;

