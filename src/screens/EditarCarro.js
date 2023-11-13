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

const EditarCarro = ({ navigation }) => {
  const { userEmail } = useUser();
  const [veiculos, setVeiculos] = useState([]);
  const [selectedVehicle, setSelectedVehicle] = useState(null);
  const [marcaEditado, setMarcaEditado] = useState("");
  const [placaAntiga, setPlacaAntiga] = useState('');
  const [modeloEditada, setModeloEditada] = useState("");
  const [placaEditada, setPlacaEditada] = useState('');
  const [anoVeiculoEditado, setAnoVeiculoEditado] = useState('');
  const [modalVisible, setModalVisible] = useState(false);
  const [mensagem, setMensagem] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const userData = {
      email: userEmail,
    };

    if (userEmail) {
      fetch(
        `http://206.189.181.153:8080/sosAuto/vehicle/vehiclesByPeople?` +
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
          if (data.statusCode == "200") {
            setVeiculos(data.vehicleResponseBodyList || []);
          } else {
            console.error("Erro ao carregar veículos:", data.message);
            setMensagem(
              "Erro ao carregar veículos. Por favor, tente novamente."
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

  const editarCarro = async () => {
    setIsLoading(true)

    const vehiclePatchData = {
        email: userEmail,
        licensePlate: placaAntiga,
    }

    try {
        const response = await fetch(
            `http://206.189.181.153:8080/sosAuto/vehicle?` +
                new URLSearchParams(vehiclePatchData),
            {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    brand: marcaEditado,
                    licensePlate: placaEditada,
                    model: modeloEditada,
                    year: anoVeiculoEditado
                }),
            }
        )
        setIsLoading(false)
        if (response.status == 204) {
            setModalVisible(false)
            setMarcaEditado('')
            setPlacaEditada('')
            setModeloEditada('')
            setAnoVeiculoEditado('')
            alert('Alteração bem-sucedida! Faça o login novamente !')
        } else {
            setMensagem(
                response.message ||
                    'Erro durante a atualização do perfil. Por favor, tente novamente.'
            )
        }
    } catch (error) {
        setIsLoading(false)
        console.error('Erro durante a solicitação:', error)
        setMensagem('Erro durante a solicitação ao servidor')
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
          {veiculos.map((veiculo, index) => (
            <View key={index} style={styles.card}>
              <Text style={styles.nomeVeiculo}>{veiculo.model}</Text>
              <Text>{`Placa do veículo: ${veiculo.licensePlate}`}</Text>
              <Text>{`Modelo do veículo: ${veiculo.brand}`}</Text>
              <Text>{`Ano do veículo: ${veiculo.year}`}</Text>
              <TouchableOpacity
                style={styles.botao}
                onPress={() => {
                  setModalVisible(true);
                  setSelectedVehicle(veiculo);
                  setMarcaEditado(veiculo.brand);
                  setPlacaAntiga(veiculo.licensePlate.toString());
                  setPlacaEditada(veiculo.licensePlate.toString());
                  setModeloEditada(veiculo.model.toString());
                  setAnoVeiculoEditado(veiculo.year.toString());
                }}
              >
                <Text style={styles.botaoTexto}>Editar veículo</Text>
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
          <TextInput
            style={styles.input}
            placeholder="Nova marca do veículo"
            value={marcaEditado}
            onChangeText={(text) => setMarcaEditado(text)}
          />
          <TextInput
            style={styles.input}
            placeholder="Nova placa do veículo"
            value={placaEditada}
            onChangeText={(text) => setPlacaEditada(text)}
          />
          <TextInput
            style={styles.input}
            placeholder="Novo modelo do veículo"
            value={modeloEditada}
            onChangeText={(text) => setModeloEditada(text)}
          />
          <TextInput
            style={styles.input}
            placeholder="Novo ano do veículo"
            value={anoVeiculoEditado}
            onChangeText={(text) => setAnoVeiculoEditado(text)}
          />
          {mensagem ? (
            <Text style={styles.mensagemErro}>{mensagem}</Text>
          ) : null}
          <Button title="Salvar Alterações" onPress={editarCarro} />
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
  nomeVeiculo: {
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

export default EditarCarro;
