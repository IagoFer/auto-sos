import React, { createContext, useContext, useState } from 'react'
import { Alert } from 'react-native'

const UserContext = createContext({
	userEmail: '',
	userPassword: '',
	isCompany: false,
	login: async (email, senha) => {},
	logout: () => {},
})

export const UserProvider = ({ children }) => {
	const [userEmail, setUserEmail] = useState('')
	const [userPassword, setUserPassword] = useState('')
	const [isCompany, setIsCompany] = useState(false)

	async function login(email, senha) {
		if (!email || !senha) {
			Alert.alert('Atenção', 'Preencha todos os campos')
			return
		}

		const userData = {
			email: email,
			password: senha,
		}

		await fetch(
			'http://206.189.181.153:8080/sosAuto/login?' +
				new URLSearchParams(userData),
			{
				method: 'GET',
				headers: {
					'Content-Type': 'application/json',
				},
			}
		)
			.then((response) => response.json())
			.then((data) => {
				if (data?.hasUser) {
					setUserEmail(email)
					setUserPassword(senha)
					setIsCompany(data.typeEntity == 'companyEntity')
				} else {
					Alert.alert('Atenção', data?.message || 'Usuário não existe')
				}
			})
			.catch((error) => {
				console.error('Erro durante a solicitação:', error)
				Alert.alert('Algo aconteceu', 'Se persistir contate nosso suporte')
			})
	}

	function logout() {
		setUserEmail('')
	}

	return (
		<UserContext.Provider value={{ login, isCompany, userEmail, userPassword, logout }}>
			{children}
		</UserContext.Provider>
	)
}

export const useUser = () => {
	const context = useContext(UserContext)
	if (!context) {
		throw new Error('useUser must be used within a UserProvider')
	}
	return context
}
