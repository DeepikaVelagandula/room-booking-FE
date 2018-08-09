angular.module("serviceModule",[])
    .service("httpServices",httpServicesData);

function httpServicesData($http) {

    function roomsService() {
        return $http.get('http://localhost:3001/rooms')
    }
    
    function timeslotsService() {
        return $http.get('http://localhost:3001/timeslots')
    }
    
    function roomBookingDetailsService(date) {
        return $http.get('http://localhost:3001/bookings/'+date)
    }
    
    function requestingRoomBookingService(date,bookingObj){
        return $http({
            url: 'http://localhost:3001/bookings/'+date,
            method: "POST",
            data: bookingObj
        })
    }

    function deleteBookingRoomSlot(date, room, slot){
        return $http({
            url:'http://localhost:3001/bookings/'+date+'/'+room+'/'+slot,
            method:'DELETE'
        })
    }

    this.getRooms = roomsService;
    this.getTimeslots = timeslotsService;
    this.roomBookingDetailsService = roomBookingDetailsService;
    this.requestingRoomBookingService = requestingRoomBookingService;
    this.deleteBookingRoomSlot = deleteBookingRoomSlot;
}