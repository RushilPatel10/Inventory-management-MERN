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
import ConfirmDialog from '../shared/ConfirmDialog';

function InventoryList({ onEdit, onDelete }) {
  const [items, setItems] = useState([]);
  const [deleteDialog, setDeleteDialog] = useState({
    open: false,
    itemId: null
  });

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

  const handleDeleteClick = (itemId) => {
    setDeleteDialog({
      open: true,
      itemId
    });
  };

  const handleDeleteConfirm = () => {
    if (deleteDialog.itemId) {
      onDelete(deleteDialog.itemId);
    }
    setDeleteDialog({ open: false, itemId: null });
  };

  return (
    <>
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
                  <IconButton onClick={() => handleDeleteClick(item._id)}>
                    <Delete />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <ConfirmDialog
        open={deleteDialog.open}
        onClose={() => setDeleteDialog({ open: false, itemId: null })}
        onConfirm={handleDeleteConfirm}
        title="Delete Item"
        message="Are you sure you want to delete this item? This action cannot be undone."
      />
    </>
  );
}

export default InventoryList; 