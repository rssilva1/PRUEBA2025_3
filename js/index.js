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

// Wait for the deviceready event before using any of Cordova's device APIs.
// See https://cordova.apache.org/docs/en/latest/cordova/events/events.html#deviceready
document.addEventListener('deviceready', onDeviceReady, false);

function onDeviceReady() {
    // Cordova is now initialized. Have fun!

    console.log('Running cordova-' + cordova.platformId + '@' + cordova.version);
    document.getElementById('deviceready').classList.add('ready');
}

var hash_tec="http://181.211.15.19/ratings_tec/index.php/";

function iconProgress( tema, texto, visible, icon, tiempo, myicon){
	var $this = $( this ),
	theme = tema || $.mobile.loader.prototype.options.theme,
	msgText = texto || $.mobile.loader.prototype.options.text,
	textVisible = visible || $.mobile.loader.prototype.options.textVisible,
	textonly = !! icon;
	html = myicon || "";
	$.mobile.loading( "show", {
		text: msgText,
		textVisible: textVisible,
		theme: theme,
		textonly: textonly,
		html: html
	});
	setTimeout(function() {$.mobile.loading( "hide" )
			},tiempo)
};

function get_control(){
	$('#div_insp').hide();
	$('#tbody_rns').html('');
	$.ajax({
		url: hash_tec+"get_arcsa_planificacion_anual",
		type:"Get",
		data: {rg: $('#txtBuscarRns').val().toUpperCase()},
		beforeSend: function(){
			$.mobile.loading( 'show', {text:'Cargando...', textVisible: true, theme: 'f'});
		},
		success: function (data){
			var html="";
			var html_two="";
			var colores, imagen;
            $.mobile.loading( 'hide');
			if($.type(data)!="string" && data!=""){
				for (var x = 0; x < data.length; x++) {
                    //alert(data[x].reg_san);
					if(data[x].revisado==0){
						colores= "color:red";
						//imagen="img/yes.png";
						html_two='<a href="#pgInsp" class="ui-btn ui-shadow ui-corner-all ui-icon-plus ui-btn-icon-notext ui-btn-inline" data-transition="pop">Open dialog</a>';
						html +=('<tr>'+
                            '<td style="text-align:center;" colspan="5"><span style="'+colores+'">Aun no se ha registrado control para el RS: '+data[x].registro_sanitario+'  </span>'+html_two+'</td>'+
						'</tr>');
					}else{
						//colores= "color:green";
						imagen="img/ok.png";
						get_control_two(data[x].registro_sanitario);
						html_two='<img src="'+imagen+'"/>';
						html +=('<tr>'+
                            '<td>'+data[x].registro_sanitario+'</td>'+
                            '<td>'+data[x].fecha_registro+'</td>'+
                            '<td> Zona '+data[x].zona+'</td>'+
							'<td>'+data[x].periodo+'</td>'+
                            '<td style="text-align:center;">'+html_two+'</td>'+
						'</tr>');
					};
				
				};
				$('#tbody_rns').html(html);
			}else{
				if(data==false){
					$("#tbody_rns").html("<tr><td  style='text-align:center;' colspan='5'><img src='img/search.png'/> <p style='color:red'>Este producto no se encuentra en la planificación anual</p></td></tr>");
				}else{
					$("#tbody_rns").html("<tr><td style='text-align:center;' colspan='5'><img src='img/no-wifi.png'/> <p style='color:red'>Su dispositivo no cuenta con servicios de datos móviles</p></td></tr>");
				};
			};
			
			$( "#tblRns" ).table( "refresh" );
			
			
		},
		error: function(request, status  ){
			$.mobile.loading("hide");
			iconProgress('d','', true, true, 5000,'<div style="text-align:center;"><img src="img/no-wifi.png" /> <p style="color:red">Compruebe el estado de su red</p></div>');
			alert('Resultado: '+request);
		}
	});	
};

function get_control_two(rns){
	$('#div_insp').show();
	$('#tbody_insp').html('');
	$.ajax({
		url: hash_tec+"get_arcsa_control",
		type:"Get",
		data: {rg: rns},
		beforeSend: function(){
			$.mobile.loading( 'show', {text:'Cargando...', textVisible: true, theme: 'f'});
		},
		success: function (data){
			var html="";
			var colores, imagen;
            $.mobile.loading( 'hide');
			if($.type(data)!="string" && data!=""){
				for (var x = 0; x < data.length; x++) {
                    //alert(data[x].reg_san);
					if(data[x].estado_inspeccion=="Cumple"){
						colores= "color:green";
						imagen="img/yes.png";
					}else{
						colores= "color:red";
						imagen="img/no.png";
						//get_control_two();
					};
				html +=('<tr>'+
                            '<td>'+data[x].reg_san+'</td>'+
                            '<td>'+data[x].producto+'</td>'+
                            '<td>'+data[x].representante+'</td>'+
                            '<td> Zona '+data[x].zona+'</td>'+
							'<td> VCPPE-CZ'+data[x].informe+'</td>'+
                            '<td style="text-align:center;"><img src="'+imagen+'"/><span style="'+colores+'">'+data[x].estado_inspeccion+'</span></td>'+
						'</tr>');
				};
				$('#tbody_insp').html(html);
			}else{
				if(data==false){
					$("#tbody_insp").html("<tr><td style='text-align:center;'  colspan='6'><img src='img/search.png'/> <p style='color:red'>No se encontraron inspecciones realizadas</p></td></tr>");
				}else{
					$("#tbody_insp").html("<tr><td style='text-align:center;'  colspan='6'><img src='img/no-wifi.png'/> <p style='color:red'>Su dispositivo no cuenta con servicios de datos móviles</p></td></tr>");
				};
			};
			
			$( "#tbl_insp" ).table( "refresh" );
			
			
		},
		error: function(request, status  ){
			$.mobile.loading("hide");
			iconProgress('d','', true, true, 5000,'<div style="text-align:center;"><img src="img/no-wifi.png" /> <p style="color:red">Compruebe el estado de su red</p></div>');
			alert('Resultado: '+request);
		}
	});	
};

function save_control(){
	$('#tbody_rns').html('');
	$.ajax({
		url: hash_tec+"save_control",
		type:"Post",
		data: {rg: $('#txtBuscarRns').val().toUpperCase(), zona: $('#cbo_zona').val()},
		beforeSend: function(){
			$.mobile.loading( 'show', {text:'Cargando...', textVisible: true, theme: 'f'});
		},
		success: function (data){
			//alert(data);
			var html="";
			var html_two="";
			var colores, imagen;
            $.mobile.loading( 'hide');
			if($.type(data)!="string" && data!=""){
				for (var x = 0; x < data.length; x++) {
                    //alert(data[x].reg_san);
					if(data[x].revisado==0){
						colores= "color:green";
						imagen="img/yes.png";
						html_two='<a href="#pgInsp" class="ui-btn ui-shadow ui-corner-all ui-icon-plus ui-btn-icon-notext ui-btn-inline" data-transition="pop">Open dialog</a>';
					}else{
						//colores= "color:red";
						imagen="img/ok.png";
						get_control_two(data[x].registro_sanitario);
						html_two='<img src="'+imagen+'"/>';
					};
				html +=('<tr>'+
                            '<td>'+data[x].registro_sanitario+'</td>'+
                            '<td>'+data[x].fecha_registro+'</td>'+
                            '<td> Zona '+data[x].zona+'</td>'+
							'<td> VCPPE-CZ'+data[x].periodo+'</td>'+
                            '<td style="text-align:center;">'+html_two+'</td>'+
						'</tr>');
				};
				$('#tbody_rns').html(html);
			}else{
				if(data==false){
					$("#tbody_rns").html("<tr><td  style='text-align:center;' colspan='5'><img src='img/search.png'/> <p style='color:red'>Este producto no se encuentra en la planificación anual</p></td></tr>");
				}else{
					$("#tbody_rns").html("<tr><td style='text-align:center;' colspan='5'><img src='img/no-wifi.png'/> <p style='color:red'>Su dispositivo no cuenta con servicios de datos móviles</p></td></tr>");
				};
			};
			
			$( "#tblRns" ).table( "refresh" );
			$.mobile.changePage( "#pgMain", { transition: "fade", changeHash: false });
			
			
			
		},
		error: function(request, status  ){
			$.mobile.loading("hide");
			iconProgress('d','', true, true, 5000,'<div style="text-align:center;"><img src="img/no-wifi.png" /> <p style="color:red">Compruebe el estado de su red</p></div>');
			alert('Resultado: '+request);
		}
	});	
};
