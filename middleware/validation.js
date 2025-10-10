/**
 * Middleware de validación para el registro de trabajadores
 */
const validateWorkerRegistration = (req, res, next) => {
  const {
    firstName,
    lastName1,
    phoneNumber,
    documentType,
    documentNumber,
    email,
    password,
    confirmPassword
  } = req.body;

  const errors = [];

  // Validar campos obligatorios
  if (!firstName || firstName.trim().length === 0) {
    errors.push('El nombre es obligatorio');
  }

  if (!lastName1 || lastName1.trim().length === 0) {
    errors.push('El primer apellido es obligatorio');
  }

  if (!phoneNumber || phoneNumber.trim().length === 0) {
    errors.push('El número de teléfono es obligatorio');
  }

  if (!documentType || documentType.trim().length === 0) {
    errors.push('El tipo de documento es obligatorio');
  }

  if (!documentNumber || documentNumber.trim().length === 0) {
    errors.push('El número de documento es obligatorio');
  }

  if (!email || email.trim().length === 0) {
    errors.push('El email es obligatorio');
  }

  if (!password || password.trim().length === 0) {
    errors.push('La contraseña es obligatoria');
  }

  // Validar formato de email
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (email && !emailRegex.test(email)) {
    errors.push('El formato del email no es válido');
  }

  // Validar longitud de contraseña
  if (password && password.length < 6) {
    errors.push('La contraseña debe tener al menos 6 caracteres');
  }

  // Validar que las contraseñas coincidan
  if (password && confirmPassword && password !== confirmPassword) {
    errors.push('Las contraseñas no coinciden');
  }

  // Validar formato de teléfono (básico)
  const phoneRegex = /^[0-9+\-\s()]+$/;
  if (phoneNumber && !phoneRegex.test(phoneNumber)) {
    errors.push('El formato del teléfono no es válido');
  }

  // Validar tipo de documento
  const validDocumentTypes = ['ti', 'cc', 'ce', 'passport'];
  if (documentType && !validDocumentTypes.includes(documentType)) {
    errors.push('El tipo de documento no es válido');
  }

  if (errors.length > 0) {
    return res.status(400).json({
      success: false,
      message: 'Errores de validación',
      errors
    });
  }

  next();
};

/**
 * Middleware de validación para el login
 */
const validateLogin = (req, res, next) => {
  const { email, password } = req.body;

  const errors = [];

  if (!email || email.trim().length === 0) {
    errors.push('El email es obligatorio');
  }

  if (!password || password.trim().length === 0) {
    errors.push('La contraseña es obligatoria');
  }

  // Validar formato de email
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (email && !emailRegex.test(email)) {
    errors.push('El formato del email no es válido');
  }

  if (errors.length > 0) {
    return res.status(400).json({
      success: false,
      message: 'Errores de validación',
      errors
    });
  }

  next();
};

module.exports = {
  validateWorkerRegistration,
  validateLogin
};
