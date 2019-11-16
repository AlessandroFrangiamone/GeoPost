/*
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */
var app = {
    // Application Constructor
    initialize: function() {
        this.bindEvents();
    },
    // Bind Event Listeners
    //
    // Bind any events that are required on startup. Common events are:
    // 'load', 'deviceready', 'offline', and 'online'.
    bindEvents: function() {
        document.addEventListener('deviceready', this.onDeviceReady, false);
    },
    // deviceready Event Handler
    //
    // The scope of 'this' is the event. In order to call the 'receivedEvent'
    // function, we must explicitly call 'app.receivedEvent(...);'
    onDeviceReady: function() {
        app.receivedEvent('deviceready');

        /*visualizzo un messaggio nel caso in cui l'utente non sia connesso alla rete*/
        document.addEventListener("offline", function(){
          navigator.notification.alert("Non sei connesso a nessuna rete", null, "Errore");
        }, false);

        $('#pagine').load('login.html',function(){
          //localStorage.login=false;
          login();
        });

    },
    // Update DOM on a Received Event
    receivedEvent: function(id) {
        var parentElement = document.getElementById(id);
        var listeningElement = parentElement.querySelector('.listening');
        var receivedElement = parentElement.querySelector('.received');

        listeningElement.setAttribute('style', 'display:none;');
        receivedElement.setAttribute('style', 'display:block;');

        console.log('Received Event: ' + id);
    }
};

function seeNav(){

  //Aggiunto navbar-fixed-top per fissare la navbar in alto
  document.getElementById('menu').innerHTML='<nav class="navbar navbar-default navbar-fixed-top">'
    +'<div class="container-fluid">'
    +'<!-- Brand and toggle get grouped for better mobile display -->'
      +'<div class="navbar-header">'
         +'<button type="button" class="navbar-toggle collapsed" data-toggle="collapse" data-target="#bs-example-navbar-collapse-1" aria-expanded="false">'
         +'<span class="sr-only">Toggle navigation</span>'
         +'<span class="icon-bar"></span>'
         +'<span class="icon-bar"></span>'
         +'<span class="icon-bar"></span>'
         +'</button>'
         +'<a class="navbar-brand">GeoPost</a>'
      +'</div>'

      +'<!-- Collect the nav links, forms, and other content for toggling -->'
      +'<div class="collapse navbar-collapse" id="bs-example-navbar-collapse-1">'
         +'<ul class="nav navbar-nav">'
            +'<li>'
               +'<a id="home">'
               +'Homepage'
               +'</a>'
            +'</li>'
            +'<li>'
               +'<a id="profilo">'
               +'Profilo'
               +'</a>'
            +'</li>'
            +'<li>'
               +'<a id="aggiungi">'
               +'Aggiungi Amici'
               +'</a>'
            +'</li>'
            +'<li>'
               +'<a id="update_status">'
               +'Aggiorna Stato'
               +'</a>'
            +'</li>'
         +'</ul>'
         +'</ul>'
         +'<ul class="nav navbar-nav navbar-right">'
         +'</ul>'
      +'</div>'
      +'<!-- /.navbar-collapse -->'
    +'</div>'
  +'<!-- /.container-fluid -->'
  +'</nav>';
}

function menu(){

  $("#home").on('click', function() {
    $('#pagine').load('AmiciSeguiti.html',function(){
      lista();
    });
  });

  $("#aggiungi").on('click', function() {
    $('#pagine').load('aggiungi.html',function(){
      aggiungi();
    });
  });

  $("#profilo").on('click', function() {
    $('#pagine').load('profile.html',function(){
      ultimoMex();
    });
  });

  $("#update_status").on('click', function() {
    $('#pagine').load('status_update.html',function(){
      update();
    });
  });

}
