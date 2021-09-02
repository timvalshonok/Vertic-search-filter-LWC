import { LightningElement, wire, api, track } from 'lwc';
import { ShowToastEvent } from "lightning/platformShowToastEvent";
import addNewRecord from '@salesforce/apex/ContactsController.addNewRecord';
import getAccounts from '@salesforce/apex/ContactsController.getAccounts';

export default class NewContact extends LightningElement {

    @api bShowModal = false;
    @track items = [];
    @track value = '';
    @track chosenValue = '';

    @api bOpenModal() {
        this.bShowModal = true;
    }

    bCloseModal() {
        this.bShowModal = false;
    }

    handleChange(event) {
        this.chosenValue = event.detail.value;
    }

    get accountOptions() {
        return this.items;
    }

    @wire(getAccounts)
    wiredAccounts({ error, data }) {
        if (data) {
            for (let i = 0; i < data.length; i++) {
                this.items = [...this.items, { value: data[i].Id, label: data[i].Name }];
            }
            this.error = undefined;
        } else if (error) {
            this.error = error;
            this.contacts = undefined;
        }
    }

    addNewUser(event) {
        let contact = { 'sobjectType': 'Contact' };
        contact.FirstName = this.template.querySelector('[data-element="FirstName"]').value;
        contact.LastName = this.template.querySelector('[data-element="LastName"]').value;
        contact.Email = this.template.querySelector('[data-element="Email"]').value;
        contact.AccountId = this.chosenValue;
        contact.MobilePhone = this.template.querySelector('[data-element="MobilePhone"]').value;

        addNewRecord({ newRecord: contact })
            .then(() => {
                this.dispatchEvent(
                    new ShowToastEvent({
                        title: 'Success',
                        message: 'Contact created',
                        variant: 'success'
                    })
                );
                const selectedEvent = new CustomEvent("rendercontactschange");
                this.dispatchEvent(selectedEvent);
                this.bShowModal = false;
            })
            .catch(error => {
                this.dispatchEvent(
                    new ShowToastEvent({
                        title: 'Сontact creation error: Please check the required fields.',
                        message: error.body.message,
                        variant: 'error'
                    })
                );
            });
    }

}