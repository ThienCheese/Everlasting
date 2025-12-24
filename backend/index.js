import app from './app.js';
import permissionService from './src/services/permission.service.js';

const PORT = process.env.PORT || 3000;

// Initialize permission service before starting server
(async () => {
  try {
    console.log('🔧 Initializing services...');
    
    // Initialize permission service from database
    await permissionService.initialize();
    
    // Start server
    app.listen(PORT, () => {
      console.log(`🚀 Server running on http://localhost:${PORT}`);
      console.log(`📊 API Documentation: http://localhost:${PORT}/api`);
      console.log(`🔐 Permission service: Ready`);
    });
  } catch (error) {
    console.error('❌ Failed to start server:', error);
    process.exit(1);
  }
})();
