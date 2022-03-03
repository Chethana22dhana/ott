define('app/appui/services/helperService',['app/appui/libs/uuidv1.min'], function (UUID) {
    return {
        setDeviceId: function () {
            var deviceId = localStorage.getItem('DEVICE_ID_STORAGE_KEY');
            if (!deviceId) {
                deviceId = UUID();
                localStorage.setItem('DEVICE_ID_STORAGE_KEY', deviceId);
            }else{
                if(!this.isUUID(deviceId)){ //previous device id
                    deviceId = UUID();
                    localStorage.setItem('DEVICE_ID_STORAGE_KEY', deviceId);
                }
            }
            return deviceId;
        },
        isUUID: function(uuid){
            let s = '' + uuid;
            s = s.match('^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$');
            if (s === null) {
                return false;
            }
            return true;
        }
    }
})