import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList, Modal, Button, ScrollView, } from 'react-native';
import { useUser } from '../context/UserContext';
import { useNavigation } from '@react-navigation/native'

const PaginaMenu = () => {
  const { userEmail, userPassword } = useUser();
  const [isLoading, setIsLoading] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);
  const [empresas, setEmpresas] = useState([]);
  const [selectedEmpresa, setSelectedEmpresa] = useState(null);
  const [nomeUsuario, setNomeUsuario] = useState('');
  const [telefone, setTelefone] = useState('');
  const [endereco, setEndereco] = useState('');
  const [cnpj, setCnpj] = useState('');
  const [horarioDeTrabalho, setHorarioDeTrabalho] = useState('');
  const [mensagem, setMensagem] = useState("");
  const navigation = useNavigation();

  useEffect(() => {
    fetch(
      `http://206.189.181.153:8080/sosAuto/companies/allCompanies?`, {
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
        if (data.statusCode == "200") {
          setEmpresas(data.companyResponse || []);
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

  const renderItem = ({ item }) => {
    return (
      <TouchableOpacity onPress={() => setModalVisible(true)}>
        <View style={styles.card}>
          <Text style={styles.nomeVeiculo}>{item.name}</Text>
          <Text>{`Endereço: ${item.address}`}</Text>
          <Text>{`Telefone para contato: ${item.contactNumber}`}</Text>
          <Text>{`Email: ${item.email}`}</Text>
          <Text>{`Horário de funcionamento:`}</Text>
          <View style={styles.horariosContainer}>
            {horarioDeTrabalhoFunction(item.cnpj).map((horario, index) => (
              <Text key={index} style={styles.modalText}>{horario}</Text>
            ))}
          </View>
          <TouchableOpacity
            style={styles.botao}
            onPress={() => {
              setSelectedEmpresa(item);
              // Adicione aqui a lógica para navegar para a tela de visualizar serviços
            }}
          >
            <Text style={styles.botaoTexto}>Visualizar serviços</Text>
          </TouchableOpacity>
        </View>
      </TouchableOpacity>
    );
  };


  const horarioDeTrabalhoFunction = (cnpj) => {
    const empresaSelecionada = empresas.find((empresa) => empresa.cnpj === cnpj);

    if (empresaSelecionada) {
      return diasOrdenados.map((dia) => ({
        dia: diasDaSemanaTraducao[dia],
        horario: empresaSelecionada.workHour[dia],
      }));
    }

    return [];
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
          {empresas.map((empresa, index) => (
            <View key={index} style={styles.card}>
              <Text style={styles.nomeVeiculo}>{empresa.name}</Text>
              <Text>{`Endereço: ${empresa.address}`}</Text>
              <Text>{`Telefone para contato: ${empresa.contactNumber}`}</Text>
              <Text>{`Email: ${empresa.email}`}</Text>
              <Text>{`Horário de funcionamento: `}</Text>
              <View style={styles.horariosContainer}>
                {horarioDeTrabalhoFunction(empresa.cnpj).map((item) => (
                  <Text key={item.dia} style={styles.modalText}>{`${item.dia}: ${item.horario}`}</Text>
                ))}
              </View>

              <TouchableOpacity
                style={styles.botao}
                onPress={() => navigation.navigate('Serviços da Empresa', { companyMail: empresa.email })} >
                <Text style={styles.botaoTexto}>Visualizar serviços</Text>
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
  nomeVeiculo: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 8,
  },
  horariosContainer: {
    marginLeft: 16,
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

export default PaginaMenu;
