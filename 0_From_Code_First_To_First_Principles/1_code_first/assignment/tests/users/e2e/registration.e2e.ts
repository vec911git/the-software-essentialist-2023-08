import { defineFeature, loadFeature } from "jest-cucumber";
import { Response } from "superagent";
import { Server } from "http";
import path from "path";
import { RESTfulAPIDriver } from '../../../src/shared/http/restfulAPIDriver'
import { UserBuilder } from "../builders/userBuilder";
import { CreateUserInput } from "../../../src/modules/users/dtos/userDTOs"
import { CompositionRoot } from '../../../src/shared/composition/compositionRoot'

const feature = loadFeature(path.join(__dirname, './registration.feature'));

defineFeature(feature, (test) => {
    test('Successful registration', ({ given, when, then, and }) => {

        let root = new CompositionRoot()
        let webServer = root.getWebServer();

        let driver: RESTfulAPIDriver;        
        let createUserInput : CreateUserInput;
        let response: Response;

        beforeAll(async () => {
            // Start the server
            await webServer.start()
            driver = new RESTfulAPIDriver(webServer.getHttp() as Server);
        });

        afterAll(async () => {
            // Stop the server
            await webServer.stop();
        });

        given('I am a new user', () => {
            createUserInput = new UserBuilder()
                .withFirstName('Victor')
                .withLastName('Escudero')
                .withRandomUserName()
                .withRandomEmail()
                .build()
        });

        when('I register with valid account details', async () => {
            response = await driver.post('/users/new', createUserInput)
        });

        then('I should be granted access to my account', () => {
            expect(response.body.success).toBeTruthy();
            expect(response.body.error).toBeFalsy();
            expect(response.body.data).toBeDefined();
            expect(response.body.data.id).toBeDefined();
            expect(response.body.data.email).toEqual(createUserInput.email);
            expect(response.body.data.firstName).toEqual(createUserInput.firstName);
            expect(response.body.data.lastName).toEqual(createUserInput.lastName);
            expect(response.body.data.userName).toEqual(createUserInput.userName);
        });

        and('I should receive an email with login instructions', () => {
            // Can't test at this level, let's verify this at a deeper level
        });
    });
});