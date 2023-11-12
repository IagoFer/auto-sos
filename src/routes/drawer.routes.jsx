import {
	createDrawerNavigator,
	DrawerItem,
	DrawerItemList,
} from '@react-navigation/drawer'
import { useUser } from '../context/UserContext'
import AdicionarCarro from '../screens/AdicionarCarro'
import PerfilUsuario from '../screens/PerfilUsuario'
import PaginaMenu from '../screens/PaginaMenu'
import { AcompanharRota } from '../screens/AcompanharRota'
import { View } from 'react-native'
import { TouchableOpacity } from 'react-native'
import Icon from 'react-native-vector-icons/FontAwesome'
import PerfilEmpresa from '../screens/PerfilEmpresa'
import AdicionarServico from '../screens/AdicionarServico'

const Drawer = createDrawerNavigator()

export function DrawerNavigator({}) {
	const { isCompany, logout } = useUser()
	return (
		<Drawer.Navigator
			initialRouteName='Inicio'
			drawerContent={(props) => (
				<View style={{ paddingTop: 50 }}>
					<DrawerItemList {...props} />
					<DrawerItem
						label='Sair'
						onPress={logout}
					/>
				</View>
			)}
			screenOptions={{
				headerRight: () => (
					<TouchableOpacity
						style={{ marginRight: 16 }}
						onPress={logout}>
						<Icon
							name='sign-out'
							size={20}
						/>
					</TouchableOpacity>
				),
			}}>
			{isCompany ? (
				<Drawer.Group>
					<Drawer.Screen
						name='Inicio'
						component={PaginaMenu}
					/>
					<Drawer.Screen
						name='Seu Perfil'
						component={PerfilEmpresa}
					/>
					<Drawer.Screen
						name='Adicionar Serviços'
						component={AdicionarServico}
					/>
					<Drawer.Screen
						name='Acompanhar Rota'
						component={AcompanharRota}
					/>
				</Drawer.Group>
			) : (
				<Drawer.Group>
					<Drawer.Screen
						name='Inicio'
						component={PaginaMenu}
					/>
					<Drawer.Screen
						name='Seu Perfil'
						component={PerfilUsuario}
					/>
					<Drawer.Screen
						name='Carro'
						component={AdicionarCarro}
					/>
					<Drawer.Screen
						name='Acompanhar Rota'
						component={AcompanharRota}
					/>
				</Drawer.Group>
			)}

			{/* Adicione outras telas de menu aqui, se necessário */}
		</Drawer.Navigator>
	)
}
