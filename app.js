var app = angular.module('plunker', []);

app.controller('MainCtrl', function($scope, colorApi, colorUtils, colorFilters) {
  $scope.colorFilters = colorFilters;
  $scope.fcolor = colorUtils.fcolor;
  
  colorApi.fetch().success(function(data) {
    $scope.colors = data.map(function(c,i) {
      // add index property to each color to make it
      // easy to track inside of the ng-repeat
      c.index = i;
      return c;
    });
  });
});

app.directive('colorSelector', function(colorUtils) {
  return {
    scope: {
      colors: '=',
      selectedColors: '='
    },
    templateUrl: 'color-selector.html',
    link: function(scope) {
      scope.fcolor = colorUtils.fcolor;
      
      scope.allToggle = function() {
        scope.colors.forEach(function(color) {
          color.selected = scope.allSelected;
        });
      };
      
      // The colors array will change when it is first initialized,
      // and then any time the user interacts with the widget.
      // This watcher will update the selectedColors array
      // by listening to changes in the colors array.
      scope.$watch('colors', function functionName() {
        console.log("colors changed: ", scope.colors);
        scope.selectedColors = scope.colors.filter(function(color) {
          return color.selected;
        })
        scope.allSelected = scope.selectedColors.length === scope.colors.length;
      }, true);
    }
  }
});


//// All of the code below is exactly the same in 
//// this version and in the flux version


// given a list of colors, will filter by fuzzy-match
// comparing to another list of colors (filterColors)
app.filter('similarColors', function(colorUtils) {
  return function(colors, filterColors) {
    var r = [];
    if ((colors instanceof Array) && (filterColors instanceof Array)) {
      colors.forEach(function(color) {
        if (filterColors.some(colorUtils.fuzzyMatch.bind(null,color)))
          r.push(color);
      })
    }
    return r;
  }
});

app.factory('colorApi', function ($http) {
  var numRows = 1000;
  return {
    // a simple HTTP API that returns a bunch of random colors
    fetch: $http.get.bind($http, "http://www.filltext.com/?rows="+numRows+"&r={number|255}&g={number|255}&b={number|255}")
  }
});

app.factory('colorUtils', function () {
  var thresh = 120; // fuzzy match threshold
  
  return {
    
    // converts a color object like {r:125,g:0,b:255}
    // to a css value like "rgb(125,0,255)"
    fcolor: function(color) {
      return 'rgb('+color.r+','+color.g+','+color.b+')'
    },
    
    // fuzzily compares two colors and returns true if 
    // they match
    fuzzyMatch: function(c1, c2) {
      return (Math.abs(c1.r-c2.r) < thresh && Math.abs(c1.g-c2.g) < thresh && Math.abs(c1.b-c2.b) < thresh)
    }
  }
});

// these are the colors that will be utilized by the
// color-selector directive
app.value('colorFilters', [
  {selected:true,r:255,g:0,b:0},
  {selected:true,r:0,g:255,b:0},
  {selected:true,r:0,g:0,b:255},
  {selected:true,r:128,g:0,b:128},
  {selected:true,r:0,g:128,b:128},
  {selected:true,r:128,g:128,b:0},
  {selected:true,r:255,g:255,b:0},
  {selected:true,r:0,g:255,b:255},
  {selected:true,r:255,g:0,b:255}
]);
