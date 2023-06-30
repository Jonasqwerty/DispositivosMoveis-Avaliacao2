import "react-native-gesture-handler";
import { useNavigation } from "@react-navigation/core";
import React, { useEffect, useState } from "react";
import {  KeyboardAvoidingView, StyleSheet, Alert, Text,  Pressable, Modal, TextInput,  TouchableOpacity,  View, Image, Button} from "react-native";
import { auth, firestore, storage } from "../firebase";
import {uploadBytes} from "firebase/storage"; //access the storage databaSse
import meuestilo from "../meuestilo";
import * as ImagePicker from "expo-image-picker";
import { Instrumento } from "../model/Instrumento";
import DateTimePickerModal from "react-native-modal-datetime-picker";
// para o progresso da imagem 


const ManterInstrumento = () => {
  const [formInstrumento, setFormInstrumento] = useState<Partial<Instrumento>>({})
  const instrumentoRef = firestore.collection('Usuario').doc(auth.currentUser?.uid).collection('Instrumento')
  const [formData, setFormData] = useState<Partial<Instrumento>>({})

  const [pickedImagePath, setPickedImagePath]=useState('')
  const [uploadProgress, setUploadProgress] = useState(0);

  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
  const [dataString, setDataString]=useState('');

  
  const navigation = useNavigation();

  useEffect(() => {
    // if (formInstrumento.urlfoto===""){
    //   setPickedImagePath("")
    // }else{
    //   setPickedImagePath(formInstrumento.urlfoto)
    // }
  }, []);
  

  const limparFormulario=()=>{
    setFormInstrumento({})
    setPickedImagePath("")
  }

  const cancelar = async() => {
    limparFormulario()
  }

  const salvar = async() => {
    const instrumentoRefComId = instrumentoRef.doc();
    const instrumento= new Instrumento(formInstrumento);
    instrumento.id=instrumentoRefComId.id

    console.log(instrumento)
    instrumentoRefComId.set(instrumento.toFirestore()).then(() => {
         alert("Instrumento" + instrumento.tipo + " Adicionado com Sucesso");
         console.log("Instrumento" + instrumento);
         console.log("Instrumento ToString: "+instrumento.toString())
         limparFormulario()
         });
    };

    const showDatePicker = () => {
    setDatePickerVisibility(true);
  };

  const hideDatePicker = () => {
    setDatePickerVisibility(false);
  };

  const handleConfirm = (date) => {
    const formattedDate = date.getDate().toString().padStart(2, "0") + "/" + ((date.getMonth()+1).toString().padStart(2, "0"))  + "/" + date.getFullYear();
    console.log(formattedDate)
    setDataString(formattedDate)
    setFormInstrumento({...formInstrumento, datafabricacao:formattedDate})
    hideDatePicker();
  };


  const escolhefoto = () => {
    Alert.alert(
      "Alert Title",
      "My Alert Msg",
      [
        {
          text: "Camera",
          onPress: () => openCamera(),
          style: "default",
        },

        {
          text: "Abrir galeria",
          onPress: () => showImagePicker(),
          style: "cancel",
        },

      ],
      {
        cancelable: true,
        onDismiss: () => { }
      }
    );
  }

  const enviarImagem = async (result) => {
    if (!result.canceled) {
      setPickedImagePath(result.assets[0].uri);
      const uploadUri = result.assets[0].uri;
      let filename = uploadUri.substring(uploadUri.lastIndexOf('/') + 1);
      const extension = filename.split('.').pop();
      const name = filename.split('.').slice(0, -1).join('.');
     
      const ref = storage.ref(`imagens/${name}.${extension}`);

      const img = await fetch(result.assets[0].uri);
      const bytes = await img.blob();
      const fbResult = await uploadBytes(ref, bytes);

      const paraDonwload = await storage.ref(fbResult.metadata.fullPath).getDownloadURL()
      
      setFormInstrumento({... formInstrumento, urlfoto:paraDonwload})

      // const reference = firestore.collection("Usuario").doc(auth.currentUser.uid);
      //reference.update({ urlfoto: fbResult.metadata.fullPath, });
      // reference.update({ urlfoto: paraDonwload, nomeFoto: name + '.' + extension });
    } else {
      alert('Upload Cancelado')
    }
  }

  const showImagePicker = async () => {
    // Ask the user for the permission to access the media library
    const permissionResult =
      await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (permissionResult.granted === false) {
      alert("You've refused to allow this app to access your photos!");
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });
    console.log(result);

    enviarImagem(result);

  };


  const openCamera = async () => {
    // Ask the user for the permission to access the camera
    const permissionResult = await ImagePicker.requestCameraPermissionsAsync();
    if (permissionResult.granted === false) {
      alert("You've refused to allow this app to access your camera!");
      return;
    }

    const result = await ImagePicker.launchCameraAsync();
    enviarImagem(result);
  };
    
  
  return (
    // <KeyboardAvoidingView 
    // style={meuestilo.container}
    // behavior="padding">
      <View style={meuestilo.inputContainer}>

      <Pressable onPress={() => escolhefoto()}>
        <View style={meuestilo.imageContainer}>
          {pickedImagePath !== "" && (
            <Image source={{ uri: pickedImagePath }} style={meuestilo.image} />
          )}
          {pickedImagePath === "" && (
            <Image source={require("../assets/camera.png")}
              style={meuestilo.image} />
          )}
        </View>
      </Pressable>
        <TextInput
          placeholder="Tipo"
          value={formInstrumento.tipo}
          onChangeText={val => setFormInstrumento({ ...formInstrumento, tipo: val })}
          style={meuestilo.input}
        />
        <TextInput
          placeholder="Cor"
          value={formInstrumento.cor}
          onChangeText={val => setFormInstrumento({ ...formInstrumento, cor: val })}
          style={meuestilo.input}
        />

        <Button style={styles.calenderio} title="calendário" onPress={showDatePicker} />
              
              <DateTimePickerModal
                isVisible={isDatePickerVisible}
                mode="date"
                onConfirm={handleConfirm}
                onCancel={hideDatePicker}
              />

        <TextInput style={styles.input}
             placeholder="Data de Fabricação"
             value={dataString}
             editable={false}/>
        
      {/* </View>

      <View style={meuestilo.buttonContainer}> */}
      
        <TouchableOpacity onPress={cancelar} style={meuestilo.button}>
          <Text style={meuestilo.buttonText}>Cancelar</Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={salvar}
          style={[meuestilo.button, meuestilo.buttonOutline]}
        >
          <Text style={meuestilo.buttonOutlineText}>Salvar</Text>
        </TouchableOpacity>
      </View>
    // </KeyboardAvoidingView>
  );
};

export default ManterInstrumento;

const styles = StyleSheet.create({
  input: {
    backgroundColor: 'white',
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderRadius: 10,
    marginTop: 5,
    marginBottom: 50,
    color: 'black',
  },

  calendario:{
    marginTop: 50,
  }
})
