export const validarAdmin = (email, password) => {
    const emailCorrecto = 'admin@gmail.com';
    const passwordCorrecto = '52838097';
  
    return email === emailCorrecto && password === passwordCorrecto;
  };
  