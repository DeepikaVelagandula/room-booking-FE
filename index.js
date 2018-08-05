angular.module("RoomBookingModule", [
    'ui.bootstrap',
    'serviceModule',
    'timeChangeFilter',
    'meetingDetailsModule',
])
    .controller("roomBookingController", roomBookingController);

function roomBookingController(httpServices, $q, $uibModal) {
    var self = this;

    function getRoomAvailability() {
        httpServices.roomBookingDetailsService(self.selectedDate).then(sf, function () { });
    }

    function sf(res) {
        console.log(res.data)
    }
    function bookSlot(room, slot){
        self.reservationData[room.id] = self.reservationData[room.id] || {};

        if(self.reservationData[room.id][slot.id]){
            delete self.reservationData[room.id][slot.id];
        }else{
            self.reservationData[room.id][slot.id] = {};
        }
    }

    function clearSelection(){
        self.reservationData = {};
    }

    function doReservation(){
        if(Object.keys(self.reservationData).length === 0 ){
            alert('Please select a time slot to do booking');
            return;
        }

        var modalInstance = $uibModal.open({
            animation: true,
            size: 'lg',
            templateUrl: './html/meeting-details.html',
            controller: 'MeetingDetailsController'
        });

        modalInstance.result.then(function (selectedItem) {
            $ctrl.selected = selectedItem;
        }, function () {
            alert('Meeting details are required to do booking');
        });
    }

    // httpServicesData.requestingRoomBookingService('09-02-2018', self.bookingObj).then(sr,function(){});
    // function sr(res){
    //     console.log(res.data)
    // }
    function init(){
        self.datePickerOpions = {
            minDate: new Date(),
            maxDate: new Date(new Date().setMonth(new Date().getMonth() + 1)),
            startingDay : 1,
            dateDisabled : function (date, mode) {
                return (mode === 'day' && (date.getDay() === 0 || date.getDay() === 6));
            }
        };
        
        var roomsPromise = httpServices.getRooms();
        var timeSlotsPromise = httpServices.getTimeslots();
        
        $q.all([roomsPromise, timeSlotsPromise]).then(function(response){
            self.roomsObj = response[0].data;
            self.timeSlots = response[1].data;        
        }, function(error){
            alert('Something went wrong, please try again');
        });
    }

    self.timeSlots = [];
    self.roomsObj = [];
    self.reservationData = {};
    self.getRoomAvailability = getRoomAvailability;
    self.bookSlot = bookSlot;
    self.clearSelection = clearSelection;
    self.doReservation = doReservation;

    init();

}