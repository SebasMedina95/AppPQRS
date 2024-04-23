import moment from 'moment-timezone';

export class MomentAdapter {

    getDateColombian(){
        // Obtener la hora actual de Colombia
        // return moment.tz('America/Bogota').format('YYYY-MM-DD HH:mm:ss');
        // return moment.tz('America/Bogota').format();
        return moment.tz('America/Bogota').toISOString();
    }

}

