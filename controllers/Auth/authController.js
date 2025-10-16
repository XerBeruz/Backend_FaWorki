const { Usuario, Trabajador, Certificado } = require('../../models');

class AuthController {
  /**
   * Registrar un nuevo trabajador
   * @param {Object} req - Request object
   * @param {Object} res - Response object
   */
  static async registrarTrabajador(req, res) {
    try {
      const {
        // Datos personales
        firstName,
        lastName1,
        lastName2,
        phoneNumber,
        documentType,
        documentNumber,
        // Datos de cuenta
        email,
        password,
        confirmPassword,
        // Documentos (opcional)
        documents = []
      } = req.body;

      // Validaciones básicas
      if (!firstName || !lastName1 || !phoneNumber || !documentType || !documentNumber || !email || !password) {
        return res.status(400).json({
          success: false,
          message: 'Todos los campos obligatorios deben ser completados',
          requiredFields: ['firstName', 'lastName1', 'phoneNumber', 'documentType', 'documentNumber', 'email', 'password']
        });
      }

      if (password !== confirmPassword) {
        return res.status(400).json({
          success: false,
          message: 'Las contraseñas no coinciden'
        });
      }

      // Verificar si el email ya existe
      const emailExiste = await Usuario.emailExiste(email);
      if (emailExiste) {
        return res.status(409).json({
          success: false,
          message: 'El email ya está registrado'
        });
      }

      // Verificar si el documento ya existe
      const documentoExiste = await Usuario.documentoExiste(documentNumber);
      if (documentoExiste) {
        return res.status(409).json({
          success: false,
          message: 'El número de documento ya está registrado'
        });
      }

      // Crear usuario
      const usuarioData = {
        email,
        password,
        nombre: firstName,
        apellido1: lastName1,
        apellido2: lastName2 || null,
        telefono: phoneNumber,
        tipoDocumento: documentType,
        numeroDocumento: documentNumber
      };

      const usuario = await Usuario.crear(usuarioData);

      // Crear trabajador
      const trabajador = await Trabajador.crear(usuario.id);

      // Procesar documentos si existen
      let certificados = [];
      if (documents && documents.length > 0) {
        const certificadosData = documents.map(doc => ({
          nombreArchivo: doc.name || doc.filename || 'documento.pdf',
          archivoUrl: doc.url || doc.path || ''
        }));

        certificados = await Certificado.crearMultiples(trabajador.id, certificadosData);
      }

      // Respuesta exitosa
      res.status(201).json({
        success: true,
        message: 'Trabajador registrado exitosamente. Su cuenta está siendo validada.',
        data: {
          usuario: {
            id: usuario.id,
            email: usuario.email,
            nombre: usuario.nombre,
            apellido1: usuario.apellido1,
            apellido2: usuario.apellido2,
            telefono: usuario.telefono,
            tipoDocumento: usuario.tipoDocumento,
            numeroDocumento: usuario.numeroDocumento,
            createdAt: usuario.createdAt
          },
          trabajador: {
            id: trabajador.id,
            estado: trabajador.estado,
            createdAt: trabajador.createdAt
          },
          certificados: certificados.map(cert => ({
            id: cert.id,
            nombreArchivo: cert.nombreArchivo,
            archivoUrl: cert.archivoUrl,
            createdAt: cert.createdAt
          }))
        }
      });

    } catch (error) {
      console.error('Error en registro de trabajador:', error);
      res.status(500).json({
        success: false,
        message: 'Error interno del servidor',
        error: process.env.NODE_ENV === 'development' ? error.message : 'Error al procesar el registro'
      });
    }
  }

  /**
   * Iniciar sesión
   * @param {Object} req - Request object
   * @param {Object} res - Response object
   */
  static async iniciarSesion(req, res) {
    try {
      const { email, password } = req.body;

      if (!email || !password) {
        return res.status(400).json({
          success: false,
          message: 'Email y contraseña son requeridos'
        });
      }

      // Buscar usuario
      const usuario = await Usuario.buscarPorEmail(email);
      if (!usuario) {
        return res.status(401).json({
          success: false,
          message: 'Credenciales inválidas'
        });
      }

      // Verificar contraseña
      const passwordValida = await Usuario.verificarPassword(password, usuario.password);
      if (!passwordValida) {
        return res.status(401).json({
          success: false,
          message: 'Credenciales inválidas'
        });
      }

      // Verificar estado del trabajador si existe
      if (usuario.trabajador && usuario.trabajador.estado === 'pending') {
        return res.status(202).json({
          success: true,
          message: 'Cuenta en proceso de validación',
          data: {
            usuario: {
              id: usuario.id,
              email: usuario.email,
              nombre: usuario.nombre,
              apellido1: usuario.apellido1,
              apellido2: usuario.apellido2,
              telefono: usuario.telefono,
              tipoDocumento: usuario.tipoDocumento,
              numeroDocumento: usuario.numeroDocumento,
              createdAt: usuario.createdAt
            },
            trabajador: {
              id: usuario.trabajador.id,
              estado: usuario.trabajador.estado,
              certificados: usuario.trabajador.certificados
            },
            requiresValidation: true
          }
        });
      }

      // Respuesta exitosa para trabajadores aprobados
      res.json({
        success: true,
        message: 'Inicio de sesión exitoso',
        data: {
          usuario: {
            id: usuario.id,
            email: usuario.email,
            nombre: usuario.nombre,
            apellido1: usuario.apellido1,
            apellido2: usuario.apellido2,
            telefono: usuario.telefono,
            tipoDocumento: usuario.tipoDocumento,
            numeroDocumento: usuario.numeroDocumento,
            createdAt: usuario.createdAt
          },
          trabajador: usuario.trabajador ? {
            id: usuario.trabajador.id,
            estado: usuario.trabajador.estado,
            certificados: usuario.trabajador.certificados
          } : null
        }
      });

    } catch (error) {
      console.error('Error en inicio de sesión:', error);
      res.status(500).json({
        success: false,
        message: 'Error interno del servidor',
        error: process.env.NODE_ENV === 'development' ? error.message : 'Error al procesar el inicio de sesión'
      });
    }
  }

  /**
   * Obtener perfil del usuario autenticado
   * @param {Object} req - Request object
   * @param {Object} res - Response object
   */
  static async obtenerPerfil(req, res) {
    try {
      const { userId } = req.params;

      const usuario = await Usuario.buscarPorId(userId);
      if (!usuario) {
        return res.status(404).json({
          success: false,
          message: 'Usuario no encontrado'
        });
      }

      res.json({
        success: true,
        data: {
          usuario: {
            id: usuario.id,
            email: usuario.email,
            nombre: usuario.nombre,
            apellido1: usuario.apellido1,
            apellido2: usuario.apellido2,
            telefono: usuario.telefono,
            tipoDocumento: usuario.tipoDocumento,
            numeroDocumento: usuario.numeroDocumento,
            createdAt: usuario.createdAt
          },
          trabajador: usuario.trabajador ? {
            id: usuario.trabajador.id,
            certificados: usuario.trabajador.certificados
          } : null
        }
      });

    } catch (error) {
      console.error('Error al obtener perfil:', error);
      res.status(500).json({
        success: false,
        message: 'Error interno del servidor',
        error: process.env.NODE_ENV === 'development' ? error.message : 'Error al obtener el perfil'
      });
    }
  }
}

module.exports = {
  registrarTrabajador: AuthController.registrarTrabajador,
  iniciarSesion: AuthController.iniciarSesion,
  obtenerPerfil: AuthController.obtenerPerfil
};

