const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcrypt');
const { prisma } = require('../../config/database');

class Usuario {
  /**
   * Crear un nuevo usuario
   * @param {Object} userData - Datos del usuario
   * @returns {Promise<Object>} Usuario creado
   */
  static async crear(userData) {
    try {
      const { password, ...otherData } = userData;
      
      // Encriptar contraseña
      const hashedPassword = await bcrypt.hash(password, 10);
      
      const usuario = await prisma.usuario.create({
        data: {
          ...otherData,
          password: hashedPassword
        }
      });
      
      return usuario;
    } catch (error) {
      throw new Error(`Error al crear usuario: ${error.message}`);
    }
  }

  /**
   * Buscar usuario por email
   * @param {string} email - Email del usuario
   * @returns {Promise<Object|null>} Usuario encontrado o null
   */
  static async buscarPorEmail(email) {
    try {
      const usuario = await prisma.usuario.findUnique({
        where: { email },
        include: {
          trabajador: {
            include: {
              certificados: true
            }
          }
        }
      });
      
      return usuario;
    } catch (error) {
      throw new Error(`Error al buscar usuario: ${error.message}`);
    }
  }

  /**
   * Buscar usuario por ID
   * @param {string} id - ID del usuario
   * @returns {Promise<Object|null>} Usuario encontrado o null
   */
  static async buscarPorId(id) {
    try {
      const usuario = await prisma.usuario.findUnique({
        where: { id },
        include: {
          trabajador: {
            include: {
              certificados: true
            }
          }
        }
      });
      
      return usuario;
    } catch (error) {
      throw new Error(`Error al buscar usuario: ${error.message}`);
    }
  }

  /**
   * Verificar si el email ya existe
   * @param {string} email - Email a verificar
   * @returns {Promise<boolean>} True si existe, false si no
   */
  static async emailExiste(email) {
    try {
      const usuario = await prisma.usuario.findUnique({
        where: { email },
        select: { id: true }
      });
      
      return !!usuario;
    } catch (error) {
      throw new Error(`Error al verificar email: ${error.message}`);
    }
  }

  /**
   * Verificar si el número de documento ya existe
   * @param {string} numeroDocumento - Número de documento a verificar
   * @returns {Promise<boolean>} True si existe, false si no
   */
  static async documentoExiste(numeroDocumento) {
    try {
      const usuario = await prisma.usuario.findUnique({
        where: { numeroDocumento },
        select: { id: true }
      });
      
      return !!usuario;
    } catch (error) {
      throw new Error(`Error al verificar documento: ${error.message}`);
    }
  }

  /**
   * Verificar contraseña
   * @param {string} password - Contraseña en texto plano
   * @param {string} hashedPassword - Contraseña encriptada
   * @returns {Promise<boolean>} True si coincide, false si no
   */
  static async verificarPassword(password, hashedPassword) {
    try {
      return await bcrypt.compare(password, hashedPassword);
    } catch (error) {
      throw new Error(`Error al verificar contraseña: ${error.message}`);
    }
  }

  /**
   * Actualizar usuario
   * @param {string} id - ID del usuario
   * @param {Object} updateData - Datos a actualizar
   * @returns {Promise<Object>} Usuario actualizado
   */
  static async actualizar(id, updateData) {
    try {
      const { password, ...otherData } = updateData;
      
      let data = { ...otherData };
      
      // Si se está actualizando la contraseña, encriptarla
      if (password) {
        data.password = await bcrypt.hash(password, 10);
      }
      
      const usuario = await prisma.usuario.update({
        where: { id },
        data
      });
      
      return usuario;
    } catch (error) {
      throw new Error(`Error al actualizar usuario: ${error.message}`);
    }
  }

  /**
   * Eliminar usuario
   * @param {string} id - ID del usuario
   * @returns {Promise<Object>} Usuario eliminado
   */
  static async eliminar(id) {
    try {
      const usuario = await prisma.usuario.delete({
        where: { id }
      });
      
      return usuario;
    } catch (error) {
      throw new Error(`Error al eliminar usuario: ${error.message}`);
    }
  }
}

module.exports = Usuario;
