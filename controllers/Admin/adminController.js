const { Trabajador } = require('../../models');

class AdminController {
  /**
   * Obtener todos los trabajadores pendientes
   * @param {Object} req - Request object
   * @param {Object} res - Response object
   */
  static async obtenerTrabajadoresPendientes(req, res) {
    try {
      const { page = 1, limit = 10 } = req.query;
      
      const result = await Trabajador.obtenerTodos({
        page: parseInt(page),
        limit: parseInt(limit)
      });
      
      // Filtrar solo los pendientes
      const trabajadoresPendientes = result.trabajadores.filter(
        t => t.usuario && t.estado === 'pending'
      );
      
      res.json({
        success: true,
        data: {
          trabajadores: trabajadoresPendientes,
          pagination: result.pagination
        }
      });
    } catch (error) {
      console.error('Error al obtener trabajadores pendientes:', error);
      res.status(500).json({
        success: false,
        message: 'Error interno del servidor',
        error: process.env.NODE_ENV === 'development' ? error.message : 'Error al obtener trabajadores'
      });
    }
  }

  /**
   * Aprobar trabajador
   * @param {Object} req - Request object
   * @param {Object} res - Response object
   */
  static async aprobarTrabajador(req, res) {
    try {
      const { trabajadorId } = req.params;
      
      const trabajador = await Trabajador.buscarPorId(trabajadorId);
      if (!trabajador) {
        return res.status(404).json({
          success: false,
          message: 'Trabajador no encontrado'
        });
      }
      
      if (trabajador.estado !== 'pending') {
        return res.status(400).json({
          success: false,
          message: 'El trabajador ya ha sido procesado'
        });
      }
      
      const trabajadorActualizado = await Trabajador.actualizar(trabajadorId, {
        estado: 'approved'
      });
      
      res.json({
        success: true,
        message: 'Trabajador aprobado exitosamente',
        data: trabajadorActualizado
      });
    } catch (error) {
      console.error('Error al aprobar trabajador:', error);
      res.status(500).json({
        success: false,
        message: 'Error interno del servidor',
        error: process.env.NODE_ENV === 'development' ? error.message : 'Error al aprobar trabajador'
      });
    }
  }

  /**
   * Rechazar trabajador
   * @param {Object} req - Request object
   * @param {Object} res - Response object
   */
  static async rechazarTrabajador(req, res) {
    try {
      const { trabajadorId } = req.params;
      const { motivo } = req.body;
      
      const trabajador = await Trabajador.buscarPorId(trabajadorId);
      if (!trabajador) {
        return res.status(404).json({
          success: false,
          message: 'Trabajador no encontrado'
        });
      }
      
      if (trabajador.estado !== 'pending') {
        return res.status(400).json({
          success: false,
          message: 'El trabajador ya ha sido procesado'
        });
      }
      
      const trabajadorActualizado = await Trabajador.actualizar(trabajadorId, {
        estado: 'rejected',
        motivoRechazo: motivo || 'No especificado'
      });
      
      res.json({
        success: true,
        message: 'Trabajador rechazado',
        data: trabajadorActualizado
      });
    } catch (error) {
      console.error('Error al rechazar trabajador:', error);
      res.status(500).json({
        success: false,
        message: 'Error interno del servidor',
        error: process.env.NODE_ENV === 'development' ? error.message : 'Error al rechazar trabajador'
      });
    }
  }

  /**
   * Obtener estadísticas de trabajadores
   * @param {Object} req - Request object
   * @param {Object} res - Response object
   */
  static async obtenerEstadisticas(req, res) {
    try {
      const { PrismaClient } = require('@prisma/client');
      const prisma = new PrismaClient();
      
      const [total, pendientes, aprobados, rechazados] = await Promise.all([
        prisma.trabajador.count(),
        prisma.trabajador.count({ where: { estado: 'pending' } }),
        prisma.trabajador.count({ where: { estado: 'approved' } }),
        prisma.trabajador.count({ where: { estado: 'rejected' } })
      ]);
      
      res.json({
        success: true,
        data: {
          total,
          pendientes,
          aprobados,
          rechazados
        }
      });
    } catch (error) {
      console.error('Error al obtener estadísticas:', error);
      res.status(500).json({
        success: false,
        message: 'Error interno del servidor',
        error: process.env.NODE_ENV === 'development' ? error.message : 'Error al obtener estadísticas'
      });
    }
  }
}

module.exports = {
  obtenerTrabajadoresPendientes: AdminController.obtenerTrabajadoresPendientes,
  aprobarTrabajador: AdminController.aprobarTrabajador,
  rechazarTrabajador: AdminController.rechazarTrabajador,
  obtenerEstadisticas: AdminController.obtenerEstadisticas
};
