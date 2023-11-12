import { createNativeStackNavigator } from '@react-navigation/native-stack'
import { useUser } from '../context/UserContext'
import PaginaLogin from '../screens/PaginaLogin'
import ServicosEmpresa from '../screens/ServicosEmpresa'
import PaginaCadastro from '../screens/PaginaCadastro'
import PaginaCadastroEmpresa from '../screens/PaginaCadastroEmpresa'
import { DrawerNavigator } from '../routes/drawer.routes'

const Stack = createNativeStackNavigator()

export function StackRoutes() {
	const { userEmail, logout, isCompany } = useUser()

	return (
		<Stack.Navigator initialRouteName='PaginaLogin'>
			{userEmail ? (
				<>
					<Stack.Screen
						name='Drawer'
						component={DrawerNavigator}
						options={{
							headerShown: false,
						}}
					/>
					{!!isCompany && (
						<Stack.Screen
							name='ServicosEmpresa'
							component={ServicosEmpresa}
							options={{ headerShown: true }}
						/>
					)}
					{/* Adicione outras telas que devem ter um cabeçalho aqui */}
				</>
			) : (
				<>
					<Stack.Screen
						name='PaginaLogin'
						component={PaginaLogin}
						options={{ headerShown: false }}
					/>
					<Stack.Screen
						name='PaginaCadastro'
						component={PaginaCadastro}
						options={{ headerShown: false }}
					/>
					<Stack.Screen
						name='PaginaCadastroEmpresa'
						component={PaginaCadastroEmpresa}
						options={{ headerShown: false }}
					/>
					{/* Adicione outras telas que não devem ter um cabeçalho aqui */}
				</>
			)}
		</Stack.Navigator>
	)
}
