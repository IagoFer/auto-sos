import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Modal,
  TextInput,
  Button,
  ScrollView,
} from "react-native";
import { useUser } from "../context/UserContext";
import * as Location from 'expo-location';

const ServicosPorEmpresa = ({ navigation, route }) => {
  const { userEmail } = useUser();
  const { companyMail } = route.params;
  const [servicos, setServicos] = useState([]);
  const [selectedService, setSelectedService] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);
  const [mensagem, setMensagem] = useState("");

  useEffect(() => {
    const userData = {
        companyMail: companyMail,
      };

    fetch(
      `http://206.189.181.153:8080/sosAuto/sosServices/servicesByCompanyMail?`, +
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
        console.log(data)
        if (data.statusCode == "200") {
          setServicos(data.companyResponse || []);
        } else {
          console.error("Erro ao carregar empresas:", data.message);
          setMensagem(
            "Erro ao carregar empresas. Por favor, tente novamente."
          );
        }
      })
      .catch((error) => {
        setIsLoading(false);
        console.error('Erro durante a solicitação:', error);
      });

  }, [userEmail]);

  const contratarServico = async () => {
    try {
      // Lógica para contratar o serviço aqui
      // Substitua este comentário pela lógica específica de contratação

      setModalVisible(false);
      alert('Serviço contratado com sucesso!');
    } catch (error) {
      console.error('Erro durante a contratação do serviço:', error);
      setMensagem('Erro durante a contratação do serviço. Por favor, tente novamente.');
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
              <Text style={styles.nomeServico}>{servico.name}</Text>
              <Text>{`Descrição: ${servico.description}`}</Text>
              <Text>{`Preço: ${servico.price}`}</Text>
              <TouchableOpacity
                style={styles.botao}
                onPress={() => {
                  setModalVisible(true);
                  setSelectedService(servico);
                }}
              >
                <Text style={styles.botaoTexto}>Contratar Serviço</Text>
              </TouchableOpacity>
            </View>
          ))}
        </View>
      )}

      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          {selectedService && (
            <>
              <Text style={styles.nomeServico}>{selectedService.name}</Text>
              <Text>{`Descrição: ${selectedService.description}`}</Text>
              <Text>{`Preço: ${selectedService.price}`}</Text>
            </>
          )}
          {mensagem ? (
            <Text style={styles.mensagemErro}>{mensagem}</Text>
          ) : null}
          <Button title="Contratar Serviço" onPress={contratarServico} />
          <Button title="Cancelar" onPress={() => setModalVisible(false)} />
        </View>
      </Modal>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
    paddingTop: 24,
    paddingHorizontal: 16,
  },
  cardContainer: {
    flexDirection: "column",
    alignItems: "stretch",
    justifyContent: "flex-start",
  },
  card: {
    backgroundColor: "white",
    borderRadius: 8,
    elevation: 4,
    padding: 16,
    marginBottom: 12,
  },
  nomeServico: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 8,
  },
  botao: {
    backgroundColor: "#4CAF50",
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 4,
    alignItems: "center",
    marginTop: 10,
  },
  botaoTexto: {
    color: "white",
    fontWeight: "bold",
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  mensagemErro: {
    color: "red",
    marginTop: 10,
  },
});

export default ServicosPorEmpresa;
