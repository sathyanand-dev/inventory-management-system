import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  CircularProgress,
  Paper,
  LinearProgress,
  Chip,
  Button,
  alpha,
} from '@mui/material';
import {
  Inventory as InventoryIcon,
  Warning as WarningIcon,
  AttachMoney as MoneyIcon,
  Category as CategoryIcon,
  TrendingUp as TrendingUpIcon,
  Add as AddIcon,
  ArrowForward as ArrowForwardIcon,
} from '@mui/icons-material';
import { itemAPI } from '../services/api';

const StatCard = ({ title, value, icon, color, onClick, clickable, subtitle }) => (
  <Card 
    sx={{ 
      height: '100%', 
      minHeight: 180,
      cursor: clickable ? 'pointer' : 'default',
      transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
      position: 'relative',
      overflow: 'hidden',
      background: `linear-gradient(135deg, ${alpha(color === 'primary' ? '#6366f1' : color === 'warning' ? '#f59e0b' : color === 'success' ? '#10b981' : '#3b82f6', 0.05)} 0%, ${alpha(color === 'primary' ? '#6366f1' : color === 'warning' ? '#f59e0b' : color === 'success' ? '#10b981' : '#3b82f6', 0.1)} 100%)`,
      '&:hover': clickable ? {
        transform: 'translateY(-8px)',
        boxShadow: 8,
      } : {},
      '&::before': {
        content: '""',
        position: 'absolute',
        top: 0,
        right: 0,
        width: '100%',
        height: '100%',
        background: `radial-gradient(circle at top right, ${alpha(color === 'primary' ? '#6366f1' : color === 'warning' ? '#f59e0b' : color === 'success' ? '#10b981' : '#3b82f6', 0.1)}, transparent)`,
        pointerEvents: 'none',
      }
    }}
    onClick={onClick}
  >
    <CardContent sx={{ 
      height: '100%', 
      display: 'flex', 
      flexDirection: 'column', 
      justifyContent: 'space-between',
      p: 3,
      position: 'relative',
      zIndex: 1,
    }}>
      <Box display="flex" justifyContent="space-between" alignItems="flex-start" gap={2}>
        <Box flex={1}>
          <Typography 
            color="textSecondary" 
            variant="caption"
            sx={{ 
              fontSize: '0.75rem', 
              fontWeight: 700, 
              letterSpacing: 1,
              mb: 1.5,
              textTransform: 'uppercase',
              display: 'block'
            }}
          >
            {title}
          </Typography>
          <Typography 
            variant="h2" 
            fontWeight="bold" 
            sx={{ 
              fontSize: { xs: '2rem', sm: '2.5rem' }, 
              lineHeight: 1,
              mb: 1,
              background: `linear-gradient(135deg, ${color === 'primary' ? '#6366f1' : color === 'warning' ? '#f59e0b' : color === 'success' ? '#10b981' : '#3b82f6'} 0%, ${color === 'primary' ? '#4f46e5' : color === 'warning' ? '#d97706' : color === 'success' ? '#059669' : '#2563eb'} 100%)`,
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
            }}
          >
            {value}
          </Typography>
          {subtitle && (
            <Typography variant="caption" color="textSecondary" sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
              <TrendingUpIcon sx={{ fontSize: 14 }} />
              {subtitle}
            </Typography>
          )}
        </Box>
        <Box
          sx={{
            background: `linear-gradient(135deg, ${color === 'primary' ? '#6366f1' : color === 'warning' ? '#f59e0b' : color === 'success' ? '#10b981' : '#3b82f6'} 0%, ${color === 'primary' ? '#4f46e5' : color === 'warning' ? '#d97706' : color === 'success' ? '#059669' : '#2563eb'} 100%)`,
            borderRadius: 3,
            width: { xs: 56, sm: 64 },
            height: { xs: 56, sm: 64 },
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0,
            boxShadow: `0 8px 16px ${alpha(color === 'primary' ? '#6366f1' : color === 'warning' ? '#f59e0b' : color === 'success' ? '#10b981' : '#3b82f6', 0.3)}`,
          }}
        >
          {React.cloneElement(icon, { 
            sx: { 
              color: 'white', 
              fontSize: { xs: 28, sm: 32 }
            } 
          })}
        </Box>
      </Box>
      {clickable && (
        <Box display="flex" alignItems="center" gap={0.5} sx={{ color: `${color}.main`, mt: 2 }}>
          <Typography variant="caption" fontWeight={600}>
            View Details
          </Typography>
          <ArrowForwardIcon sx={{ fontSize: 14 }} />
        </Box>
      )}
    </CardContent>
  </Card>
);

const CategoryCard = ({ name, count, totalItems }) => {
  const percentage = totalItems > 0 ? (count / totalItems * 100).toFixed(1) : 0;
  
  return (
    <Card 
      sx={{ 
        height: '100%',
        transition: 'all 0.3s ease',
        '&:hover': {
          transform: 'translateY(-4px)',
          boxShadow: 4,
        }
      }}
    >
      <CardContent sx={{ p: 2.5 }}>
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
          <Typography variant="h6" fontWeight="bold" sx={{ fontSize: '1.1rem' }}>
            {name || 'Uncategorized'}
          </Typography>
          <Chip 
            label={`${count} items`} 
            size="small" 
            color="primary" 
            sx={{ fontWeight: 600 }}
          />
        </Box>
        <Box>
          <Box display="flex" justifyContent="space-between" mb={0.5}>
            <Typography variant="caption" color="textSecondary">
              Percentage of total
            </Typography>
            <Typography variant="caption" fontWeight="bold" color="primary.main">
              {percentage}%
            </Typography>
          </Box>
          <LinearProgress 
            variant="determinate" 
            value={parseFloat(percentage)} 
            sx={{ 
              height: 8, 
              borderRadius: 4,
              backgroundColor: alpha('#6366f1', 0.1),
              '& .MuiLinearProgress-bar': {
                borderRadius: 4,
                background: 'linear-gradient(90deg, #6366f1 0%, #ec4899 100%)',
              }
            }} 
          />
        </Box>
      </CardContent>
    </Card>
  );
};

const Dashboard = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      setError(null);
      const response = await itemAPI.getStats();
      setStats(response.data);
    } catch (error) {
      console.error('Error fetching stats:', error);
      setError('Failed to load dashboard statistics');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <CircularProgress size={60} />
      </Box>
    );
  }

  if (error) {
    return (
      <Box display="flex" flexDirection="column" alignItems="center" justifyContent="center" minHeight="400px" gap={2}>
        <Typography variant="h6" color="error">{error}</Typography>
        <Button variant="contained" onClick={fetchStats}>Retry</Button>
      </Box>
    );
  }

  return (
    <Box>
      {/* Header Section */}
      <Box 
        display="flex" 
        justifyContent="space-between" 
        alignItems={{ xs: 'flex-start', sm: 'center' }}
        flexDirection={{ xs: 'column', sm: 'row' }}
        gap={2}
        mb={4}
      >
        <Box>
          <Typography variant="h4" fontWeight="bold" gutterBottom>
            Dashboard Overview
          </Typography>
          <Typography variant="body2" color="textSecondary">
            Monitor your inventory performance and key metrics
          </Typography>
        </Box>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => navigate('/create')}
          sx={{
            px: 3,
            py: 1.5,
            background: 'linear-gradient(135deg, #6366f1 0%, #ec4899 100%)',
            boxShadow: '0 4px 12px rgba(99, 102, 241, 0.4)',
          }}
        >
          Add New Item
        </Button>
      </Box>

      {/* Stats Cards */}
      <Grid container spacing={3} mb={4}>
        <Grid item xs={12} sm={6} lg={3}>
          <StatCard
            title="Total Items"
            value={stats?.totalItems || 0}
            subtitle="in inventory"
            icon={<InventoryIcon />}
            color="primary"
            clickable={true}
            onClick={() => navigate('/inventory')}
          />
        </Grid>
        <Grid item xs={12} sm={6} lg={3}>
          <StatCard
            title="Low Stock Alert"
            value={stats?.lowStockItems || 0}
            subtitle="need restocking"
            icon={<WarningIcon />}
            color="warning"
            clickable={true}
            onClick={() => navigate('/low-stock')}
          />
        </Grid>
        <Grid item xs={12} sm={6} lg={3}>
          <StatCard
            title="Total Value"
            value={`₹${stats?.totalValue?.toFixed(2) || 0}`}
            subtitle="inventory worth"
            icon={<MoneyIcon />}
            color="success"
            clickable={false}
          />
        </Grid>
        <Grid item xs={12} sm={6} lg={3}>
          <StatCard
            title="Categories"
            value={stats?.categories?.length || 0}
            subtitle="product types"
            icon={<CategoryIcon />}
            color="info"
            clickable={false}
          />
        </Grid>
      </Grid>

      {/* Category Breakdown */}
      {stats?.categories && stats.categories.length > 0 && (
        <Paper elevation={2} sx={{ p: 3, borderRadius: 3 }}>
          <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
            <Box>
              <Typography variant="h5" fontWeight="bold" gutterBottom>
                Category Distribution
              </Typography>
              <Typography variant="body2" color="textSecondary">
                Breakdown of items across different categories
              </Typography>
            </Box>
          </Box>
          <Grid container spacing={2.5}>
            {stats.categories.map((cat) => (
              <Grid item xs={12} sm={6} md={4} lg={3} key={cat.name}>
                <CategoryCard 
                  name={cat.name} 
                  count={cat.count}
                  totalItems={stats.totalItems}
                />
              </Grid>
            ))}
          </Grid>
        </Paper>
      )}

      {/* Empty State */}
      {(!stats?.categories || stats.categories.length === 0) && (
        <Paper 
          elevation={0} 
          sx={{ 
            p: 6, 
            textAlign: 'center', 
            borderRadius: 3,
            border: '2px dashed',
            borderColor: 'divider'
          }}
        >
          <CategoryIcon sx={{ fontSize: 64, color: 'text.secondary', mb: 2 }} />
          <Typography variant="h6" gutterBottom>
            No categories yet
          </Typography>
          <Typography variant="body2" color="textSecondary" mb={3}>
            Start adding items to see category distribution
          </Typography>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => navigate('/create')}
          >
            Add First Item
          </Button>
        </Paper>
      )}
    </Box>
  );
};

export default Dashboard;
