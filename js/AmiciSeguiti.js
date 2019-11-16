
//VARIABILI PER LA mappa
var map;
var markers=[];
var infowindow;
var u = [];



//AMICO SINGOLO
function Friend(nome, msg, lat, lon){
  this.nome=nome;
  this.msg=msg;
  this.lat=lat;
  this.lon=lon;
}

Friend.prototype.toString = function(){
  var distanza=calcolaDistanza(localStorage.lat,localStorage.lon,this.lat,this.lon);

  if(distanza<1){
    distanza=distanza*1000;
    distanza=Math.round(distanza);
    distanza=distanza+" m";
  }else{
    distanza=distanza.toFixed(2);
    distanza=distanza+" Km";
  }

  return "<h4 class='list-group-item-heading'>"+this.nome+"</h4> <p class='list-group-item-text'>Messaggio: "+this.msg+"</p> <p class='list-group-item-text'>Distanza:"+distanza+"</p>";
}

//FRIENDLIST
function FriendList(){
  this.lista=[];
}

FriendList.prototype.addFriend = function(utente){
  this.lista.push(utente);
}

FriendList.prototype.readList = function(){
  return this.lista;
}

FriendList.prototype.clear = function(){
  this.lista= [];
}

//ADAPTER
function GenericAdapter(array,div){
  this.array=array;
  this.div=div;
}

GenericAdapter.prototype.generateListElement= function(object){

  return "<a href='#' class='list-group-item'>"+object.toString()+"</a>";
}

GenericAdapter.prototype.refresh= function(){
  this.div.append("<ul>");

  for(var i=0;i<this.array.readList().length;i++){
    //alert(this.array.readList()[i]);
    this.div.append(this.generateListElement(this.array.readList()[i]));
  }

  this.div.append("</ul>");
}

FriendList.prototype.sort = function(){
  var listaDistanza = [];
  for(var i=0;i<this.lista.length;i++){
    listaDistanza.push(calcolaDistanza(localStorage.lat, localStorage.lon, this.lista[i].lat, this.lista[i].lon));
  }
  var liste=sorting(this.lista,listaDistanza);
  this.lista=liste[0];
  listaDistanza=liste[1];
}


//Metodo per calcolare la distanza tra due punti (mediante latitudine e longitudine di ognuno dei due punti)
//p.s: lat1 e lon1 sono la nostra posizione attuale
function calcolaDistanza(lat1,lon1,lat2,lon2){

  var distanza;
  var radlat1 = Math.PI * lat1/180;
	var radlat2 = Math.PI * lat2/180;
	var theta = lon1-lon2;
	var radtheta = Math.PI * theta/180;
	var dist = Math.sin(radlat1) * Math.sin(radlat2) + Math.cos(radlat1) * Math.cos(radlat2) * Math.cos(radtheta);
	dist = Math.acos(dist);
	dist = dist * 180/Math.PI;
	dist = dist * 60 * 1.1515;
	dist = dist * 1.609344;

  return dist;
}

//fa il sorting degli amici in base alla distanza
function sorting(lista,listaD){
  var liste=[];
  var temp;
  for(var i=0;i<lista.length;i++){
    for(var j=i;j<lista.length;j++){
      if(listaD[i]>listaD[j]){
        //alert(listaD[i]+" è maggiore di "+listaD[j]);
        //riordinamento lista normale
        temp=lista[i];
        lista[i]=lista[j];
        lista[j]=temp;

        //riordinamento lista distanze
        temp=listaD[i];
        listaD[i]=listaD[j];
        listaD[j]=temp;
      }
    }
  }
  liste.push(lista);
  liste.push(listaD);

  return liste;
}

var list=new FriendList();

function lista(){

  //Stampa la navbar
  seeNav();
  menu();
  document.getElementById("lista").style.display = "none";

  //Auto.click su Lista appena la funzione lista viene richiamata.
  jQuery(function(){
    jQuery('#lista').click();
  });

  /*
  Click sul pulsante lista
  */
  $("#lista").click(function(){


    //Calcolo posizione
    var latitudine;
    var longitudine;

    var options = { enableHighAccuracy: true};

    function success(position){

      latitudine=position.coords.latitude;
      longitudine=position.coords.longitude;

      //se esistono lat e lon stampa la lista
      if(latitudine!=undefined && longitudine!=undefined && localStorage.check){

        localStorage.lat=latitudine;
        localStorage.lon=longitudine;

        location.reload();
      }
    }

    function error(err){
      navigator.notification.alert("Abilita il GPS", null, "");
    }

    //Cancello tutto quello presente dentro al div della mappa
    var mappaDiv=$("#googleMap");
    mappaDiv.html("");

    var list=new FriendList();

    var xhttp = new XMLHttpRequest();
      xhttp.onreadystatechange=function() {
        if (this.readyState == 4 && this.status == 200) {
          list=new FriendList();
          var listaUtenti=JSON.parse(this.responseText);

          //Lista dei nomi degli utenti che in seguito mi servirà per salvarlo nel localStorage.
          var lista_Username=[];

          for(var i=0;i<listaUtenti.followed.length;i++){
            lista_Username.push(listaUtenti.followed[i].username);
            if(listaUtenti.followed[i].msg!=null){
              list.addFriend(new Friend(listaUtenti.followed[i].username, listaUtenti.followed[i].msg, listaUtenti.followed[i].lat, listaUtenti.followed[i].lon));
            }
          }

          //Inserisco la lista nel localStorage perchè mi servirà per prevenire l'aggiunta di amici già stati aggiunti.
          localStorage.setItem("lista_Amici", JSON.stringify(lista_Username));

          //Variabile che mi serve per sincronizzare la chiamata e il listener della posizione
          localStorage.check=true;

          list.sort();
          var listDiv=$("#stampa");
          listDiv.html("<p></p>");

          if((typeof localStorage.lat!=='undefined' && typeof localStorage.lon!=='undefined') && (localStorage.lat!==null && localStorage.lon!==null)){
            var adapter= new GenericAdapter(list,listDiv);
            adapter.refresh();
          }else{
            listDiv.append("<p>Attivare il GPS e inserire posizione</p>");
          }

        }
      };
    xhttp.open("GET", "https://ewserver.di.unimi.it/mobicomp/geopost/followed?session_id="+localStorage.getItem('session_id'), true);
    xhttp.send();

    navigator.geolocation.watchPosition(success,error,options);

    //nascondi bottone lista, vedi bottone mappa
    document.getElementById("lista").style.display = "none";
    document.getElementById("mappa").style.display = "block";
  });


  /*
  Click del pulsante mappa
  */
  $("#mappa").click(function(){

    //Elimna tutto quello contenuto nel div lista
    var mappaDiv=$("#stampa");
    mappaDiv.html("");

    initMap();

    function initMap() {
        var Utente= function(nome,messaggio,lat,lon){
          this.nome=nome;
          this.msg=messaggio;
          this.lat=lat;
          this.lon=lon;
        }

        u = [];
        markers = [];

        var xhttp = new XMLHttpRequest();
          xhttp.onreadystatechange=function() {
            if (this.readyState == 4 && this.status == 200) {
              var list=new FriendList();
              var listaUtenti=JSON.parse(this.responseText);
              for(var i=0;i<listaUtenti.followed.length;i++){
                if(listaUtenti.followed[i].msg != null){
                  u.push(new Utente(listaUtenti.followed[i].username, listaUtenti.followed[i].msg, listaUtenti.followed[i].lat, listaUtenti.followed[i].lon));
                }
              }
              createMap();
            }
          };
        xhttp.open("GET", "https://ewserver.di.unimi.it/mobicomp/geopost/followed?session_id="+localStorage.getItem('session_id'), true);
        xhttp.onerror = function(){
          navigator.notification.alert("Errore di connessione", null, " ");
        }
        xhttp.send();

        //nascondi bottone mappa, vedi bottone lista
        document.getElementById("mappa").style.display = "none";
        document.getElementById("lista").style.display = "block";

        function createMap(){
          var map = new google.maps.Map(document.getElementById('googleMap'), {
            center: new google.maps.LatLng(0, 0),
    	      minZoom: 1
          });

          for(var i=0;i<u.length;i++){

            var myLatLng = {lat: parseFloat(u[i].lat), lng: parseFloat(u[i].lon)};


            markers.push(new google.maps.Marker({
              position: myLatLng,
              map: map,
              title: u[i].nome
            }));
          }

          //Creo l'oggetto infowindow
          infowindow=new google.maps.InfoWindow();

          for(var i=0;i<u.length;i++){
            addMarkerListener(i);
          }

          var bounds = new google.maps.LatLngBounds();
          for (var i = 0; i < markers.length; i++) {
           bounds.extend(markers[i].getPosition());
          }
          map.fitBounds(bounds);
        }
    }

    function addMarkerListener(i) {
      markers[i].addListener( 'click', function() {
           infowindow.setContent("<h5>"+markers[i].title+"</h5>\n<p>"+u[i].msg+"</p>");
           infowindow.open(map, markers[i]);
       });
    }


  });
}
