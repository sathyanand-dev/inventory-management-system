import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Typography,
  CircularProgress,
  Chip,
  Alert,
  AlertTitle,
  TextField,
  InputAdornment,
  Button,
} from '@mui/material';
import {
  Edit as EditIcon,
  Warning as WarningIcon,
  Inventory as InventoryIcon,
  TrendingDown as TrendingDownIcon,
} from '@mui/icons-material';
import { itemAPI } from '../services/api';

const LowStockItems = () => {
  const navigate = useNavigate();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [threshold, setThreshold] = useState(10);

  useEffect(() => {
    fetchLowStockItems();
  }, [threshold]);

  const fetchLowStockItems = async () => {
    try {
      setLoading(true);
      console.log('Fetching low stock items with threshold:', threshold);
      const response = await itemAPI.getLowStock(threshold);
      console.log('Low stock response:', response);
      // Response structure: { success, data: { items, count, threshold } }
      setItems(response.data.items || []);
    } catch (error) {
      console.error('Error fetching low stock items:', error);
      setItems([]);
    } finally {
      setLoading(false);
    }
  };

  const getStockStatus = (quantity) => {
    if (quantity === 0) return { label: 'Out of Stock', color: 'error' };
    if (quantity < 5) return { label: 'Critical', color: 'error' };
    return { label: 'Low Stock', color: 'warning' };
  };

  const getUrgencyColor = (quantity) => {
    if (quantity === 0) return '#ef4444';
    if (quantity < 5) return '#f97316';
    return '#f59e0b';
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Box display="flex" alignItems="center" gap={2}>
          <Box
            sx={{
              backgroundColor: 'warning.main',
              borderRadius: 2,
              width: 56,
              height: 56,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <WarningIcon sx={{ fontSize: 32, color: 'white' }} />
          </Box>
          <Box>
            <Typography variant="h4" fontWeight="bold">
              Low Stock Alert
            </Typography>
            <Typography variant="body2" color="textSecondary">
              Items requiring immediate attention
            </Typography>
          </Box>
        </Box>
        <TextField
          type="number"
          label="Stock Threshold"
          value={threshold}
          onChange={(e) => setThreshold(Math.max(1, Number(e.target.value)))}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <TrendingDownIcon color="action" />
              </InputAdornment>
            ),
          }}
          sx={{ width: 200 }}
          size="small"
        />
      </Box>

      {items.length === 0 ? (
        <Alert severity="success" icon={<InventoryIcon />} sx={{ borderRadius: 3 }}>
          <AlertTitle sx={{ fontWeight: 'bold' }}>All Stock Levels Good!</AlertTitle>
          No items are below the threshold of {threshold} units. All inventory levels are healthy.
        </Alert>
      ) : (
        <>
          <Alert 
            severity="warning" 
            icon={<WarningIcon />} 
            sx={{ mb: 3, borderRadius: 3 }}
          >
            <AlertTitle sx={{ fontWeight: 'bold' }}>
              {items.length} {items.length === 1 ? 'Item' : 'Items'} Need Restocking
            </AlertTitle>
            The following items have quantities below {threshold} units. Consider restocking soon.
          </Alert>

          <TableContainer component={Paper} sx={{ borderRadius: 3 }}>
            <Table>
              <TableHead>
                <TableRow sx={{ backgroundColor: 'warning.light' }}>
                  <TableCell sx={{ fontWeight: 'bold' }}>Item Name</TableCell>
                  <TableCell align="center" sx={{ fontWeight: 'bold' }}>Current Stock</TableCell>
                  <TableCell align="right" sx={{ fontWeight: 'bold' }}>Price</TableCell>
                  <TableCell sx={{ fontWeight: 'bold' }}>Category</TableCell>
                  <TableCell sx={{ fontWeight: 'bold' }}>Status</TableCell>
                  <TableCell align="center" sx={{ fontWeight: 'bold' }}>Action</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {items.map((item) => {
                  const stockStatus = getStockStatus(item.quantity);
                  return (
                    <TableRow 
                      key={item._id} 
                      hover
                      sx={{
                        borderLeft: `4px solid ${getUrgencyColor(item.quantity)}`,
                        '&:hover': {
                          backgroundColor: 'rgba(245, 158, 11, 0.05)',
                        },
                      }}
                    >
                      <TableCell>
                        <Box display="flex" alignItems="center" gap={1}>
                          <InventoryIcon color="action" fontSize="small" />
                          <Typography fontWeight="medium">{item.itemName}</Typography>
                        </Box>
                      </TableCell>
                      <TableCell align="center">
                        <Typography
                          variant="h6"
                          fontWeight="bold"
                          sx={{ color: getUrgencyColor(item.quantity) }}
                        >
                          {item.quantity}
                        </Typography>
                        <Typography variant="caption" color="textSecondary">
                          units
                        </Typography>
                      </TableCell>
                      <TableCell align="right">
                        <Typography fontWeight="medium">
                          ₹{item.price.toFixed(2)}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={item.category || 'Uncategorized'}
                          size="small"
                          variant="outlined"
                        />
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={stockStatus.label}
                          color={stockStatus.color}
                          size="small"
                          icon={<WarningIcon />}
                        />
                      </TableCell>
                      <TableCell align="center">
                        <Button
                          variant="contained"
                          size="small"
                          startIcon={<EditIcon />}
                          onClick={() => navigate(`/edit/${item._id}`)}
                          sx={{ minWidth: 120 }}
                        >
                          Restock
                        </Button>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </TableContainer>

          <Paper sx={{ mt: 3, p: 3, borderRadius: 3, backgroundColor: 'info.lighter' }}>
            <Typography variant="h6" gutterBottom fontWeight="bold">
              💡 Stock Management Tips
            </Typography>
            <Typography variant="body2" color="textSecondary" paragraph>
              • <strong>Critical (0-4 units):</strong> Immediate restocking required
            </Typography>
            <Typography variant="body2" color="textSecondary" paragraph>
              • <strong>Low Stock (5-{threshold-1} units):</strong> Plan restocking soon
            </Typography>
            <Typography variant="body2" color="textSecondary">
              • Adjust the threshold above to customize your low stock alerts
            </Typography>
          </Paper>
        </>
      )}
    </Box>
  );
};

export default LowStockItems;
