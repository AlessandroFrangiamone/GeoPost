
function login(){
  //Elimina il menu
  document.getElementById('menu').innerHTML="";

  if(localStorage.session_id!="null" && localStorage.getItem("session_id")!=null){
    $('#pagine').load('AmiciSeguiti.html',function(){
      lista();
    });
  }

  $("#invio").click(function(){

    $.ajax({
        type: "POST",
        url: 'https://ewserver.di.unimi.it/mobicomp/geopost/login',
        data: {
            "username": document.getElementById('Username').value,
            "password": document.getElementById('Password').value
          },
        success: function(result){
          localStorage.nome_Utente=document.getElementById('Username').value;
          localStorage.session_id=String(result);
          localStorage.login=true;
          $('#pagine').load('AmiciSeguiti.html',function(){
            lista();
          });
        },
        error: function(xhr,ajaxOptions, thrownError){
          switch(xhr.status){
            case 400:
              navigator.notification.alert("Username o passoword non corrette", null, "Errore");
              break;
            default:
              navigator.notification.alert("Errore connessione", null, "Errore");
              break;
          }
        }
    });
  });
}
