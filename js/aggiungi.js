function aggiungi(){

  seeNav();
  menu();

  var input=document.getElementById("nome");
  var awesomplete = new Awesomplete(input, {
            minChars: 1,
            maxItems: 10,
            autoFirst: true
  });

  //Disabilita il bottone aggiungi se non è presente testo al suo interno
  if(input.value==""){
    $("#add").prop("disabled", true);
  }

  document.getElementById("nome").addEventListener("input", callAutoComplete);

  $("#add").click(function(){
    addFriend(document.getElementById("nome").value);
  });

  function callAutoComplete() {
    //  alert("The value of the input field was changed.");

      var xhttp = new XMLHttpRequest();
        xhttp.onreadystatechange=function() {
          if (this.readyState == 4 && this.status == 200) {
            var listaUtenti=JSON.parse(this.responseText);

            //Previene l'aggiunta di amici già aggiunti e l'aggiunta di sè stesso
            var lista_amici=JSON.parse(localStorage.getItem("lista_Amici"));

            //se hai almeno un amico
            if(lista_amici.length>0){
              for(var i=0;i<lista_amici.length;i++){
                for(var j=0;j<listaUtenti.usernames.length;j++){

                  //Cancella dalla lista gli amici già aggiunti
                  if(lista_amici[i] == listaUtenti.usernames[j]){
                    listaUtenti.usernames.splice(j,1);
                  }

                  //Cancella dalla lista l'utente stesso
                  if(localStorage.nome_Utente == listaUtenti.usernames[j]){
                    var index=listaUtenti.usernames.indexOf(listaUtenti.usernames[j]);
                    listaUtenti.usernames.splice(j,1);
                  }
                }
              }
              //else se non hai ancora amici
            }else{
              for(var j=0;j<listaUtenti.usernames.length;j++){
                //Cancella dalla lista l'utente stesso
                if(localStorage.nome_Utente == listaUtenti.usernames[j]){
                  var index=listaUtenti.usernames.indexOf(listaUtenti.usernames[j]);
                  listaUtenti.usernames.splice(j,1);
                }
              }
            }

            //disattiva/attiva il bottone aggiungi amico
            if(listaUtenti.usernames.length==0){
              $("#add").prop("disabled", true);
            }else{
              $("#add").prop("disabled", false);
            }

            awesomplete.list = listaUtenti.usernames;
          }
        };
      xhttp.open("GET", "https://ewserver.di.unimi.it/mobicomp/geopost/users?session_id="+localStorage.getItem('session_id')+"&usernamestart="+input.value+"&limit=10", true);
      xhttp.send();
  }

  function addFriend(nome){
    var xhttp = new XMLHttpRequest();
      xhttp.onreadystatechange=function() {
        if(this.readyState == 4 ){
          if (this.status == 200) {
            navigator.notification.alert("Amico Aggiunto!", null, " ");
            $('#pagine').load('AmiciSeguiti.html',function(){
              lista();
            });
          }else{
            //Estrapola l'errore e lo mostra in un alert
            if(this.status == 400 || this.status == 404 || this.status == 401)
              navigator.notification.alert(this.responseText, null, "Errore");
          }
        }
      };
    xhttp.open("GET", "https://ewserver.di.unimi.it/mobicomp/geopost/follow?session_id="+localStorage.getItem('session_id')+"&username="+nome, true);
    xhttp.send();
  }
}
