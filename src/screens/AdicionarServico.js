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

const AdicionarServico = () => {
	const { userEmail } = useUser() // Acessando o email do context
	const [nomeServico, setNomeServico] = useState('')
	const [valorDistancia, setValorDistancia] = useState('')
	const [valorBase, setValorBase] = useState('')
	const [modalVisible, setModalVisible] = useState(false)
	const [mensagem, setMensagem] = useState('')

const criarServico = () => {

	const servicoData = {
		serviceName: nomeServico,
		distanceValue: valorDistancia,
		baseValue: valorBase,
		companyMail: userEmail
	}
	console.log(servicoData)
	fetch('http://206.189.181.153:8080/sosAuto/services', {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
		},
		body: JSON.stringify(servicoData),
	})
		.then((data) => {
			console.log(data)
			if (data.status == 204) {
				alert('Cadastro de serviço bem-sucedido!')
			}
		})
		.catch((error) => {

			console.error('Erro durante a solicitação:', error)
			setMensagem(
				'Erro durante a solicitação ao servidor. Por favor, tente novamente.'
			)
		})
}

return (
	<View style={styles.container}>
	<TextInput
		placeholder='Nome do serviço'
		value={nomeServico}
		style={styles.input}
		placeholderTextColor='#ccc'
		onChangeText={setNomeServico}
	/>
	<TextInput
		placeholder='Valor da distancia por Km'
		value={valorDistancia}
		keyboardType = 'numeric'
		style={styles.input}
		placeholderTextColor='#ccc'
		onChangeText={setValorDistancia}
	/>
	<TextInput
		placeholder='Valor base do serviço'
		value={valorBase}
		keyboardType = 'numeric'
		style={styles.input}
		placeholderTextColor='#ccc'
		onChangeText={setValorBase}
	/>
	<Button
		title='Cadastrar serviço'
		onPress={criarServico}
	/>
	</View>
)
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: '#f5f5f5',
		paddingTop: 24,
		paddingHorizontal: 16,
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

export default AdicionarServico
