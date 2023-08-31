import { CreateUserInput } from "../../../src/modules/users/dtos/userDTOs";
import { generateRandomInteger } from '../../../src/shared/utils/numberUtils';

export class UserBuilder {
    
    private userInput: CreateUserInput;

    constructor () {
        this.userInput = {
          email: '',
          userName: '',
          firstName: '',
          lastName: ''
        }
      }

    withFirstName(value: string) {
        this.userInput.firstName = value;
        return this;
    }

    withLastName(value: string) {
        this.userInput.lastName = value;
        return this;
    }
    
    withRandomUserName() {
        const randomSequence = generateRandomInteger(1000, 100000);
        this.userInput.userName = `vescudero-${randomSequence}`;
        return this;
    }
      
    withRandomEmail() {
        const randomSequence = generateRandomInteger(1000, 100000);
        this.userInput.email = `test-${randomSequence}@gmail.com`
        return this;
    }
    
    build(): CreateUserInput {
        return this.userInput;
    }

}
