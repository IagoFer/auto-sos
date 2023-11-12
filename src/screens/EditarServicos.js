import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Modal,
  TextInput,
  Button,
  ScrollView,
} from 'react-native';
import { useUser } from '../context/UserContext';

const EditarServicos = ({ navigation }) => {
  const { userEmail } = useUser();
  const [servicos, setServicos] = useState([]);
  const [selectedService, setSelectedService] = useState(null);
  const [nomeServicoEditado, setNomeServicoEditado] = useState('');
  const [valorDistanciaEditado, setValorDistanciaEditado] = useState('');
  const [valorBaseEditado, setValorBaseEditado] = useState('');
  const [modalVisible, setModalVisible] = useState(false);
  const [mensagem, setMensagem] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const userData = {
      companyMail: userEmail,
    };
    if (userEmail) {
      fetch(
        `http://206.189.181.153:8080/sosAuto/sosServices/servicesByCompanyMail?` +
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
          setIsLoading(false);
          if (data.statusCode == '200') {
            setServicos(data.serviceResponseBodyList || []);
          } else {
            console.error('Erro ao carregar serviço:', data.message);
            setMensagem(
              'Erro ao carregar serviço. Por favor, tente novamente.'
            );
          }
        })
        .catch((error) => {
          setIsLoading(false);
          console.error('Erro durante a solicitação:', error);
          setMensagem(
            'Erro durante a solicitação ao servidor. Por favor, tente novamente.'
          );
        });
    }
  }, [userEmail]);

  const editarServico = async () => {
    setIsLoading(true);
    const userData = {
      companyMail: userEmail,
	  serviceName : nomeServicoEditado
    };
    try {
      const response = await fetch(
        `http://206.189.181.153:8080/sosAuto/sosServices/editService?` +
          new URLSearchParams(userData),
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            serviceName: nomeServicoEditado,
            distanceValue: valorDistanciaEditado,
            baseValue: valorBaseEditado,
          }),
        }
      );
      setIsLoading(false);
	  console.log(response);
      if (response.status == 204) {
        setModalVisible(false);
        setNomeServicoEditado('');
        setValorDistanciaEditado('');
        setValorBaseEditado('');
        alert('Alteração bem-sucedida! Faça o login novamente !');
      } else {
        setMensagem(
          response.message ||
            'Erro durante a atualização do serviço. Por favor, tente novamente.'
        );
      }
    } catch (error) {
      setIsLoading(false);
      console.error('Erro durante a solicitação:', error);
      setMensagem('Erro durante a solicitação ao servidor');
    }
  };

  return (
    <ScrollView style={styles.container}>
      {isLoading ? (
        <Text>Carregando...</Text>
      ) : mensagem ? (
        <View style={styles.container}>
          <Text style={styles.mensagemErro}>{mensagem}</Text>
        </View>
      ) : (
        <View style={styles.cardContainer}>
          {servicos.map((servico, index) => (
            <View key={index} style={styles.card}>
              <Text style={styles.nomeServico}>{servico.serviceName}</Text>
              <Text>{`Valor da distância por Km: ${servico.distanceValue}`}</Text>
              <Text>{`Valor base do serviço: ${servico.baseValue}`}</Text>
              <TouchableOpacity
                style={styles.botao}
                onPress={() => {
                  setModalVisible(true);
                  setSelectedService(servico);
                  setNomeServicoEditado(servico.serviceName);
                  setValorDistanciaEditado(servico.distanceValue.toString());
                  setValorBaseEditado(servico.baseValue.toString());
                }}>
                <Text style={styles.botaoTexto}>Editar serviço</Text>
              </TouchableOpacity>
            </View>
          ))}
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
            placeholder='Novo nome do serviço'
            value={nomeServicoEditado}
            onChangeText={(text) => setNomeServicoEditado(text)}
          />
          <TextInput
            style={styles.input}
            placeholder='Novo valor da distância por Km'
            value={valorDistanciaEditado}
            onChangeText={(text) => setValorDistanciaEditado(text)}
          />
          <TextInput
            style={styles.input}
            placeholder='Novo valor base do serviço'
            value={valorBaseEditado}
            onChangeText={(text) => setValorBaseEditado(text)}
          />
          {mensagem ? (
            <Text style={styles.mensagemErro}>{mensagem}</Text>
          ) : null}
          <Button title='Salvar Alterações' onPress={editarServico} />
          <Button title='Cancelar' onPress={() => setModalVisible(false)} />
        </View>
      </Modal>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    paddingTop: 24,
    paddingHorizontal: 16,
  },
  cardContainer: {
    flexDirection: 'column',
    alignItems: 'stretch',
    justifyContent: 'flex-start',
  },
  card: {
    backgroundColor: 'white',
    borderRadius: 8,
    elevation: 4,
    padding: 16,
    marginBottom: 12,
  },
  nomeServico: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  botao: {
    backgroundColor: '#4CAF50',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 4,
    alignItems: 'center',
    marginTop: 10,
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

export default EditarServicos;
