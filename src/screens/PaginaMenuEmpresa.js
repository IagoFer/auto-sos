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

const PaginaMenuEmpresa = ({ navigation }) => {
  const { userEmail } = useUser();
  const [servicos, setServicos] = useState([]);
  const [selectedService, setSelectedService] = useState(null);
  const [nomeServicoAntigo, setNomeServicoAntigo] = useState("");
  const [nomeServicoEditado, setNomeServicoEditado] = useState("");
  const [valorDistanciaEditado, setValorDistanciaEditado] = useState("");
  const [valorBaseEditado, setValorBaseEditado] = useState("");
  const [modalVisible, setModalVisible] = useState(false);
  const [mensagem, setMensagem] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const userData = {
      companyMail: userEmail,
    };

    if (userEmail) {
      fetch(
        `http://206.189.181.153:8080/sosAuto/sosServices/hiredService?` +
          new URLSearchParams(userData),
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      )
        .then((response) => response.json())
        .then((data) => {
          setIsLoading(false);
          console.log(userData)
          console.log(data);
          if (data.statusCode === "200") {
            setServicos(data.serviceResponseBodyList || []);
          } else {
            console.error("Erro ao carregar serviço:", data.message);
            setMensagem(
              "Erro ao carregar serviço. Por favor, tente novamente."
            );
          }
        })
        .catch((error) => {
          setIsLoading(false);
          console.error("Erro durante a solicitação:", error);
          setMensagem(
            "Erro durante a solicitação ao servidor. Por favor, tente novamente."
          );
        });
    }
  }, [userEmail]);

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
              >
                <Text style={styles.botaoTexto}>Aceitar serviço</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.botao, { backgroundColor: 'red' }]}
              >
                <Text style={styles.botaoTexto}>Recusar serviço</Text>
              </TouchableOpacity>
            </View>
          ))}
        </View>
      )}
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
  input: {
    width: "80%",
    height: 50,
    fontSize: 18,
    marginVertical: 10,
    padding: 10,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    backgroundColor: "white",
  },
  mensagemErro: {
    color: "red",
    marginTop: 10,
  },
});

export default PaginaMenuEmpresa;
