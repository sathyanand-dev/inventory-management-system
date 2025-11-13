import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  Box,
  Paper,
  TextField,
  Button,
  Typography,
  Grid,
  CircularProgress,
  Divider,
  Card,
  CardContent,
  InputAdornment,
  Chip,
} from '@mui/material';
import {
  Save as SaveIcon,
  Cancel as CancelIcon,
  Inventory as InventoryIcon,
  AttachMoney as MoneyIcon,
  Numbers as NumbersIcon,
  Category as CategoryIcon,
  Description as DescriptionIcon,
} from '@mui/icons-material';
import { itemAPI } from '../services/api';
import { useInventory } from '../context/InventoryContext';

const ItemForm = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEditMode = Boolean(id);
  const { fetchItems } = useInventory();

  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    itemName: '',
    quantity: '',
    price: '',
    description: '',
    category: '',
  });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (isEditMode) {
      fetchItem();
    }
  }, [id]);

  const fetchItem = async () => {
    try {
      setLoading(true);
      const response = await itemAPI.getById(id);
      setFormData({
        itemName: response.data.itemName,
        quantity: response.data.quantity,
        price: response.data.price,
        description: response.data.description || '',
        category: response.data.category || '',
      });
    } catch (error) {
      console.error('Error fetching item:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: '',
      }));
    }
  };

  const validate = () => {
    const newErrors = {};

    if (!formData.itemName.trim()) {
      newErrors.itemName = 'Item name is required';
    }

    if (formData.quantity === '' || formData.quantity < 0) {
      newErrors.quantity = 'Quantity must be a non-negative number';
    }

    if (formData.price === '' || formData.price < 0) {
      newErrors.price = 'Price must be a non-negative number';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validate()) {
      return;
    }

    try {
      setLoading(true);
      
      // Convert quantity and price to numbers before sending
      const dataToSend = {
        ...formData,
        quantity: Number(formData.quantity),
        price: Number(formData.price),
      };
      
      if (isEditMode) {
        await itemAPI.update(id, dataToSend);
      } else {
        await itemAPI.create(dataToSend);
      }
      // Refresh the items list
      await fetchItems(1);
      navigate('/inventory');
    } catch (error) {
      console.error('Error saving item:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading && isEditMode) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ maxWidth: 1000, mx: 'auto' }}>
      <Box display="flex" alignItems="center" mb={4}>
        <InventoryIcon sx={{ fontSize: 40, mr: 2, color: 'primary.main' }} />
        <Typography variant="h4" fontWeight="bold">
          {isEditMode ? 'Edit Item' : 'Create New Item'}
        </Typography>
      </Box>

      {isEditMode && (
        <Chip
          label="Edit Mode"
          color="primary"
          sx={{ mb: 3 }}
        />
      )}

      <Card elevation={3}>
        <CardContent sx={{ p: 4 }}>
          <form onSubmit={handleSubmit}>
            {/* Item Information Section */}
            <Box mb={4}>
              <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                <InventoryIcon sx={{ mr: 1, color: 'primary.main' }} />
                Item Information
              </Typography>
              <TextField
                fullWidth
                required
                label="Item Name"
                name="itemName"
                value={formData.itemName}
                onChange={handleChange}
                error={Boolean(errors.itemName)}
                helperText={errors.itemName || 'Enter a unique name for the item'}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <InventoryIcon color="action" />
                    </InputAdornment>
                  ),
                }}
                variant="outlined"
                size="medium"
              />
            </Box>

            {/* Quantity and Price Section */}
            <Box mb={4}>
              <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                <NumbersIcon sx={{ mr: 1, color: 'primary.main' }} />
                Quantity & Pricing
              </Typography>
              <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    required
                    type="number"
                    label="Quantity"
                    name="quantity"
                    value={formData.quantity}
                    onChange={handleChange}
                    error={Boolean(errors.quantity)}
                    helperText={errors.quantity || 'Available stock quantity'}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <NumbersIcon color="action" />
                        </InputAdornment>
                      ),
                    }}
                    inputProps={{ min: 0 }}
                    variant="outlined"
                  />
                </Grid>

                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    required
                    type="number"
                    label="Price"
                    name="price"
                    value={formData.price}
                    onChange={handleChange}
                    error={Boolean(errors.price)}
                    helperText={errors.price || 'Price per unit in INR'}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          ₹
                        </InputAdornment>
                      ),
                    }}
                    inputProps={{ min: 0, step: '0.01' }}
                    variant="outlined"
                  />
                </Grid>
              </Grid>
            </Box>

            {/* Category Section */}
            <Box mb={4}>
              <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                <CategoryIcon sx={{ mr: 1, color: 'primary.main' }} />
                Classification
              </Typography>
              <TextField
                fullWidth
                label="Category"
                name="category"
                value={formData.category}
                onChange={handleChange}
                helperText="e.g., Electronics, Furniture, Food, Clothing"
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <CategoryIcon color="action" />
                    </InputAdornment>
                  ),
                }}
                variant="outlined"
              />
            </Box>

            {/* Description Section */}
            <Box mb={4}>
              <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                <DescriptionIcon sx={{ mr: 1, color: 'primary.main' }} />
                Additional Details
              </Typography>
              <TextField
                fullWidth
                multiline
                rows={4}
                label="Description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                helperText="Provide detailed information about the item"
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start" sx={{ alignSelf: 'flex-start', mt: 2 }}>
                      <DescriptionIcon color="action" />
                    </InputAdornment>
                  ),
                }}
                variant="outlined"
              />
            </Box>

            {/* Action Buttons */}
            <Box display="flex" gap={2} justifyContent="flex-end" mt={4} pt={3} borderTop={1} borderColor="divider">
              <Button
                variant="outlined"
                size="large"
                startIcon={<CancelIcon />}
                onClick={() => navigate('/inventory')}
                disabled={loading}
                sx={{ minWidth: 140, textTransform: 'uppercase', fontWeight: 600 }}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                variant="contained"
                size="large"
                startIcon={loading ? <CircularProgress size={20} color="inherit" /> : <SaveIcon />}
                disabled={loading}
                sx={{ minWidth: 140, textTransform: 'uppercase', fontWeight: 600 }}
              >
                {loading ? 'Saving...' : isEditMode ? 'Update' : 'Create'}
              </Button>
            </Box>
          </form>
        </CardContent>
      </Card>

      {/* Preview Card */}
      {(formData.itemName || formData.quantity || formData.price) && (
        <Card elevation={2} sx={{ mt: 4, bgcolor: 'grey.50' }}>
          <CardContent sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom color="primary" fontWeight="bold">
              Preview
            </Typography>
            <Divider sx={{ mb: 2 }} />
            <Grid container spacing={2}>
              {formData.itemName && (
                <Grid item xs={12}>
                  <Typography variant="body2" color="textSecondary" gutterBottom>Item Name</Typography>
                  <Typography variant="body1" fontWeight="medium">{formData.itemName}</Typography>
                </Grid>
              )}
              <Grid item xs={12} sm={6}>
                {formData.quantity && (
                  <Box>
                    <Typography variant="body2" color="textSecondary" gutterBottom>Quantity</Typography>
                    <Typography variant="body1" fontWeight="medium">{formData.quantity} units</Typography>
                  </Box>
                )}
              </Grid>
              <Grid item xs={12} sm={6}>
                {formData.price && (
                  <Box>
                    <Typography variant="body2" color="textSecondary" gutterBottom>Price</Typography>
                    <Typography variant="body1" fontWeight="medium">₹{formData.price}</Typography>
                  </Box>
                )}
              </Grid>
              {formData.category && (
                <Grid item xs={12}>
                  <Typography variant="body2" color="textSecondary" gutterBottom>Category</Typography>
                  <Chip label={formData.category} size="small" color="primary" variant="outlined" />
                </Grid>
              )}
              {formData.quantity && formData.price && (
                <Grid item xs={12}>
                  <Divider sx={{ my: 1 }} />
                  <Typography variant="body2" color="textSecondary" gutterBottom>Total Value</Typography>
                  <Typography variant="h5" color="success.main" fontWeight="bold">
                    ₹{(formData.quantity * formData.price).toFixed(2)}
                  </Typography>
                </Grid>
              )}
            </Grid>
          </CardContent>
        </Card>
      )}
    </Box>
  );
};

export default ItemForm;
