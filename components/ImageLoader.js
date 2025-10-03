import React, { useEffect } from 'react';
import * as FileSystem from 'expo-file-system';
import { Asset } from 'expo-asset';

// Lista de imágenes que necesitamos precargar
const imageAssets = [
  require('../assets/images/questions/Dark_Souls_.jpg'),
  require('../assets/images/questions/Ghost_of_Tsushima.jpg'),
  require('../assets/images/questions/God_of_War_.jpg'),
  require('../assets/images/questions/Grand_Theft_Auto_V.jpg'),
  require('../assets/images/questions/Minecraft.jpg'),
  require('../assets/images/questions/RE4.jpg'),
  require('../assets/images/questions/REVillage.jpg'),
  require('../assets/images/questions/SPmilesmorales.jpg'),
  // Añade aquí todas las imágenes que necesites
];

// Función para obtener el nombre del archivo de una ruta
const getFileNameFromPath = (path) => {
  return path.split('/').pop();
};

const ImageLoader = () => {
  useEffect(() => {
    const loadImages = async () => {
      try {
        // Crear directorio de preguntas si no existe
        const questionsDir = FileSystem.documentDirectory + 'questions';
        const dirInfo = await FileSystem.getInfoAsync(questionsDir);
        
        if (!dirInfo.exists) {
          await FileSystem.makeDirectoryAsync(questionsDir);
          console.log('Created questions directory');
        }

        // Cargar y copiar cada imagen
        for (const image of imageAssets) {
          try {
            // Cargar el asset
            const asset = Asset.fromModule(image);
            await asset.downloadAsync();
            
            // Obtener el nombre del archivo
            const fileName = getFileNameFromPath(asset.uri);
            
            // Copiar al directorio de preguntas
            const destination = `${questionsDir}/${fileName}`;
            
            // Verificar si ya existe
            const fileInfo = await FileSystem.getInfoAsync(destination);
            if (!fileInfo.exists) {
              await FileSystem.copyAsync({
                from: asset.uri,
                to: destination
              });
              console.log(`Copied ${fileName} to questions directory`);
            }
          } catch (err) {
            console.error('Error processing image:', err);
          }
        }
        
        console.log('All images loaded successfully');
      } catch (error) {
        console.error('Error loading images:', error);
      }
    };

    loadImages();
  }, []);

  // Este componente no renderiza nada
  return null;
};

export default ImageLoader;
