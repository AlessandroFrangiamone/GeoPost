
function update(){

  seeNav();
  menu();
  if(localStorage.lat!=null && localStorage.lon!=null){
    $("#update").prop("disabled", false);
    $("#update").click(function(){
      var messaggio=document.getElementById("mex");
      var xhttp = new XMLHttpRequest();
        xhttp.onreadystatechange=function() {
            if (this.readyState == 4 && this.status == 200) {
                navigator.notification.alert("Messaggio Inviato", null, " ");
                $('#pagine').load('AmiciSeguiti.html',function(){
                  lista();
                });
            }
        };
      xhttp.open("GET", "https://ewserver.di.unimi.it/mobicomp/geopost/status_update?session_id="+localStorage.getItem('session_id')+"&message="+messaggio.value+"&lat="+localStorage.lat+"&lon="+localStorage.lon, true);
      xhttp.onerror = function(){
        navigator.notification.alert("Errore di connessione", null, " ");
      }
      xhttp.send();
    });
  }else{
    navigator.notification.alert("Il GPS non ha fornito la posizione, non è possibile inviare messaggi", null, "Errore");
    $("#update").prop("disabled", true);
  }
}
