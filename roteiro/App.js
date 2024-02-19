import { useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View , TextInput, Platform, 
Pressable, ScrollView,ActivityIndicator, Alert, Keyboard} from 'react-native';
import Slider from '@react-native-community/slider';
import {MaterialIcons} from '@expo/vector-icons'

const statusBar = StatusBar.currentHeight
const KEY_CHATGPT = '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'


export default function App() {
  const [city, setCity] = useState("")
  const [days, setDays] = useState(10) 
  const [loading, setLoading] = useState(false)
  const [travel, setTravel] = useState("")

  const handleGenerate = async ()=>{
    if(city === ""){
      Alert.alert("Atenção", "Preencha o nome da cidade!")
    }
    setTravel("")
    setLoading(true);
    Keyboard.dismiss; // fechando o teclado do usuário

    const Prompt = `Crie um roteiro para uma viagem de exatos ${days.toFixed(0)} dias na cidade de ${city}, busque por lugares turisticos, lugares mais visitados, seja preciso nos dias de estadia fornecidos e limite o roteiro apenas na cidade fornecida. Forneça apenas em tópicos com nome do local onde ir em cada dia.`
    // pegando e utilizando API do Openai(chatgpt)
    fetch('https://api.openai.com/v1/chat/completions',{
      method: "POST",
      // definindo os cabeçalhos da solicitação HTTP, 
      headers:{
        "Content-Type": "application/json",
        Authorization: `Bearer ${KEY_CHATGPT}`
      },
      // convertendo um objeto JavaScript em uma string JSON usando JSON.stringify()
      body: JSON.stringify({
        model:"gpt-3.5-turbo-0301",
        messages: [
          {
            role:'user',
            content: Prompt
          },
        ],
            temperature: 0.20,
            max_tokens: 500,
            top_p:1
      })
    })
    // Tranformando o retorno da API em JSON
    .then(response => response.json())
    // Pegando o retorno da API
    .then((data)=>{
      console.log(data.choices[0].message.content)
      setTravel(data.choices[0].message.content)
    })
    // caso de algum erro na API
    .catch((error)=>{
      console.log(error)
    })
    // chamada a API deu certo
    .finally(()=>{
      setLoading(false)
    })
  }


  return (
    <View style={styles.container}>
      <StatusBar style="auto" />
      <Text style={styles.heading}>Roteiro fácil</Text>
    
      <View style={styles.form}>
        <Text style={styles.label}>Cidade destino</Text>
        <TextInput
          placeholder='Ex: Campo Grande, MS'
          style={styles.input}
          onChangeText={(text)=> setCity(text)}
          value={city}
        />
        <Text style={styles.label}>Tempo de estadia: <Text style={styles.days}>{days}</Text> dias</Text>
        <Slider
          minimumValue={1}
          maximumValue={31}
          minimumTrackTintColor='#009688'
          maximumTrackTintColor='#000000'
          value={days}
          onValueChange={(value)=> setDays(value.toFixed(0))}
        />
      </View>

      <Pressable style={styles.button} onPress={handleGenerate}>
        <Text style={styles.buttonText}>Gerar roteiro</Text>
        <MaterialIcons name='travel-explore'  size={24} color='#FFF'/>
      </Pressable>

      <ScrollView style={styles.containerScroll} showsVerticalScrollIndicator={false} contentContainerStyle={{paddingBottom: 24, marginTop:4 }}>
        {loading &&(
        <View style={styles.content}>
          <Text style={styles.title}>Carregando roteiro....</Text>
          <ActivityIndicator color='#000' size='large'/> 
        </View>
        )

        }

        {travel && (
        <View style={styles.content}>
          <Text style={styles.title}>Roteiro da sua viagem</Text>
          <Text>{travel}</Text>
        </View>
        )

        }
      </ScrollView>
    
    
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f1f1f1',
    alignItems: 'center',
    paddingTop: 20
  },
  heading:{
    fontSize: 32,
    fontWeight: 'bold',
    paddingTop: Platform.OS === 'android' ? statusBar : 54
  },
  form:{
    backgroundColor: '#FFF',
    width: '90%',
    borderRadius: 8 ,
    padding: 16,
    marginTop: 16,
    marginBottom: 8 
  },
  label:{
    fontWeight: 'bold',
    fontSize: 18,
    marginBottom: 8
  },
  input:{
    borderWidth: 1,
    borderRadius: 4,
    borderColor: "#94a3b8",
    padding: 8,
    fontSize: 16,
    marginBottom: 16
  },
  days:{
    backgroundColor: '#F1F1F1'  
  },
  button:{
    backgroundColor: '#FF5656',
    width: '90%',
    borderRadius: 8,
    flexDirection: 'row',
    padding: 14,
    justifyContent: "center",
    alignItems: "center",
    gap: 8
  },
  buttonText:{
    fontSize: 18,
    color: "#FFF",
    fontWeight: "bold"
  },
  content:{
    backgroundColor: '#FFF',
    padding: 16,
    width: "100%",
    marginTop: 16,
    borderRadius: 8,
  },
  title:{
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 14
  },
  containerScroll:{
    width: '90%',
    marginTop: 8
  }


});





//showsVerticalScrollIndicator: desabilita a barra de rolagem vertical

// contentContainerStyle: estilo do container do scroll

// <ActivityIndicator color='#000' size='large'/>: bolinha carregando na tela 
