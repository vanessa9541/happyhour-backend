const express = require('express');
const router = express.Router();
const multer = require('multer');
const fs = require('fs');
const path = require('path');
const Meal = require('../models/Meal');
const mealController = require('../controllers/mealController');

// Configuration multer pour sauvegarde en mémoire
const storage = multer.memoryStorage();
const upload = multer({ storage });

// ✅ GET - Récupérer tous les repas
router.get('/', mealController.getAllMeals);

// ✅ POST - Ajouter un repas
router.post('/', upload.fields([{ name: 'image' }, { name: 'video' }]), async (req, res) => {
 console.log('champs recus:', req.body);
 onsole.log('fichier recu:', req.files);
  try {
    const { name, price, category } = req.body;

    const uploadsDir = path.join(__dirname, '..', 'uploads');
    if (!fs.existsSync(uploadsDir)) {
      fs.mkdirSync(uploadsDir);
    }

    let imageUrl = '';
    let videoUrl = '';

    if (req.files && req.files['image'] && req.files['image'][0]) {
      const imageFile = req.files['image'][0];
      const imageName = `${Date.now()}_${imageFile.originalname}`;
      const imagePath = path.join(uploadsDir, imageName);
      fs.writeFileSync(imagePath, imageFile.buffer);
      imageUrl = `uploads/${imageName}`; // Pas de slash devant
    }

    if (req.files && req.files['video'] && req.files['video'][0]) {
      const videoFile = req.files['video'][0];
      const videoName = `${Date.now()}_${videoFile.originalname}`;
      const videoPath = path.join(uploadsDir, videoName);
      fs.writeFileSync(videoPath, videoFile.buffer);
      videoUrl = `uploads/${videoName}`;
    }

    const newMeal = new Meal({
      name,
      price,
      category,
      imageUrl,
      videoUrl,
    });

    const savedMeal = await newMeal.save();

    // Émettre événement via socket.io si besoin
    const io = req.app.get('io');
    if (io) io.emit('mealAdded', savedMeal);

    res.status(201).json(savedMeal);
  } catch (error) {
    console.error('❌ Erreur lors de l’ajout du repas :', error);
    res.status(500).json({ message: 'Erreur lors de l’ajout du repas', error });
  }
});

// ✅ DELETE - Supprimer un repas + ses fichiers
router.delete('/:id', async (req, res) => {
  try {
    const deletedMeal = await Meal.findByIdAndDelete(req.params.id);
    if (!deletedMeal) {
      return res.status(404).json({ message: 'Repas non trouvé' });
    }

    // Suppression fichiers image et vidéo si existants
    const imagePath = deletedMeal.imageUrl
      ? path.join(__dirname, '..', deletedMeal.imageUrl)
      : null;
    const videoPath = deletedMeal.videoUrl
      ? path.join(__dirname, '..', deletedMeal.videoUrl)
      : null;

    if (imagePath && fs.existsSync(imagePath)) fs.unlinkSync(imagePath);
    if (videoPath && fs.existsSync(videoPath)) fs.unlinkSync(videoPath);

    res.status(200).json({ message: 'Repas supprimé avec succès' });
  } catch (err) {
    console.error('❌ Erreur suppression repas :', err);
    res.status(500).json({ message: 'Erreur serveur lors de la suppression du repas' });
  }
});

module.exports = router;
