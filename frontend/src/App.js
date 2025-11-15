import React from 'react';
import { BrowserRouter as Router, Routes, Route} from 'react-router-dom';
import { ThemeProvider } from '@mui/material/styles';
import { CssBaseline, Container, Box } from '@mui/material';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import theme from './theme/theme';
import { AuthProvider } from './context/AuthContext';
import { InventoryProvider } from './context/InventoryContext';
import PrivateRoute from './components/PrivateRoute';
import Navbar from './components/Navbar';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import InventoryList from './pages/InventoryList';
import ItemForm from './pages/ItemForm';
import LowStockItems from './pages/LowStockItems';

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AuthProvider>
        <Router>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route
              path="/*"
              element={
                <PrivateRoute>
                  <InventoryProvider>
                    <Box
                      sx={{
                        minHeight: '100vh',
                        background: 'linear-gradient(135deg, #f1f5f9 0%, #e2e8f0 100%)',
                        backgroundAttachment: 'fixed',
                      }}
                    >
                      <Navbar />
                      <Container maxWidth="lg" sx={{ mt: { xs: 2, sm: 3, md: 4 }, mb: { xs: 2, sm: 3, md: 4 }, pb: { xs: 2, sm: 3, md: 4 }, px: { xs: 2, sm: 3 } }}>
                        <Routes>
                          <Route path="/" element={<Dashboard />} />
                          <Route path="/inventory" element={<InventoryList />} />
                          <Route path="/low-stock" element={<LowStockItems />} />
                          <Route path="/create" element={<ItemForm />} />
                          <Route path="/edit/:id" element={<ItemForm />} />
                        </Routes>
                      </Container>
                    </Box>
                  </InventoryProvider>
                </PrivateRoute>
              }
            />
          </Routes>
        </Router>
        <ToastContainer
          position="bottom-right"
          autoClose={3000}
          hideProgressBar={false}
          newestOnTop
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
        />
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
