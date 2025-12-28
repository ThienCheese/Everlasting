import app from './app.js';
import permissionService from './src/services/permission.service.js';

const PORT = process.env.PORT || 3000;

// Initialize permission service before starting server
(async () => {
  try {
    console.log('🔧 Initializing services...');
    
    // Initialize permission service from database
    try {
      await permissionService.initialize();
      console.log('🔐 Permission service: Ready');
    } catch (permError) {
      console.warn('⚠️  Permission service initialization failed:', permError.message);
      console.warn('⚠️  Server will continue without permission cache.');
      console.warn('⚠️  Please ensure database has permissions data or run migrations.');
    }
    
    // Start server anyway
    app.listen(PORT, () => {
      console.log(`🚀 Server running on http://localhost:${PORT}`);
      console.log(`📊 Environment: ${process.env.NODE_ENV}`);
      console.log(`🌐 API Base URL: http://localhost:${PORT}/api`);
    });
  } catch (error) {
    console.error('❌ Failed to start server:', error);
    process.exit(1);
  }
})();
