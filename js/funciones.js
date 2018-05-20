//var wsUrl = "http://url.dominio/server.php?wsdl";//para probar de afuera.

var pictureSource;   // picture source
var destinationType; // sets the format of returned value
var latitud = '-33.4349083';
var longitud = '-70.6170132';
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
  navigator.geolocation.getCurrentPosition(geolocationSuccess, geolocationError);
  document.getElementById('largeImage').src='';
  clearCache();
  pictureSource=navigator.camera.PictureSourceType;
  destinationType=navigator.camera.DestinationType;
}
//______________________________________________________________________________
/*var geolocationSuccess (position) {
  var Latitude = position.coords.latitude;
  var Longitude = position.coords.longitude;
  var Altitude = position.coords.altitude;
  var Accuracy = position.coords.accuracy;
  var Altitude Accuracy = position.coords.altitudeAccuracy;
  var Heading = position.coords.heading;
  var Speed = position.coords.speed;
  var Timestamp = position.timestamp;

  document.getElementById("Latitud").value = Latitude;
  document.getElementById("Longitud").value = Longitude;
};
function geolocationError(error) {
  alert('code: '    + error.code    + '\n' +
        'message: ' + error.message + '\n');
}*/
//______________________________________________________________________________
function sendSMS(){
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
