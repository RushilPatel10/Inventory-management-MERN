import { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  MenuItem,
  FormControl,
  InputLabel,
  Select,
} from '@mui/material';

function InventoryForm({ open, onClose, onSubmit, initialData, suppliers }) {
  const [formData, setFormData] = useState({
    name: '',
    quantity: '',
    category: '',
    lowStockThreshold: '',
    supplier: '',
  });

  useEffect(() => {
    if (initialData) {
      setFormData({
        ...initialData,
        supplier: initialData.supplier?._id || '',
      });
    }
  }, [initialData]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>{initialData ? 'Edit Item' : 'Add New Item'}</DialogTitle>
      <form onSubmit={handleSubmit}>
        <DialogContent>
          <TextField
            name="name"
            label="Item Name"
            fullWidth
            margin="normal"
            value={formData.name}
            onChange={handleChange}
            required
          />
          <TextField
            name="quantity"
            label="Quantity"
            type="number"
            fullWidth
            margin="normal"
            value={formData.quantity}
            onChange={handleChange}
            required
          />
          <TextField
            name="category"
            label="Category"
            fullWidth
            margin="normal"
            value={formData.category}
            onChange={handleChange}
            required
          />
          <TextField
            name="lowStockThreshold"
            label="Low Stock Threshold"
            type="number"
            fullWidth
            margin="normal"
            value={formData.lowStockThreshold}
            onChange={handleChange}
            required
          />
          <FormControl fullWidth margin="normal">
            <InputLabel>Supplier</InputLabel>
            <Select
              name="supplier"
              value={formData.supplier}
              onChange={handleChange}
              required
            >
              {suppliers.map((supplier) => (
                <MenuItem key={supplier._id} value={supplier._id}>
                  {supplier.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose}>Cancel</Button>
          <Button type="submit" variant="contained" color="primary">
            {initialData ? 'Update' : 'Add'}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
}

export default InventoryForm; 