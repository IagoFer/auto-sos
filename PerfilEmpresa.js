import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList } from 'react-native';

const PerfilEmpresa = () => {
  const [empresas, setEmpresas] = useState([
    { id: '1', nome: 'Mecânico', localizacao: 'R$100,00', horario: '9:00 - 18:00' },
    { id: '2', nome: 'Guincho', localizacao: 'R$150,00', horario: '10:00 - 19:00' },
    // Adicione mais empresas conforme necessário
  ]);

  const renderCard = ({ item }) => {
    return (
      <TouchableOpacity style={styles.card} onPress={() => entrarNoPerfil(item)}>
        <Text style={styles.nomeEmpresa}>{item.nome}</Text>
        <Text style={styles.info}>{`Preço: ${item.localizacao}`}</Text>
        <Text style={styles.info}>{`Horário de Trabalho: ${item.horario}`}</Text>
        <TouchableOpacity style={styles.botao} onPress={() => entrarNoPerfil(item)}>
          <Text style={styles.botaoTexto}>Contratar serviço</Text>
        </TouchableOpacity>
      </TouchableOpacity>
    );
  };

  const entrarNoPerfil = (empresa) => {
    // Implemente a lógica para entrar no perfil da empresa aqui
    console.log('Entrar no perfil da empresa:', empresa.nome);
  };

  return (
    <View style={styles.container}>
      {empresas.length > 0 ? (
        <FlatList
          data={empresas}
          renderItem={renderCard}
          keyExtractor={(item) => item.id}
        />
      ) : (
        <Text style={styles.semEmpresas}>Nenhuma empresa encontrada.</Text>
      )}
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
  nomeEmpresa: {
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
  semEmpresas: {
    fontSize: 18,
    textAlign: 'center',
    marginTop: 50,
  },
});

export default PerfilEmpresa;