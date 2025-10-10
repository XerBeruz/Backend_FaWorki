const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

class Trabajador {
  /**
   * Crear un nuevo trabajador
   * @param {string} usuarioId - ID del usuario asociado
   * @returns {Promise<Object>} Trabajador creado
   */
  static async crear(usuarioId) {
    try {
      const trabajador = await prisma.trabajador.create({
        data: {
          usuarioId
        },
        include: {
          usuario: true,
          certificados: true
        }
      });
      
      return trabajador;
    } catch (error) {
      throw new Error(`Error al crear trabajador: ${error.message}`);
    }
  }

  /**
   * Buscar trabajador por ID
   * @param {string} id - ID del trabajador
   * @returns {Promise<Object|null>} Trabajador encontrado o null
   */
  static async buscarPorId(id) {
    try {
      const trabajador = await prisma.trabajador.findUnique({
        where: { id },
        include: {
          usuario: true,
          certificados: true
        }
      });
      
      return trabajador;
    } catch (error) {
      throw new Error(`Error al buscar trabajador: ${error.message}`);
    }
  }

  /**
   * Buscar trabajador por ID de usuario
   * @param {string} usuarioId - ID del usuario
   * @returns {Promise<Object|null>} Trabajador encontrado o null
   */
  static async buscarPorUsuarioId(usuarioId) {
    try {
      const trabajador = await prisma.trabajador.findUnique({
        where: { usuarioId },
        include: {
          usuario: true,
          certificados: true
        }
      });
      
      return trabajador;
    } catch (error) {
      throw new Error(`Error al buscar trabajador: ${error.message}`);
    }
  }

  /**
   * Obtener todos los trabajadores
   * @param {Object} options - Opciones de paginación y filtros
   * @returns {Promise<Object>} Lista de trabajadores
   */
  static async obtenerTodos(options = {}) {
    try {
      const { page = 1, limit = 10, skip = 0 } = options;
      
      const [trabajadores, total] = await Promise.all([
        prisma.trabajador.findMany({
          skip: skip || (page - 1) * limit,
          take: limit,
          include: {
            usuario: true,
            certificados: true
          },
          orderBy: {
            createdAt: 'desc'
          }
        }),
        prisma.trabajador.count()
      ]);
      
      return {
        trabajadores,
        pagination: {
          page,
          limit,
          total,
          pages: Math.ceil(total / limit)
        }
      };
    } catch (error) {
      throw new Error(`Error al obtener trabajadores: ${error.message}`);
    }
  }

  /**
   * Verificar si un usuario ya es trabajador
   * @param {string} usuarioId - ID del usuario
   * @returns {Promise<boolean>} True si es trabajador, false si no
   */
  static async esTrabajador(usuarioId) {
    try {
      const trabajador = await prisma.trabajador.findUnique({
        where: { usuarioId },
        select: { id: true }
      });
      
      return !!trabajador;
    } catch (error) {
      throw new Error(`Error al verificar trabajador: ${error.message}`);
    }
  }

  /**
   * Actualizar trabajador
   * @param {string} id - ID del trabajador
   * @param {Object} updateData - Datos a actualizar
   * @returns {Promise<Object>} Trabajador actualizado
   */
  static async actualizar(id, updateData) {
    try {
      const trabajador = await prisma.trabajador.update({
        where: { id },
        data: updateData,
        include: {
          usuario: true,
          certificados: true
        }
      });
      
      return trabajador;
    } catch (error) {
      throw new Error(`Error al actualizar trabajador: ${error.message}`);
    }
  }

  /**
   * Eliminar trabajador
   * @param {string} id - ID del trabajador
   * @returns {Promise<Object>} Trabajador eliminado
   */
  static async eliminar(id) {
    try {
      const trabajador = await prisma.trabajador.delete({
        where: { id }
      });
      
      return trabajador;
    } catch (error) {
      throw new Error(`Error al eliminar trabajador: ${error.message}`);
    }
  }
}

module.exports = Trabajador;
