import { useState, useEffect } from 'react';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableContainer, 
  TableHead, 
  TableRow, 
  Paper,
  IconButton 
} from '@mui/material';
import { Edit, Delete } from '@mui/icons-material';
import { inventoryApi } from '../../services/api';
import StockIndicator from './StockIndicator';

function InventoryList({ onEdit }) {
  const [items, setItems] = useState([]);

  useEffect(() => {
    loadInventory();
  }, []);

  const loadInventory = async () => {
    try {
      const response = await inventoryApi.getAll();
      setItems(response.data);
    } catch (error) {
      console.error('Error loading inventory:', error);
    }
  };

  const handleDelete = async (id) => {
    try {
      await inventoryApi.delete(id);
      loadInventory();
    } catch (error) {
      console.error('Error deleting item:', error);
    }
  };

  return (
    <TableContainer component={Paper}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Item Name</TableCell>
            <TableCell>Quantity</TableCell>
            <TableCell>Category</TableCell>
            <TableCell>Supplier</TableCell>
            <TableCell>Stock Level</TableCell>
            <TableCell>Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {items.map((item) => (
            <TableRow key={item._id}>
              <TableCell>{item.name}</TableCell>
              <TableCell>{item.quantity}</TableCell>
              <TableCell>{item.category}</TableCell>
              <TableCell>{item.supplier?.name}</TableCell>
              <TableCell>
                <StockIndicator quantity={item.quantity} threshold={item.lowStockThreshold} />
              </TableCell>
              <TableCell>
                <IconButton onClick={() => onEdit(item)}>
                  <Edit />
                </IconButton>
                <IconButton onClick={() => handleDelete(item._id)}>
                  <Delete />
                </IconButton>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}

export default InventoryList; 