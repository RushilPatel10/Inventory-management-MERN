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
import SupplierList from '../components/supplier/SupplierList';
import SupplierForm from '../components/supplier/SupplierForm';
import { supplierApi } from '../services/api';
import LoadingSpinner from '../components/shared/LoadingSpinner';

function Suppliers() {
  const [suppliers, setSuppliers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [openForm, setOpenForm] = useState(false);
  const [selectedSupplier, setSelectedSupplier] = useState(null);

  useEffect(() => {
    loadSuppliers();
  }, []);

  const loadSuppliers = async () => {
    try {
      const response = await supplierApi.getAll();
      setSuppliers(response.data);
    } catch (error) {
      toast.error('Error loading suppliers');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (formData) => {
    try {
      if (selectedSupplier) {
        await supplierApi.update(selectedSupplier._id, formData);
        toast.success('Supplier updated successfully');
      } else {
        await supplierApi.create(formData);
        toast.success('Supplier added successfully');
      }
      loadSuppliers();
      setOpenForm(false);
      setSelectedSupplier(null);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Error saving supplier');
    }
  };

  const handleEdit = (supplier) => {
    setSelectedSupplier(supplier);
    setOpenForm(true);
  };

  const handleDelete = async (id) => {
    try {
      await supplierApi.delete(id);
      toast.success('Supplier deleted successfully');
      loadSuppliers();
    } catch (error) {
      toast.error('Error deleting supplier');
    }
  };

  if (loading) return <LoadingSpinner />;

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Paper sx={{ p: 3 }}>
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
          <Typography variant="h5" component="h1">
            Supplier Management
          </Typography>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => setOpenForm(true)}
          >
            Add Supplier
          </Button>
        </Box>

        <SupplierList
          suppliers={suppliers}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />

        <SupplierForm
          open={openForm}
          onClose={() => {
            setOpenForm(false);
            setSelectedSupplier(null);
          }}
          onSubmit={handleSubmit}
          initialData={selectedSupplier}
        />
      </Paper>
    </Container>
  );
}

export default Suppliers; 