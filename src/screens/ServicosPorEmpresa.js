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
    Alert,
} from "react-native";
import { useUser } from "../context/UserContext";
import * as Location from "expo-location";

const ServicosPorEmpresa = ({ navigation, route }) => {
    const { userEmail } = useUser();
    const { companyMail } = route.params;
    const [servicos, setServicos] = useState([]);
    const [selectedService, setSelectedService] = useState(null);
    const [nomeServicoAntigo, setNomeServicoAntigo] = useState("");
    const [isLoading, setIsLoading] = useState(true);
    const [modalVisible, setModalVisible] = useState(false);
    const [mensagem, setMensagem] = useState("");

    useEffect(() => {
        const userData = {
            companyMail: companyMail,
        };

        fetch(
            `http://206.189.181.153:8080/sosAuto/sosServices/servicesByCompanyMail?` +
            new URLSearchParams(userData),
            {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
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
                    setServicos(data.serviceResponseBodyList || []);
                } else {
                    console.error("Erro ao carregar empresas:", data.message);
                    setMensagem("Erro ao carregar empresas. Por favor, tente novamente.");
                }
            })
            .catch((error) => {
                setIsLoading(false);
                console.error("Erro durante a solicitação:", error);
            });
    }, [userEmail]);

    const contratarServico = async () => {
        let { status } = await Location.requestForegroundPermissionsAsync()
        if (status !== 'granted') {
            setErrorMsg('Permission to access location was denied')
            return
        }

        let location = await Location.getCurrentPositionAsync({})

        const { coords } = location;

        try {
            const userData = {
                companyMail: companyMail,
                peopleMail: userEmail
            };
    
            const serviceHired = {
                baseValue: "1",
                distanceValue: "1",
                serviceName: nomeServicoAntigo
            }

            const bodyData = {
                peopleLatitude: coords.latitude,
                peopleLongitude: coords.longitude,
                serviceHired: serviceHired
            };
            
            console.log( "log aqui" + bodyData)
            console.log( bodyData)
            fetch(
                `http://206.189.181.153:8080/sosAuto/sosServices/hireService?` +
                new URLSearchParams(userData),
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify(bodyData)
                }
            )
                .then((response) => {
                    if (!response.ok) {
                        throw new Error(`HTTP error! status: ${response.status}`);
                    }
                })
                .catch((error) => {
                    setIsLoading(false);
                    console.error("Erro durante a solicitação:", error);
                });
        } catch (error) {
            console.error("Erro durante a contratação do serviço:", error);
            setMensagem(
                "Erro durante a contratação do serviço. Por favor, tente novamente."
            );
        }
    }

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
                        <Text>{`Valor base: R$ ${servico.baseValue}`}</Text>
                        <Text>{`Valor por distância: R$ ${servico.distanceValue}`}</Text>
                        <TouchableOpacity
                            style={styles.botao}
                            onPress={() => {
                                setNomeServicoAntigo(servico.serviceName);
                                setSelectedService(servico);
                                contratarServico(servico.serviceName);
                            }}
                        >
                            <Text style={styles.botaoTexto}>Contratar Serviço</Text>
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
    mensagemErro: {
        color: "red",
        marginTop: 10,
    },
});

export default ServicosPorEmpresa;
