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

  const filteredItems = selectedItem
    ? items.filter(item => categories[item.category]?.title === selectedItem)
    : items;

  return (
    <Container>
      <h2>Gráficos de Gastos e Entradas</h2>
      
      <GraphsContainer>
        <GraphSection>
          <h3>Entradas</h3>
          <PieChart width={300} height={300}>
            <Pie
              data={incomeData}
              cx="50%"
              cy="50%"
              labelLine={false}
              label={entry => `${entry.name} (${entry.value})`}
              outerRadius={80}
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
          <PieChart width={300} height={300}>
            <Pie
              data={expenseData}
              cx="50%"
              cy="50%"
              labelLine={false}
              label={entry => `${entry.name} (${entry.value})`}
              outerRadius={80}
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

      <TableContainer>
        <h4>Tabela de Entradas e Saídas</h4>
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
    </Container>
  );
};

// Estilização
const Container = styled.div`
  margin: 20px;
`;

const GraphsContainer = styled.div`
  display: flex;
  justify-content: space-around;
  flex-wrap: wrap;
  @media (max-width: 768px) {
    flex-direction: column;
    align-items: center;
  }
`;

const GraphSection = styled.div`
  width: 100%;
  max-width: 400px;
  margin-bottom: 20px;
  text-align: center;
`;

const TableContainer = styled.div`
  margin-top: 20px;
  width: 100%;
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