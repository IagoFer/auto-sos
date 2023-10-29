import React, { useState } from 'react';
import { View, Text, TextInput, Pressable, StyleSheet } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import { useUser } from './UserContext'; // Importe useUser

const PaginaLogin = ({ navigation, setIsLoggedIn }) => {
    const [email, setEmail] = useState('');
    const [senha, setSenha] = useState('');
    const { updateUserEmail } = useUser(); // Obtenha updateUserEmail do contexto

    const handleLogin = () => {
        if (!email || !senha) {
            console.log("Preencha todos os campos");
            return;
        }

        const userData = {
            email: email,
            password: senha,
        };

        fetch("http://206.189.181.153:8080/sosAuto/login?" + new URLSearchParams(userData), {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        })
            .then((response) => response.json())
            .then((data) => {
                console.log(data);
                if (data.hasUser) {
                    console.log('Resposta do servidor:', data);
                    setIsLoggedIn(true);
                    console.log('User logged in'); // Adicione este log
                    updateUserEmail(email);
                    console.log(email);
                    navigation.navigate('PaginaMenu'); // Navegação para a próxima tela após o login bem-sucedido
                } else {
                    console.error('Usuário não existe');
                }
            })
            .catch((error) => {
                console.error('Erro durante a solicitação:', error);
            });
    };

    return (
        <View style={styles.container}>
            <FontAwesome name="cog" size={50} color="orange" style={styles.icon} />
            <Text style={styles.title}>Login</Text>
            <TextInput
                placeholder="Email"
                style={styles.input}
                placeholderTextColor="#ccc"
                onChangeText={(text) => setEmail(text)}
            />
            <TextInput
                placeholder="Senha"
                secureTextEntry={true}
                style={styles.input}
                placeholderTextColor="#ccc"
                onChangeText={(text) => setSenha(text)}
            />
            <Pressable style={styles.button} onPress={handleLogin}>
                <Text style={styles.buttonText}>Entrar</Text>
            </Pressable>
            <Pressable style={styles.signupButton} onPress={() => navigation.navigate('PaginaCadastroEmpresa')}>
                <Text style={styles.buttonText}>Cadastre sua Empresa</Text>
            </Pressable>
            <Pressable style={styles.signupButton} onPress={() => navigation.navigate('PaginaCadastro')}>
                <Text style={styles.buttonText}>Cadastre-se como Consumidor</Text>
            </Pressable>
        </View>
    );
};

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
});

export default PaginaLogin;
