import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  CircularProgress,
} from '@mui/material';
import {
  Inventory as InventoryIcon,
  Warning as WarningIcon,
  AttachMoney as MoneyIcon,
  Category as CategoryIcon,
} from '@mui/icons-material';
import { itemAPI } from '../services/api';

const StatCard = ({ title, value, icon, color, onClick, clickable }) => (
  <Card 
    sx={{ 
      height: '100%', 
      minHeight: 160,
      cursor: clickable ? 'pointer' : 'default',
      transition: 'all 0.3s ease',
      '&:hover': clickable ? {
        transform: 'translateY(-4px)',
        boxShadow: 6,
      } : {},
    }}
    onClick={onClick}
  >
    <CardContent sx={{ 
      height: '100%', 
      display: 'flex', 
      flexDirection: 'column', 
      justifyContent: 'space-between',
      p: 3 
    }}>
      <Box display="flex" justifyContent="space-between" alignItems="center" gap={2}>
        <Box flex={1}>
          <Typography 
            color="textSecondary" 
            variant="body2"
            sx={{ 
              fontSize: '0.875rem', 
              fontWeight: 600, 
              letterSpacing: 0.5,
              mb: 2,
              textTransform: 'uppercase'
            }}
          >
            {title}
          </Typography>
          <Typography variant="h2" fontWeight="bold" sx={{ fontSize: '2.5rem', lineHeight: 1 }}>
            {value}
          </Typography>
        </Box>
        <Box
          sx={{
            backgroundColor: `${color}.main`,
            borderRadius: 3,
            width: 64,
            height: 64,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0,
          }}
        >
          {React.cloneElement(icon, { 
            sx: { 
              color: 'white', 
              fontSize: 32 
            } 
          })}
        </Box>
      </Box>
    </CardContent>
  </Card>
);

const Dashboard = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const response = await itemAPI.getStats();
      setStats(response.data);
    } catch (error) {
      console.error('Error fetching stats:', error);
    } finally {
      setLoading(false);
    }
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
      <Typography variant="h4" gutterBottom>
        Dashboard
      </Typography>
      <Grid container spacing={3}>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Total Items"
            value={stats?.totalItems || 0}
            icon={<InventoryIcon />}
            color="primary"
            clickable={true}
            onClick={() => navigate('/inventory')}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Low Stock Items"
            value={stats?.lowStockItems || 0}
            icon={<WarningIcon />}
            color="warning"
            clickable={true}
            onClick={() => navigate('/low-stock')}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Total Value"
            value={`₹${stats?.totalValue?.toFixed(2) || 0}`}
            icon={<MoneyIcon />}
            color="success"
            clickable={false}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Categories"
            value={stats?.categories?.length || 0}
            icon={<CategoryIcon />}
            color="info"
            clickable={false}
          />
        </Grid>
      </Grid>

      {stats?.categories && stats.categories.length > 0 && (
        <Box mt={4}>
          <Typography variant="h4" gutterBottom>
            Category Breakdown
          </Typography>
          <Grid container spacing={2}>
            {stats.categories.map((cat) => (
              <Grid item xs={12} sm={6} md={4} key={cat.name}>
                <Card>
                  <CardContent>
                    <Typography variant="h6">{cat.name}</Typography>
                    <Typography variant="body2" color="textSecondary">
                      {cat.count} items
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Box>
      )}
    </Box>
  );
};

export default Dashboard;
