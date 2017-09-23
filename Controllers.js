var p1App = angular.module('p1App', []);
p1App.controller('P1Ctrl',['$scope','P1AppFactory', function($scope, P1AppFactory) {
  $scope.analysedData = null;
  $scope.showLoader = true;
  
  $scope.analyseData = function (d) {
  	var a = {td:0, ms:0, as:0, eg:0, mt:0, tt:0}
  	for (var i = 1; i < d.length; i++) {
  		distance = Math.sqrt(Math.pow((d[i]['@attributes'].lat - d[i-1]['@attributes'].lat),2) + Math.pow((d[i]['@attributes'].lon - d[i-1]['@attributes'].lon),2) + Math.pow((d[i]['ele']['#text'] - d[i-1]['ele']['#text']),2));
  		time = ((new Date(d[i]['time']['#text'])).getTime() - (new Date(d[i-1]['time']['#text'])).getTime())/1000;

  		a.td += distance;
  		a.tt += time;
  		if (distance > 0) {
  			a.mt += time;
  		}
  		if (a.ms < distance/time) {
  			a.ms = distance/time;
  		}
  	}
  	a.as = a.td / a.tt;
  	a.eg = d[0]['ele']['#text'] - d[d.length-1]['ele']['#text'];
  	$scope.showLoader = false;
  	return a;
  }

  $scope.getCoordinates = function () {
  	P1AppFactory.getCoordinates().then(function (res) {
  		$scope.data = xmlToJson(res.data).gpx.trk.trkseg.trkpt;
  		$scope.analysedData = $scope.analyseData($scope.data);
  	},function (res) {
  		$scope.showLoader = false;
  		console.log(res);
  	})
  }
  $scope.getCoordinates()
}])
.factory('P1AppFactory', ['$http', function($http){
	var o={};

	o.getCoordinates = function(){
		return $http.get('https://dl.dropboxusercontent.com/s/8nvqnasci6l76nz/Problem.gpx?dl=0',{
			headers: {
		    'Accept':'application/json, text/plain'
			},
			transformResponse : function(data) {
                // string -> XML document object
          return $.parseXML(data);
      }
		});
	}

	return o;
}])	;






var p2App = angular.module('p2App', []);
p2App.controller('P2Ctrl',['$scope', 'P2AppFactory', function($scope, P2AppFactory) {
  $scope.showLoader = true;
  $scope.analyseData = function (d) {
  	for (var i = 0; i < d.length; i++) {
  		flightPlanCoordinates.push({lat: parseFloat(d[i]['@attributes'].lat), lng: parseFloat(d[i]['@attributes'].lon)});
  	}
  	initMap();
  }

  $scope.getCoordinates = function () {
  	P2AppFactory.getCoordinates().then(function (res) {
  		$scope.analyseData(xmlToJson(res.data).gpx.trk.trkseg.trkpt);
  		$scope.showLoader = false;
  	},function (res) {
  		$scope.showLoader = false;
  		console.log(res);
  	})
  }
  $scope.getCoordinates()
}])
.factory('P2AppFactory', ['$http', function($http){
	var o={};

	o.getCoordinates = function(){
		return $http.get('https://dl.dropboxusercontent.com/s/8nvqnasci6l76nz/Problem.gpx?dl=0',{
			headers: {
		    'Accept':'application/json, text/plain'
			},
			transformResponse : function(data) {
                // string -> XML document object
          return $.parseXML(data);
      }
		});
	}

	return o;
}])	;






var p3App = angular.module('p3App', []);
p3App.controller('P3Ctrl',['$scope', function($scope) {
	$scope.n = null;
	$scope.pairs = [];
	$scope.showResult = false;

	$scope.checkNumbers = function (n1) {
		var temp, n2;
		n1 = n1.toString();
		for (var i = 0; i < n1.length; i++) {
			n2 = n1.slice(0,i) + n1.slice(i+1,n1.length);
			if(parseInt(n1)+ parseInt(n2) == $scope.n){
				return [n1, n2];
			}
		}
		return false;
	}

	$scope.findNumbers = function () {
		var s = "9"
		for (var i = 0; i < $scope.n.toString().length-2; i++) {
			s = s + "0";
		}
		var pair;
		for (i = parseInt(s); i <= $scope.n; i++) {
			pair = $scope.checkNumbers(i);
			if (pair) {
				$scope.pairs.push(pair);
			}
		}
		$scope.showResult = true;
	}

	$scope.showNumbers = function (n) {
		if(!n){
			$scope.showResult = false;
			$scope.error = "Please input a number.";
			return;
		}
		else if (n > Math.pow(10,6)) {
			$scope.showResult = false;
			$scope.error = "According to question, input number N (N < 10 power 6).";
			return;
		} else {
			$scope.pairs = [];
			$scope.error = null;
		}
		$scope.n = n;
		$scope.showLoader = true;
		$scope.findNumbers();
		$scope.showLoader = false;
	}
}]);
