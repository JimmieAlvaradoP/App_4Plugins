//var wsUrl = "http://url.dominio/server.php?wsdl";//para probar de afuera.

var pictureSource;   // picture source
var destinationType; // sets the format of returned value
//var Latitud = '-33.4349083';
//var Longitud = '-70.6170132';
var Latitud;
var Longitud;
document.addEventListener("deviceready", onDeviceReady, false);
//______________________________________________________________________________
function showAlert(msj){
  navigator.notification.alert(
    msj,  // message
    'UNAB',   // title
    ''    // buttonName
  );
}//fin function mensaje.

// PhoneGap is ready
function onDeviceReady(){
  if (! SMS ) { alert( 'SMS plugin not ready' ); return; } //SMS
  console.log("navigator.geolocation esta trabajando correctamente");
  navigator.geolocation.getCurrentPosition(onSuccess, onError);
  document.getElementById('largeImage').src='';
  clearCache();
  pictureSource=navigator.camera.PictureSourceType;
  destinationType=navigator.camera.DestinationType;
}
//______________________________________________________________________________
/*var onSuccess (position) {
  Latitude = position.coords.latitude;
  Longitude = position.coords.longitude;
  Altitude = position.coords.altitude;
  Accuracy = position.coords.accuracy;
  Altitude Accuracy = position.coords.altitudeAccuracy;
  Heading = position.coords.heading;
  Speed = position.coords.speed;
  Timestamp = position.timestamp;

  Latitud = document.getElementById("Latitude").value;
  Longitud = document.getElementById("Longitude").value;
};
function onError(error) {
  alert('code: '    + error.code    + '\n' +
        'message: ' + error.message + '\n');
}*/
//______________________________________________________________________________
function sendSMS(){
  var onSuccess (position) {
    Latitude = position.coords.latitude;
    Longitude = position.coords.longitude;
    Altitude = position.coords.altitude;
    Accuracy = position.coords.accuracy;
    Altitude Accuracy = position.coords.altitudeAccuracy;
    Heading = position.coords.heading;
    Speed = position.coords.speed;
    Timestamp = position.timestamp;

    Latitud = document.getElementById("Latitude").value;
    Longitud = document.getElementById("Longitude").value;
  };
  function onError(error) {
    alert('code: '    + error.code    + '\n' +
          'message: ' + error.message + '\n');
  }
  var fono=document.getElementById('fono').value;
  var mensajetexto=document.getElementById('mensajetexto').value;
  if(fono==''){
    showAlert('¡Debe Ingresar un numero de telefono!');
  }
  else{
    if(mensajetexto==""){
      showAlert('¡Ingrese un texto como mensaje!');
    }
    else{
      var textoURl = "y no tengo GPS Activado,";
      if(Latitud != 0){
        textoURl = "https://www.google.com/maps?q="+Latitud+","+Longitud;
      }
      if (SMS){
        SMS.sendSMS(fono, mensajetexto + textoURl, function () { showAlert('¡Mensaje enviado!');}, function (e) { showAlert('Message Failed:' + e);});
      }
    }
  }
}
//______________________________________________________________________________
function clearCache(){
  navigator.camera.cleanup();
}

function getImage(source){
  // Retrieve image file location from specified source
  navigator.camera.getPicture(uploadPhoto, onFail, { quality: 50,
  destinationType: Camera.DestinationType.DATA_URL, sourceType: source});	//destinationType: navigator.camera.DestinationType.FILE_URI
}

function onFail(message){
  clearCache();
  //alert('Captura Descartada.');
  showAlert('Captura Descartada.'+ message);
}

function uploadPhoto(imageURI){
  var largeImage = document.getElementById('largeImage');
  largeImage.style.display = 'block';
  largeImage.src ="data:image/jpeg;base64," + imageURI;
}


function enviaFoto(){
  var user=document.getElementById('user').value;
  //var foto=document.getElementById('largeImage');
  var fotoSrc=document.getElementById('largeImage').src;

  if(user=='' || fotoSrc==''){
    showAlert('Debe Ingresar los valores!');
  }
  else{
  //var fotoCod=encodeImageFileAsURL(foto);
  $.ajax({
    cache: false,
    type: "POST", // puede ser GET, POST
    dataType: "html", // Tipo de retorno
    url: "http://72.14.183.67/ws/foto.php", // pagina php que recibe la llamada
    data: {// datos, ej: $_POST['data']
      user:user,
      foto:fotoSrc
    },
    /*beforeSend: function(){
    document.getElementById('divCargando').style.display="block";
    $("#labelCargando").html('Cargando...');
    },*/
    // acciones cuando me retorna algo el PHP
    success: function(msg){
      console.log(msg);
      if(msg=='1'){
        showAlert('Ha ocurrido un Error. Archivo ya existe!');
      }
      else{
        showAlert('Foto Subida!.');
      }
    },
    // acciones cuando hay error en comunicacion el el php
    error: function(xhr, status,msg2 ){
      //alert('4');
      console.log(xhr);
    }
  });//fin ajax
  }
}
