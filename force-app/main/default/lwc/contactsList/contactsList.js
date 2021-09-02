import { LightningElement, api, wire, track } from 'lwc';
import searchByName from '@salesforce/apex/ContactsController.searchByName';
import { ShowToastEvent } from "lightning/platformShowToastEvent";
import { refreshApex } from '@salesforce/apex';
import deleteContacts from '@salesforce/apex/ContactsController.deleteContacts';

export default class ContactsList extends LightningElement {
    
    @track columns = [
        {label: 'First Name', fieldName: 'FirstName', type: 'text'}, 
        {label: 'Last Name', fieldName: 'LastName', type: 'text'},
        {label: 'Email', fieldName: 'Email', type: 'email'},
        {label: "Account Name", fieldName: "AccountId", type: "url",
        typeAttributes: {label: { fieldName: 'AccountName'},}},
        {label: 'Phone', fieldName: 'Phone', type: 'phone'},
        {label: 'Created Date', fieldName: 'CreatedDate', type: 'date',
        typeAttributes: {month: "2-digit", day: "2-digit", year: "numeric", hour: "2-digit", minute: "2-digit"}},
        {type: 'button-icon', typeAttributes: {iconName: 'utility:delete', name: 'delete', iconClass: 'slds-icon-text-error'}}
    ];
    
// for deleteContact
    @api showModal;
    @track rows;
    @track renderContacts;
    @api row;

// for newContact
    @api bShowModal;

    strConName = '';
    @wire(searchByName, { strConName: '$strConName' })
    wiredAssets(value) {
        this.renderContacts = value;
        const {data, error} = value;
        if (data) {
            this.rows = data.map(this.toContactRows);
        } else if (error) {
            this.showErrorToast(error.body.message);
            this.rows = undefined;
        }
    }

    reRenderContacts(event) {
        const contactFromList = event.detail;
        console.log("contactFromList=>" + contactFromList);
        deleteContacts({
            id: contactFromList
        })
            .then((result) => {
                this.dispatchEvent(
                    new ShowToastEvent({
                        title: 'Success',
                        message: 'Contact deleted',
                        variant: 'success'
                    })
                );
                refreshApex(this.renderContacts);
            })
            .catch(error => {
                this.dispatchEvent(
                    new ShowToastEvent({
                        title: 'Error deleting record',
                        message: error.body.message,
                        variant: 'error'
                    })
                );
            });
    }

    handleRowAction(event) {
        if (event.detail.action.name === 'delete') {
            this.template.querySelector("c-delete-contact").openModal();
            this.row = event.detail.row;
        }
    }

    hanldeRenderContactsChange(event) {
        refreshApex(this.renderContacts);
    }

    toContactRows(row) {
        let contact = {
            ...row,
            AccountName: row.Account?.Name,
            AccountId: row.AccountId?`/${row.AccountId}`:""
        };
        return contact;
    }

    handleKeyChange(event) {
        const value = this.template.querySelector('.input').value;
        this.strConName = value;
    }

    showErrorToast(message) {
        const event = new ShowToastEvent({
            title: "Error",
            variant: "error",
            message: message
        });
        this.dispatchEvent(event);
    }

    bOpenModal() {
        this.template.querySelector("c-new-contact").bOpenModal();
    }
}