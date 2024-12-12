import { useState, useEffect } from 'react';
import {
  Box,
  Button,
  Typography,
  Container,
  Paper,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import { toast } from 'react-toastify';
import InventoryList from '../components/inventory/InventoryList';
import InventoryForm from '../components/inventory/InventoryForm';
import { inventoryApi, supplierApi } from '../services/api';
import LoadingSpinner from '../components/shared/LoadingSpinner';
import CsvOperations from '../components/inventory/CsvOperations';

function Inventory() {
  const [items, setItems] = useState([]);
  const [suppliers, setSuppliers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [openForm, setOpenForm] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [inventoryRes, suppliersRes] = await Promise.all([
        inventoryApi.getAll(),
        supplierApi.getAll()
      ]);
      setItems(inventoryRes.data);
      setSuppliers(suppliersRes.data);
    } catch (error) {
      toast.error('Error loading data');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (formData) => {
    try {
      if (selectedItem) {
        await inventoryApi.update(selectedItem._id, formData);
        toast.success('Item updated successfully');
      } else {
        await inventoryApi.create(formData);
        toast.success('Item added successfully');
      }
      loadData();
      setOpenForm(false);
      setSelectedItem(null);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Error saving item');
    }
  };

  const handleEdit = (item) => {
    setSelectedItem(item);
    setOpenForm(true);
  };

  const handleDelete = async (id) => {
    try {
      await inventoryApi.delete(id);
      toast.success('Item deleted successfully');
      loadData();
    } catch (error) {
      toast.error('Error deleting item');
    }
  };

  if (loading) return <LoadingSpinner />;

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Paper sx={{ p: 3 }}>
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
          <Typography variant="h5" component="h1">
            Inventory Management
          </Typography>
          <Box display="flex" gap={2}>
            <CsvOperations onImportSuccess={loadData} />
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={() => setOpenForm(true)}
            >
              Add Item
            </Button>
          </Box>
        </Box>

        <InventoryList
          items={items}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />

        <InventoryForm
          open={openForm}
          onClose={() => {
            setOpenForm(false);
            setSelectedItem(null);
          }}
          onSubmit={handleSubmit}
          initialData={selectedItem}
          suppliers={suppliers}
        />
      </Paper>
    </Container>
  );
}

export default Inventory; 