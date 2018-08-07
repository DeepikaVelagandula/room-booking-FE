angular.module('meetingDetailsModule', [])
    .controller('MeetingDetailsController', function ($uibModalInstance, $scope) {
        $scope.meetingDetails = {};
        $scope.submitMeetingDetails = submitMeetingDetails;
        $scope.cancel = function () {
            $uibModalInstance.dismiss('cancel');
          };
        function submitMeetingDetails() {
            $uibModalInstance.close($scope.meetingDetails);
        };
       

    });