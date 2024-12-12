import { Box, Button } from '@mui/material';
import { Upload, Download } from '@mui/icons-material';
import { toast } from 'react-toastify';
import { inventoryApi } from '../../services/api';

function CsvOperations({ onImportSuccess }) {
  const handleExport = async () => {
    try {
      const response = await inventoryApi.exportCsv();
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'inventory.csv');
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (error) {
      toast.error('Error exporting data');
    }
  };

  const handleImport = async (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      await inventoryApi.importCsv(file);
      toast.success('Data imported successfully');
      if (onImportSuccess) onImportSuccess();
    } catch (error) {
      toast.error('Error importing data');
    }
    event.target.value = '';
  };

  return (
    <Box sx={{ display: 'flex', gap: 2 }}>
      <Button
        variant="outlined"
        startIcon={<Download />}
        onClick={handleExport}
      >
        Export CSV
      </Button>
      <Button
        variant="outlined"
        component="label"
        startIcon={<Upload />}
      >
        Import CSV
        <input
          type="file"
          hidden
          accept=".csv"
          onChange={handleImport}
        />
      </Button>
    </Box>
  );
}

export default CsvOperations; 