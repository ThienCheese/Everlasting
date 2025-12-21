import logger from '../helpers/logger.js';

/**
 * Middleware log tất cả requests
 */
export const requestLogger = (req, res, next) => {
  const start = Date.now();

  // Log khi response hoàn thành
  res.on('finish', () => {
    const duration = Date.now() - start;
    const logData = {
      method: req.method,
      url: req.originalUrl,
      status: res.statusCode,
      duration: `${duration}ms`,
      ip: req.ip || req.connection.remoteAddress,
      userAgent: req.get('user-agent')
    };

    if (res.statusCode >= 400) {
      logger.error('HTTP Request Error', logData);
    } else {
      logger.info('HTTP Request', logData);
    }
  });

  next();
};

/**
 * Middleware log các thao tác quan trọng
 */
export const auditLogger = (action) => {
  return (req, res, next) => {
    const userId = req.user?.id || 'anonymous';
    const userName = req.user?.tenNguoiDung || 'anonymous';

    logger.info('Audit Log', {
      action,
      userId,
      userName,
      method: req.method,
      url: req.originalUrl,
      ip: req.ip || req.connection.remoteAddress,
      timestamp: new Date().toISOString(),
      body: req.body
    });

    next();
  };
};

/**
 * Middleware log errors
 */
export const errorLogger = (err, req, res, next) => {
  logger.error('Application Error', {
    error: err.message,
    stack: err.stack,
    method: req.method,
    url: req.originalUrl,
    body: req.body,
    user: req.user?.id || 'anonymous'
  });

  next(err);
};

export default {
  requestLogger,
  auditLogger,
  errorLogger
};
