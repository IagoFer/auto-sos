import React, { useState } from 'react'
import {
	View,
	Text,
	TextInput,
	Pressable,
	StyleSheet,
	ActivityIndicator,
} from 'react-native'
import { FontAwesome } from '@expo/vector-icons'
import { useUser } from '../context/UserContext'

const PaginaLogin = ({ navigation }) => {
	const [email, setEmail] = useState('')
	const [senha, setSenha] = useState('')
	const [isLoading, setLoading] = useState(false)

	const { login } = useUser() // Obtenha updateUserEmail do context

	async function handleLogin() {
		if (isLoading) return
		await login(email, senha)
		setLoading(false)
	}

	return (
		<View style={styles.container}>
			<FontAwesome
				name='cog'
				size={50}
				color='orange'
				style={styles.icon}
			/>
			<Text style={styles.title}>Login</Text>
			<TextInput
				placeholder='Email'
				style={styles.input}
				placeholderTextColor='#ccc'
				onChangeText={(text) => setEmail(text)}
			/>
			<TextInput
				placeholder='Senha'
				secureTextEntry={true}
				style={styles.input}
				placeholderTextColor='#ccc'
				onChangeText={(text) => setSenha(text)}
			/>
			<Pressable
				style={styles.button}
				onPress={handleLogin}>
				{isLoading ? (
					<ActivityIndicator />
				) : (
					<Text style={styles.buttonText}>Entrar</Text>
				)}
			</Pressable>
			<Pressable
				style={styles.signupButton}
				onPress={() => navigation.navigate('PaginaCadastroEmpresa')}>
				<Text style={styles.buttonText}>Cadastre sua Empresa</Text>
			</Pressable>
			<Pressable
				style={styles.signupButton}
				onPress={() => navigation.navigate('PaginaCadastro')}>
				<Text style={styles.buttonText}>Cadastre-se como Consumidor</Text>
			</Pressable>
		</View>
	)
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		justifyContent: 'center',
		alignItems: 'center',
		width: '100%',
		height: '100%',
		backgroundColor: 'black',
	},
	title: {
		fontSize: 24,
		color: 'white',
		marginBottom: 20,
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
		color: 'white',
	},
	icon: {
		marginBottom: 20,
	},
	button: {
		backgroundColor: 'green',
		paddingVertical: 10,
		paddingHorizontal: 20,
		borderRadius: 5,
		marginVertical: 5,
	},
	signupButton: {
		backgroundColor: 'red',
		paddingVertical: 10,
		paddingHorizontal: 20,
		borderRadius: 50,
		marginVertical: 5,
	},
	buttonText: {
		color: 'white',
		fontSize: 18,
	},
})

export default PaginaLogin
