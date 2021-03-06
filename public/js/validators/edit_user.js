function validateForm() {
  // Clear back-end errors
  var dni = document.getElementById("error_message");
  if (dni) dni.remove();
  // Check front-end errors
  var errors = 0;
  errors += validateDNI();
  return errors == 0;
}

function validateDNI() {
  var dni = document.getElementById("dni").value;
  var dni_dic = "TRWAGMYFPDXBNJZSQVHLCKE";
  var error = 0;
  if (dni.length != 9) {
    error = 1;
    document.getElementById("dni_error").innerHTML = "El dni es incorrecto";
  } else {
    var dni_numbers = parseInt(dni, 10);
    if (dni_dic[dni_numbers % 23] != dni.slice(8)) {
      console.log(dni_dic[dni_numbers % 23]);
      error = 1;
      document.getElementById("dni_error").innerHTML = "El dni es incorrecto";
    }
  }

  if (error == 0) document.getElementById("dni_error").innerHTML = null;

  return error;
}

