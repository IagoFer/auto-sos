import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Modal,
  TextInput,
  Button,
} from 'react-native';
import { useUser } from '../context/UserContext';

const PerfilEmpresa = ({ navigation }) => {
  const { userEmail, userPassword } = useUser();
  const [nomeUsuario, setNomeUsuario] = useState('');
  const [telefone, setTelefone] = useState('');
  const [endereco, setEndereco] = useState('');
  const [cnpj, setCnpj] = useState('');
  const [horarioDeTrabalho, setHorarioDeTrabalho] = useState('');
  const [modalVisible, setModalVisible] = useState(false);
  const [nomeUsuarioEditado, setNomeUsuarioEditado] = useState('');
  const [telefoneEditado, setTelefoneEditado] = useState('');
  const [enderecoEditado, setEnderecoEditado] = useState('');
  const [horarioDeTrabalhoEditado, setHorarioDeTrabalhoEditado] = useState('');
  const [senhaEditada, setSenhaEditada] = useState('');
  const [confirmarSenha, setConfirmarSenha] = useState('');
  const [mensagem, setMensagem] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const userData = {
      email: userEmail,
      password: userPassword,
    };
    if (userEmail) {
      fetch(
        `http://206.189.181.153:8080/sosAuto/companies?` +
          new URLSearchParams(userData),
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        }
      )
        .then((response) => {
          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
          }
          return response.json();
        })
        .then((data) => {
          setIsLoading(false);
          if (data.statusCode == 200) {
            setNomeUsuario(data.name);
            setTelefone(data.contactNumber);
            setEndereco(data.address);
            setCnpj(data.cnpj);
            setHorarioDeTrabalho(data.workHour);
          } else {
            console.error('Erro ao carregar perfil:', data.message);
            setMensagem('Erro ao carregar perfil. Por favor, tente novamente.');
          }
        })
        .catch((error) => {
          setIsLoading(false);
          console.error('Erro durante a solicitação:', error);
          setMensagem('Erro durante a solicitação ao servidor.');
        });
    }
  }, [userEmail]);

  const diasDaSemanaTraducao = {
    MONDAY: 'Segunda-feira',
    TUESDAY: 'Terça-feira',
    WEDNESDAY: 'Quarta-feira',
    THURSDAY: 'Quinta-feira',
    FRIDAY: 'Sexta-feira',
    SATURDAY: 'Sábado',
    SUNDAY: 'Domingo',
  };

  const diasOrdenados = [
    'MONDAY',
    'TUESDAY',
    'WEDNESDAY',
    'THURSDAY',
    'FRIDAY',
    'SATURDAY',
    'SUNDAY',
  ];

  const editarPerfil = async () => {
    if (confirmarSenha !== senhaEditada) {
      alert('As senhas não coincidem. Por favor, tente novamente.');
      return;
    }

    setIsLoading(true);
    const userData = {
      email: userEmail,
      password: userPassword,
    };
    try {
      const response = await fetch(
        `http://206.189.181.153:8080/sosAuto/companies?` +
          new URLSearchParams(userData),
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            name: nomeEditado,
            mobilePhoneNumber: telefoneEditado,
            address: enderecoEditado,
            password: senhaEditada,
          }),
        }
      );
      setIsLoading(false);
      if (response.status == 204) {
        setModalVisible(false);
        nomeUsuarioEditado('');
        setTelefoneEditado('');
        setEnderecoEditado('');
        setSenhaEditada('');
        setConfirmarSenha('');
        alert('Alteração bem-sucedida! Faça o login novamente!');
        setTimeout(() => {
          navigation.navigate('Seu Perfil');
        }, 2000);
      } else {
        setMensagem(
          response.message ||
            'Erro durante a atualização do perfil. Por favor, tente novamente.'
        );
      }
    } catch (error) {
      setIsLoading(false);
      console.error('Erro durante a solicitação:', error);
      setMensagem('Erro durante a solicitação ao servidor');
    }
  };

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
          <Text style={styles.nomeUsuario}>{nomeUsuario}</Text>
          <Text style={styles.info}>{`Email: ${userEmail}`}</Text>
          <Text style={styles.info}>{`Endereço: ${endereco}`}</Text>
          <Text style={styles.info}>{`Telefone: ${telefone}`}</Text>
          <Text style={styles.info}>{`Horário de funcionamento:`}</Text>
          <View style={styles.horariosContainer}>
            {diasOrdenados.map((dia) => (
              <Text key={dia} style={styles.info}>{`${diasDaSemanaTraducao[dia]}: ${horarioDeTrabalho[dia]}`}</Text>
            ))}
          </View>
          <TouchableOpacity
            style={styles.botao}
            onPress={() => setModalVisible(true)}>
            <Text style={styles.botaoTexto}>Editar Perfil</Text>
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
            placeholder='Novo Nome'
            value={nomeUsuarioEditado}
            onChangeText={(text) => nomeUsuarioEditado(text)}
          />
          <TextInput
            style={styles.input}
            placeholder='Novo Número'
            value={telefoneEditado}
            onChangeText={(text) => setTelefoneEditado(text)}
          />
          <TextInput
            style={styles.input}
            placeholder='Endereço'
            value={enderecoEditado}
            onChangeText={(text) => setEnderecoEditado(text)}
          />
          <TextInput
            style={styles.input}
            placeholder='Horários de trabalho'
            value={horarioDeTrabalhoEditado}
            onChangeText={(text) => setHorarioDeTrabalho(text)}
          />
          <TextInput
            style={styles.input}
            placeholder='Nova Senha'
            secureTextEntry={true}
            value={senhaEditada}
            onChangeText={(text) => setSenhaEditada(text)}
          />
          <TextInput
            style={styles.input}
            placeholder='Confirmar Nova Senha'
            secureTextEntry={true}
            value={confirmarSenha}
            onChangeText={(text) => setConfirmarSenha(text)}
          />
          {mensagem ? (
            <Text style={styles.mensagemErro}>{mensagem}</Text>
          ) : null}
          <Button
            title='Salvar Alterações'
            onPress={editarPerfil}
          />
          <Button
            title='Cancelar'
            onPress={() => setModalVisible(false)}
          />
        </View>
      </Modal>
    </View>
  );
};

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
  horariosContainer: {
    marginTop: 8,
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
});

export default PerfilEmpresa;
