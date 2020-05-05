function validateForm() {
  var errors = 0;

  var dni = document.getElementById("dni").value;
  var dni_dic = "TRWAGMYFPDXBNJZSQVHLCKE";
  if (dni.length != 9) {
    errors++;
    document.getElementById("dni_error").innerHTML = "El dni es incorrecto a";
  } else {
    var dni_numbers = parseInt(dni, 10);
    if (dni_dic[dni_numbers % 23] != dni.slice(8)) {
      console.log(dni_dic[dni_numbers % 23]);
      errors++;
      document.getElementById("dni_error").innerHTML = "El dni es incorrecto b";
    }
  }
  return errors == 0;
}
