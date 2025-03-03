/* Convert number at come in to ID such as "123456789" to "123-456-789" */
function FormateID (value) {

    value = value.replace(/\D/g, '');
    const formattedID = value.replace(/(\d{3})(\d{3})(\d{4})/, '$1-$2-$3');
  
    return formattedID;
}

export default FormateID;