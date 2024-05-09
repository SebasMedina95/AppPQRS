import { v4 as uuidv4 } from 'uuid';

export class UuidAdapter {

    uuidGenerate = () => {
        return uuidv4();
    }

}

