import React, { useState, useEffect } from "react";
import { ActivityIndicator, SafeAreaView, View, FlatList, Text, StatusBar, Pressable, Image } from "react-native";
import { auth, firestore } from "../firebase";
import meuestilo from "../meuestilo";
import { Instrumento } from "../model/Instrumento";
const ListarInstrumento = () => {
  const [loading, setLoading] = useState(true); // Set loading to true
  const [instrumentos, setInstrumentos] = useState<Instrumento[]>([]); // Initial empty array
  const instrumentoRef =
    firestore.collection('Usuario').doc(auth.currentUser?.uid)
      .collection('Instrumento')
  //const instrumentoRef = firestore.collection('Instrumento');

  useEffect(() => {
    const subscriber = instrumentoRef
      .onSnapshot((querySnapshot) => {
        const instrumentos = [];
        querySnapshot.forEach((documentSnapshot) => {
          instrumentos.push({
            ...documentSnapshot.data(),
            key: documentSnapshot.id,
          });
        });
        setInstrumentos(instrumentos);
        setLoading(false);
      });
    return () => subscriber();
  }, [instrumentos]);


  if (loading) {
    return <ActivityIndicator />;
  }


  const renderItem = ({ item }) => {
    return <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
      {/* <View style={meuestilo.item} key={item.id}> */}
      <Pressable
        style={({ pressed }) => [{ backgroundColor: pressed ? '#f1f1f1' : 'transparent' }, meuestilo.title]}
        
      >
        <View style={meuestilo.alinhamentoLinha}>
          <Image style={{ height: 80, width: 80, borderRadius: 50 }} source={{ uri: item.urlfoto }} />
          <View style={meuestilo.alinhamentoColuna}>
          <Text style={meuestilo.itemStylefirebase}>ID: {item.id}</Text>
            <Text style={meuestilo.itemStylefirebase}>Tipo: {item.tipo}</Text>
            <Text style={meuestilo.itemStylefirebase}>Cor: {item.cor}</Text>
            <Text style={meuestilo.itemStylefirebase}>Data de Fabricação: {item.datafabricacao}</Text>
            {/* fecha alinhamento colunas */}
          </View>
          {/* fecha alinhamento linhas */}
        </View>
      </Pressable>
    </View>
  }


  return (
    <SafeAreaView style={meuestilo.containerlistar}>
      <FlatList
        data={instrumentos}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
      />
    </SafeAreaView>
  );
};
export default ListarInstrumento;
