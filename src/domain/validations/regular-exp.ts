export const regularExps = {

    // Email
    email: /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/,

    // Password
    password: /^(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*._])[A-Za-z0-9!@#$%^&*._]{6,}$/,

    // Número documento
    document: /^[0-9]+$/,

    // Nombres/Apellidos
    names: /^[a-zA-ZñÑáéíóúÁÉÍÓÚ\s]+$/,

}