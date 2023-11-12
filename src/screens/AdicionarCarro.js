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
	const [modalVisible, setModalVisible] = useState(false)
	const [nomeEditado, setNomeEditado] = useState('')
	const [marcaEditado, setMarcaEditado] = useState('')
	const [modeloEditada, setModeloEditada] = useState('')
	const [placaEditada, setPlacaEditada] = useState('')
	const [mensagem, setMensagem] = useState('')
	const [isLoading, setIsLoading] = useState(true)

	useEffect(() => {
		const userData = {
			email: userEmail,
		}
		const vehicleData = {
			email: userEmail,
		}

		if (userEmail) {
			fetch(
				`http://206.189.181.153:8080/sosAuto/vehicle/vehiclesByPeople?` +
					new URLSearchParams(vehicleData),
				{
					method: 'GET',
					headers: {
						'Content-Type': 'application/json',
					},
				}
			)
				.then((response) => response.json())
				.then((data) => {
					setIsLoading(false)
					console.log(data[0])
					//  if (response.status == 200) {
					setMarca(data[0].brand)
					setModelo(data[0].model)
					setPlaca(data[0].licensePlate)
					//  } else {
					//   setMensagem('Erro ao carregar perfil. Por favor, tente novamente.');
					//  }
				})
				.catch((error) => {
					setIsLoading(false)
					console.error('Erro durante a solicitação:', error)
					setMensagem(
						'Erro durante a solicitação ao servidor. Por favor, tente novamente.'
					)
				})
		}
	}, [userEmail])

	const editarCarro = async () => {
		const vehiclePatchData = {
			email: userEmail,
			licensePlate: placa,
		}
		setIsLoading(true)
		const userData = {
			email: userEmail,
		}
		try {
			const response = await fetch(
				`http://206.189.181.153:8080/sosAuto/vehicle?` +
					new URLSearchParams(vehiclePatchData),
				{
					method: 'PATCH',
					headers: {
						'Content-Type': 'application/json',
					},
					body: JSON.stringify({
						brand: marcaEditado,
						licensePlate: placaEditada,
						model: modeloEditada,
					}),
				}
			)
			setIsLoading(false)
			console.log(response)
			if (response.status == 204) {
				setModalVisible(false)
				setMarcaEditado('')
				setPlacaEditada('')
				setModeloEditada('')
				alert('Alteração bem-sucedida! Faça o login novamente !')
			} else {
				setMensagem(
					response.message ||
						'Erro durante a atualização do perfil. Por favor, tente novamente.'
				)
			}
		} catch (error) {
			setIsLoading(false)
			console.error('Erro durante a solicitação:', error)
			setMensagem('Erro durante a solicitação ao servidor')
		}
	}

	return (
		<View style={styles.container}>
			{isLoading ? (
				<Text>Carregando...</Text>
			) : mensagem ? (
				<View style={styles.container}>
					<Text style={styles.mensagemErro}>{mensagem}</Text>
				</View>
			) : (
				<View style={styles.card}>
					<Text style={styles.nomeUsuario}>{`Carro: ${modelo}`}</Text>
					<Text style={styles.info}>{`Marca: ${marca}`}</Text>
					<Text style={styles.info}>{`Placa: ${placa}`}</Text>
					<TouchableOpacity
						style={styles.botao}
						onPress={() => setModalVisible(true)}>
						<Text style={styles.botaoTexto}>Editar Carro</Text>
					</TouchableOpacity>
				</View>
			)}

			<Modal
				animationType='slide'
				transparent={true}
				visible={modalVisible}
				onRequestClose={() => setModalVisible(false)}>
				<View style={styles.modalContainer}>
					<TextInput
						style={styles.input}
						placeholder='Modelo'
						value={modeloEditada}
						onChangeText={(text) => setModeloEditada(text)}
					/>
					<TextInput
						style={styles.input}
						placeholder='Marca'
						value={marcaEditado}
						onChangeText={(text) => setMarcaEditado(text)}
					/>
					<TextInput
						style={styles.input}
						placeholder='Placa'
						value={placaEditada}
						onChangeText={(text) => setPlacaEditada(text)}
					/>

					{mensagem ? (
						<Text style={styles.mensagemErro}>{mensagem}</Text>
					) : null}
					<Button
						title='Salvar Alterações'
						onPress={editarCarro}
					/>
					<Button
						title='Cancelar'
						onPress={() => setModalVisible(false)}
					/>
				</View>
			</Modal>
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
