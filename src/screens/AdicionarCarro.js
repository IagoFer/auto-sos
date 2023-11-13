import React, { useState, useEffect } from 'react'
import {
	View,
	Text,
	StyleSheet,
	TouchableOpacity,
	Modal,
	TextInput,
	Button,
} from 'react-native'
import { useUser } from '../context/UserContext'

const AdicionarCarro = () => {
	const { userEmail } = useUser() // Acessando o email do contex
	const [marca, setMarca] = useState('')
	const [modelo, setModelo] = useState('')
	const [placa, setPlaca] = useState('')
	const [ano, setAno] = useState('')
	const [modalVisible, setModalVisible] = useState(false)
	const [mensagem, setMensagem] = useState('')
	const [isLoading, setIsLoading] = useState(true)

	const criarVeiculo = () => {
		const veiculoData = {
		  brand: marca,
		  licensePlate: placa,
		  model: modelo,
		  year: ano
		};
		const userData = {
		  email: userEmail,
		};
	
		fetch(
		  "http://206.189.181.153:8080/sosAuto/vehicle?" + 
		  new URLSearchParams(userData),
		  {
			method: "POST",
			headers: {
			  "Content-Type": "application/json",
			},
			body: JSON.stringify(veiculoData),
		  }
		)
		  .then((data) => {
			if (data.status == 204) {
			  alert("Cadastro de veículo bem-sucedido!");
			}
		  })
		  .catch((error) => {
			console.error("Erro durante a solicitação:", error);
			setMensagem(
			  "Erro durante a solicitação ao servidor. Por favor, tente novamente."
			);
		  });
	  };

	  return (
		<View style={styles.container}>
		  <TextInput
			placeholder="Nome da marca"
			value={marca}
			style={styles.input}
			placeholderTextColor="#ccc"
			onChangeText={setMarca}
		  />
		  <TextInput
			placeholder="Nome do modelo"
			value={modelo}
			style={styles.input}
			placeholderTextColor="#ccc"
			onChangeText={setModelo}
		  />
		  <TextInput
			placeholder="Ano do veículo"
			value={ano}
			style={styles.input}
			placeholderTextColor="#ccc"
			onChangeText={setAno}
		  />
		  	<TextInput
			placeholder="Placa do veículo"
			value={placa}
			style={styles.input}
			placeholderTextColor="#ccc"
			onChangeText={setPlaca}
		  />
		  <Button title="Cadastrar veículo" onPress={criarVeiculo} />
		</View>
	  );
	};

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: '#f5f5f5',
		paddingTop: 24,
		paddingHorizontal: 16,
	},
	card: {
		backgroundColor: 'white',
		borderRadius: 8,
		elevation: 4,
		padding: 16,
		marginBottom: 12,
	},
	nomeUsuario: {
		fontSize: 20,
		fontWeight: 'bold',
		marginBottom: 8,
	},
	info: {
		fontSize: 16,
		marginBottom: 8,
	},
	botao: {
		backgroundColor: '#4CAF50',
		paddingVertical: 8,
		paddingHorizontal: 12,
		borderRadius: 4,
		alignItems: 'center',
	},
	botaoTexto: {
		color: 'white',
		fontWeight: 'bold',
	},
	modalContainer: {
		flex: 1,
		justifyContent: 'center',
		alignItems: 'center',
		backgroundColor: 'rgba(0, 0, 0, 0.5)',
	},
	input: {
		width: '80%',
		height: 50,
		fontSize: 18,
		marginVertical: 10,
		padding: 10,
		borderWidth: 1,
		borderColor: '#ccc',
		borderRadius: 5,
		backgroundColor: 'white',
	},
	mensagemErro: {
		color: 'red',
		marginTop: 10,
	},
})

export default AdicionarCarro
