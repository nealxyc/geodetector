/**
 * 
 * 
 * 
 * The javascript from http://maps.google.com/maps/api/js?libraries=geometry&sensor=false is required for GeoDetector
 * 
 */

if(Array.prototype.contains == undefined){
	Array.prototype.contains = function(obj){
		for(var i in this){
			if(this[i] == obj || this[i] === obj){
				return true ;
			}
			
		}
		return false ;
	};
}

if(HTMLDocument.prototype.addScript == undefined){
	HTMLDocument.prototype.addScript = function(src){
		this.write('<' + 'script src="' + src + '"' + ' type="text/javascript"><' + '/script>');
	};
}

//if(google && google.maps && google.maps.Geocoder){
//	
//	
//}else{
//	document.addScript("http://maps.google.com/maps/api/js?libraries=geometry&sensor=false&language=en");
//}
if(typeof google == "undefined" || typeof google.maps == "undefined" || typeof google.maps.Geocoder == "undefined"){
	document.addScript("http://maps.google.com/maps/api/js?libraries=geometry&sensor=false&language=en");
}

function GeoDetector(){
	
	this.enabled  = false ;
	this.coords = {} ;
	
	this.geocoder = new google.maps.Geocoder();
	this.address = {};	
	
	if (typeof GeoDetector._initialized == "undefined") {
		
		GeoDetector.prototype.init = function(cb){
			
			var onSuccess = undefined ;
			var onFailure = undefined ;
			
			if(cb){
				onSuccess = cb.success ? cb.success:undefined ;
				onFailure = cb.failure ? cb.failure:undefined ;
			}
			
			var co = this.coords ;
			var gd = this ;
			if(navigator.geolocation){
				navigator.geolocation.getCurrentPosition(function( position ){
					co.latitude = position.coords.latitude ;
					co.longtitude = position.coords.longitude ;
					
					/* translate the coords into address */
					var latlng = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
					gd.geocoder.geocode({'latLng': latlng}, function(results, status) {
					      if (status == google.maps.GeocoderStatus.OK) {
					        if (results[0]) {
					          gd.address.geo_data = results[0];
					          
					          /* read parts of the address */
					          for(var i = 0 ; i < gd.address.geo_data.address_components.length ; i ++ ){
					        	  var comp = gd.address.geo_data.address_components[i];
					        	  if(comp.types.contains("country")){
					        		  gd.address.country = comp.long_name ;
					        
					        	  }else if(comp.types.contains("administrative_area_level_1")){
					        		  gd.address.level1 = comp.long_name ;
					        		  
					        	  }else if(comp.types.contains("administrative_area_level_2")){
					        		  gd.address.level2 = comp.long_name ;
					        		  
					        	  }else if(comp.types.contains("administrative_area_level_3")){
					        		  gd.address.level3 = comp.long_name ;
					        		  
					        	  }else if(comp.types.contains("postal_code")){
					        		  gd.address.postal_code = comp.long_name ;
					        		  
					        	  }else if(comp.types.contains("route")){
					        		  gd.address.street = comp.long_name ;
					        		  
					        	  }else if(comp.types.contains("street_number")){
					        		  gd.address.street_number = comp.long_name ;
					        		  
					        	  }else if(comp.types.contains("locality")){
					        		  gd.address.locality = comp.long_name ;
					        		  
					        	  }else if(comp.types.contains("sublocality")){
					        		  gd.address.sublocality = comp.long_name ;
					        		  
					        	  }else if(comp.types.contains("neighborhood")){
					        		  gd.address.neighborhood = comp.long_name ;
					        		  
					        	  }//route ,street_number, neighborhood, sublocality, locality,
					        	  
					          }
					          
					          /* Succeeded */
					          if(onSuccess){
					        	  onSuccess();
					          }
					        }
					      } else {
					        //alert("Geocoder failed due to: " + status);
					    	  if(onFailure){
					    		  onFailure();
					    	  }
					    	  
					      }
					    });
					
					gd.enabled = true ;
					
				}, function(){
					if(onFailure){
			    		 onFailure();
			    	}
				});//navigator.geolocation.getCurrentPosition()
			}else{
				gd.enabled = false ;
				if(onFailure){
		    		 onFailure();
		    	}
			}
		};	
		
		GeoDetector.prototype.getCountry = function(){
			return this.address.country ;
		};
		
		GeoDetector.prototype.getLevel1 = function(){
			return this.address.level1 ;
		};
		
		GeoDetector.prototype.getLevel2 = function(){
			return this.address.level2 ;
		};
		
		GeoDetector.prototype.getLevel3 = function(){
			return this.address.level2 ;
		};
		
		GeoDetector.prototype.getLocality = function(){
			return this.address.locality ;
		};
		
		GeoDetector.prototype.getPostalCode = function(){
			return this.address.postal_code;
		};
		
		GeoDetector.prototype.getStreetName = function(){
			return this.address.street;
		};
		
		GeoDetector.prototype.getStreetNumber = function(){
			return this.address.street_number;
		};
		
		GeoDetector.prototype.getSubLocality = function(){
			return this.address.sublocality;
		};
		
		GeoDetector.prototype.isEnabled = function(){
			return this.enabled ;
		};
		
		
		
		
	}
	GeoDetector._initialized = true ;
}