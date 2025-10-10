const { PrismaClient } = require('@prisma/client');
const { prisma } = require('../../config/database');

class Certificado {
  /**
   * Crear un nuevo certificado
   * @param {Object} certificadoData - Datos del certificado
   * @returns {Promise<Object>} Certificado creado
   */
  static async crear(certificadoData) {
    try {
      const certificado = await prisma.certificado.create({
        data: certificadoData,
        include: {
          trabajador: {
            include: {
              usuario: true
            }
          }
        }
      });
      
      return certificado;
    } catch (error) {
      throw new Error(`Error al crear certificado: ${error.message}`);
    }
  }

  /**
   * Crear múltiples certificados para un trabajador
   * @param {string} trabajadorId - ID del trabajador
   * @param {Array} certificadosData - Array de datos de certificados
   * @returns {Promise<Array>} Certificados creados
   */
  static async crearMultiples(trabajadorId, certificadosData) {
    try {
      const certificados = await prisma.certificado.createMany({
        data: certificadosData.map(cert => ({
          ...cert,
          trabajadorId
        }))
      });
      
      // Obtener los certificados creados
      const certificadosCreados = await prisma.certificado.findMany({
        where: { trabajadorId },
        orderBy: { createdAt: 'desc' },
        take: certificadosData.length
      });
      
      return certificadosCreados;
    } catch (error) {
      throw new Error(`Error al crear certificados: ${error.message}`);
    }
  }

  /**
   * Buscar certificado por ID
   * @param {string} id - ID del certificado
   * @returns {Promise<Object|null>} Certificado encontrado o null
   */
  static async buscarPorId(id) {
    try {
      const certificado = await prisma.certificado.findUnique({
        where: { id },
        include: {
          trabajador: {
            include: {
              usuario: true
            }
          }
        }
      });
      
      return certificado;
    } catch (error) {
      throw new Error(`Error al buscar certificado: ${error.message}`);
    }
  }

  /**
   * Obtener certificados de un trabajador
   * @param {string} trabajadorId - ID del trabajador
   * @returns {Promise<Array>} Lista de certificados
   */
  static async obtenerPorTrabajador(trabajadorId) {
    try {
      const certificados = await prisma.certificado.findMany({
        where: { trabajadorId },
        orderBy: { createdAt: 'desc' }
      });
      
      return certificados;
    } catch (error) {
      throw new Error(`Error al obtener certificados: ${error.message}`);
    }
  }

  /**
   * Obtener todos los certificados
   * @param {Object} options - Opciones de paginación y filtros
   * @returns {Promise<Object>} Lista de certificados
   */
  static async obtenerTodos(options = {}) {
    try {
      const { page = 1, limit = 10, skip = 0 } = options;
      
      const [certificados, total] = await Promise.all([
        prisma.certificado.findMany({
          skip: skip || (page - 1) * limit,
          take: limit,
          include: {
            trabajador: {
              include: {
                usuario: true
              }
            }
          },
          orderBy: {
            createdAt: 'desc'
          }
        }),
        prisma.certificado.count()
      ]);
      
      return {
        certificados,
        pagination: {
          page,
          limit,
          total,
          pages: Math.ceil(total / limit)
        }
      };
    } catch (error) {
      throw new Error(`Error al obtener certificados: ${error.message}`);
    }
  }

  /**
   * Actualizar certificado
   * @param {string} id - ID del certificado
   * @param {Object} updateData - Datos a actualizar
   * @returns {Promise<Object>} Certificado actualizado
   */
  static async actualizar(id, updateData) {
    try {
      const certificado = await prisma.certificado.update({
        where: { id },
        data: updateData,
        include: {
          trabajador: {
            include: {
              usuario: true
            }
          }
        }
      });
      
      return certificado;
    } catch (error) {
      throw new Error(`Error al actualizar certificado: ${error.message}`);
    }
  }

  /**
   * Eliminar certificado
   * @param {string} id - ID del certificado
   * @returns {Promise<Object>} Certificado eliminado
   */
  static async eliminar(id) {
    try {
      const certificado = await prisma.certificado.delete({
        where: { id }
      });
      
      return certificado;
    } catch (error) {
      throw new Error(`Error al eliminar certificado: ${error.message}`);
    }
  }

  /**
   * Eliminar todos los certificados de un trabajador
   * @param {string} trabajadorId - ID del trabajador
   * @returns {Promise<Object>} Resultado de la eliminación
   */
  static async eliminarPorTrabajador(trabajadorId) {
    try {
      const result = await prisma.certificado.deleteMany({
        where: { trabajadorId }
      });
      
      return result;
    } catch (error) {
      throw new Error(`Error al eliminar certificados: ${error.message}`);
    }
  }
}

module.exports = Certificado;
