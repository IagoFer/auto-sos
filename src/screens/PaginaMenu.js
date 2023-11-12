import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList, Modal, Button } from 'react-native';
import { useUser } from '../context/UserContext';

const PaginaMenu = () => {
  const { userEmail, userPassword } = useUser();
  const [isLoading, setIsLoading] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);

  const [nomeUsuario, setNomeUsuario] = useState('');
  const [telefone, setTelefone] = useState('');
  const [endereco, setEndereco] = useState('');
  const [cnpj, setCnpj] = useState('');
  const [horarioDeTrabalho, setHorarioDeTrabalho] = useState('');

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
          }
        })
        .catch((error) => {
          setIsLoading(false);
          console.error('Erro durante a solicitação:', error);
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

  const renderItem = () => {
    return (
      <TouchableOpacity onPress={() => setModalVisible(true)}>
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
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      {isLoading ? (
        <Text>Carregando...</Text>
      ) : (
        <FlatList
          data={[1]} // Utilizei um array fictício apenas para permitir a renderização do FlatList
          keyExtractor={() => 'key'}
          renderItem={renderItem}
          contentContainerStyle={styles.cardContainer}
        />
      )}

      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <Text style={styles.modalTitle}>{nomeUsuario}</Text>
          <Text style={styles.modalText}>{`Endereço: ${endereco}`}</Text>
          <Text style={styles.modalText}>{`Telefone: ${telefone}`}</Text>
          <Text style={styles.modalText}>{`Horário de funcionamento:`}</Text>
          <View style={styles.horariosContainer}>
            {diasOrdenados.map((dia) => (
              <Text key={dia} style={styles.modalText}>{`${diasDaSemanaTraducao[dia]}: ${horarioDeTrabalho[dia]}`}</Text>
            ))}
          </View>
          <Button title="Fechar" onPress={() => setModalVisible(false)} />
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    padding: 16,
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
    marginBottom: 16,
  },
  nomeUsuario: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#333',
  },
  info: {
    fontSize: 16,
    marginBottom: 8,
  },
  horariosContainer: {
    marginLeft: 16,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
    color: 'white',
  },
  modalText: {
    fontSize: 16,
    marginBottom: 8,
    color: 'white',
  },
});

export default PaginaMenu;
