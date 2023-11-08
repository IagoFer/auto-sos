import React from 'react'
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native'
import { useNavigation } from '@react-navigation/native'
import { DrawerContentScrollView } from '@react-navigation/drawer'
import { Ionicons } from '@expo/vector-icons'

const PaginaMenu = ({ navigation }) => {
	return (
		<View style={styles.container}>
			{/* ... Seu conteúdo aqui */}
			<TouchableOpacity onPress={() => navigation.navigate('PerfilEmpresa')}>
				<View style={styles.card}>
					<Text style={styles.companyName}>Mecânica XYZ</Text>
					<Text style={styles.infoText}>Localização: Rua Godofredo, 123</Text>
					<Text style={styles.infoText}>
						Horário de Funcionamento: 08:00 - 18:00
					</Text>
				</View>
			</TouchableOpacity>
		</View>
	)
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: '#f5f5f5', // Cor de fundo
		padding: 16,
	},
	menuIcon: {
		marginBottom: 16,
	},
	cardContainer: {
		marginBottom: 16,
	},
	card: {
		backgroundColor: 'white',
		borderRadius: 8,
		shadowColor: '#000',
		shadowOffset: {
			width: 0,
			height: 2,
		},
		shadowOpacity: 0.25,
		shadowRadius: 3.84,
		elevation: 5,
		padding: 16,
	},
	companyName: {
		fontSize: 20,
		fontWeight: 'bold',
		marginBottom: 8,
		color: '#333', // Cor do texto
	},
	infoText: {
		fontSize: 16,
		marginBottom: 4,
		color: '#555', // Cor do texto
	},
})

export default PaginaMenu
