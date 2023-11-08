import 'react-native-gesture-handler'
import React from 'react'
import { UserProvider } from './src/context/UserContext'
import { Routes } from './src/routes'

function App() {
	return (
		<UserProvider>
			<Routes />
		</UserProvider>
	)
}

export default App
