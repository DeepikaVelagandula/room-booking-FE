angular.module('deletePopUpModule', [])
.controller('deletePopUpController', function ($uibModalInstance, $scope) {
    $scope.cancel = function () {
        $uibModalInstance.dismiss('cancel');
      };
    $scope.ok = function() {
        $uibModalInstance.close();
    }
   

});