import React, { useState } from 'react';
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
  TablePagination,
  IconButton,
  Button,
  TextField,
  Typography,
  CircularProgress,
  Chip,
  InputAdornment,
  Grid,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Divider,
} from '@mui/material';
import {
  Edit as EditIcon,
  Delete as DeleteIcon,
  Add as AddIcon,
  Search as SearchIcon,
  FilterList as FilterIcon,
  Visibility as VisibilityIcon,
  Close as CloseIcon,
} from '@mui/icons-material';
import { useInventory } from '../context/InventoryContext';
import { itemAPI } from '../services/api';
import ConfirmDialog from '../components/ConfirmDialog';

const InventoryList = () => {
  const navigate = useNavigate();
  const { items, loading, pagination, filters, fetchItems, updateFilters } = useInventory();
  const [deleteDialog, setDeleteDialog] = useState({ open: false, itemId: null, itemName: '' });
  const [viewDialog, setViewDialog] = useState({ open: false, item: null });
  const [showFilters, setShowFilters] = useState(false);

  const handleChangePage = (event, newPage) => {
    fetchItems(newPage + 1);
  };

  const handleChangeRowsPerPage = (event) => {
    updateFilters({ itemsPerPage: parseInt(event.target.value, 10) });
    fetchItems(1);
  };

  const handleSearch = (event) => {
    updateFilters({ search: event.target.value });
  };

  const handleDelete = async () => {
    try {
      await itemAPI.delete(deleteDialog.itemId);
      setDeleteDialog({ open: false, itemId: null, itemName: '' });
      fetchItems(pagination.currentPage);
    } catch (error) {
      console.error('Error deleting item:', error);
    }
  };

  const openDeleteDialog = (id, name) => {
    setDeleteDialog({ open: true, itemId: id, itemName: name });
  };

  const openViewDialog = (item) => {
    setViewDialog({ open: true, item });
  };

  const closeViewDialog = () => {
    setViewDialog({ open: false, item: null });
  };

  const getStockStatus = (quantity) => {
    if (quantity === 0) return { label: 'Out of Stock', color: 'error' };
    if (quantity < 10) return { label: 'Low Stock', color: 'warning' };
    return { label: 'In Stock', color: 'success' };
  };

  if (loading && items.length === 0) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h4">Inventory Items</Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => navigate('/create')}
        >
          Add Item
        </Button>
      </Box>

      <Paper sx={{ p: 2, mb: 2 }}>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              placeholder="Search items..."
              value={filters.search}
              onChange={handleSearch}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon />
                  </InputAdornment>
                ),
              }}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <Box display="flex" justifyContent="flex-end" gap={2}>
              <Button
                startIcon={<FilterIcon />}
                onClick={() => setShowFilters(!showFilters)}
              >
                Filters
              </Button>
            </Box>
          </Grid>
          
          {showFilters && (
            <>
              <Grid item xs={12} md={4}>
                <TextField
                  fullWidth
                  label="Category"
                  value={filters.category}
                  onChange={(e) => updateFilters({ category: e.target.value })}
                />
              </Grid>
              <Grid item xs={12} md={4}>
                <TextField
                  fullWidth
                  label="Min Price"
                  type="number"
                  value={filters.minPrice}
                  onChange={(e) => updateFilters({ minPrice: e.target.value })}
                />
              </Grid>
              <Grid item xs={12} md={4}>
                <TextField
                  fullWidth
                  label="Max Price"
                  type="number"
                  value={filters.maxPrice}
                  onChange={(e) => updateFilters({ maxPrice: e.target.value })}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <FormControl fullWidth>
                  <InputLabel>Sort By</InputLabel>
                  <Select
                    value={filters.sortBy}
                    label="Sort By"
                    onChange={(e) => updateFilters({ sortBy: e.target.value })}
                  >
                    <MenuItem value="createdAt">Date Created</MenuItem>
                    <MenuItem value="itemName">Name</MenuItem>
                    <MenuItem value="quantity">Quantity</MenuItem>
                    <MenuItem value="price">Price</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} md={6}>
                <FormControl fullWidth>
                  <InputLabel>Order</InputLabel>
                  <Select
                    value={filters.sortOrder}
                    label="Order"
                    onChange={(e) => updateFilters({ sortOrder: e.target.value })}
                  >
                    <MenuItem value="asc">Ascending</MenuItem>
                    <MenuItem value="desc">Descending</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
            </>
          )}
        </Grid>
      </Paper>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Item Name</TableCell>
              <TableCell align="right">Quantity</TableCell>
              <TableCell align="right">Price</TableCell>
              <TableCell>Category</TableCell>
              <TableCell>Status</TableCell>
              <TableCell align="center">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {items.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} align="center">
                  <Typography variant="body1" color="textSecondary" py={4}>
                    No items found
                  </Typography>
                </TableCell>
              </TableRow>
            ) : (
              items.map((item) => {
                const stockStatus = getStockStatus(item.quantity);
                return (
                  <TableRow key={item._id} hover>
                    <TableCell>{item.itemName}</TableCell>
                    <TableCell align="right">{item.quantity}</TableCell>
                    <TableCell align="right">₹{item.price.toFixed(2)}</TableCell>
                    <TableCell>{item.category || '-'}</TableCell>
                    <TableCell>
                      <Chip
                        label={stockStatus.label}
                        color={stockStatus.color}
                        size="small"
                      />
                    </TableCell>
                    <TableCell align="center">
                      <IconButton
                        color="info"
                        onClick={() => openViewDialog(item)}
                        title="View Details"
                      >
                        <VisibilityIcon />
                      </IconButton>
                      <IconButton
                        color="primary"
                        onClick={() => navigate(`/edit/${item._id}`)}
                        title="Edit"
                      >
                        <EditIcon />
                      </IconButton>
                      <IconButton
                        color="error"
                        onClick={() => openDeleteDialog(item._id, item.itemName)}
                        title="Delete"
                      >
                        <DeleteIcon />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                );
              })
            )}
          </TableBody>
        </Table>
        <TablePagination
          component="div"
          count={pagination.totalItems}
          page={pagination.currentPage - 1}
          onPageChange={handleChangePage}
          rowsPerPage={pagination.itemsPerPage}
          onRowsPerPageChange={handleChangeRowsPerPage}
          rowsPerPageOptions={[5, 10, 25, 50]}
        />
      </TableContainer>

      <ConfirmDialog
        open={deleteDialog.open}
        title="Delete Item"
        message={`Are you sure you want to delete "${deleteDialog.itemName}"? This action cannot be undone.`}
        onConfirm={handleDelete}
        onCancel={() => setDeleteDialog({ open: false, itemId: null, itemName: '' })}
      />

      {/* View Item Dialog */}
      <Dialog
        open={viewDialog.open}
        onClose={closeViewDialog}
        maxWidth="sm"
        fullWidth
        PaperProps={{
          sx: { borderRadius: 3 }
        }}
      >
        <DialogTitle sx={{ pb: 2 }}>
          <Box display="flex" justifyContent="space-between" alignItems="center">
            <Typography variant="h5" fontWeight="bold">
              Item Details
            </Typography>
            <IconButton onClick={closeViewDialog} size="small">
              <CloseIcon />
            </IconButton>
          </Box>
        </DialogTitle>
        <Divider />
        <DialogContent sx={{ pt: 3 }}>
          {viewDialog.item && (
            <Box>
              <Grid container spacing={3}>
                <Grid item xs={12}>
                  <Typography variant="overline" color="textSecondary" fontWeight="bold">
                    Item Name
                  </Typography>
                  <Typography variant="h6" gutterBottom>
                    {viewDialog.item.itemName}
                  </Typography>
                </Grid>

                <Grid item xs={6}>
                  <Typography variant="overline" color="textSecondary" fontWeight="bold">
                    Quantity
                  </Typography>
                  <Typography variant="h6" gutterBottom>
                    {viewDialog.item.quantity} units
                  </Typography>
                </Grid>

                <Grid item xs={6}>
                  <Typography variant="overline" color="textSecondary" fontWeight="bold">
                    Price
                  </Typography>
                  <Typography variant="h6" gutterBottom color="primary">
                    ₹{viewDialog.item.price.toFixed(2)}
                  </Typography>
                </Grid>

                <Grid item xs={6}>
                  <Typography variant="overline" color="textSecondary" fontWeight="bold">
                    Category
                  </Typography>
                  <Typography variant="body1" gutterBottom>
                    {viewDialog.item.category || 'Not specified'}
                  </Typography>
                </Grid>

                <Grid item xs={6}>
                  <Typography variant="overline" color="textSecondary" fontWeight="bold">
                    Status
                  </Typography>
                  <Box>
                    <Chip
                      label={getStockStatus(viewDialog.item.quantity).label}
                      color={getStockStatus(viewDialog.item.quantity).color}
                      size="medium"
                    />
                  </Box>
                </Grid>

                <Grid item xs={12}>
                  <Typography variant="overline" color="textSecondary" fontWeight="bold">
                    Description
                  </Typography>
                  <Typography variant="body1" color="textSecondary">
                    {viewDialog.item.description || 'No description available'}
                  </Typography>
                </Grid>

                <Grid item xs={12}>
                  <Divider sx={{ my: 1 }} />
                  <Box display="flex" justifyContent="space-between" alignItems="center" mt={2}>
                    <Typography variant="body2" color="textSecondary">
                      Total Value
                    </Typography>
                    <Typography variant="h5" color="success.main" fontWeight="bold">
                      ₹{(viewDialog.item.quantity * viewDialog.item.price).toFixed(2)}
                    </Typography>
                  </Box>
                </Grid>
              </Grid>
            </Box>
          )}
        </DialogContent>
        <Divider />
        <DialogActions sx={{ p: 2.5 }}>
          <Button
            onClick={() => {
              closeViewDialog();
              navigate(`/edit/${viewDialog.item._id}`);
            }}
            variant="contained"
            startIcon={<EditIcon />}
          >
            Edit Item
          </Button>
          <Button onClick={closeViewDialog} variant="outlined">
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default InventoryList;
