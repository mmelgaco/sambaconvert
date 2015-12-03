'use strict';

describe('Controller: MainCtrl', function () {

  // load the controller's module
  beforeEach(module('sambaconvertApp'));

  var MainCtrl,
      scope,
      $httpBackend;

  // Initialize the controller and a mock scope
  beforeEach(inject(function (_$httpBackend_, $controller, $rootScope) {
    scope = $rootScope.$new();
    MainCtrl = $controller('MainCtrl', {
      $scope: scope
    });
  }));

  it('should attach a aws creds do scope', function () {

    expect(scope.creds);
  });
});
