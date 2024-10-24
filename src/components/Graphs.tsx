import React, { useState } from 'react';
import { PieChart, Pie, Cell, Tooltip, Legend } from 'recharts';
import { Item } from '../types/Item';
import { categories } from '../data/categories';
import styled from 'styled-components';

type Props = {
  items: Item[];
};

const Graphs = ({ items }: Props) => {
  const [selectedItem, setSelectedItem] = useState<string | null>(null);

  const incomeData = Object.entries(categories)
    .filter(([_, category]) => !category.expense)
    .map(([key, category]) => {
      const totalValue = items
        .filter(item => item.category === key)
        .reduce((acc, item) => acc + item.value, 0);
      return { name: category.title, value: totalValue, color: category.color };
    })
    .filter(item => item.value > 0);

  const expenseData = Object.entries(categories)
    .filter(([_, category]) => category.expense)
    .map(([key, category]) => {
      const totalValue = items
        .filter(item => item.category === key)
        .reduce((acc, item) => acc + item.value, 0);
      return { name: category.title, value: totalValue, color: category.color };
    })
    .filter(item => item.value > 0);

  const handleClick = (entry: { name: string }) => {
    setSelectedItem(entry.name);
  };

  const handleClickOutside = () => {
    setSelectedItem(null); // Reseta a seleção ao clicar fora
  };

  const filteredItems = selectedItem 
    ? items.filter(item => categories[item.category]?.title === selectedItem) 
    : items; // Mostra todos os itens quando nenhum está selecionado

  return (
    <Container onClick={handleClickOutside}>
      <h2>Gráficos de Gastos e Entradas</h2>
      
      <GraphsContainer>
        <GraphSection>
          <h3>Entradas</h3>
          <PieChart width={400} height={400}>
            <Pie
              data={incomeData}
              cx="50%"
              cy="50%"
              labelLine={false}
              label={entry => `${entry.name} (${entry.value})`}
              outerRadius={100}  // Ajuste do tamanho
              fill="#8884d8"
              dataKey="value"
              onClick={handleClick}
            >
              {incomeData.map((entry, index) => (
                <Cell key={`cell-income-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip />
            <Legend />
          </PieChart>
        </GraphSection>

        <GraphSection>
          <h3>Saídas</h3>
          <PieChart width={400} height={400}>
            <Pie
              data={expenseData}
              cx="50%"
              cy="50%"
              labelLine={false}
              label={entry => `${entry.name} (${entry.value})`}
              outerRadius={100}  // Ajuste do tamanho
              fill="#8884d8"
              dataKey="value"
              onClick={handleClick}
            >
              {expenseData.map((entry, index) => (
                <Cell key={`cell-expense-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip />
            <Legend />
          </PieChart>
        </GraphSection>
      </GraphsContainer>

      {filteredItems.length > 0 && (
        <TableContainer>
          <h4>Valores {selectedItem ? `para: ${selectedItem}` : 'de todos os itens'}</h4>
          <StyledTable>
            <thead>
              <tr>
                <th>Título</th>
                <th>Valor</th>
                <th>Data</th>
              </tr>
            </thead>
            <tbody>
              {filteredItems.map((item, index) => (
                <tr key={index}>
                  <td>{item.title}</td>
                  <td>R$ {item.value}</td>
                  <td>{item.date.toLocaleDateString('pt-BR')}</td>
                </tr>
              ))}
            </tbody>
          </StyledTable>
        </TableContainer>
      )}
    </Container>
  );
};

// Estilização
const Container = styled.div`
  margin: 20px;
  text-align: center;  // Centraliza os gráficos
`;

const GraphsContainer = styled.div`
  display: flex;
  justify-content: center;  // Centraliza os gráficos no desktop
  flex-direction: column;   // No mobile, empilha os gráficos
  @media(min-width: 768px) {
    flex-direction: row;  // No desktop, exibe os gráficos lado a lado
  }
`;

const GraphSection = styled.div`
  width: 100%;
  max-width: 400px;  // Limita o tamanho máximo do gráfico
  margin: 20px auto;  // Centraliza os gráficos
  text-align: center;
`;

const TableContainer = styled.div`
  margin-top: 20px;
`;

const StyledTable = styled.table`
  width: 100%;
  border-collapse: collapse;

  th, td {
    border: 1px solid #ddd;
    padding: 8px;
    text-align: left;
  }

  th {
    background-color: #f2f2f2;
  }

  tr:nth-child(even) {
    background-color: #f9f9f9;
  }

  tr:hover {
    background-color: #f1f1f1;
  }
`;

export default Graphs;