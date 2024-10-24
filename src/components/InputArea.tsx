
import { useState } from 'react';
import { Item } from '../types/Item';
import { categories } from '../data/categories';
import styled from 'styled-components';
import { newDateAdjusted } from '../helpers/dateFilter';
import { db } from '../firebaseConfig'; // Importa o Realtime Database
import { ref, push } from 'firebase/database'; // Funções para salvar no Realtime Database

type Props = {
  onAdd: (item: Item) => void; 
};

export const InputArea = ({ onAdd }: Props) => {
  const [dateField, setDateField] = useState('');
  const [categoryField, setCategoryField] = useState('');
  const [titleField, setTitleField] = useState('');
  const [valueField, setValueField] = useState(0);

  let categoryKeys: string[] = Object.keys(categories);
  
  // Função para salvar no Realtime Database
  const saveToRealtimeDatabase = async (item: Item) => {
    try {
      // Referência para onde os dados serão armazenados
      const itemRef = ref(db, 'financialData');
      
      // Formata a data no padrão brasileiro
      const formattedDate = new Date(item.date).toLocaleDateString('pt-BR');

      // Cria um novo objeto com a data como string
      const itemWithDate = {
        ...item,
        date: formattedDate, // Formata a data para o padrão 'dd/MM/yyyy'
      };
      
      // Push para adicionar um novo item
      await push(itemRef, itemWithDate);
      console.log("Lançamento salvo no Realtime Database");
    } catch (error) {
      console.error("Erro ao salvar no Realtime Database: ", error);
    }
  };

  const handleAddEvent = () => {
    let errors: string[] = [];
    
    if(isNaN(new Date(dateField).getTime())) {
      errors.push('Data inválida!');
    }
    if(!categoryKeys.includes(categoryField)) {
      errors.push('Categoria inválida!');
    }
    if(titleField === '') {
      errors.push('Título vazio!');
    }
    if(valueField <= 0) {
      errors.push('Valor inválido!');
    }
    
    if(errors.length > 0) {
      alert(errors.join("\n"));
    } else {
      const newItem: Item = {
        date: new Date(dateField), // Armazena como objeto Date
        category: categoryField,
        title: titleField,
        value: valueField
      };

      onAdd(newItem); // Atualiza a UI local
      saveToRealtimeDatabase(newItem); // Salva no Realtime Database
      clearFields();
    }
  };

  const clearFields = () => {
    setDateField('');
    setCategoryField('');
    setTitleField('');
    setValueField(0);
  }
  
  return (
    <Container>
      <InputLabel>
        <InputTitle>Data</InputTitle>
        <Input type='date' value={dateField} onChange={e => setDateField(e.target.value)} />
      </InputLabel>
      <InputLabel>
        <InputTitle>Categoria</InputTitle>
        <Select value={categoryField} onChange={e => setCategoryField(e.target.value)}>
          <>
            <option></option>
            {categoryKeys.map((key, index) => (
              <option key={index} value={key}>{categories[key].title}</option>
            ))}
          </>
        </Select>
      </InputLabel>
      <InputLabel>
        <InputTitle>Título</InputTitle>
        <Input type='text' value={titleField} onChange={e => setTitleField(e.target.value)} />
      </InputLabel>
      <InputLabel>
        <InputTitle>Valor</InputTitle>
        <Input type='number' value={valueField} onChange={e => setValueField(parseFloat(e.target.value))} />
      </InputLabel>
      <InputLabel>
        <InputTitle>&nbsp;</InputTitle>
        <Button onClick={handleAddEvent}>Adicionar</Button>
      </InputLabel>
    </Container> 
  );
}

// Estilização dos componentes
const Container = styled.div`
  background-color: #FFF;
  box-shadow: 0px 0px 5px #CCC;
  border-radius: 10px;
  padding: 20px;
  margin-top: 20px;
  display: flex;
  align-items: center;
`;

const InputLabel = styled.label`
    flex: 1;
    margin: 10px;
`;

const InputTitle = styled.div`
    font-weight: bold;
    margin-bottom: 5px;
`;

const Input = styled.input`
    width: 100%;
    height: 30px;
    padding: 0 5px;
    border: 1px solid lightblue;
    border-radius: 5px;
`;

const Select = styled.select`
    width: 100%;
    height: 30px;
    padding: 0 5px;
    border: 1px solid lightblue;
    border-radius: 5px;
`;

const Button = styled.button`
    width: 100%;
    height: 30px;
    padding: 0 5px;
    border: 1px solid lightblue;
    border-radius: 5px;
    background-color: lightblue;
    color: black;
    cursor: pointer;
    &:hover {
        background-color: blue;
        color: white;
    }
`;

