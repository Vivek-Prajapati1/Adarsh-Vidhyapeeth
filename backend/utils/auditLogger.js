import AuditLog from '../models/AuditLog.js';

export const createAuditLog = async (logData) => {
  try {
    const auditLog = await AuditLog.create({
      action: logData.action,
      performedBy: logData.performedBy,
      performedByName: logData.performedByName,
      performedByRole: logData.performedByRole,
      targetModel: logData.targetModel,
      targetId: logData.targetId,
      oldValues: logData.oldValues || null,
      newValues: logData.newValues || null,
      reason: logData.reason || null,
      ipAddress: logData.ipAddress || null
    });
    return auditLog;
  } catch (error) {
    console.error('Error creating audit log:', error);
    // Don't throw error - audit log failure should not break the main operation
  }
};
