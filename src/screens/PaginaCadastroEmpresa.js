import React, { useState } from 'react'
import { View, Text, TextInput, Button, StyleSheet, ScrollView, } from 'react-native'
import { FontAwesome } from '@expo/vector-icons'
import { Picker } from '@react-native-picker/picker'

const PaginaCadastroEmpresa = ({ navigation }) => {
	const [horariosDeTrabalho, setHorariosDeTrabalho] = useState({
		MONDAY: '',
		TUESDAY: '',
		WEDNESDAY: '',
		THURSDAY: '',
		FRIDAY: '',
		SATURDAY: '',
		SUNDAY: '',
	})

	const [nome, setNome] = useState('')
	const [email, setEmail] = useState('')
	const [senha, setSenha] = useState('')
	const [numero, setNumero] = useState('')
	const [endereco, setEndereco] = useState('')
	const [cnpj, setCnpj] = useState('')
	const [diasDeTrabalho, setDiasDeTrabalho] = useState('')

	const [mensagem, setMensagem] = useState('')

	const handleCadastro = () => {
		if (!nome || !email || !senha || !numero || !endereco || !cnpj) {
			setMensagem('Preencha todos os campos.')
			return
		}

		const workHour = {
			SATURDAY: diasDeTrabalho == 'sabado' ? horariosDeTrabalho : '',
			SUNDAY: diasDeTrabalho == 'domingo' ? horariosDeTrabalho : '',
			MONDAY: diasDeTrabalho == 'segunda' ? horariosDeTrabalho : '',
			TUESDAY: diasDeTrabalho == 'terca' ? horariosDeTrabalho : '',
			WEDNESDAY: diasDeTrabalho == 'quarta' ? horariosDeTrabalho : '',
			THURSDAY: diasDeTrabalho == 'quinta' ? horariosDeTrabalho : '',
			FRIDAY: diasDeTrabalho == 'sexta' ? horariosDeTrabalho : '',
		}

		const userData = {
			name: nome,
			address: endereco,
			cnpj: cnpj,
			workHour: horariosDeTrabalho,
			email: email,
			password: senha,
			contactNumber: numero,
		}
		fetch('http://206.189.181.153:8080/sosAuto/companies', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify(userData),
		})
			.then((data) => {
				if (data.status == 204) {
					alert('Cadastro bem-sucedido!')
					setTimeout(() => {
						navigation.navigate('PaginaLogin')
					}, 2000)
				} else if (data.status == 422) {
					alert('Email ja existente no sistema. Por favor, tente com outro.')
				} else {
					throw new Error(
						data.error || 'Erro durante o cadastro. Por favor, tente novamente.'
					)
				}
			})
			.catch((error) => {
				console.error('Erro durante a solicitação:', error)
				alert(
					error.message ||
						'Erro durante a solicitação. Por favor, tente novamente.'
				)
			})
	}

	return (
		<ScrollView style={styles.container}>
			<FontAwesome
				name='cog'
				size={50}
				color='orange'
				style={styles.icon}
			/>
			<Text style={styles.title}>Cadastro da Empresa</Text>
			<TextInput
				placeholder='Nome'
				value={nome}
				style={styles.input}
				placeholderTextColor='#ccc'
				onChangeText={setNome}
			/>
			<TextInput
				placeholder='Email'
				value={email}
				style={styles.input}
				placeholderTextColor='#ccc'
				onChangeText={setEmail}
			/>
			<TextInput
				placeholder='Cnpj'
				value={cnpj}
				style={styles.input}
				placeholderTextColor='#ccc'
				onChangeText={setCnpj}
			/>
			<TextInput
				placeholder='Telefone'
				value={numero}
				style={styles.input}
				placeholderTextColor='#ccc'
				onChangeText={setNumero}
			/>
			<TextInput
				placeholder='Endereço'
				value={endereco}
				style={styles.input}
				placeholderTextColor='#ccc'
				onChangeText={setEndereco}
			/>
			<TextInput
				placeholder='Senha'
				value={senha}
				secureTextEntry={true}
				style={styles.input}
				placeholderTextColor='#ccc'
				onChangeText={setSenha}
			/>
			<Picker
				selectedValue={diasDeTrabalho}
				onValueChange={(itemValue) => setDiasDeTrabalho(itemValue)}
				style={styles.picker}>
				<Picker.Item
					label='Selecione dia / digite horario'
					value=''
				/>
				<Picker.Item
					label='Segunda-feira'
					value='MONDAY'
				/>
				<Picker.Item
					label='Terça-feira'
					value='TUESDAY'
				/>
				<Picker.Item
					label='Quarta-feira'
					value='WEDNESDAY'
				/>
				<Picker.Item
					label='Quinta-feira'
					value='THURSDAY'
				/>
				<Picker.Item
					label='Sexta-feira'
					value='FRIDAY'
				/>
				<Picker.Item
					label='Sábado'
					value='SATURDAY'
				/>
				<Picker.Item
					label='Domingo'
					value='SUNDAY'
				/>
			</Picker>
			<TextInput
				placeholder='Horário de Trabalho'
				value={horariosDeTrabalho[diasDeTrabalho]}
				style={styles.input}
				placeholderTextColor='#ccc'
				onChangeText={(text) => {
					setHorariosDeTrabalho((prevState) => ({
						...prevState,
						[diasDeTrabalho]: text,
					}))
				}}
			/>

			<Button
				title='Cadastrar Empresa'
				onPress={handleCadastro}
			/>
			<Button
				title='Já tenho uma conta'
				onPress={() => navigation.navigate('PaginaLogin')}
				color='green'
			/>
			{mensagem ? <Text style={styles.mensagem}>{mensagem}</Text> : null}
		</ScrollView>
	)
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		width: '100%',
		height: '100%',
		backgroundColor: 'black',
	},
	picker: {
		width: '80%',
		height: 50,
		color: 'white',
		borderWidth: 1,
		borderColor: '#ccc',
		borderRadius: 5,
		marginVertical: 10,
		padding: 10,
	},
	title: {
		paddingLeft: 80,
		fontSize: 24,
		color: 'white',
		marginBottom: 20,
	},
	input: {
		width: '100%',
		height: 50,
		fontSize: 18,
		marginVertical: 10,
		padding: 10,
		borderWidth: 1,
		borderColor: '#ccc',
		borderRadius: 5,
		color: 'white',
	},
	icon: {
		marginTop:15,
		paddingLeft: 170,
		marginBottom: 20,
	},
	mensagem: {
		color: 'white',
		marginTop: 20,
	},
})

export default PaginaCadastroEmpresa
