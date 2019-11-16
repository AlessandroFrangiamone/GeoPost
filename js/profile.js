
  function ultimoMex(){

    seeNav();
    menu();

    var lat;
    var lon;
    var username;
    var msg;


    var xhttp = new XMLHttpRequest();
      xhttp.onreadystatechange=function() {
        if (this.readyState == 4 && this.status == 200) {
            var risposta=JSON.parse(this.responseText);

            if(risposta.lat!=null){
              lat=risposta.lat;
              lon=risposta.lon;
              username=risposta.username;
              msg=risposta.msg;
              mostraMappa();
            }
            document.getElementById("nome").innerHTML="<h4>"+risposta.username+"</h4>";
            if(risposta.msg!=null){
              document.getElementById("ultimo_mex").innerHTML="<p>"+risposta.msg+"</p>";
            }else{
              document.getElementById("ultimo_mex").innerHTML="<p>Non hai ancora inserito alcun messaggio.</p>";
            }
        }
      };
    xhttp.open("GET", "https://ewserver.di.unimi.it/mobicomp/geopost/profile?session_id="+localStorage.getItem('session_id'), true);
    xhttp.send();


    function mostraMappa(){
      var map, infoWindow;
      var markers;
      var myLatLng = {lat: parseFloat(lat), lng: parseFloat(lon)};
      map = new google.maps.Map(document.getElementById('mappaProfilo'), {
        center: myLatLng,
        zoom: 12
      });

        var marker = new google.maps.Marker({
          position: new google.maps.LatLng(lat, lon),
          map: map,
          title: username
        });

        //Creo l'oggetto infowindow
        var infowindow=new google.maps.InfoWindow();

        marker.addListener( 'click', function() {
             infowindow.setContent("<h5>"+username+"</h5>\n<p>"+msg+"</p>");
             infowindow.open(map, marker);
        });
    }

    $("#logout").click(function(){
      var xhttp = new XMLHttpRequest();
        xhttp.onreadystatechange=function() {
          if (this.readyState == 4 && this.status == 200) {
            localStorage.clear();
            list=new FriendList();
            $('#pagine').load('login.html',function(){
              login();
            });
          }
        };
      xhttp.open("GET", "https://ewserver.di.unimi.it/mobicomp/geopost/logout?session_id="+localStorage.getItem('session_id'), true);
      xhttp.onerror = function(){
        navigator.notification.alert("Errore di connessione", null, " ");
      }
      xhttp.send();
    });

  }
