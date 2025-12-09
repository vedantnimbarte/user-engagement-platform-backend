import 'dotenv/config';
import app from './src/app.js';
import { testConnection } from './src/config/database.js';

const PORT = process.env.PORT || 3000;

const startServer = async () => {
    try {
        // Test database connection
        await testConnection();

        // Create HTTP server
        const server = app.listen(PORT, () => {
            console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
        });

        // Handle server errors
        server.on('error', (error) => {
            console.error('Server error:', error);
            process.exit(1);
        });

        // Graceful shutdown
        const shutdown = async () => {
            console.log('Shutting down server...');
            server.close(async () => {
                console.log('Server closed');
                process.exit(0);
            });

            // Force close after 10s
            setTimeout(() => {
                console.error('Could not close connections in time, forcefully shutting down');
                process.exit(1);
            }, 10000);
        };

        process.on('SIGTERM', shutdown);
        process.on('SIGINT', shutdown);

    } catch (error) {
        console.error('Failed to start server:', error);
        process.exit(1);
    }
};

startServer();

// Export app for testing
export default app;
