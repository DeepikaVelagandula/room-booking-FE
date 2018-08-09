angular.module("RoomBookingModule", [
    'ui.bootstrap',
    'serviceModule',
    'timeChangeFilter',
    'meetingDetailsModule',
])
    .controller("roomBookingController", roomBookingController);

function roomBookingController(httpServices, $q, $uibModal, $scope, $filter) {
    var self = this;

    self.deleteRoomReservation = deleteRoomReservation;

    function deleteRoomReservation(room, slot){        
        //self.bookedMeetings[room][slot] = {};
        var modalInstance = $uibModal.open({
            animation: true,
            size: 'md',
            templateUrl: './html/deletePopUp.html',
            controller: 'deletePopUpController'
        });

        modalInstance.result.then(function (selectedItem) {
            self.meetingDetails = selectedItem;
            for (var room in self.reservationData) {
                if (self.reservationData.hasOwnProperty(room)) {
                    for (var slot in self.reservationData[room]) {
                        if (self.reservationData[room].hasOwnProperty(slot)) {
                            self.reservationData[room][slot] = self.meetingDetails;
                        }
                    }
                }
            }
           // console.log(self.reservationData)
            httpServices.requestingRoomBookingService(self.formattedDate, self.reservationData).then(successRoomBookingObj, errorBookingSlots);

        }, function () {
            //alert('Meeting details are required to do booking');
        });
        httpServices.deleteBookingRoomSlot(self.formattedDate, room, slot).then(successRoomBookingObj,function(){
            alert("please delete once again.");
        });
    }

    self.popover = {
        templateUrl:  "./html/meetingInfoPopOver.html",
        title: "Meeting Details",
        placement: "bottom-left"
    }
    self.roomPopOver = {
        templateUrl:  "./html/roomDetails.html",
        title: "Room Details",
        placement: "bottom-right" 
    }

    function getRoomAvailability() {
        httpServices.roomBookingDetailsService(self.formattedDate).then(function (res) {
            self.bookedMeetings = res.data;
        }, function () { 
            self.bookedMeetings = {};
        });
    }

    function bookSlot(room, slot) {
        if (self.bookedMeetings
            && self.bookedMeetings[room.id]
            && self.bookedMeetings[room.id][slot.id]) { 
                alert('current slot is already booked, please choose another');
                return;
        }
        self.reservationData[room.id] = self.reservationData[room.id] || {};

        if (self.reservationData[room.id][slot.id]) {
            delete self.reservationData[room.id][slot.id];
        } else {
            self.reservationData[room.id][slot.id] = {};
        }
    }

    function clearSelection() {
        self.reservationData = {};
    }

    function doReservation() {
        if (Object.keys(self.reservationData).length === 0) {
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
            self.meetingDetails = selectedItem;
            for (var room in self.reservationData) {
                if (self.reservationData.hasOwnProperty(room)) {
                    for (var slot in self.reservationData[room]) {
                        if (self.reservationData[room].hasOwnProperty(slot)) {
                            self.reservationData[room][slot] = self.meetingDetails;
                        }
                    }
                }
            }
           // console.log(self.reservationData)
            httpServices.requestingRoomBookingService(self.formattedDate, self.reservationData).then(successRoomBookingObj, errorBookingSlots);

        }, function () {
            //alert('Meeting details are required to do booking');
        });

    }
    function errorBookingSlots(err) {
        alert('rooms are booked already. Please try for another room.')
    }

    function successRoomBookingObj(res) {
        self.reservationData = {};
        self.bookedMeetings = res.data;
        alert('user successfully booked the slots.')
    }

    // Watching Calander ng-model value to find change in date
    $scope.$watch(function() {
        return self.selectedDate;
    }, function (newValue, oldValue) {
        // If user selected a new date or if the application is loading first time
        if (newValue != oldValue || self.formattedDate === null){
            var formattedDate = $filter('date')(newValue, 'dd-MM-yyyy'); 
            if(self.formattedDate !== formattedDate){
                self.formattedDate = formattedDate;
                self.reservationData = {};
                self.bookedMeetings = {};
                getRoomAvailability(); // On date change get changed date information
            }
        }
    });

    function init() {
        self.datePickerOpions = {
            minDate: new Date(),
            maxDate: new Date(new Date().setMonth(new Date().getMonth() + 1)),
            startingDay: 1,
            dateDisabled: function (date, mode) {
                return (mode === 'day' && (date.getDay() === 0 || date.getDay() === 6));
            }
        };

        var roomsPromise = httpServices.getRooms();
        var timeSlotsPromise = httpServices.getTimeslots();

        $q.all([roomsPromise, timeSlotsPromise]).then(function (response) {
            self.roomsObj = response[0].data;
            self.timeSlots = response[1].data;
        }, function (error) {
            alert('Something went wrong, please try again');
        });
    }

    self.timeSlots = [];
    self.roomsObj = [];
    self.reservationData = {}; // Current bookings from front end
    self.bookedMeetings = {}; // Already booked rooms of selected date
    self.selectedDate = new Date(); // Date Object from Calander
    self.formattedDate = null;
    self.getRoomAvailability = getRoomAvailability;
    self.bookSlot = bookSlot;
    self.clearSelection = clearSelection;
    self.doReservation = doReservation;

    init();

}